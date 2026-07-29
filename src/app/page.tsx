'use client';

import Link from 'next/link';

import { AppShell } from '@/components/layout/AppShell';
import { PlanetOrb } from '@/components/space/PlanetOrb';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PLANETS } from '@/data/planets';
import { getScenariosForPlanet, SCENARIOS } from '@/data/scenarios';
import { gatePlanet } from '@/domain/entitlements';
import { useEntitlementsStore } from '@/stores/useEntitlementsStore';
import { useHydrated } from '@/stores/StoreHydrationProvider';

/**
 * The galaxy map. Planets are the product metaphor: each one is a slang dialect
 * world you travel to. Available planets glow; locked ones sit greyed until
 * the Cadet upgrades clearance.
 */
export default function GalaxyPage() {
  const hydrated = useHydrated();
  const tier = useEntitlementsStore((state) => state.tier);
  const featured = SCENARIOS[0];
  const featuredPlanet = PLANETS.find((p) => p.id === featured?.planetId);

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Mission Control"
        title="Pick a planet"
        subtitle="Every world speaks a different dialect. Touch down, learn the room, leave with the words that actually work."
      />

      <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-void-900/50 p-5">
        <div className="pointer-events-none absolute -top-10 -right-8 h-40 w-40 rounded-full bg-nova-600/20 blur-3xl" />
        <p className="text-[11px] font-bold tracking-[0.2em] text-plasma-400 uppercase">
          Local system
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-center gap-5 py-4">
          {PLANETS.map((planet, index) => {
            const locked =
              (hydrated && !gatePlanet(tier, planet).allowed) ||
              planet.status === 'coming-soon';
            return (
              <Link
                key={planet.id}
                href={locked ? '/profile' : `/story?planet=${planet.id}`}
                className="group flex flex-col items-center gap-2"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <PlanetOrb
                  surface={planet.surface}
                  emoji={planet.emoji}
                  size={planet.size * 0.85}
                  ring={planet.ring}
                  locked={locked}
                  className="animate-bob transition-transform group-hover:scale-105"
                />
                <span className="font-display text-xs font-bold text-white/80">
                  {planet.name}
                </span>
                {locked ? (
                  <Badge tone="solar">Locked</Badge>
                ) : planet.status === 'available' ? (
                  <Badge tone="plasma">Live</Badge>
                ) : (
                  <Badge tone="muted">Soon</Badge>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {featured && featuredPlanet ? (
        <section className="mt-8">
          <Card className="overflow-hidden border-plasma-500/25 bg-gradient-to-br from-void-850 to-void-900 p-0">
            <div className="flex gap-4 p-5">
              <PlanetOrb
                surface={featuredPlanet.surface}
                emoji={featuredPlanet.emoji}
                size={72}
                ring={featuredPlanet.ring}
                className="animate-bob"
              />
              <div className="min-w-0 flex-1">
                <Badge tone="plasma">Next landing</Badge>
                <CardTitle className="mt-2 text-xl">{featured.title}</CardTitle>
                <CardBody className="mt-1.5">{featured.tagline}</CardBody>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="muted">{featuredPlanet.name}</Badge>
                  <Badge tone="muted">{featured.difficulty}</Badge>
                  <Badge tone="muted">{featured.estimatedMinutes} min</Badge>
                </div>
              </div>
            </div>
            <div className="border-t border-white/8 px-5 py-4">
              <ButtonLink href={`/story/${featured.id}`} fullWidth>
                Touch down
              </ButtonLink>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-sm font-bold text-white/80">
          How travel works
        </h2>
        <div className="mt-3 grid gap-3">
          {[
            {
              emoji: '🪐',
              title: 'Land on a planet',
              body: 'Each world is a dialect — hallway slang, workplace tone, dating chat. You learn by being in the room.',
            },
            {
              emoji: '💬',
              title: 'Say something',
              body: 'Choices are dialogue lines, not quiz answers. Tone and timing matter as much as the word.',
            },
            {
              emoji: '📓',
              title: 'Log what you learn',
              body: 'Every term you encounter auto-saves to your Logbook with context, pronunciation, and when not to use it.',
            },
          ].map((item) => (
            <Card key={item.title}>
              <p className="text-xl" aria-hidden>
                {item.emoji}
              </p>
              <CardTitle className="mt-2">{item.title}</CardTitle>
              <CardBody className="mt-1">{item.body}</CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-sm font-bold text-white/80">
          Planet dossier
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {PLANETS.map((planet) => {
            const scenarios = getScenariosForPlanet(planet.id);
            const gate = gatePlanet(hydrated ? tier : 'free', planet);
            return (
              <li key={planet.id}>
                <Link href={gate.allowed ? `/story?planet=${planet.id}` : '/profile'}>
                  <Card className="flex items-center gap-3 transition-colors hover:border-white/20">
                    <PlanetOrb
                      surface={planet.surface}
                      emoji={planet.emoji}
                      size={48}
                      ring={planet.ring}
                      locked={!gate.allowed || planet.status === 'coming-soon'}
                    />
                    <div className="min-w-0 flex-1">
                      <CardTitle>{planet.name}</CardTitle>
                      <CardBody className="mt-0.5">
                        {planet.dialect} · {planet.blurb}
                      </CardBody>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        tone={
                          planet.status === 'available' ? 'plasma' : 'muted'
                        }
                      >
                        {planet.status === 'available'
                          ? `${scenarios.length || '—'} mission${scenarios.length === 1 ? '' : 's'}`
                          : 'Soon'}
                      </Badge>
                      {!gate.allowed ? (
                        <Badge tone="solar">{gate.requiredTier}</Badge>
                      ) : null}
                    </div>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
