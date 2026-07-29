/**
 * Analytics seam. A typed event union keeps call sites honest and gives us the
 * exact list to hand a real provider (PostHog / Amplitude) later. v1 logs to the
 * console and buffers in memory so the metrics we care about — session length,
 * retries, completion — are already being emitted.
 */

export type AnalyticsEvent =
  | { name: 'scenario_started'; scenarioId: string; attempt: number }
  | { name: 'node_entered'; scenarioId: string; nodeId: string; kind: string }
  | {
      name: 'choice_made';
      scenarioId: string;
      nodeId: string;
      choiceId: string;
      outcome: string;
      viaTimeout: boolean;
      msToDecide: number;
    }
  | {
      name: 'scenario_ended';
      scenarioId: string;
      endingId: string;
      outcome: string;
      decisions: number;
      retries: number;
      durationMs: number;
    }
  | { name: 'scenario_retried'; scenarioId: string; fromNodeId: string }
  | { name: 'slang_encountered'; termId: string; scenarioId?: string }
  | { name: 'gate_blocked'; feature: string; requiredTier: string }
  | { name: 'playground_message_sent'; provider: string; characterId: string };

type BufferedEvent = AnalyticsEvent & { at: string };

const buffer: BufferedEvent[] = [];
const MAX_BUFFER = 200;

export function track(event: AnalyticsEvent): void {
  const entry: BufferedEvent = { ...event, at: new Date().toISOString() };
  buffer.push(entry);
  if (buffer.length > MAX_BUFFER) buffer.shift();

  if (process.env.NODE_ENV !== 'production') {
    const { name, at, ...props } = entry;
    void at;
    console.debug(`[analytics] ${name}`, props);
  }
}

export function getBufferedEvents(): readonly BufferedEvent[] {
  return buffer;
}
