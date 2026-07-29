import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';

import { StoreHydrationProvider } from '@/stores/StoreHydrationProvider';

import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
/** Display face for planet names and headings — geometric, slightly retro-futurist. */
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Slanguage — a galaxy of slang',
  description:
    'Travel planet to planet learning how slang actually works: branching video stories with tone, timing, and consequences.',
  applicationName: 'Slanguage',
  appleWebApp: {
    capable: true,
    title: 'Slanguage',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#04030d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Story Mode is a tap-driven full-screen video surface; pinch-zoom only gets
  // in the way of the choice buttons.
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-dvh bg-void-950 text-white antialiased">
        <StoreHydrationProvider>{children}</StoreHydrationProvider>
      </body>
    </html>
  );
}
