/**
 * Entitlements layer. Deliberately pure and payment-agnostic: a billing
 * provider (RevenueCat / Stripe) only has to set `tier` on the entitlements
 * store, and every gate in the app keeps working unchanged.
 */

export const TIER_IDS = ['free', 'plus', 'pro'] as const;
export type TierId = (typeof TIER_IDS)[number];

/** Higher rank satisfies any lower requirement. */
const TIER_RANK: Record<TierId, number> = { free: 0, plus: 1, pro: 2 };

export type TierDefinition = {
  id: TierId;
  name: string;
  priceLabel: string;
  tagline: string;
  perks: string[];
  /** null = unlimited. */
  playgroundMessagesPerDay: number | null;
  /** Caps free users to a taste of the library even inside unlocked packs. */
  maxScenarios: number | null;
  fluencyScoring: boolean;
  voicePractice: boolean;
};

export const TIERS: Record<TierId, TierDefinition> = {
  free: {
    id: 'free',
    name: 'Cadet',
    priceLabel: '$0',
    tagline: 'Explore the home system.',
    perks: [
      'Scholaris and Clout Prime unlocked',
      '10 Comms messages a day',
      'Logbook with unlimited saves',
    ],
    playgroundMessagesPerDay: 10,
    maxScenarios: 2,
    fluencyScoring: false,
    voicePractice: false,
  },
  plus: {
    id: 'plus',
    name: 'Pilot',
    priceLabel: '$6.99/mo',
    tagline: 'Every planet, every ending.',
    perks: [
      'All planets + new worlds weekly',
      'Unlimited Comms',
      'Replay any branch to hunt endings',
    ],
    playgroundMessagesPerDay: null,
    maxScenarios: null,
    fluencyScoring: false,
    voicePractice: false,
  },
  pro: {
    id: 'pro',
    name: 'Captain',
    priceLabel: '$14.99/mo',
    tagline: 'Sound like you grew up in orbit.',
    perks: [
      'Everything in Pilot',
      'Voice practice + pronunciation scoring',
      'Fluency report card and tone feedback',
    ],
    playgroundMessagesPerDay: null,
    maxScenarios: null,
    fluencyScoring: true,
    voicePractice: true,
  },
};

export function tierSatisfies(current: TierId, required: TierId): boolean {
  return TIER_RANK[current] >= TIER_RANK[required];
}

export type GateResult =
  | { allowed: true }
  | { allowed: false; reason: string; requiredTier: TierId };

export function gatePlanet(
  current: TierId,
  planet: { requiredTier: TierId; name: string },
): GateResult {
  if (tierSatisfies(current, planet.requiredTier)) return { allowed: true };
  return {
    allowed: false,
    reason: `${planet.name} needs ${TIERS[planet.requiredTier].name} clearance.`,
    requiredTier: planet.requiredTier,
  };
}

export function gatePlaygroundMessage(
  current: TierId,
  messagesUsedToday: number,
): GateResult {
  const limit = TIERS[current].playgroundMessagesPerDay;
  if (limit === null || messagesUsedToday < limit) return { allowed: true };
  return {
    allowed: false,
    reason: `You've used all ${limit} Playground messages today.`,
    requiredTier: 'plus',
  };
}

export function gateFluencyScoring(current: TierId): GateResult {
  if (TIERS[current].fluencyScoring) return { allowed: true };
  return {
    allowed: false,
    reason: 'Fluency scoring and tone feedback are a Pro feature.',
    requiredTier: 'pro',
  };
}
