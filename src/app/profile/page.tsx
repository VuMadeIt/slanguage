'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SCENARIOS } from '@/data/scenarios';
import { listEndings } from '@/domain/graph';
import {
  gateFluencyScoring,
  TIERS,
  type TierId,
} from '@/domain/entitlements';
import { clearAllPersistedData } from '@/services/storage/persist';
import { useEntitlementsStore } from '@/stores/useEntitlementsStore';
import { useHydrated } from '@/stores/StoreHydrationProvider';
import { useJournalStore } from '@/stores/useJournalStore';
import { useProgressStore } from '@/stores/useProgressStore';

export default function ProfilePage() {
  const hydrated = useHydrated();
  const tier = useEntitlementsStore((state) => state.tier);
  const setTier = useEntitlementsStore((state) => state.setTier);
  const resetEntitlements = useEntitlementsStore((state) => state.resetAll);
  const resetProgress = useProgressStore((state) => state.resetAll);
  const resetJournal = useJournalStore((state) => state.resetAll);
  const progressByScenario = useProgressStore((state) => state.byScenario);
  const journalCount = useJournalStore(
    (state) => Object.keys(state.entries).length,
  );

  const fluencyGate = gateFluencyScoring(tier);

  const resetLocal = () => {
    if (!confirm('Clear all local progress, journal entries, and tier?')) return;
    resetEntitlements();
    resetProgress();
    resetJournal();
    clearAllPersistedData();
    window.location.reload();
  };

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Cadet file"
        title="Your clearance"
        subtitle="Progress, tier, and local data. Billing hooks in here later."
      />

      {!hydrated ? (
        <p className="mt-8 text-sm text-white/40">Loading…</p>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-white/80">Clearance tier</h2>
            <Card className="mt-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>{TIERS[tier].name}</CardTitle>
                  <CardBody className="mt-1">{TIERS[tier].tagline}</CardBody>
                </div>
                <Badge tone="plasma">{TIERS[tier].priceLabel}</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-white/60">
                {TIERS[tier].perks.map((perk) => (
                  <li key={perk}>· {perk}</li>
                ))}
              </ul>
            </Card>

            <p className="mt-4 text-xs text-white/40">
              Demo only — pick a tier to see gates in action. Payment wiring lands
              here without touching feature code.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(TIERS) as TierId[]).map((id) => (
                <Button
                  key={id}
                  variant={tier === id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTier(id)}
                >
                  {TIERS[id].name}
                </Button>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-semibold text-white/80">Progress</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Stat label="Journal terms" value={String(journalCount)} />
              <Stat
                label="Scenarios played"
                value={String(
                  Object.values(progressByScenario).filter((p) => p.attempts > 0)
                    .length,
                )}
              />
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {SCENARIOS.map((scenario) => {
                const progress = progressByScenario[scenario.id];
                const endings = listEndings(scenario);
                const found = progress?.unlockedEndingIds.length ?? 0;
                return (
                  <li key={scenario.id}>
                    <Card>
                      <CardTitle>{scenario.title}</CardTitle>
                      <CardBody className="mt-1">
                        {progress?.attempts
                          ? `${progress.attempts} run(s) · ${progress.retries} retry(ies) · ${found}/${endings.length} endings`
                          : 'Not started'}
                      </CardBody>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-semibold text-white/80">
              Feature gates preview
            </h2>
            <Card className="mt-3">
              <CardTitle>Fluency scoring</CardTitle>
              <CardBody className="mt-1">
                {fluencyGate.allowed
                  ? 'Unlocked on your current tier.'
                  : fluencyGate.reason}
              </CardBody>
              {!fluencyGate.allowed ? (
                <Badge className="mt-2" tone="solar">
                  Requires {fluencyGate.requiredTier}
                </Badge>
              ) : (
                <Badge className="mt-2" tone="plasma">
                  Active
                </Badge>
              )}
            </Card>
          </section>

          <section className="mt-10">
            <Button variant="danger" fullWidth onClick={resetLocal}>
              Reset local data
            </Button>
          </section>
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/45">{label}</p>
    </Card>
  );
}
