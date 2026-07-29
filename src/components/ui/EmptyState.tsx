import { cn } from '@/lib/cn';

type Props = {
  emoji: string;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ emoji, title, body, action, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-dashed border-white/12 bg-void-900/60 px-6 py-10 text-center',
        className,
      )}
    >
      <div className="animate-bob text-4xl" aria-hidden>
        {emoji}
      </div>
      <h2 className="font-display mt-4 text-base font-bold text-white">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/50">
        {body}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
