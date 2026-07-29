/**
 * Authoring lint for scenarios: the things a Zod schema cannot catch.
 *
 * The schema proves a node is *shaped* right. This proves it is *playable* —
 * that no dialogue is scheduled after the clock stops, that choices appear
 * before the clip ends, and that the story actually runs as long as it claims.
 *
 *   npm run scenarios:check
 */
import { SCENARIOS } from '../src/data/scenarios';
import { SLANG_TERMS } from '../src/data/slang/terms';
import {
  getClipEndSec,
  getClipStartSec,
  getMaxDecisionDepth,
  validateScenario,
} from '../src/domain/graph';
import type { Scenario, StoryNode, VoiceLine } from '../src/domain/scenario';

/** Rough speaking rate for English TTS, used to estimate when a line finishes. */
const CHARS_PER_SEC = 15;
/** Assumed clip length when a node plays to the natural end of its file. */
const UNTRIMMED_SEC = 8;

const estimateLineSec = (line: VoiceLine) => line.text.length / CHARS_PER_SEC;

const clipDuration = (node: StoryNode) => {
  const end = getClipEndSec(node.clip);
  return end === null ? UNTRIMMED_SEC : end - getClipStartSec(node.clip);
};

/** When the art/video clock stops for this node. */
const clockStopsAt = (node: StoryNode) => {
  const duration = clipDuration(node);
  if (node.kind !== 'scene') return duration;
  return Math.min(node.choiceCueAtSec ?? duration, duration);
};

type Problem = { level: 'error' | 'warning'; message: string };

function checkTiming(scenario: Scenario): Problem[] {
  const problems: Problem[] = [];

  for (const node of Object.values(scenario.nodes)) {
    const label = `${scenario.id}/${node.id}`;
    const duration = clipDuration(node);
    const stop = clockStopsAt(node);

    if (duration <= 0) {
      problems.push({ level: 'error', message: `${label}: trim has no length.` });
    }

    if (node.kind === 'scene') {
      const cue = node.choiceCueAtSec;
      if (cue !== undefined && cue > duration) {
        problems.push({
          level: 'error',
          message: `${label}: choiceCueAtSec ${cue}s is past the ${duration}s clip, so choices never appear.`,
        });
      }
      if (node.timeoutChoiceId) {
        const exists = node.choices.some((c) => c.id === node.timeoutChoiceId);
        if (!exists) {
          problems.push({
            level: 'error',
            message: `${label}: timeoutChoiceId "${node.timeoutChoiceId}" is not one of its choices.`,
          });
        }
      }
      if (node.decisionSeconds && !node.timeoutChoiceId) {
        problems.push({
          level: 'warning',
          message: `${label}: has a decision timer but no timeoutChoiceId.`,
        });
      }
    }

    const lines = node.clip.audio?.lines ?? [];
    if (lines.length === 0) {
      problems.push({ level: 'warning', message: `${label}: no dialogue.` });
    }

    let previousEnd = 0;
    lines.forEach((line, index) => {
      const at = line.atSec ?? 0;
      const ends = at + estimateLineSec(line);

      if (at >= stop) {
        problems.push({
          level: 'error',
          message: `${label} line ${index} (${line.speaker}) starts at ${at}s but the clock stops at ${stop}s — it will never be heard.`,
        });
      } else if (ends > stop + 1.5) {
        problems.push({
          level: 'warning',
          message: `${label} line ${index} (${line.speaker}) runs to ~${ends.toFixed(1)}s past a ${stop}s stop; it will be cut off.`,
        });
      }

      if (at < previousEnd - 0.4) {
        problems.push({
          level: 'warning',
          message: `${label} line ${index} (${line.speaker}) starts at ${at}s while line ${index - 1} runs to ~${previousEnd.toFixed(1)}s — they will talk over each other.`,
        });
      }
      previousEnd = ends;
    });
  }

  return problems;
}

/** Longest and shortest run of clip time from entry to any ending. */
function pathRuntimes(scenario: Scenario) {
  const seen = new Set<string>();

  const walk = (nodeId: string): { min: number; max: number } => {
    const node = scenario.nodes[nodeId];
    if (!node || seen.has(nodeId)) return { min: 0, max: 0 };

    seen.add(nodeId);
    const self = clipDuration(node);

    const nextIds =
      node.kind === 'scene'
        ? node.choices.map((c) => c.nextNodeId)
        : node.kind === 'beat'
          ? [node.autoAdvanceToId]
          : [];

    if (nextIds.length === 0) {
      seen.delete(nodeId);
      return { min: self, max: self };
    }

    const children = nextIds.map(walk);
    seen.delete(nodeId);
    return {
      min: self + Math.min(...children.map((c) => c.min)),
      max: self + Math.max(...children.map((c) => c.max)),
    };
  };

  return walk(scenario.entryNodeId);
}

const knownSlangIds = new Set(SLANG_TERMS.map((term) => term.id));
let errors = 0;

for (const scenario of SCENARIOS) {
  const problems = [
    ...validateScenario(scenario, knownSlangIds),
    ...checkTiming(scenario),
  ];

  const nodeCount = Object.keys(scenario.nodes).length;
  const scenes = Object.values(scenario.nodes).filter((n) => n.kind === 'scene');
  const endings = Object.values(scenario.nodes).filter(
    (n) => n.kind === 'ending',
  );
  const lineCount = Object.values(scenario.nodes).reduce(
    (total, node) => total + (node.clip.audio?.lines.length ?? 0),
    0,
  );
  const { min, max } = pathRuntimes(scenario);

  const fmt = (s: number) => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;

  console.log(`\n${scenario.title}  (${scenario.id})`);
  console.log(
    `  ${nodeCount} nodes · ${scenes.length} decisions · ${endings.length} endings · ${lineCount} voice lines · depth ${getMaxDecisionDepth(scenario)}`,
  );
  console.log(
    `  clip time per playthrough: ${fmt(min)} shortest → ${fmt(max)} longest (excludes decision and feedback time)`,
  );

  const errs = problems.filter((p) => p.level === 'error');
  const warns = problems.filter((p) => p.level === 'warning');
  errors += errs.length;

  for (const p of errs) console.log(`  ERROR   ${p.message}`);
  for (const p of warns) console.log(`  warning ${p.message}`);
  if (problems.length === 0) console.log('  clean');
}

console.log('');
process.exit(errors > 0 ? 1 : 0);
