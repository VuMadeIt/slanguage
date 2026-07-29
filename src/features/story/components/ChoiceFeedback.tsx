'use client';

import { useEffect } from 'react';

import { getSlangTerm } from '@/data/slang/terms';
import type { Choice, ChoiceOutcome } from '@/domain/scenario';
import { cn } from '@/lib/cn';

const OUTCOME_STYLE: Record<ChoiceOutcome, { ring: string; label: string }> = {
  optimal: { ring: 'border-plasma-500/60 bg-plasma-500/12', label: 'Landed' },
  acceptable: { ring: 'border-white/25 bg-white/8', label: 'Recovered' },
  risky: { ring: 'border-solar-400/50 bg-solar-400/12', label: 'Risky' },
  wrong: { ring: 'border-nebula-500/60 bg-nebula-500/12', label: 'Misread' },
};

type Props = {
  choice: Choice;
  viaTimeout: boolean;
  onDismiss: () => void;
};

/**
 * The lesson arrives *over* the consequence footage rather than on a results
 * screen, so the explanation is attached to the reaction that proves it.
 */
export function ChoiceFeedback({ choice, viaTimeout, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6500);
    return () => clearTimeout(timer);
  }, [choice.id, onDismiss]);

  if (!choice.feedback) return null;

  const style = OUTCOME_STYLE[choice.outcome];
  const savedTerms = choice.slangTermIds
    .map(getSlangTerm)
    .filter((term) => term !== undefined);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-16">
      <div
        className={cn(
          'rise-in pointer-events-auto mx-auto w-full max-w-md rounded-2xl border px-4 py-3 backdrop-blur-md',
          style.ring,
        )}
        role="status"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.16em] text-white/90 uppercase">
            {viaTimeout ? 'You froze' : style.label}
          </span>
          {typeof choice.auraDelta === 'number' ? (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                choice.auraDelta >= 0
                  ? 'bg-plasma-500/20 text-plasma-300'
                  : 'bg-nebula-500/20 text-nebula-400',
              )}
            >
              {choice.auraDelta >= 0 ? '+' : ''}
              {choice.auraDelta} aura
            </span>
          ) : null}
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto text-xs font-semibold text-white/50 hover:text-white"
          >
            Dismiss
          </button>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-white">
          {choice.feedback}
        </p>
        {savedTerms.length > 0 ? (
          <p className="mt-2 text-[11px] font-semibold text-white/50">
            Saved to Logbook:{' '}
            {savedTerms.map((term) => term.term).join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  );
}
