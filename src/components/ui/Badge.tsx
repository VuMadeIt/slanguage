import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'plasma' | 'nova' | 'nebula' | 'solar' | 'muted';

const TONES: Record<Tone, string> = {
  neutral: 'bg-white/10 text-white/80',
  plasma: 'bg-plasma-500/15 text-plasma-300 ring-1 ring-plasma-500/30',
  nova: 'bg-nova-500/18 text-nova-300 ring-1 ring-nova-500/30',
  nebula: 'bg-nebula-500/15 text-nebula-400 ring-1 ring-nebula-500/30',
  solar: 'bg-solar-500/15 text-solar-400 ring-1 ring-solar-500/30',
  muted: 'bg-white/5 text-white/45',
};

type Props = HTMLAttributes<HTMLSpanElement> & { tone?: Tone };

export function Badge({ tone = 'neutral', className, ...props }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
