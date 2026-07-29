import type { Scenario, StoryNode, VideoClip } from './scenario';
import { scenarioSchema } from './scenario';

export function getNode(scenario: Scenario, nodeId: string): StoryNode {
  const node = scenario.nodes[nodeId];
  if (!node) {
    throw new Error(
      `Scenario "${scenario.id}" has no node "${nodeId}". Check the choice that points here.`,
    );
  }
  return node;
}

/**
 * Every node the player could reach in one step. This is the input to the
 * preloader: when a decision is on screen we warm all of these, because we
 * cannot know which the user will pick.
 */
export function getNextNodeIds(node: StoryNode): string[] {
  switch (node.kind) {
    case 'scene':
      return node.choices.map((choice) => choice.nextNodeId);
    case 'beat':
      return [node.autoAdvanceToId];
    case 'ending':
      return [];
  }
}

export function getClipStartSec(clip: VideoClip): number {
  return clip.trim?.startSec ?? 0;
}

/** `null` means "play to the natural end of the file". */
export function getClipEndSec(clip: VideoClip): number | null {
  return clip.trim?.endSec ?? null;
}

/**
 * When the decision overlay should appear, in source-file time. Authors can set
 * a cue mid-clip so playback freezes on a reaction shot instead of running out.
 */
export function getChoiceCueSec(node: StoryNode): number | null {
  if (node.kind !== 'scene') return null;
  return node.choiceCueAtSec ?? getClipEndSec(node.clip);
}

export function listEndings(scenario: Scenario) {
  return Object.values(scenario.nodes).filter(
    (node): node is Extract<StoryNode, { kind: 'ending' }> =>
      node.kind === 'ending',
  );
}

export function collectReachableNodeIds(scenario: Scenario): Set<string> {
  const seen = new Set<string>();
  const queue = [scenario.entryNodeId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    const node = scenario.nodes[id];
    if (!node) continue;
    seen.add(id);
    queue.push(...getNextNodeIds(node));
  }
  return seen;
}

/**
 * Longest chain of decisions to any ending. Used to sanity-check that a scenario
 * is actually branching 3–6 deep rather than a two-step stub.
 */
export function getMaxDecisionDepth(scenario: Scenario): number {
  const memo = new Map<string, number>();

  const walk = (nodeId: string, onPath: Set<string>): number => {
    const cached = memo.get(nodeId);
    if (cached !== undefined) return cached;
    // A cycle is legal (a "try again in-story" loop) but must not hang the walk.
    if (onPath.has(nodeId)) return 0;

    const node = scenario.nodes[nodeId];
    if (!node) return 0;

    onPath.add(nodeId);
    const nextDepths = getNextNodeIds(node).map((id) => walk(id, onPath));
    onPath.delete(nodeId);

    const deepestChild = nextDepths.length > 0 ? Math.max(...nextDepths) : 0;
    const depth = (node.kind === 'scene' ? 1 : 0) + deepestChild;
    memo.set(nodeId, depth);
    return depth;
  };

  return walk(scenario.entryNodeId, new Set());
}

export type ScenarioIssue = { level: 'error' | 'warning'; message: string };

/**
 * Structural checks the type system cannot express: dangling pointers,
 * unreachable nodes, unknown slang ids, missing failure paths.
 *
 * Runs in dev on import (see `data/scenarios/index.ts`) and is surfaced in the
 * story dev panel, so an authoring mistake shows up immediately rather than as a
 * black video at branch point four.
 */
export function validateScenario(
  scenario: Scenario,
  knownSlangIds: ReadonlySet<string>,
): ScenarioIssue[] {
  const issues: ScenarioIssue[] = [];

  const parsed = scenarioSchema.safeParse(scenario);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        level: 'error',
        message: `schema: ${issue.path.join('.')} — ${issue.message}`,
      });
    }
    return issues;
  }

  const nodeIds = Object.keys(scenario.nodes);

  for (const [key, node] of Object.entries(scenario.nodes)) {
    if (key !== node.id) {
      issues.push({
        level: 'error',
        message: `node key "${key}" does not match its id "${node.id}".`,
      });
    }
    for (const nextId of getNextNodeIds(node)) {
      if (!scenario.nodes[nextId]) {
        issues.push({
          level: 'error',
          message: `node "${node.id}" points at missing node "${nextId}".`,
        });
      }
    }
    if (node.kind === 'scene') {
      const choiceIds = new Set(node.choices.map((c) => c.id));
      if (choiceIds.size !== node.choices.length) {
        issues.push({
          level: 'error',
          message: `node "${node.id}" has duplicate choice ids.`,
        });
      }
      if (node.timeoutChoiceId && !choiceIds.has(node.timeoutChoiceId)) {
        issues.push({
          level: 'error',
          message: `node "${node.id}" times out to unknown choice "${node.timeoutChoiceId}".`,
        });
      }
      if (node.decisionSeconds && !node.timeoutChoiceId) {
        issues.push({
          level: 'warning',
          message: `node "${node.id}" shows a timer but has no timeoutChoiceId, so nothing happens at zero.`,
        });
      }
    }
    if (node.kind === 'ending' && node.retryFromNodeId) {
      if (!scenario.nodes[node.retryFromNodeId]) {
        issues.push({
          level: 'error',
          message: `ending "${node.id}" retries from missing node "${node.retryFromNodeId}".`,
        });
      }
    }

    const start = getClipStartSec(node.clip);
    const end = getClipEndSec(node.clip);
    if (end !== null && end <= start) {
      issues.push({
        level: 'error',
        message: `node "${node.id}" has a trim window that ends before it starts.`,
      });
    }
    const cue = getChoiceCueSec(node);
    if (cue !== null && (cue < start || (end !== null && cue > end))) {
      issues.push({
        level: 'warning',
        message: `node "${node.id}" cues its choices outside its trim window.`,
      });
    }
    if (!node.clip.mockUrl) {
      issues.push({
        level: 'warning',
        message: `node "${node.id}" has no mockUrl, so it will be blank in mock video mode.`,
      });
    }

    for (const termId of node.slangTermIds) {
      if (!knownSlangIds.has(termId)) {
        issues.push({
          level: 'error',
          message: `node "${node.id}" references unknown slang term "${termId}".`,
        });
      }
    }
    if (node.kind === 'scene') {
      for (const choice of node.choices) {
        for (const termId of choice.slangTermIds) {
          if (!knownSlangIds.has(termId)) {
            issues.push({
              level: 'error',
              message: `choice "${choice.id}" references unknown slang term "${termId}".`,
            });
          }
        }
      }
    }
  }

  if (!scenario.nodes[scenario.entryNodeId]) {
    issues.push({
      level: 'error',
      message: `entryNodeId "${scenario.entryNodeId}" does not exist.`,
    });
  }

  const reachable = collectReachableNodeIds(scenario);
  for (const id of nodeIds) {
    if (!reachable.has(id)) {
      issues.push({
        level: 'warning',
        message: `node "${id}" is unreachable from the entry node.`,
      });
    }
  }

  const endings = listEndings(scenario);
  if (!endings.some((e) => e.outcome === 'success')) {
    issues.push({
      level: 'warning',
      message: 'scenario has no success ending.',
    });
  }
  if (!endings.some((e) => e.outcome === 'failure')) {
    issues.push({
      level: 'warning',
      message:
        'scenario has no failure ending, so there is no consequence to learn from.',
    });
  }

  for (const termId of scenario.slangTermIds) {
    if (!knownSlangIds.has(termId)) {
      issues.push({
        level: 'error',
        message: `scenario lists unknown slang term "${termId}".`,
      });
    }
  }

  return issues;
}
