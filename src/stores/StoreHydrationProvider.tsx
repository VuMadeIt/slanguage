'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useEntitlementsStore } from './useEntitlementsStore';
import { useJournalStore } from './useJournalStore';
import { useProgressStore } from './useProgressStore';

const PERSISTED_STORES = [useProgressStore, useJournalStore, useEntitlementsStore];

const HydrationContext = createContext(false);

/**
 * Every persisted store uses `skipHydration`, so localStorage is read exactly
 * once here on mount. That keeps the server-rendered markup identical to the
 * first client render — otherwise a returning user's saved progress would trip
 * React's hydration check on every page load.
 *
 * Components that render persisted data call `useHydrated()` and show a skeleton
 * until it flips, so counts never visibly jump from zero.
 */
export function StoreHydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.all(
      PERSISTED_STORES.map((store) => store.persist.rehydrate()),
    ).then(() => {
      if (cancelled) return;
      useEntitlementsStore.getState().rollUsageDate();
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <HydrationContext.Provider value={hydrated}>
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydrated(): boolean {
  return useContext(HydrationContext);
}
