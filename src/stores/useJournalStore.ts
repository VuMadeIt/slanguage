import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createPersistStorage, storageKey } from '@/services/storage/persist';

/**
 * The journal stores only the user's *relationship* to a term (when they met it,
 * how often, their note). The term content itself lives in the term library, so
 * editing a definition updates every user's journal without a migration.
 */
export type JournalEntry = {
  termId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  timesEncountered: number;
  /** Where they met it — good "you learned this in Kanye in the Wild" context. */
  scenarioIds: string[];
  source: 'story' | 'playground' | 'manual';
  userNote: string;
  favorite: boolean;
  /** Self-reported for now; fluency scoring will set this on Pro. */
  mastered: boolean;
};

type JournalState = {
  entries: Record<string, JournalEntry>;
  /** Idempotent per encounter — safe to call on every node entry. */
  encounter: (
    termId: string,
    context?: { scenarioId?: string; source?: JournalEntry['source'] },
  ) => void;
  encounterMany: (
    termIds: readonly string[],
    context?: { scenarioId?: string; source?: JournalEntry['source'] },
  ) => void;
  setNote: (termId: string, note: string) => void;
  toggleFavorite: (termId: string) => void;
  toggleMastered: (termId: string) => void;
  remove: (termId: string) => void;
  resetAll: () => void;
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: {},

      encounter: (termId, context) => {
        const now = new Date().toISOString();
        set((state) => {
          const existing = state.entries[termId];
          const scenarioIds = context?.scenarioId
            ? [
                ...new Set([
                  ...(existing?.scenarioIds ?? []),
                  context.scenarioId,
                ]),
              ]
            : (existing?.scenarioIds ?? []);

          const next: JournalEntry = existing
            ? {
                ...existing,
                lastSeenAt: now,
                timesEncountered: existing.timesEncountered + 1,
                scenarioIds,
              }
            : {
                termId,
                firstSeenAt: now,
                lastSeenAt: now,
                timesEncountered: 1,
                scenarioIds,
                source: context?.source ?? 'story',
                userNote: '',
                favorite: false,
                mastered: false,
              };

          return { entries: { ...state.entries, [termId]: next } };
        });
      },

      encounterMany: (termIds, context) => {
        termIds.forEach((termId) => get().encounter(termId, context));
      },

      setNote: (termId, note) =>
        set((state) => {
          const existing = state.entries[termId];
          if (!existing) return state;
          return {
            entries: {
              ...state.entries,
              [termId]: { ...existing, userNote: note },
            },
          };
        }),

      toggleFavorite: (termId) =>
        set((state) => {
          const existing = state.entries[termId];
          if (!existing) return state;
          return {
            entries: {
              ...state.entries,
              [termId]: { ...existing, favorite: !existing.favorite },
            },
          };
        }),

      toggleMastered: (termId) =>
        set((state) => {
          const existing = state.entries[termId];
          if (!existing) return state;
          return {
            entries: {
              ...state.entries,
              [termId]: { ...existing, mastered: !existing.mastered },
            },
          };
        }),

      remove: (termId) =>
        set((state) => {
          const { [termId]: _removed, ...rest } = state.entries;
          void _removed;
          return { entries: rest };
        }),

      resetAll: () => set({ entries: {} }),
    }),
    {
      name: storageKey('journal'),
      version: 1,
      storage: createPersistStorage<JournalState>(),
      skipHydration: true,
    },
  ),
);
