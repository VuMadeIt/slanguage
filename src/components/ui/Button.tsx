import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-plasma-500 text-void-950 hover:bg-plasma-400 active:bg-plasma-600 shadow-[0_0_24px_-6px_var(--color-plasma-500)]',
  secondary:
    'bg-void-700 text-white border border-white/12 hover:bg-void-600 active:bg-void-800',
  ghost: 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white',
  danger: 'bg-nebula-500 text-white hover:bg-nebula-400 active:bg-nebula-600',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

type StyleOptions = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export function buttonClass({
  variant = 'primary',
  size = 'md',
  fullWidth,
}: StyleOptions = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plasma-500',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
    'active:scale-[0.98]',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClass({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonClass({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
