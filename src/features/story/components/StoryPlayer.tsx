'use client';

import { ChevronLeft, FastForward, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { env } from '@/config/env';
import { getPlanet } from '@/data/planets';
import { getClipEndSec, getClipStartSec } from '@/domain/graph';
import type { Scenario } from '@/domain/scenario';

import { useStoryEngine } from '../hooks/useStoryEngine';
import { resolveSceneArt, resolveSpeakingKey } from '../lib/resolveSceneArt';
import { ChoiceFeedback } from './ChoiceFeedback';
import { ChoiceOverlay } from './ChoiceOverlay';
import { EndingCard } from './EndingCard';
import { SceneArtStage } from './SceneArtStage';
import { StoryAudioTrack } from './StoryAudioTrack';
import { StoryDevPanel } from './StoryDevPanel';
import {
  VideoStage,
  type StageSource,
  type VideoStageHandle,
} from './VideoStage';

/** Fallback beat length for art mode when a clip has no authored out-point. */
const DEFAULT_ART_DURATION_SEC = 7;

/**
 * Story Mode shell. Owns the run (via `useStoryEngine`) and wires it to the
 * video surface; every overlay below is presentational.
 */
export function StoryPlayer({ scenario }: { scenario: Scenario }) {
  const engine = useStoryEngine(scenario);
  const stageRef = useRef<VideoStageHandle>(null);
  const [devOpen, setDevOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  const { node, phase } = engine;
  const planet = getPlanet(scenario.planetId);

  /**
   * Art mode stands in until a beat has a real clip on the CDN. `assetPath`
   * being unresolved is the signal, so a scenario can mix generated footage and
   * placeholder art while its library is filled in.
   */
  const useArt = env.useSceneArt && env.useMockVideos;

  const playKey = `${node.id}:${engine.visitSeq}`;

  const source: StageSource = useMemo(
    () => ({
      // Includes visitSeq so re-entering a node after a retry replays it.
      key: `${node.id}:${engine.visitSeq}`,
      url: engine.currentClipUrl,
      startSec: getClipStartSec(node.clip),
      endSec: getClipEndSec(node.clip),
      posterUrl: node.clip.posterUrl,
    }),
    [engine.currentClipUrl, engine.visitSeq, node.clip, node.id],
  );

  // Trim points are authored in source-file time; art mode has no file, so
  // rebase them onto the beat itself.
  const artTiming = useMemo(() => {
    const startSec = getClipStartSec(node.clip);
    const endSec = getClipEndSec(node.clip);
    const durationSec =
      endSec === null ? DEFAULT_ART_DURATION_SEC : endSec - startSec;
    const cue = engine.choiceCueSec;
    return {
      durationSec: Math.max(1.5, durationSec),
      cueSec: cue === null ? null : Math.max(0.4, cue - startSec),
    };
  }, [engine.choiceCueSec, node.clip]);

  const start = () => {
    // Unlock both buffers inside the gesture, or the first branch swap plays silently.
    stageRef.current?.unlock();
    engine.begin();
  };

  const skipAhead = () => {
    if (node.kind === 'scene') engine.onCue();
    else engine.onClipEnded();
  };

  const toggleMute = () => {
    stageRef.current?.toggleMute();
    setMuted((prev) => !prev);
  };

  const showCaption = phase === 'playing' && Boolean(node.caption);
  const backHref = planet ? `/story?planet=${planet.id}` : '/story';

  return (
    <div className="bg-void-950 relative h-dvh w-full overflow-hidden select-none">
      {useArt ? (
        <SceneArtStage
          className="absolute inset-0"
          art={resolveSceneArt(scenario, node)}
          playKey={playKey}
          durationSec={artTiming.durationSec}
          cueSec={artTiming.cueSec}
          frozen={phase !== 'playing'}
          speakingKey={resolveSpeakingKey(node)}
          onCue={engine.onCue}
          onEnded={engine.onClipEnded}
        />
      ) : (
        <VideoStage
          ref={stageRef}
          className="absolute inset-0"
          source={source}
          upcomingUrls={engine.upcomingClipUrls}
          frozen={phase === 'deciding' || phase === 'ready'}
          cueSec={engine.choiceCueSec}
          onCue={engine.onCue}
          onEnded={engine.onClipEnded}
        />
      )}

      <StoryAudioTrack
        key={playKey}
        track={node.clip.audio}
        scenarioId={scenario.id}
        nodeId={node.id}
        playKey={playKey}
        paused={phase !== 'playing'}
        muted={muted}
      />

      <div className="from-void-950/80 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent" />
      <div className="from-void-950/90 pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t to-transparent" />

      <header className="pt-safe absolute inset-x-0 top-0 z-30 flex items-center gap-2 px-3">
        <Link
          href={backHref}
          aria-label="Leave scenario"
          className="bg-void-900/60 hover:bg-void-800 rounded-full p-2 text-white/90 backdrop-blur transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          {planet ? (
            <p className="text-plasma-400 truncate text-[10px] font-bold tracking-[0.18em] uppercase">
              {planet.emoji} {planet.name}
            </p>
          ) : null}
          <p className="truncate text-sm font-semibold text-white/90 drop-shadow">
            {scenario.title}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-label="Toggle sound"
          className="bg-void-900/60 hover:bg-void-800 rounded-full p-2 text-white/90 backdrop-blur transition-colors"
        >
          <Volume2 size={18} />
        </button>
        {phase === 'playing' ? (
          <button
            type="button"
            onClick={skipAhead}
            aria-label="Skip ahead"
            className="bg-void-900/60 hover:bg-void-800 rounded-full p-2 text-white/90 backdrop-blur transition-colors"
          >
            <FastForward size={18} />
          </button>
        ) : null}
      </header>

      {showCaption ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-8">
          <div className="mx-auto max-w-md">
            {node.speaker ? (
              <p className="text-plasma-400 text-[11px] font-bold tracking-[0.16em] uppercase">
                {node.speaker}
              </p>
            ) : null}
            <p className="mt-1 text-[15px] leading-snug font-medium text-white drop-shadow-lg">
              {node.caption}
            </p>
          </div>
        </div>
      ) : null}

      {node.kind === 'scene' ? (
        <ChoiceOverlay
          key={node.id}
          node={node}
          visible={phase === 'deciding'}
          onSelect={engine.select}
        />
      ) : null}

      {engine.lastChoice && phase !== 'ended' ? (
        <ChoiceFeedback
          choice={engine.lastChoice.choice}
          viaTimeout={engine.lastChoice.viaTimeout}
          onDismiss={engine.dismissFeedback}
        />
      ) : null}

      {phase === 'ready' ? (
        <div className="from-void-950 via-void-950/85 to-void-950/30 absolute inset-0 z-40 flex flex-col justify-end bg-gradient-to-t px-5 pb-10">
          <div className="mx-auto w-full max-w-md">
            {planet ? (
              <p className="text-plasma-400 text-[11px] font-bold tracking-[0.18em] uppercase">
                Landing on {planet.name} · {planet.dialect}
              </p>
            ) : null}
            <p className="mt-2 text-[11px] font-bold tracking-[0.18em] text-white/45 uppercase">
              {scenario.difficulty} · {scenario.estimatedMinutes} min
            </p>
            <h1 className="font-display mt-2 text-4xl leading-[1.05] font-bold tracking-tight text-white">
              {scenario.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {scenario.description}
            </p>
            <Button fullWidth size="lg" className="mt-6" onClick={start}>
              Touch down
            </Button>
            <p className="mt-3 text-center text-xs text-white/40">
              Sound on. Some choices are timed.
            </p>
          </div>
        </div>
      ) : null}

      {phase === 'ended' && node.kind === 'ending' ? (
        <EndingCard
          scenario={scenario}
          ending={node}
          onRetry={engine.retryFromLastDecision}
          onRestart={engine.restart}
        />
      ) : null}

      {env.showStoryDevTools ? (
        <StoryDevPanel
          engine={engine}
          open={devOpen}
          onToggle={() => setDevOpen((prev) => !prev)}
        />
      ) : null}
    </div>
  );
}
