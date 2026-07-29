import type { Planet } from '@/domain/scenario';

/**
 * The galaxy. Each planet is a slang dialect world and the unit of
 * monetization — gating happens here, never on individual scenarios.
 *
 * `surface` gradients are authored per planet so the star map, travel cards and
 * player chrome can all tint from one source of truth.
 */
export const PLANETS: Planet[] = [
  {
    id: 'scholaris',
    name: 'Scholaris',
    dialect: 'Hallway Standard',
    blurb:
      'A crowded school world where every corridor speaks in shorthand. Start here.',
    emoji: '🎒',
    surface:
      'radial-gradient(circle at 32% 28%, #7ff5f7 0%, #2de2e6 26%, #1b6fa8 62%, #0b2140 100%)',
    size: 96,
    ring: false,
    distanceLabel: 'Home system',
    requiredTier: 'free',
    status: 'available',
  },
  {
    id: 'clout',
    name: 'Clout Prime',
    dialect: 'Camera-Facing',
    blurb:
      'A gas giant of celebrity encounters, where tone matters more than words.',
    emoji: '🎤',
    surface:
      'radial-gradient(circle at 30% 26%, #ff7ad9 0%, #ff4ecd 28%, #7c5cff 66%, #240f45 100%)',
    size: 84,
    ring: true,
    distanceLabel: '0.4 light-years',
    requiredTier: 'free',
    status: 'available',
  },
  {
    id: 'cubicle',
    name: 'Cubicle IX',
    dialect: 'Workplace Casual',
    blurb:
      'A ringed office moon. Slack tone, standup jokes, and the manager who says "circle back".',
    emoji: '💼',
    surface:
      'radial-gradient(circle at 30% 26%, #bda6ff 0%, #7c5cff 30%, #3b3a8f 68%, #14112b 100%)',
    size: 76,
    ring: true,
    distanceLabel: '1.2 light-years',
    requiredTier: 'plus',
    status: 'coming-soon',
  },
  {
    id: 'situationship',
    name: 'Situationship',
    dialect: 'Dry-Text Dialect',
    blurb: 'A binary star that never quite defines its own orbit.',
    emoji: '💌',
    surface:
      'radial-gradient(circle at 32% 24%, #ffc663 0%, #ff4ecd 34%, #6344e0 72%, #1c0f33 100%)',
    size: 70,
    ring: false,
    distanceLabel: '2.6 light-years',
    requiredTier: 'plus',
    status: 'coming-soon',
  },
  {
    id: 'irie',
    name: 'Irie',
    dialect: 'Patois Basics',
    blurb:
      'An ocean world of Jamaican Patois — respect, rhythm, and the line between visiting and cosplaying.',
    emoji: '🌴',
    surface:
      'radial-gradient(circle at 30% 28%, #7ff5f7 0%, #2de2e6 24%, #1e9e5a 60%, #07301f 100%)',
    size: 80,
    ring: false,
    distanceLabel: '4.1 light-years',
    requiredTier: 'pro',
    status: 'coming-soon',
  },
];

export const PLANETS_BY_ID: Record<string, Planet> = Object.fromEntries(
  PLANETS.map((planet) => [planet.id, planet]),
);

export function getPlanet(id: string): Planet | undefined {
  return PLANETS_BY_ID[id];
}
