import { cn } from '@/lib/cn';

type Props = {
  /** Two-stop gradient describing the planet surface, from the planet record. */
  surface: string;
  emoji: string;
  size?: number;
  /** Draws an orbital ring, used to make paid planets look like the prize. */
  ring?: boolean;
  locked?: boolean;
  className?: string;
};

/**
 * A planet. Pure CSS so it costs nothing to render dozens on the star map:
 * gradient sphere, drifting atmosphere blob, inset shadow for the terminator,
 * and an optional tilted ring.
 */
export function PlanetOrb({
  surface,
  emoji,
  size = 72,
  ring = false,
  locked = false,
  className,
}: Props) {
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {ring ? (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-white/25"
          style={{
            width: size * 1.55,
            height: size * 0.5,
            transform: 'translate(-50%, -50%) rotate(-18deg)',
          }}
        />
      ) : null}

      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-full',
          'shadow-[inset_-8px_-8px_18px_rgba(0,0,0,0.55)]',
          locked && 'grayscale-[0.7] opacity-60',
        )}
        style={{ backgroundImage: surface }}
      >
        <div className="animate-atmosphere absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.4),transparent_55%)]" />
        <div className="absolute inset-0 flex items-center justify-center text-[1.4rem] drop-shadow">
          {emoji}
        </div>
      </div>
    </div>
  );
}
