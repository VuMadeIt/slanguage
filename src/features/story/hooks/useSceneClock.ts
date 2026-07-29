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

  const elapsedRef = useRef(0);
  const firedCueRef = useRef(false);
  const firedEndRef = useRef(false);

  const onCueRef = useRef(onCue);
  const onEndedRef = useRef(onEnded);
  onCueRef.current = onCue;
  onEndedRef.current = onEnded;

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const cueRef = useRef(cueSec);
  cueRef.current = cueSec;
  const durationRef = useRef(durationSec);
  durationRef.current = durationSec;

  useEffect(() => {
    elapsedRef.current = 0;
    firedCueRef.current = false;
    firedEndRef.current = false;
    setProgress(0);

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      last = now;
      if (pausedRef.current) return;

      elapsedRef.current += delta / 1000;
      const elapsed = elapsedRef.current;
      const duration = durationRef.current;
      setProgress(duration > 0 ? Math.min(1, elapsed / duration) : 0);

      const cue = cueRef.current;
      if (cue !== null && !firedCueRef.current && elapsed >= cue) {
        firedCueRef.current = true;
        onCueRef.current?.();
        return;
      }
      if (!firedEndRef.current && elapsed >= duration) {
        // A cue sitting on the out-point still wins, matching VideoStage.
        if (cue !== null && !firedCueRef.current) {
          firedCueRef.current = true;
          onCueRef.current?.();
          return;
        }
        firedEndRef.current = true;
        onEndedRef.current();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playKey]);

  return { progress };
}
