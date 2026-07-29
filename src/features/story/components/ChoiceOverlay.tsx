'use client';

import { useEffect, useRef, useState } from 'react';

import { getSlangTerm } from '@/data/slang/terms';
import type { SceneNode } from '@/domain/scenario';
import { cn } from '@/lib/cn';

type Props = {
  node: SceneNode;
  visible: boolean;
  onSelect: (choiceId: string, options?: { viaTimeout?: boolean }) => void;
};

const TICK_MS = 100;

/**
 * The decision surface. Choices are written as lines of dialogue rather than
 * lettered answers — the user is picking what to *say*, not answering a quiz,
 * and that framing is the whole difference from a flashcard app.
 *
 * Outcome quality is deliberately not signalled: colour-coding the right answer
 * would defeat the exercise.
 */
export function ChoiceOverlay({ node, visible, onSelect }: Props) {
  const hasTimer = Boolean(node.decisionSeconds && node.timeoutChoiceId);
  const totalMs = (node.decisionSeconds ?? 0) * 1000;
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [committed, setCommitted] = useState<string | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!visible || !hasTimer || committed) return;
    const interval = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - TICK_MS));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [committed, hasTimer, visible]);

  useEffect(() => {
    if (!visible || !hasTimer || remainingMs > 0 || firedRef.current) return;
    firedRef.current = true;
    // Saying nothing is a choice, and the story treats it as one.
    onSelect(node.timeoutChoiceId!, { viaTimeout: true });
  }, [hasTimer, node.timeoutChoiceId, onSelect, remainingMs, visible]);

  if (!visible) return null;

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const urgent = hasTimer && secondsLeft <= 5;

  const handleSelect = (choiceId: string) => {
    if (committed) return;
    setCommitted(choiceId);
    onSelect(choiceId);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6">
      <div className="rise-in mx-auto w-full max-w-md">
        <div className="mb-3 flex items-end justify-between gap-3">
          <p className="text-sm font-semibold text-white drop-shadow-lg">
            {node.prompt}
          </p>
          {hasTimer ? (
            <span
              className={cn(
                'shrink-0 font-mono text-lg font-bold tabular-nums drop-shadow-lg',
                urgent ? 'text-nebula-500' : 'text-white/80',
              )}
              aria-live="off"
            >
              {secondsLeft}
            </span>
          ) : null}
        </div>

        {hasTimer ? (
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-100 ease-linear',
                urgent ? 'bg-nebula-500' : 'bg-plasma-500',
              )}
              style={{ width: `${(remainingMs / totalMs) * 100}%` }}
            />
          </div>
        ) : null}

        <ul className="flex flex-col gap-2.5">
          {node.choices.map((choice) => {
            const terms = choice.slangTermIds
              .map(getSlangTerm)
              .filter((term) => term !== undefined);
            const isCommitted = committed === choice.id;
            return (
              <li key={choice.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(choice.id)}
                  disabled={committed !== null}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                    'backdrop-blur-md active:scale-[0.985]',
                    isCommitted
                      ? 'border-plasma-500 bg-plasma-500/20'
                      : 'border-white/15 bg-black/55 hover:border-white/35 hover:bg-black/70',
                    committed && !isCommitted && 'opacity-35',
                  )}
                >
                  <span className="block text-[15px] leading-snug font-medium text-white">
                    {choice.label}
                  </span>
                  {choice.tone ? (
                    <span className="mt-1 block text-xs text-white/45 italic">
                      {choice.tone}
                    </span>
                  ) : null}
                  {terms.length > 0 ? (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {terms.map((term) => (
                        <span
                          key={term.id}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/70 uppercase"
                        >
                          {term.term}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
