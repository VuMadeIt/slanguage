import {
  getVoicePersona,
  VOICE_PERSONAS,
  type VoicePersona,
} from '@/data/voice-personas';

/**
 * Server-side ElevenLabs voice cast.
 *
 * Scenarios reference voices by these keys, never by raw ElevenLabs ids, so
 * recasting a character is a one-line change here instead of an edit to every
 * line of dialogue. Ids are account-specific: paste your own from the
 * ElevenLabs voice library, or set the matching env var.
 *
 * `settings` maps onto the ElevenLabs voice_settings payload. Teen dialogue
 * needs low stability and high style, otherwise the delivery comes out like a
 * corporate audiobook — which is the single most common failure mode when
 * generating high-school audio.
 */
export type VoiceProfile = VoicePersona & {
  elevenLabsVoiceId: string;
  settings: {
    stability: number;
    similarityBoost: number;
    style: number;
    speakerBoost: boolean;
    speed: number;
  };
};

function persona(key: string): VoicePersona {
  const value = getVoicePersona(key);
  if (!value) throw new Error(`Missing voice persona "${key}".`);
  return value;
}

/** The player character. Speaks in beats, never in choice labels. */
const ari: VoiceProfile = {
  ...persona('ari'),
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ARI ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.52,
    similarityBoost: 0.78,
    style: 0.38,
    speakerBoost: true,
    speed: 0.96,
  },
};

const dez: VoiceProfile = {
  ...persona('dez'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_DEZ ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.26,
    similarityBoost: 0.74,
    style: 0.72,
    speakerBoost: true,
    speed: 1.1,
  },
};

const priya: VoiceProfile = {
  ...persona('priya'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_PRIYA ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.67,
    similarityBoost: 0.8,
    style: 0.22,
    speakerBoost: true,
    speed: 0.92,
  },
};

const tyler: VoiceProfile = {
  ...persona('tyler'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_TYLER ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.2,
    similarityBoost: 0.68,
    style: 0.82,
    speakerBoost: true,
    speed: 1.18,
  },
};

/**
 * The adult in the room. Slang-free by design, and never once aware of what is
 * happening in it — high stability is what makes the obliviousness land.
 */
const teacher: VoiceProfile = {
  ...persona('teacher'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_TEACHER ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.78,
    similarityBoost: 0.82,
    style: 0.12,
    speakerBoost: true,
    speed: 0.88,
  },
};

const control: VoiceProfile = {
  ...persona('control'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_CONTROL ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.72,
    similarityBoost: 0.58,
    style: 0.34,
    speakerBoost: false,
    speed: 0.9,
  },
};

/**
 * This is intentionally an original performance voice. Point the env variable
 * at a licensed library/designed voice, never a clone of Kanye West.
 */
const kanye: VoiceProfile = {
  ...persona('kanye'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_KANYE ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.3,
    similarityBoost: 0.7,
    style: 0.86,
    speakerBoost: true,
    speed: 0.98,
  },
};

const manager: VoiceProfile = {
  ...persona('manager'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_MANAGER ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.76,
    similarityBoost: 0.78,
    style: 0.2,
    speakerBoost: true,
    speed: 0.9,
  },
};

const security: VoiceProfile = {
  ...persona('security'),
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_SECURITY ?? 'REPLACE_WITH_VOICE_ID',
  settings: {
    stability: 0.84,
    similarityBoost: 0.76,
    style: 0.1,
    speakerBoost: true,
    speed: 0.8,
  },
};

export const VOICES: Record<string, VoiceProfile> = {
  ari,
  dez,
  priya,
  tyler,
  teacher,
  control,
  kanye,
  manager,
  security,
};

export const VOICE_KEYS = Object.keys(VOICE_PERSONAS);

export function getVoice(key: string): VoiceProfile | undefined {
  return VOICES[key];
}
