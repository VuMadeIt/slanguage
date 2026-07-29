import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-void-850/80 p-4 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-display text-base font-bold tracking-tight text-white',
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm leading-relaxed text-white/60', className)}
      {...props}
    />
  );
}
