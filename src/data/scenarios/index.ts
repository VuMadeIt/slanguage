import { SLANG_TERMS } from '@/data/slang/terms';
import { validateScenario } from '@/domain/graph';
import type { Scenario } from '@/domain/scenario';

import { firstDayOfClass } from './first-day-of-class';
import { meetingACelebrity } from './meeting-a-celebrity';

/**
 * The scenario registry. Adding a scenario means adding one import here; the
 * planet screens, entitlement gates and progress tracking all pick it up.
 */
export const SCENARIOS: Scenario[] = [firstDayOfClass, meetingACelebrity];

export const SCENARIOS_BY_ID: Record<string, Scenario> = Object.fromEntries(
  SCENARIOS.map((scenario) => [scenario.id, scenario]),
);

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS_BY_ID[id];
}

export function getScenariosForPlanet(planetId: string): Scenario[] {
  return SCENARIOS.filter((scenario) => scenario.planetId === planetId);
}

const KNOWN_SLANG_IDS = new Set(SLANG_TERMS.map((term) => term.id));

export function auditScenarios() {
  return SCENARIOS.map((scenario) => ({
    scenarioId: scenario.id,
    issues: validateScenario(scenario, KNOWN_SLANG_IDS),
  }));
}

// Authoring safety net: a dangling nextNodeId should surface on import, not as a
// black screen at branch point four.
if (process.env.NODE_ENV !== 'production') {
  for (const { scenarioId, issues } of auditScenarios()) {
    for (const issue of issues) {
      const line = `[scenario:${scenarioId}] ${issue.message}`;
      if (issue.level === 'error') console.error(line);
      else console.warn(line);
    }
  }
}
