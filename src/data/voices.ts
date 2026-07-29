/**
 * Voice cast for ElevenLabs text-to-speech.
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
export type VoiceProfile = {
  key: string;
  /** Character this voice belongs to, for the generation manifest. */
  character: string;
  description: string;
  elevenLabsVoiceId: string;
  settings: {
    stability: number;
    similarityBoost: number;
    style: number;
    speakerBoost: boolean;
  };
};

/** Loud, warm, talks fast — the kid who adopts you on day one. */
const dez: VoiceProfile = {
  key: 'dez',
  character: 'Dez',
  description: 'Teen boy, high energy, friendly, rushes his words',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_DEZ ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.28, similarityBoost: 0.75, style: 0.65, speakerBoost: true },
};

/** Deadpan, unimpressed, runs the group chat. */
const priya: VoiceProfile = {
  key: 'priya',
  character: 'Priya',
  description: 'Teen girl, dry deadpan delivery, minimal affect',
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_PRIYA ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.55, similarityBoost: 0.8, style: 0.3, speakerBoost: true },
};

/** Tries too hard with slang; the cautionary character. */
const tyler: VoiceProfile = {
  key: 'tyler',
  character: 'Tyler',
  description: 'Teen boy, slightly nasal, over-eager, forces slang',
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_TYLER ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.35, similarityBoost: 0.7, style: 0.7, speakerBoost: true },
};

/**
 * The adult in the room. Slang-free by design, and never once aware of what is
 * happening in it — high stability is what makes the obliviousness land.
 */
const teacher: VoiceProfile = {
  key: 'teacher',
  character: 'Mr. Okafor',
  description: 'Adult man, flat and tired, addresses the chalkboard, entirely oblivious',
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_TEACHER ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.7, similarityBoost: 0.8, style: 0.15, speakerBoost: true },
};

/** Mission-control narrator that frames the space metaphor. */
const control: VoiceProfile = {
  key: 'control',
  character: 'Mission Control',
  description: 'Androgynous synthetic narrator, dry humour, radio-filtered',
  elevenLabsVoiceId:
    process.env.ELEVENLABS_VOICE_CONTROL ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.6, similarityBoost: 0.6, style: 0.4, speakerBoost: false },
};

/** Rico, the artist on Clout Prime. */
const rico: VoiceProfile = {
  key: 'rico',
  character: 'Rico',
  description: 'Young adult man, relaxed confidence, low volume',
  elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_RICO ?? 'REPLACE_WITH_VOICE_ID',
  settings: { stability: 0.45, similarityBoost: 0.8, style: 0.45, speakerBoost: true },
};

export const VOICES: Record<string, VoiceProfile> = {
  dez,
  priya,
  tyler,
  teacher,
  control,
  rico,
};

export function getVoice(key: string): VoiceProfile | undefined {
  return VOICES[key];
}
