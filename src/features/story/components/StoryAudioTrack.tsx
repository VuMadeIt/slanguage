'use client';

import { useEffect, useRef } from 'react';

import { resolveAudioUrl } from '@/services/audio/resolveAudio';
import type { AudioTrack } from '@/domain/scenario';

type Props = {
  track: AudioTrack | undefined;
  /** Replays from the top whenever this changes (node entry). */
  playKey: string;
  /** Paused while the decision overlay is up, or before the run begins. */
  paused: boolean;
  muted: boolean;
};

/**
 * Dialogue track that rides along with the video stage.
 *
 * Higgsfield returns silent video, so this is the spoken layer. It is a sibling
 * of the video element rather than something baked into the file: that lets us
 * re-record a line after a slang term ages out without re-shooting anything.
 *
 * In mock mode (no generated audio yet) this component is a no-op.
 */
export function StoryAudioTrack({ track, playKey, paused, muted }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const url = track ? resolveAudioUrl(track) : null;
  const offset = track?.offsetSec ?? 0;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !url) return;
    el.src = url;
    el.currentTime = Math.max(0, offset);
    el.load();
  }, [playKey, url, offset]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !url) return;
    el.muted = muted;
    if (paused) {
      el.pause();
      return;
    }
    void el.play().catch(() => {
      // Autoplay may still be blocked until the Start gesture; that is fine.
    });
  }, [paused, muted, playKey, url]);

  if (!url) return null;
  return <audio ref={audioRef} preload="auto" playsInline />;
}
