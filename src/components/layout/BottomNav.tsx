'use client';

import { BookMarked, Orbit, Radio, Rocket, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';

const TABS = [
  { href: '/', label: 'Galaxy', icon: Orbit },
  { href: '/story', label: 'Planets', icon: Rocket },
  { href: '/playground', label: 'Comms', icon: Radio },
  { href: '/journal', label: 'Logbook', icon: BookMarked },
  { href: '/profile', label: 'Cadet', icon: UserCircle2 },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-void-900/90 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pt-1.5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-bold tracking-wide transition-colors',
                  active
                    ? 'text-plasma-400'
                    : 'text-white/40 hover:text-white/70',
                )}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute -top-[7px] h-1 w-8 rounded-full bg-plasma-400 shadow-[0_0_12px_var(--color-plasma-400)]"
                  />
                ) : null}
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
