import { createJSONStorage, type PersistStorage } from 'zustand/middleware';

/**
 * Storage seam for persisted stores.
 *
 * v1 is localStorage-only. It sits behind this factory so that adding accounts
 * later means implementing one adapter (read-through cache over an API, or
 * IndexedDB for larger journals) instead of touching every store.
 */

const memoryFallback = new Map<string, string>();

const safeStorage = {
  getItem(name: string): string | null {
    try {
      if (typeof window === 'undefined') return memoryFallback.get(name) ?? null;
      return window.localStorage.getItem(name);
    } catch {
      // Private-mode Safari and some embedded webviews throw on access.
      return memoryFallback.get(name) ?? null;
    }
  },
  setItem(name: string, value: string): void {
    try {
      if (typeof window === 'undefined') {
        memoryFallback.set(name, value);
        return;
      }
      window.localStorage.setItem(name, value);
    } catch {
      memoryFallback.set(name, value);
    }
  },
  removeItem(name: string): void {
    try {
      memoryFallback.delete(name);
      if (typeof window !== 'undefined') window.localStorage.removeItem(name);
    } catch {
      memoryFallback.delete(name);
    }
  },
};

export const STORAGE_PREFIX = 'slanguage';

export function storageKey(name: string): string {
  return `${STORAGE_PREFIX}:${name}`;
}

export function createPersistStorage<T>(): PersistStorage<T> | undefined {
  return createJSONStorage<T>(() => safeStorage);
}

/** Used by the Profile screen's "reset local data" action. */
export function clearAllPersistedData(): void {
  try {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(`${STORAGE_PREFIX}:`),
    );
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    memoryFallback.clear();
  }
}
