/**
 * Branch preloading.
 *
 * The core UX risk in a branching video app is the pause between "user taps a
 * choice" and "next clip plays". We attack it on two levels:
 *
 *  1. This module warms every reachable next clip at the HTTP level while the
 *     decision overlay is on screen. Off-screen <video> elements with
 *     preload="auto" buffer their opening seconds, so a later request for the
 *     same URL is served from cache.
 *  2. `VideoStage` additionally parks the first candidate in an idle <video>
 *     buffer, already seeked to its in-point, so the likeliest branch swaps in
 *     with zero network work at all.
 *
 * Elements are kept alive in an LRU — dropping them would let the browser evict
 * the buffered data we just paid for — but capped, because a phone will not hold
 * a dozen buffering video elements without stuttering.
 */

const MAX_WARM_ELEMENTS = 6;

type WarmEntry = {
  element: HTMLVideoElement;
  ready: boolean;
  touchedAt: number;
};

const warmed = new Map<string, WarmEntry>();
let hiddenHost: HTMLDivElement | null = null;

function getHost(): HTMLDivElement | null {
  if (typeof document === 'undefined') return null;
  if (hiddenHost?.isConnected) return hiddenHost;

  const host = document.createElement('div');
  host.dataset.slanguage = 'video-preload-host';
  host.setAttribute('aria-hidden', 'true');
  // Off-screen rather than display:none — hidden elements are allowed to skip
  // buffering in some engines.
  host.style.cssText =
    'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0';
  document.body.appendChild(host);
  hiddenHost = host;
  return host;
}

function evictIfNeeded() {
  if (warmed.size <= MAX_WARM_ELEMENTS) return;
  const entries = [...warmed.entries()].sort(
    (a, b) => a[1].touchedAt - b[1].touchedAt,
  );
  for (const [url, entry] of entries.slice(
    0,
    warmed.size - MAX_WARM_ELEMENTS,
  )) {
    entry.element.removeAttribute('src');
    entry.element.load();
    entry.element.remove();
    warmed.delete(url);
  }
}

/** Idempotent: calling this on every render is safe and cheap. */
export function warmClip(url: string): void {
  const existing = warmed.get(url);
  if (existing) {
    existing.touchedAt = Date.now();
    return;
  }

  const host = getHost();
  if (!host) return;

  const element = document.createElement('video');
  element.preload = 'auto';
  element.muted = true;
  element.playsInline = true;
  // Deliberately no crossOrigin: we never read frames into a canvas, and
  // requiring CORS headers would rule out otherwise fine CDN origins.
  element.src = url;

  const entry: WarmEntry = { element, ready: false, touchedAt: Date.now() };
  const markReady = () => {
    entry.ready = true;
  };
  element.addEventListener('loadeddata', markReady, { once: true });
  element.addEventListener('canplaythrough', markReady, { once: true });

  host.appendChild(element);
  element.load();

  warmed.set(url, entry);
  evictIfNeeded();
}

export function warmClips(urls: readonly string[]): void {
  urls.forEach(warmClip);
}

export function isClipWarm(url: string): boolean {
  return warmed.get(url)?.ready ?? false;
}

/** Diagnostics for the story dev panel. */
export function getWarmSnapshot(): { url: string; ready: boolean }[] {
  return [...warmed.entries()].map(([url, entry]) => ({
    url,
    ready: entry.ready,
  }));
}

export function clearWarmedClips(): void {
  for (const entry of warmed.values()) {
    entry.element.removeAttribute('src');
    entry.element.load();
    entry.element.remove();
  }
  warmed.clear();
}
