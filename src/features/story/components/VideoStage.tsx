'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/cn';
import { warmClips } from '@/services/video/preload';

export type StageSource = {
  /** Changes on every node entry, including re-entry after a retry. */
  key: string;
  url: string;
  startSec: number;
  /** null = play to the natural end of the file. */
  endSec: number | null;
  posterUrl?: string;
};

export type VideoStageHandle = {
  /**
   * Must be called from inside a real user gesture. Mobile browsers grant
   * playback permission per element, so both buffers get unlocked at once —
   * otherwise the first branch transition would silently fail to play.
   */
  unlock: () => void;
  toggleMute: () => void;
};

type Props = {
  source: StageSource;
  /** Every clip reachable from the current node. First is parked in the idle buffer. */
  upcomingUrls: readonly string[];
  /** Freeze the current frame, e.g. while a decision is on screen. */
  frozen: boolean;
  /** Source-file time at which to pause and hand over to the decision overlay. */
  cueSec: number | null;
  /** Fires once per source when playback reaches the decision cue. */
  onCue?: () => void;
  onEnded: () => void;
  className?: string;
};

/**
 * Trim windows are authored against an expected cut. If the delivered asset is
 * shorter — a re-render came back trimmed, a generation job used a different
 * duration — an un-clamped in/out point would seek past the end and stall the
 * story. Clamping keeps playback moving; `validateScenario` is what tells the
 * author their numbers were wrong.
 */
function clampToDuration(value: number, el: HTMLVideoElement): number {
  const duration = el.duration;
  if (!Number.isFinite(duration) || duration <= 0) return value;
  return Math.min(value, Math.max(0, duration - 0.05));
}

/** Resolves once the element is parked on the requested frame. */
function seekTo(el: HTMLVideoElement, rawTarget: number): Promise<void> {
  const target = clampToDuration(rawTarget, el);
  if (Math.abs(el.currentTime - target) < 0.25) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      el.removeEventListener('seeked', finish);
      clearTimeout(timer);
      resolve();
    };
    // Some sources never emit `seeked` on a cold buffer; don't hang the swap.
    const timer = setTimeout(finish, 1500);
    el.addEventListener('seeked', finish);
    try {
      el.currentTime = target;
    } catch {
      finish();
    }
  });
}

/**
 * Double-buffered branching video surface.
 *
 * Two <video> elements alternate roles. While one plays, the other is loaded and
 * pre-seeked to the in-point of the most likely next clip, so committing to a
 * branch is an opacity swap rather than a network round trip. Remaining branch
 * candidates are warmed at the HTTP level by the preload cache.
 *
 * The outgoing element is never cleared, which is why the last frame of the
 * previous clip stays on screen instead of flashing black while the next one
 * loads.
 */
export const VideoStage = forwardRef<VideoStageHandle, Props>(
  function VideoStage(
    { source, upcomingUrls, frozen, cueSec, onCue, onEnded, className },
    ref,
  ) {
    const bufferA = useRef<HTMLVideoElement | null>(null);
    const bufferB = useRef<HTMLVideoElement | null>(null);
    const buffers = useRef<[typeof bufferA, typeof bufferB]>([bufferA, bufferB]);

    const bufferUrls = useRef<[string | null, string | null]>([null, null]);
    const activeRef = useRef<0 | 1>(0);
    const [activeIndex, setActiveIndex] = useState<0 | 1>(0);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(false);
    const [audioBlocked, setAudioBlocked] = useState(false);

    const cueFiredFor = useRef<string | null>(null);
    // Latest callbacks, so the rAF monitor never needs re-subscribing.
    const onCueRef = useRef(onCue);
    const onEndedRef = useRef(onEnded);
    onCueRef.current = onCue;
    onEndedRef.current = onEnded;
    const sourceRef = useRef(source);
    sourceRef.current = source;
    const frozenRef = useRef(frozen);
    frozenRef.current = frozen;
    const cueSecRef = useRef(cueSec);
    cueSecRef.current = cueSec;

    const getEl = (index: 0 | 1) => buffers.current[index].current;

    useImperativeHandle(ref, () => ({
      unlock: () => {
        ([0, 1] as const).forEach((index) => {
          const el = getEl(index);
          if (!el?.src) return;
          el.muted = muted;
          void el
            .play()
            .then(() => {
              if (index !== activeRef.current) el.pause();
            })
            .catch(() => {
              // Permission still withheld; the muted fallback below covers it.
            });
        });
      },
      toggleMute: () => {
        setMuted((prev) => {
          const next = !prev;
          ([0, 1] as const).forEach((index) => {
            const el = getEl(index);
            if (el) el.muted = next;
          });
          if (!next) setAudioBlocked(false);
          return next;
        });
      },
    }));

    // Load, seek and swap in the current source.
    useEffect(() => {
      const active = activeRef.current;
      const target: 0 | 1 =
        bufferUrls.current[active] === source.url
          ? active
          : ((1 - active) as 0 | 1);
      const el = getEl(target);
      if (!el) return;

      let cancelled = false;
      cueFiredFor.current = null;
      setLoading(true);

      if (bufferUrls.current[target] !== source.url) {
        bufferUrls.current[target] = source.url;
        el.src = source.url;
        el.load();
      }

      const run = async () => {
        if (cancelled) return;
        await seekTo(el, source.startSec);
        if (cancelled) return;

        el.muted = muted;
        try {
          await el.play();
        } catch {
          // Unmuted autoplay refused: fall back to muted so the story never stalls.
          el.muted = true;
          setMuted(true);
          setAudioBlocked(true);
          try {
            await el.play();
          } catch {
            /* nothing else to try; the frame is still parked correctly */
          }
        }
        if (cancelled) return;

        activeRef.current = target;
        setActiveIndex(target);
        setLoading(false);

        const other = getEl((1 - target) as 0 | 1);
        if (other && other !== el) other.pause();
      };

      if (el.readyState >= 2) {
        void run();
        return () => {
          cancelled = true;
        };
      }

      const onLoaded = () => void run();
      el.addEventListener('loadeddata', onLoaded, { once: true });
      return () => {
        cancelled = true;
        el.removeEventListener('loadeddata', onLoaded);
      };
      // `muted` is intentionally excluded: changing mute must not restart a clip.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source.key, source.url, source.startSec]);

    // Warm every branch candidate, and park the first in the idle buffer.
    // Skipped while `loading`, because until the swap completes the "idle"
    // buffer is the one currently being loaded.
    useEffect(() => {
      if (loading || upcomingUrls.length === 0) return;
      warmClips(upcomingUrls);

      const idle = (1 - activeIndex) as 0 | 1;
      const el = getEl(idle);
      const next = upcomingUrls[0];
      if (!el || next === source.url || bufferUrls.current[idle] === next) return;

      bufferUrls.current[idle] = next;
      el.src = next;
      el.load();
    }, [activeIndex, loading, source.url, upcomingUrls]);

    /**
     * Playback monitor. `timeupdate` only fires about four times a second, which
     * would overshoot a trim out-point by up to 250ms; a rAF loop keeps cue
     * points and trim boundaries frame-accurate.
     */
    useEffect(() => {
      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        const el = getEl(activeRef.current);
        const current = sourceRef.current;
        if (!el || el.paused || frozenRef.current) return;
        if (bufferUrls.current[activeRef.current] !== current.url) return;

        const { endSec, key } = current;
        const rawCue = cueSecRef.current;
        const cue = rawCue === null ? null : clampToDuration(rawCue, el);
        const end = endSec === null ? null : clampToDuration(endSec, el);

        // Cue is checked first: when a cue sits on the out-point, the decision
        // takes precedence over ending the clip.
        if (cue !== null && cueFiredFor.current !== key && el.currentTime >= cue) {
          cueFiredFor.current = key;
          el.pause();
          onCueRef.current?.();
          return;
        }
        if (end !== null && el.currentTime >= end) {
          el.pause();
          onEndedRef.current();
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
      const el = getEl(activeIndex);
      if (!el) return;
      if (frozen) el.pause();
      else if (!loading && el.paused && cueFiredFor.current !== source.key) {
        void el.play().catch(() => undefined);
      }
    }, [activeIndex, frozen, loading, source.key]);

    /**
     * Safety net. If the file ran out before the rAF monitor saw the cue or the
     * out-point, hand control back anyway — reaching the end of a clip must
     * never leave the story with no way forward.
     */
    const handleNativeEnded = useCallback((index: 0 | 1) => {
      if (index !== activeRef.current) return;
      const { key } = sourceRef.current;
      if (cueSecRef.current !== null && cueFiredFor.current !== key) {
        cueFiredFor.current = key;
        onCueRef.current?.();
        return;
      }
      onEndedRef.current();
    }, []);

    return (
      <div className={cn('relative overflow-hidden bg-black', className)}>
        {([0, 1] as const).map((index) => (
          <video
            key={index}
            ref={buffers.current[index]}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
            playsInline
            preload="auto"
            poster={index === activeIndex ? source.posterUrl : undefined}
            onEnded={() => handleNativeEnded(index)}
          />
        ))}

        {loading ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden">
            <div className="h-full w-1/3 animate-[stage-loading_1.1s_ease-in-out_infinite] bg-plasma-500" />
          </div>
        ) : null}

        {audioBlocked && muted ? (
          <button
            type="button"
            onClick={() => {
              const el = getEl(activeRef.current);
              setMuted(false);
              setAudioBlocked(false);
              ([0, 1] as const).forEach((i) => {
                const buffer = getEl(i);
                if (buffer) buffer.muted = false;
              });
              void el?.play().catch(() => undefined);
            }}
            className="absolute right-3 top-3 z-20 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
          >
            Tap for sound
          </button>
        ) : null}
      </div>
    );
  },
);
