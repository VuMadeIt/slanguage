'use client';

import { useEffect, useState } from 'react';

import { auditScenarios } from '@/data/scenarios';
import { cn } from '@/lib/cn';
import { getWarmSnapshot } from '@/services/video/preload';

import type { StoryEngine } from '../hooks/useStoryEngine';

type Props = {
  engine: StoryEngine;
  open: boolean;
  onToggle: () => void;
};

/**
 * Authoring aid, not product surface. Shows where you are in the graph, whether
 * the preloader actually warmed the next branches, and any validation issues in
 * the scenario — the three things that are otherwise invisible while testing a
 * branching video tree. Gated behind NEXT_PUBLIC_SHOW_STORY_DEVTOOLS.
 */
export function StoryDevPanel({ engine, open, onToggle }: Props) {
  const [warm, setWarm] = useState<{ url: string; ready: boolean }[]>([]);

  useEffect(() => {
    if (!open) return;
    const update = () => setWarm(getWarmSnapshot());
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [open]);

  const issues =
    auditScenarios().find((audit) => audit.scenarioId === engine.scenario.id)
      ?.issues ?? [];

  if (!open) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="absolute bottom-3 right-3 z-50 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-plasma-400 backdrop-blur"
      >
        DEV
      </button>
    );
  }

  return (
    <div className="absolute inset-x-2 bottom-2 z-50 max-h-[52dvh] overflow-y-auto rounded-2xl border border-plasma-500/25 bg-black/90 p-3 font-mono text-[11px] text-white/75 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold text-plasma-400">STORY DEBUG</span>
        <button type="button" onClick={onToggle} className="text-white/50">
          close
        </button>
      </div>

      <p>
        node <span className="text-white">{engine.node.id}</span> ({engine.node.kind})
        {' · '}phase <span className="text-white">{engine.phase}</span>
        {' · '}retries <span className="text-white">{engine.retries}</span>
      </p>

      <p className="mt-2 text-white/45">trail</p>
      <p className="text-white/80">
        {engine.history.length === 0
          ? '—'
          : engine.history
              .map((step) =>
                step.choiceId
                  ? `${step.nodeId}→${step.choiceId}${step.viaTimeout ? '(timeout)' : ''}`
                  : `${step.nodeId}→auto`,
              )
              .join('  ›  ')}
      </p>

      <p className="mt-2 text-white/45">preload cache</p>
      <ul>
        {warm.length === 0 ? <li>—</li> : null}
        {warm.map((entry) => (
          <li key={entry.url} className="truncate">
            <span className={entry.ready ? 'text-plasma-400' : 'text-solar-400'}>
              {entry.ready ? 'warm' : 'load'}
            </span>{' '}
            {entry.url.split('/').pop()}
          </li>
        ))}
      </ul>

      <p className="mt-2 text-white/45">jump to node</p>
      <div className="flex flex-wrap gap-1">
        {Object.keys(engine.scenario.nodes).map((nodeId) => (
          <button
            key={nodeId}
            type="button"
            onClick={() => engine.jumpTo(nodeId)}
            className={cn(
              'rounded border border-white/15 px-1.5 py-0.5 hover:border-plasma-500',
              nodeId === engine.node.id && 'border-plasma-500 text-plasma-400',
            )}
          >
            {nodeId}
          </button>
        ))}
      </div>

      <p className="mt-2 text-white/45">
        validation ({issues.length === 0 ? 'clean' : `${issues.length} issue(s)`})
      </p>
      <ul>
        {issues.map((issue, index) => (
          <li
            key={index}
            className={issue.level === 'error' ? 'text-nebula-500' : 'text-solar-400'}
          >
            {issue.level}: {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
