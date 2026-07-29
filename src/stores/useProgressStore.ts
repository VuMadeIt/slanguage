import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { EndingOutcome } from '@/domain/scenario';
import { createPersistStorage, storageKey } from '@/services/storage/persist';

export type ScenarioProgress = {
  scenarioId: string;
  attempts: number;
  retries: number;
  completed: boolean;
  /** Ending ids the user has actually seen — the collectible in this app. */
  unlockedEndingIds: string[];
  bestOutcome: EndingOutcome | null;
  visitedNodeIds: string[];
  lastNodeId: string | null;
  totalPlayMs: number;
  lastPlayedAt: string | null;
};

function emptyProgress(scenarioId: string): ScenarioProgress {
  return {
    scenarioId,
    attempts: 0,
    retries: 0,
    completed: false,
    unlockedEndingIds: [],
    bestOutcome: null,
    visitedNodeIds: [],
    lastNodeId: null,
    totalPlayMs: 0,
    lastPlayedAt: null,
  };
}

const OUTCOME_RANK: Record<EndingOutcome, number> = {
  failure: 0,
  partial: 1,
  success: 2,
};

type ProgressState = {
  byScenario: Record<string, ScenarioProgress>;
  startRun: (scenarioId: string) => void;
  visitNode: (scenarioId: string, nodeId: string) => void;
  recordRetry: (scenarioId: string) => void;
  recordEnding: (
    scenarioId: string,
    endingId: string,
    outcome: EndingOutcome,
    durationMs: number,
  ) => void;
  resetScenario: (scenarioId: string) => void;
  resetAll: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      byScenario: {},

      startRun: (scenarioId) =>
        set((state) => {
          const current = state.byScenario[scenarioId] ?? emptyProgress(scenarioId);
          return {
            byScenario: {
              ...state.byScenario,
              [scenarioId]: {
                ...current,
                attempts: current.attempts + 1,
                lastPlayedAt: new Date().toISOString(),
              },
            },
          };
        }),

      visitNode: (scenarioId, nodeId) =>
        set((state) => {
          const current = state.byScenario[scenarioId] ?? emptyProgress(scenarioId);
          const visited = current.visitedNodeIds.includes(nodeId)
            ? current.visitedNodeIds
            : [...current.visitedNodeIds, nodeId];
          return {
            byScenario: {
              ...state.byScenario,
              [scenarioId]: {
                ...current,
                visitedNodeIds: visited,
                lastNodeId: nodeId,
              },
            },
          };
        }),

      recordRetry: (scenarioId) =>
        set((state) => {
          const current = state.byScenario[scenarioId] ?? emptyProgress(scenarioId);
          return {
            byScenario: {
              ...state.byScenario,
              [scenarioId]: { ...current, retries: current.retries + 1 },
            },
          };
        }),

      recordEnding: (scenarioId, endingId, outcome, durationMs) =>
        set((state) => {
          const current = state.byScenario[scenarioId] ?? emptyProgress(scenarioId);
          const unlocked = current.unlockedEndingIds.includes(endingId)
            ? current.unlockedEndingIds
            : [...current.unlockedEndingIds, endingId];
          const best =
            current.bestOutcome === null ||
            OUTCOME_RANK[outcome] > OUTCOME_RANK[current.bestOutcome]
              ? outcome
              : current.bestOutcome;
          return {
            byScenario: {
              ...state.byScenario,
              [scenarioId]: {
                ...current,
                unlockedEndingIds: unlocked,
                // Reaching any ending counts as completing a run; `bestOutcome`
                // is what tells the user whether to come back.
                completed: true,
                bestOutcome: best,
                totalPlayMs: current.totalPlayMs + durationMs,
                lastPlayedAt: new Date().toISOString(),
              },
            },
          };
        }),

      resetScenario: (scenarioId) =>
        set((state) => ({
          byScenario: {
            ...state.byScenario,
            [scenarioId]: emptyProgress(scenarioId),
          },
        })),

      resetAll: () => set({ byScenario: {} }),
    }),
    {
      name: storageKey('progress'),
      version: 1,
      storage: createPersistStorage<ProgressState>(),
      // Hydrating during render would desync SSR markup; the app shell triggers
      // rehydration on mount instead.
      skipHydration: true,
    },
  ),
);

export function selectProgress(
  state: ProgressState,
  scenarioId: string,
): ScenarioProgress {
  return state.byScenario[scenarioId] ?? emptyProgress(scenarioId);
}

export { emptyProgress };
