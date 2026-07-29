'use client';

import { useEffect, useRef, useState } from 'react';

type Options = {
  /** Restarts the clock from zero whenever it changes. */
  playKey: string;
  /** How long the beat runs, in seconds. */
  durationSec: number;
  /** Offset at which to hand over to the decision overlay, or null. */
  cueSec: number | null;
  paused: boolean;
  onCue?: () => void;
  onEnded: () => void;
};

/**
 * Playback clock for beats rendered as art rather than video.
 *
 * Mirrors the timing contract `VideoStage` gets from the media element — cue
 * first, then out-point, each firing at most once per key — so the story engine
 * behaves identically whether a beat is a generated clip or cutout art.
 */
export function useSceneClock({
  playKey,
  durationSec,
  cueSec,
  paused,
  onCue,
  onEnded,
}: Options): { progress: number } {
  const [progress, setProgress] = useState(0);

  // The loop is keyed on `playKey` alone so a re-render never restarts the beat.
  // Everything it needs to read live goes through this one snapshot instead.
  const latest = useRef({ durationSec, cueSec, paused, onCue, onEnded });
  useEffect(() => {
    latest.current = { durationSec, cueSec, paused, onCue, onEnded };
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let firedCue = false;
    let firedEnd = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      last = now;

      const { durationSec: duration, cueSec: cue, paused: isPaused } = latest.current;
      if (!isPaused) elapsed += delta / 1000;
      // Set unconditionally so re-entering a node resets the bar even while paused.
      setProgress(duration > 0 ? Math.min(1, elapsed / duration) : 0);
      if (isPaused) return;

      if (cue !== null && !firedCue && elapsed >= cue) {
        firedCue = true;
        latest.current.onCue?.();
        return;
      }
      if (!firedEnd && elapsed >= duration) {
        // A cue sitting on the out-point still wins, matching VideoStage.
        if (cue !== null && !firedCue) {
          firedCue = true;
          latest.current.onCue?.();
          return;
        }
        firedEnd = true;
        latest.current.onEnded();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playKey]);

  return { progress };
}
