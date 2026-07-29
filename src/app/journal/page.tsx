'use client';

import { useMemo, useState } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { getSlangTerm } from '@/data/slang/terms';
import { FRESHNESS_LABEL } from '@/domain/slang';
import { cn } from '@/lib/cn';
import { useHydrated } from '@/stores/StoreHydrationProvider';
import { useJournalStore } from '@/stores/useJournalStore';

export default function JournalPage() {
  const hydrated = useHydrated();
  const entries = useJournalStore((state) => state.entries);
  const setNote = useJournalStore((state) => state.setNote);
  const toggleFavorite = useJournalStore((state) => state.toggleFavorite);
  const toggleMastered = useJournalStore((state) => state.toggleMastered);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      Object.values(entries).sort(
        (a, b) =>
          new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
      ),
    [entries],
  );

  const selected = selectedId ? entries[selectedId] : null;
  const term = selected ? getSlangTerm(selected.termId) : null;

  if (!hydrated) {
    return (
      <AppShell>
        <ScreenHeader eyebrow="Logbook" title="Your words" />
        <p className="mt-8 text-sm text-white/40">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader
        eyebrow="Logbook"
        title="Your words"
        subtitle="Every term you encounter on a planet or in Comms lands here automatically."
        action={
          sorted.length > 0 ? (
            <Badge tone="plasma">{sorted.length} saved</Badge>
          ) : null
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          className="mt-8"
          emoji="📓"
          title="Logbook empty"
          body="Touch down on a planet or hail Riley in Comms. Terms you encounter will show up here with context and usage notes."
        />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {sorted.map((entry) => {
              const t = getSlangTerm(entry.termId);
              if (!t) return null;
              const active = selectedId === entry.termId;
              return (
                <li key={entry.termId}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(active ? null : entry.termId)
                    }
                    className={cn(
                      'w-full rounded-2xl border px-4 py-3 text-left transition-colors',
                      active
                        ? 'border-plasma-500/40 bg-plasma-500/8'
                        : 'border-white/8 bg-void-850 hover:border-white/15',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">{t.term}</span>
                      <div className="flex gap-1">
                        {entry.favorite ? (
                          <Badge tone="nebula">★</Badge>
                        ) : null}
                        {entry.mastered ? (
                          <Badge tone="plasma">got it</Badge>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-white/50">
                      {t.definition}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected && term ? (
            <Card className="rise-in">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{term.term}</CardTitle>
                <Badge tone="muted">{term.pronunciation}</Badge>
                <Badge
                  tone={
                    term.freshness === 'trending'
                      ? 'nova'
                      : term.freshness === 'fading'
                        ? 'solar'
                        : 'muted'
                  }
                >
                  {FRESHNESS_LABEL[term.freshness]}
                </Badge>
              </div>
              <CardBody className="mt-2">{term.definition}</CardBody>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-white/40 uppercase">
                    Example
                  </dt>
                  <dd className="mt-1 text-white/85 italic">
                    &ldquo;{term.exampleUsage}&rdquo;
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-white/40 uppercase">
                    Cultural context
                  </dt>
                  <dd className="mt-1 text-white/70">{term.culturalContext}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-plasma-400 uppercase">
                    When to use
                  </dt>
                  <dd className="mt-1 text-white/70">{term.whenToUse}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-wide text-nebula-500 uppercase">
                    When not to
                  </dt>
                  <dd className="mt-1 text-white/70">{term.whenNotToUse}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {term.registers.map((register) => (
                  <Badge key={register} tone="muted">
                    {register}
                  </Badge>
                ))}
              </div>

              <label className="mt-4 block">
                <span className="text-[11px] font-bold tracking-wide text-white/40 uppercase">
                  Your note
                </span>
                <textarea
                  value={selected.userNote}
                  onChange={(event) =>
                    setNote(selected.termId, event.target.value)
                  }
                  rows={2}
                  placeholder="Where you'd actually say this…"
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-void-900 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-plasma-500/40 focus:outline-none"
                />
              </label>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(selected.termId)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/5"
                >
                  {selected.favorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleMastered(selected.termId)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/5"
                >
                  {selected.mastered ? 'Unmark mastered' : 'Mark mastered'}
                </button>
              </div>

              <p className="mt-3 text-[11px] text-white/35">
                Met {selected.timesEncountered}× · first seen{' '}
                {new Date(selected.firstSeenAt).toLocaleDateString()}
                {selected.scenarioIds.length > 0
                  ? ` · in ${selected.scenarioIds.join(', ')}`
                  : ''}
              </p>
            </Card>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
