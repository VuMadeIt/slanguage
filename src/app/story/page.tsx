'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { PlanetOrb } from '@/components/space/PlanetOrb';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PLANETS } from '@/data/planets';
import { getScenariosForPlanet } from '@/data/scenarios';
import { FRESHNESS_LABEL } from '@/domain/slang';
import { getSlangTerm } from '@/data/slang/terms';
import { gatePlanet } from '@/domain/entitlements';
import { listEndings } from '@/domain/graph';
import { useEntitlementsStore } from '@/stores/useEntitlementsStore';
import { useHydrated } from '@/stores/StoreHydrationProvider';
import { useProgressStore } from '@/stores/useProgressStore';

function PlanetsContent() {
  const search = useSearchParams();
  const focusId = search.get('planet');
  const hydrated = useHydrated();
  const tier = useEntitlementsStore((state) => state.tier);
  const progressByScenario = useProgressStore((state) => state.byScenario);

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Flight deck"
        title="Planets"
        subtitle="Touch a world to see its missions. Each one teaches a dialect through branching video."
      />

      <div className="mt-8 flex flex-col gap-8">
        {PLANETS.map((planet) => {
          const scenarios = getScenariosForPlanet(planet.id);
          const gate = gatePlanet(hydrated ? tier : 'free', planet);
          const locked = !gate.allowed || planet.status === 'coming-soon';
          const focused = focusId === planet.id;

          return (
            <section
              key={planet.id}
              id={planet.id}
              className={
                focused
                  ? 'rounded-[1.75rem] border border-plasma-500/30 bg-plasma-500/5 p-4'
                  : undefined
              }
            >
              <div className="flex items-start gap-3">
                <PlanetOrb
                  surface={planet.surface}
                  emoji={planet.emoji}
                  size={64}
                  ring={planet.ring}
                  locked={locked}
                  className="animate-bob"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-white">
                      {planet.name}
                    </h2>
                    {planet.status === 'coming-soon' ? (
                      <Badge tone="muted">Coming soon</Badge>
                    ) : null}
                    {!gate.allowed ? (
                      <Badge tone="solar">Needs {gate.requiredTier}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs font-bold tracking-wide text-plasma-400 uppercase">
                    {planet.dialect}
                  </p>
                  <p className="mt-1.5 text-sm text-white/55">{planet.blurb}</p>
                  <p className="mt-1 text-[11px] text-white/35">
                    {planet.distanceLabel}
                  </p>
                </div>
              </div>

              {scenarios.length > 0 ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {scenarios.map((scenario) => {
                    const progress = progressByScenario[scenario.id];
                    const endings = listEndings(scenario);
                    const found = progress?.unlockedEndingIds.length ?? 0;
                    const trendingCount = scenario.slangTermIds.filter(
                      (id) => getSlangTerm(id)?.freshness === 'trending',
                    ).length;

                    return (
                      <li key={scenario.id}>
                        <Card>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl" aria-hidden>
                              {scenario.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <CardTitle>{scenario.title}</CardTitle>
                              <CardBody className="mt-1">
                                {scenario.tagline}
                              </CardBody>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge tone="muted">{scenario.difficulty}</Badge>
                                <Badge tone="muted">
                                  {scenario.estimatedMinutes} min
                                </Badge>
                                {trendingCount > 0 ? (
                                  <Badge tone="nova">
                                    {trendingCount}{' '}
                                    {FRESHNESS_LABEL.trending.toLowerCase()}
                                  </Badge>
                                ) : null}
                                {hydrated && found > 0 ? (
                                  <Badge tone="plasma">
                                    {found}/{endings.length} endings
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <ButtonLink
                            href={locked ? '/profile' : `/story/${scenario.id}`}
                            variant={locked ? 'secondary' : 'primary'}
                            fullWidth
                            className="mt-4"
                          >
                            {locked ? 'Unlock clearance' : 'Touch down'}
                          </ButtonLink>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-white/40">
                  {planet.status === 'coming-soon'
                    ? 'Missions still in hyperspace.'
                    : 'No missions charted yet.'}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-white/35">
        Looking for the galaxy map?{' '}
        <Link href="/" className="text-plasma-400 underline-offset-2 hover:underline">
          Back to Mission Control
        </Link>
      </p>
    </AppShell>
  );
}

export default function PlanetsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <ScreenHeader eyebrow="Flight deck" title="Planets" />
          <p className="mt-8 text-sm text-white/40">Charting courses…</p>
        </AppShell>
      }
    >
      <PlanetsContent />
    </Suspense>
  );
}
