'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import {
  getChoiceCueSec,
  getNextNodeIds,
  getNode,
} from '@/domain/graph';
import type {
  Choice,
  ChoiceOutcome,
  Scenario,
  StoryNode,
} from '@/domain/scenario';
import { track } from '@/services/analytics';
import { resolveClipUrl } from '@/services/video/resolveClip';
import { useJournalStore } from '@/stores/useJournalStore';
import { useProgressStore } from '@/stores/useProgressStore';

/**
 * Run state (where you are right now, what you picked) is deliberately NOT in a
 * global store: it is scoped to one player mounting, it changes many times a
 * second while a clip plays, and it should not survive a refresh mid-scene. A
 * reducer local to the player is the right lifetime.
 *
 * Anything that must outlive the run — unlocked endings, journal entries,
 * attempt counts — is written through to the persisted Zustand stores by the
 * effects at the bottom of this hook.
 */

export type StoryPhase =
  /** Mounted, waiting for the tap that unlocks audio playback. */
  | 'ready'
  | 'playing'
  /** Paused on the cue frame with the choice overlay up. */
  | 'deciding'
  /** Ending clip finished; showing the outcome card. */
  | 'ended';

export type StoryStep = {
  nodeId: string;
  choiceId: string | null;
  outcome: ChoiceOutcome | null;
  viaTimeout: boolean;
  msToDecide: number | null;
};

type LastChoice = {
  fromNodeId: string;
  choice: Choice;
  viaTimeout: boolean;
};

type RunState = {
  currentNodeId: string;
  phase: StoryPhase;
  history: StoryStep[];
  lastChoice: LastChoice | null;
  retries: number;
  /** Increments on every node entry so effects fire once per visit, not per render. */
  visitSeq: number;
  decisionOpenedAt: number | null;
  runStartedAt: number;
};

type Action =
  | { type: 'begin' }
  | { type: 'cue-decision'; at: number }
  | { type: 'clip-ended'; node: StoryNode }
  | {
      type: 'select';
      choice: Choice;
      viaTimeout: boolean;
      at: number;
    }
  | { type: 'goto'; nodeId: string; countAsRetry: boolean }
  | { type: 'restart'; entryNodeId: string }
  | { type: 'dismiss-feedback' };

function initialState(entryNodeId: string): RunState {
  return {
    currentNodeId: entryNodeId,
    phase: 'ready',
    history: [],
    lastChoice: null,
    retries: 0,
    visitSeq: 0,
    decisionOpenedAt: null,
    runStartedAt: Date.now(),
  };
}

function reducer(state: RunState, action: Action): RunState {
  switch (action.type) {
    case 'begin':
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'playing', visitSeq: state.visitSeq + 1 };

    case 'cue-decision':
      if (state.phase !== 'playing') return state;
      return { ...state, phase: 'deciding', decisionOpenedAt: action.at };

    case 'clip-ended': {
      const node = action.node;
      if (node.kind === 'ending') return { ...state, phase: 'ended' };
      if (node.kind === 'beat') {
        return {
          ...state,
          currentNodeId: node.autoAdvanceToId,
          phase: 'playing',
          visitSeq: state.visitSeq + 1,
          history: [
            ...state.history,
            {
              nodeId: node.id,
              choiceId: null,
              outcome: null,
              viaTimeout: false,
              msToDecide: null,
            },
          ],
        };
      }
      // A scene whose cue point is its final frame: the clip running out *is* the cue.
      if (state.phase === 'playing') {
        return { ...state, phase: 'deciding', decisionOpenedAt: Date.now() };
      }
      return state;
    }

    case 'select': {
      if (state.phase !== 'deciding') return state;
      const msToDecide = state.decisionOpenedAt
        ? action.at - state.decisionOpenedAt
        : null;
      return {
        ...state,
        currentNodeId: action.choice.nextNodeId,
        phase: 'playing',
        visitSeq: state.visitSeq + 1,
        decisionOpenedAt: null,
        lastChoice: {
          fromNodeId: state.currentNodeId,
          choice: action.choice,
          viaTimeout: action.viaTimeout,
        },
        history: [
          ...state.history,
          {
            nodeId: state.currentNodeId,
            choiceId: action.choice.id,
            outcome: action.choice.outcome,
            viaTimeout: action.viaTimeout,
            msToDecide,
          },
        ],
      };
    }

    case 'goto': {
      // Rewind history to the point we are jumping back to, so the branch trail
      // stays truthful after a retry.
      const rewindIndex = state.history.findIndex(
        (step) => step.nodeId === action.nodeId,
      );
      return {
        ...state,
        currentNodeId: action.nodeId,
        phase: 'playing',
        visitSeq: state.visitSeq + 1,
        decisionOpenedAt: null,
        lastChoice: null,
        retries: state.retries + (action.countAsRetry ? 1 : 0),
        history:
          rewindIndex >= 0 ? state.history.slice(0, rewindIndex) : state.history,
      };
    }

    case 'restart':
      return {
        ...initialState(action.entryNodeId),
        phase: 'playing',
        visitSeq: state.visitSeq + 1,
        retries: state.retries,
      };

    case 'dismiss-feedback':
      return { ...state, lastChoice: null };
  }
}

export type StoryEngine = {
  scenario: Scenario;
  node: StoryNode;
  phase: StoryPhase;
  /** Increments on every node entry; used to key the video source. */
  visitSeq: number;
  history: StoryStep[];
  lastChoice: LastChoice | null;
  retries: number;
  /** URL of the clip currently on screen. */
  currentClipUrl: string;
  /** URLs for every branch reachable from here — the preloader's worklist. */
  upcomingClipUrls: string[];
  choiceCueSec: number | null;
  begin: () => void;
  onCue: () => void;
  onClipEnded: () => void;
  select: (choiceId: string, options?: { viaTimeout?: boolean }) => void;
  retryFromLastDecision: () => void;
  restart: () => void;
  jumpTo: (nodeId: string) => void;
  dismissFeedback: () => void;
};

export function useStoryEngine(scenario: Scenario): StoryEngine {
  const [state, dispatch] = useReducer(reducer, scenario.entryNodeId, initialState);

  const node = getNode(scenario, state.currentNodeId);

  const visitNode = useProgressStore((s) => s.visitNode);
  const startRun = useProgressStore((s) => s.startRun);
  const recordEnding = useProgressStore((s) => s.recordEnding);
  const recordRetry = useProgressStore((s) => s.recordRetry);
  const encounterMany = useJournalStore((s) => s.encounterMany);

  const currentClipUrl = useMemo(() => resolveClipUrl(node.clip), [node.clip]);

  const upcomingClipUrls = useMemo(
    () =>
      getNextNodeIds(node)
        .map((id) => scenario.nodes[id])
        .filter((next): next is StoryNode => Boolean(next))
        .map((next) => resolveClipUrl(next.clip)),
    [node, scenario.nodes],
  );

  const begin = useCallback(() => {
    startRun(scenario.id);
    track({ name: 'scenario_started', scenarioId: scenario.id, attempt: 1 });
    dispatch({ type: 'begin' });
  }, [scenario.id, startRun]);

  const onCue = useCallback(() => {
    dispatch({ type: 'cue-decision', at: Date.now() });
  }, []);

  const onClipEnded = useCallback(() => {
    dispatch({ type: 'clip-ended', node });
  }, [node]);

  const select = useCallback(
    (choiceId: string, options?: { viaTimeout?: boolean }) => {
      if (node.kind !== 'scene') return;
      const choice = node.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      const viaTimeout = options?.viaTimeout ?? false;
      encounterMany(choice.slangTermIds, {
        scenarioId: scenario.id,
        source: 'story',
      });
      choice.slangTermIds.forEach((termId) =>
        track({ name: 'slang_encountered', termId, scenarioId: scenario.id }),
      );
      track({
        name: 'choice_made',
        scenarioId: scenario.id,
        nodeId: node.id,
        choiceId: choice.id,
        outcome: choice.outcome,
        viaTimeout,
        msToDecide: state.decisionOpenedAt
          ? Date.now() - state.decisionOpenedAt
          : 0,
      });
      dispatch({ type: 'select', choice, viaTimeout, at: Date.now() });
    },
    [encounterMany, node, scenario.id, state.decisionOpenedAt],
  );

  /**
   * Failure is a loop, not a wall: rewind to the decision that went wrong rather
   * than to the top of the scenario. Authors can override the target on an
   * ending; otherwise we use the last decision the user actually made.
   */
  const retryFromLastDecision = useCallback(() => {
    const override =
      node.kind === 'ending' ? node.retryFromNodeId : undefined;
    const lastDecision = [...state.history]
      .reverse()
      .find((step) => step.choiceId !== null);
    const target = override ?? lastDecision?.nodeId ?? scenario.entryNodeId;

    recordRetry(scenario.id);
    track({ name: 'scenario_retried', scenarioId: scenario.id, fromNodeId: target });
    dispatch({ type: 'goto', nodeId: target, countAsRetry: true });
  }, [node, recordRetry, scenario.entryNodeId, scenario.id, state.history]);

  const restart = useCallback(() => {
    startRun(scenario.id);
    track({ name: 'scenario_started', scenarioId: scenario.id, attempt: 2 });
    dispatch({ type: 'restart', entryNodeId: scenario.entryNodeId });
  }, [scenario.entryNodeId, scenario.id, startRun]);

  const jumpTo = useCallback((nodeId: string) => {
    dispatch({ type: 'goto', nodeId, countAsRetry: false });
  }, []);

  const dismissFeedback = useCallback(() => {
    dispatch({ type: 'dismiss-feedback' });
  }, []);

  // --- Write-through effects -------------------------------------------------
  // Keyed on visitSeq rather than nodeId so a retry that re-enters the same node
  // is counted again, while re-renders and Strict Mode double-invocation are not.
  const countedVisit = useRef(-1);
  useEffect(() => {
    if (state.visitSeq === 0 || countedVisit.current === state.visitSeq) return;
    countedVisit.current = state.visitSeq;

    visitNode(scenario.id, node.id);
    track({
      name: 'node_entered',
      scenarioId: scenario.id,
      nodeId: node.id,
      kind: node.kind,
    });

    if (node.slangTermIds.length > 0) {
      encounterMany(node.slangTermIds, {
        scenarioId: scenario.id,
        source: 'story',
      });
    }

    if (node.kind === 'ending') {
      // Recorded on entry, not after the clip: progress should survive the user
      // closing the tab during the outcome shot.
      recordEnding(
        scenario.id,
        node.id,
        node.outcome,
        Date.now() - state.runStartedAt,
      );
      track({
        name: 'scenario_ended',
        scenarioId: scenario.id,
        endingId: node.id,
        outcome: node.outcome,
        decisions: state.history.filter((step) => step.choiceId).length,
        retries: state.retries,
        durationMs: Date.now() - state.runStartedAt,
      });
    }
  }, [
    encounterMany,
    node,
    recordEnding,
    scenario.id,
    state.history,
    state.retries,
    state.runStartedAt,
    state.visitSeq,
    visitNode,
  ]);

  return {
    scenario,
    node,
    phase: state.phase,
    visitSeq: state.visitSeq,
    history: state.history,
    lastChoice: state.lastChoice,
    retries: state.retries,
    currentClipUrl,
    upcomingClipUrls,
    choiceCueSec: getChoiceCueSec(node),
    begin,
    onCue,
    onClipEnded,
    select,
    retryFromLastDecision,
    restart,
    jumpTo,
    dismissFeedback,
  };
}
