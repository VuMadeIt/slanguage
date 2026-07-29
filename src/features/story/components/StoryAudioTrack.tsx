'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { getVoicePersona } from '@/data/voice-personas';
import type { AudioTrack } from '@/domain/scenario';
import { resolveAudioLineUrl } from '@/services/audio/resolveAudio';

type Props = {
  track: AudioTrack | undefined;
  scenarioId: string;
  nodeId: string;
  /** Replays from the top whenever this changes (node entry). */
  playKey: string;
  /** Paused while the decision overlay is up, or before the run begins. */
  paused: boolean;
  muted: boolean;
};

/**
 * Timed dialogue layer that rides along with either story stage.
 *
 * Higgsfield returns silent video, so this is the spoken layer. It is a sibling
 * of the video element rather than something baked into the file: that lets us
 * re-record a line after a slang term ages out without re-shooting anything.
 *
 * Every authored line gets its own audio element and fires at `atSec`. Mock mode
 * calls the server-side ElevenLabs route on demand; generated/CDN mode loads the
 * same per-line files produced by `generate:assets`. If credentials or a voice
 * id are missing, browser speech takes over with character-specific rate/pitch
 * rather than leaving the scene silent.
 */
export function StoryAudioTrack({
  track,
  scenarioId,
  nodeId,
  playKey,
  paused,
  muted,
}: Props) {
  const [usingFallback, setUsingFallback] = useState(false);

  // Live values for the loop below. Keeping them here rather than in the effect's
  // dependencies is what stops a mute toggle or a decision pause from tearing
  // down the audio elements and restarting the dialogue from line one.
  const latest = useRef({ paused, muted });
  useEffect(() => {
    latest.current = { paused, muted };
  });

  const lineUrls = useMemo(
    () =>
      track?.lines.map((_, lineIndex) =>
        resolveAudioLineUrl(track, lineIndex, { scenarioId, nodeId }),
      ) ?? [],
    [nodeId, scenarioId, track],
  );

  // One effect owns the whole node: the elements, the clock, pause and mute.
  // Splitting them meant mutating the same elements from several effects, which
  // is both a lint error and a real ordering hazard during a branch swap.
  useEffect(() => {
    const lines = track?.lines ?? [];
    if (lines.length === 0) return;

    const offset = track?.offsetSec ?? 0;
    const elements = lineUrls.map((url) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.muted = latest.current.muted;
      audio.load();
      return audio;
    });

    const fired = lines.map(() => false);
    const fallbackFired = lines.map(() => false);

    const speakFallback = (lineIndex: number) => {
      const line = lines[lineIndex];
      if (
        !line ||
        fallbackFired[lineIndex] ||
        latest.current.muted ||
        !('speechSynthesis' in window)
      ) {
        return;
      }
      fallbackFired[lineIndex] = true;

      const persona = getVoicePersona(line.voice);
      const utterance = new SpeechSynthesisUtterance(line.text);
      const installed = window.speechSynthesis.getVoices();
      const voice = persona?.browser.voiceHints
        .map((hint) =>
          installed.find((candidate) =>
            candidate.name.toLowerCase().includes(hint.toLowerCase()),
          ),
        )
        .find(Boolean);

      if (voice) utterance.voice = voice;
      utterance.rate = persona?.browser.rate ?? 1;
      utterance.pitch = persona?.browser.pitch ?? 1;
      utterance.volume = persona?.browser.volume ?? 1;
      setUsingFallback(true);
      window.speechSynthesis.speak(utterance);
    };

    let raf = 0;
    let elapsed = 0;
    let lastTick: number | null = null;
    let appliedMuted = latest.current.muted;
    let appliedPaused = latest.current.paused;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const { paused: isPaused, muted: isMuted } = latest.current;

      if (isMuted !== appliedMuted) {
        appliedMuted = isMuted;
        for (const audio of elements) audio.muted = isMuted;
        if (isMuted) window.speechSynthesis?.cancel();
      }

      if (isPaused !== appliedPaused) {
        appliedPaused = isPaused;
        if (isPaused) {
          for (const audio of elements) audio.pause();
          window.speechSynthesis?.pause();
        } else {
          // Only resume lines already underway; unplayed ones wait for their cue.
          for (const audio of elements) {
            if (audio.currentTime > 0 && !audio.ended) {
              void audio.play().catch(() => undefined);
            }
          }
          window.speechSynthesis?.resume();
        }
      }

      if (isPaused) {
        lastTick = null;
        return;
      }
      if (lastTick !== null) elapsed += (now - lastTick) / 1000;
      lastTick = now;

      lines.forEach((line, lineIndex) => {
        if (fired[lineIndex]) return;
        const atSec = Math.max(0, (line.atSec ?? 0) + offset);
        if (elapsed < atSec) return;

        fired[lineIndex] = true;
        const audio = elements[lineIndex];
        if (!audio || latest.current.muted) return;

        audio.addEventListener('error', () => speakFallback(lineIndex), {
          once: true,
        });
        void audio.play().catch(() => speakFallback(lineIndex));
      });
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.speechSynthesis?.cancel();
      for (const audio of elements) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [lineUrls, playKey, track]);

  if (!usingFallback) return null;
  return (
    <div
      role="status"
      className="bg-void-900/70 text-solar-300 absolute top-14 right-3 z-20 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase backdrop-blur"
    >
      Browser voice · add ElevenLabs keys
    </div>
  );
}
