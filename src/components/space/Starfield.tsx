import { cn } from '@/lib/cn';

/**
 * Fixed background starfield.
 *
 * Star positions come from a seeded generator evaluated at module load, not
 * `Math.random()` per render — a random layout would differ between the server
 * and client renders and trip hydration.
 */
function seededStars(count: number, seed: number) {
  let state = seed;
  const next = () => {
    // Mulberry32: tiny, deterministic, good enough for scattering dots.
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: next() * 100,
    top: next() * 100,
    size: 1 + Math.round(next() * 2),
    delay: next() * 4,
    duration: 2.5 + next() * 3.5,
    bright: next() > 0.82,
  }));
}

const STARS = seededStars(90, 20260729);

export function Starfield({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {/* Distant nebula wash so the void is not a flat black rectangle. */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-nova-600/20 blur-[100px]" />
      <div className="absolute top-1/3 -right-28 h-80 w-80 rounded-full bg-plasma-600/15 blur-[100px]" />
      <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-nebula-600/12 blur-[100px]" />

      {STARS.map((star) => (
        <span
          key={star.id}
          data-star
          className={cn(
            'absolute rounded-full',
            star.bright ? 'bg-plasma-300' : 'bg-white',
          )}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
