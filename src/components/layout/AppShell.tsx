import { Starfield } from '@/components/space/Starfield';

import { BottomNav } from './BottomNav';

/**
 * Phone-width column, centred on desktop, floating over a shared starfield.
 * Slanguage is a phone app that happens to run in a browser, so the layout
 * never widens past comfortable thumb reach.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <Starfield />
      <main className="mx-auto w-full max-w-md px-5 pt-8 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
