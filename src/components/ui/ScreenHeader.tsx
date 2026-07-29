import { cn } from '@/lib/cn';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: Props) {
  return (
    <header className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-bold tracking-[0.22em] text-plasma-400 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display mt-1.5 text-[1.75rem] leading-tight font-bold tracking-tight text-white">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1">{action}</div> : null}
    </header>
  );
}
