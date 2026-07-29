'use client';

import { cn } from '@/lib/cn';
import type { SceneArt } from '@/domain/scenario';

import { useSceneClock } from '../hooks/useSceneClock';
import { CutoutScene, SETTING_PALETTE } from './CutoutScene';

type Props = {
  art: SceneArt;
  /** Changes on every node entry, including re-entry after a retry. */
  playKey: string;
  durationSec: number;
  /** Offset into the beat at which the decision overlay takes over. */
  cueSec: number | null;
  frozen: boolean;
  speakingKey?: string | null;
  onCue?: () => void;
  onEnded: () => void;
  className?: string;
};

/**
 * Drop-in stand-in for `VideoStage` that draws a beat as cutout art.
 *
 * Used while a scenario's clips are still un-generated: it keeps the branching
 * mechanic fully demoable and, unlike a generic stock clip, actually depicts the
 * beat it belongs to. Preloading is a no-op here since nothing is fetched.
 */
export function SceneArtStage({
  art,
  playKey,
  durationSec,
  cueSec,
  frozen,
  speakingKey,
  onCue,
  onEnded,
  className,
}: Props) {
  const { progress } = useSceneClock({
    playKey,
    durationSec,
    cueSec,
    paused: frozen,
    onCue,
    onEnded,
  });

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      // Backstop only: the scene scales to fill, so this is never normally seen.
      style={{ backgroundColor: SETTING_PALETTE[art.setting].wall }}
    >
      <CutoutScene
        key={playKey}
        art={art}
        speakingKey={frozen ? null : speakingKey}
        className="absolute inset-0 h-full w-full"
      />

      {/* Paper grain, so the flat fills read as construction paper. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 30%, #000 0.5px, transparent 0.6px), radial-gradient(circle at 70% 65%, #000 0.5px, transparent 0.6px)',
          backgroundSize: '7px 7px, 11px 11px',
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-white/10">
        <div
          className="h-full bg-plasma-500 transition-[width] duration-100 ease-linear"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
