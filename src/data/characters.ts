/**
 * Visual definitions for the cutout art renderer.
 *
 * Flat colours only, no gradients: the whole point of the construction-paper
 * look is that every shape reads as a piece of cut paper. Keys match the
 * `voice` keys in `data/voices.ts` so a character's look and their ElevenLabs
 * voice stay in step.
 */
export type HairStyle =
  'braids' | 'bob' | 'curly' | 'buzz' | 'bald' | 'cap' | 'messy' | 'hood';

export type Accessory = 'none' | 'glasses' | 'sunglasses' | 'backpack' | 'tie';

export type CharacterVisual = {
  key: string;
  name: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  bottom: string;
  accessory: Accessory;
  /** Slightly different heights keep a line-up from looking like clones. */
  heightScale: number;
};

export const CHARACTERS: Record<string, CharacterVisual> = {
  ari: {
    key: 'ari',
    name: 'Ari',
    skin: '#C68642',
    hair: '#2B1B12',
    hairStyle: 'curly',
    top: '#3D5A8A',
    bottom: '#2C3E57',
    accessory: 'backpack',
    heightScale: 0.97,
  },
  dez: {
    key: 'dez',
    name: 'Dez',
    skin: '#7A4A25',
    hair: '#160F0A',
    hairStyle: 'braids',
    top: '#D93A3A',
    bottom: '#3A3A45',
    accessory: 'none',
    heightScale: 1.04,
  },
  priya: {
    key: 'priya',
    name: 'Priya',
    skin: '#B47A46',
    hair: '#14100F',
    hairStyle: 'bob',
    top: '#C9A87C',
    bottom: '#4A4552',
    accessory: 'none',
    heightScale: 0.95,
  },
  tyler: {
    key: 'tyler',
    name: 'Tyler',
    skin: '#EFC49A',
    hair: '#9A6B3F',
    hairStyle: 'messy',
    top: '#5FA84E',
    bottom: '#5A6270',
    accessory: 'none',
    heightScale: 0.93,
  },
  teacher: {
    key: 'teacher',
    name: 'Mr. Okafor',
    skin: '#5C3A21',
    hair: '#1A1A1A',
    hairStyle: 'bald',
    top: '#E3DED0',
    bottom: '#37414F',
    accessory: 'tie',
    heightScale: 1.12,
  },
  kanye: {
    key: 'kanye',
    name: 'Kanye',
    skin: '#8A5730',
    hair: '#120E0C',
    hairStyle: 'cap',
    top: '#2E2E38',
    bottom: '#1D1D25',
    accessory: 'sunglasses',
    heightScale: 1.05,
  },
  security: {
    key: 'security',
    name: 'Security',
    skin: '#D9A579',
    hair: '#241C16',
    hairStyle: 'buzz',
    top: '#17171D',
    bottom: '#17171D',
    accessory: 'sunglasses',
    heightScale: 1.18,
  },
  manager: {
    key: 'manager',
    name: 'Manager',
    skin: '#E8C09A',
    hair: '#4A3527',
    hairStyle: 'bob',
    top: '#2B2B3A',
    bottom: '#1F1F2B',
    accessory: 'glasses',
    heightScale: 1.02,
  },
  control: {
    key: 'control',
    name: 'Mission Control',
    skin: '#9FE8EA',
    hair: '#2DE2E6',
    hairStyle: 'hood',
    top: '#1B2A45',
    bottom: '#141F35',
    accessory: 'none',
    heightScale: 1.0,
  },
};

export function getCharacter(key: string): CharacterVisual | undefined {
  return CHARACTERS[key];
}

/** Maps a node's `speaker` string onto a cast key for the art fallback. */
export function characterKeyFromSpeaker(
  speaker: string | undefined,
): string | null {
  if (!speaker) return null;
  const normalized = speaker.trim().toLowerCase();
  if (CHARACTERS[normalized]) return normalized;
  const match = Object.values(CHARACTERS).find(
    (character) =>
      character.name.toLowerCase() === normalized ||
      normalized.includes(character.key),
  );
  return match?.key ?? null;
}
