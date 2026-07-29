import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TierId } from '@/domain/entitlements';
import { createPersistStorage, storageKey } from '@/services/storage/persist';

/**
 * Holds *what the user is entitled to*, never *how they paid*. When billing gets
 * wired up, the webhook handler sets `tier` and nothing else in the app changes.
 * Until then the Profile screen can set it directly, which is also how we demo
 * the paywall.
 */
type EntitlementsState = {
  tier: TierId;
  /** Reset lazily on first use each day rather than by a scheduled job. */
  playgroundMessagesUsedToday: number;
  usageDate: string;
  setTier: (tier: TierId) => void;
  rollUsageDate: () => void;
  consumePlaygroundMessage: () => void;
  resetAll: () => void;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useEntitlementsStore = create<EntitlementsState>()(
  persist(
    (set, get) => ({
      tier: 'free',
      playgroundMessagesUsedToday: 0,
      usageDate: today(),

      setTier: (tier) => set({ tier }),

      rollUsageDate: () => {
        if (get().usageDate !== today()) {
          set({ usageDate: today(), playgroundMessagesUsedToday: 0 });
        }
      },

      consumePlaygroundMessage: () => {
        get().rollUsageDate();
        set((state) => ({
          playgroundMessagesUsedToday: state.playgroundMessagesUsedToday + 1,
        }));
      },

      resetAll: () =>
        set({
          tier: 'free',
          playgroundMessagesUsedToday: 0,
          usageDate: today(),
        }),
    }),
    {
      name: storageKey('entitlements'),
      version: 1,
      storage: createPersistStorage<EntitlementsState>(),
      skipHydration: true,
    },
  ),
);
