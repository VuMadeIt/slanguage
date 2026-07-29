'use client';

import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { listEndings } from '@/domain/graph';
import type { EndingNode, EndingOutcome, Scenario } from '@/domain/scenario';
import { cn } from '@/lib/cn';
import { selectProgress, useProgressStore } from '@/stores/useProgressStore';

const OUTCOME_COPY: Record<
  EndingOutcome,
  { eyebrow: string; tone: 'plasma' | 'solar' | 'nebula' }
> = {
  success: { eyebrow: 'You read the room', tone: 'plasma' },
  partial: { eyebrow: 'Close', tone: 'solar' },
  failure: { eyebrow: 'That went badly', tone: 'nebula' },
};

type Props = {
  scenario: Scenario;
  ending: EndingNode;
  onRetry: () => void;
  onRestart: () => void;
};

export function EndingCard({ scenario, ending, onRetry, onRestart }: Props) {
  const progress = useProgressStore((state) => selectProgress(state, scenario.id));
  const allEndings = listEndings(scenario);
  const found = allEndings.filter((node) =>
    progress.unlockedEndingIds.includes(node.id),
  ).length;

  const copy = OUTCOME_COPY[ending.outcome];

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-gradient-to-t from-void-950 via-void-950/92 to-void-950/40 px-5 pb-8">
      <div className="rise-in mx-auto w-full max-w-md">
        <Badge tone={copy.tone}>{copy.eyebrow}</Badge>
        <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white">
          {ending.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {ending.summary}
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-bold tracking-[0.16em] text-plasma-400 uppercase">
            Why it played out that way
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            {ending.lesson}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {allEndings.map((node) => (
              <span
                key={node.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  progress.unlockedEndingIds.includes(node.id)
                    ? 'bg-plasma-500'
                    : 'bg-white/15',
                )}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-white/55">
            {found}/{allEndings.length} endings
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {ending.outcome !== 'success' ? (
            <Button fullWidth onClick={onRetry}>
              Rewind to that moment
            </Button>
          ) : null}
          <Button
            fullWidth
            variant={ending.outcome === 'success' ? 'primary' : 'secondary'}
            onClick={onRestart}
          >
            {found < allEndings.length
              ? 'Play again for another ending'
              : 'Play again'}
          </Button>
          <ButtonLink href="/story" variant="ghost" fullWidth>
            Back to planets
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
