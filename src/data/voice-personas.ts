/**
 * Character direction shared by ElevenLabs and the browser fallback.
 *
 * Voice IDs stay server-only in `voices.ts`; this file is safe to import from
 * the client. The fallback is intentionally more than "pick any system voice":
 * rate, pitch and preferred installed voices preserve the broad character
 * contrast when ElevenLabs is unavailable.
 *
 * Casting is driven by who the character *is* — age, region, energy, status in
 * the room — never by their appearance. Two characters who look similar should
 * still be instantly distinguishable with your eyes shut, and the `rate`/`pitch`
 * values below are deliberately spread so that holds even on the fallback path.
 */
export type VoicePersona = {
  key: string;
  character: string;
  description: string;
  /** Prompt used by the optional ElevenLabs Text-to-Voice setup script. */
  designPrompt: string;
  /** Eleven v3 direction inserted before lines without an explicit tag. */
  defaultPerformance: string;
  browser: {
    voiceHints: string[];
    rate: number;
    pitch: number;
    volume: number;
  };
};

export const VOICE_PERSONAS: Record<string, VoicePersona> = {
  ari: {
    key: 'ari',
    character: 'Ari',
    description:
      'The newcomer. Careful, precise, quieter than everyone around them — fluent in English but reading the room in real time.',
    designPrompt:
      'A teenage voice, sixteen, portraying a recent immigrant on their first day at a new school. Fully fluent, careful and precise diction, softer volume than the people around them, thoughtful pauses before speaking, faint non-regional accent. Watchful and self-possessed rather than timid. Warms up noticeably when spoken to kindly.',
    defaultPerformance: '[thoughtful] [softly]',
    browser: {
      voiceHints: ['Aria', 'Alex', 'Google US English', 'Female'],
      rate: 0.95,
      pitch: 1.02,
      volume: 0.9,
    },
  },
  dez: {
    key: 'dez',
    character: 'Dez',
    description:
      'Warm high-school extrovert; fast, bright, welcoming, and always half-laughing.',
    designPrompt:
      'A young adult male voice portraying a high-school extrovert. Warm American accent, bright medium pitch, energetic and quick, naturally smiling through words, playful spontaneous chuckles, friendly rather than announcer-like. Clear casual speech suited to funny social dialogue.',
    defaultPerformance: '[excited and friendly] [chuckles]',
    browser: {
      voiceHints: ['Guy', 'Davis', 'Andrew', 'Male'],
      rate: 1.16,
      pitch: 1.12,
      volume: 1,
    },
  },
  priya: {
    key: 'priya',
    character: 'Priya',
    description:
      'Dry group-chat admin; low affect, exact timing, funny because she never pushes the joke.',
    designPrompt:
      'A young adult female voice portraying a dry, highly observant student. Neutral American accent, low-key delivery, medium-low pitch, precise diction, minimal affect, perfect comic pauses, quietly kind beneath the deadpan. Never bubbly or theatrical.',
    defaultPerformance: '[deadpan] [quietly]',
    browser: {
      voiceHints: ['Samantha', 'Ava', 'Jenny', 'Female'],
      rate: 0.88,
      pitch: 0.9,
      volume: 0.92,
    },
  },
  tyler: {
    key: 'tyler',
    character: 'Tyler',
    description:
      'Over-eager sophomore; nasal, breathless, delighted by disasters he claims to regret.',
    designPrompt:
      'A young adult male voice portraying an over-eager awkward student. Slightly nasal, higher pitch, fast and breathless, nervous enthusiasm, words occasionally tumble together, delighted by gossip and social disasters. Comedic but believable.',
    defaultPerformance: '[nervous and excited] [speaks quickly]',
    browser: {
      voiceHints: ['Eddy', 'Junior', 'Ryan', 'Male'],
      rate: 1.26,
      pitch: 1.28,
      volume: 0.96,
    },
  },
  teacher: {
    key: 'teacher',
    character: 'Mr. Okafor',
    description:
      'Exhausted adult authority; calm, slow and oblivious to the social catastrophe behind him.',
    designPrompt:
      'A middle-aged male teacher voice. Deep, calm, warm authority with an exhausted edge, measured pace, understated delivery, sounds like he is reading attendance while chaos happens behind him. Dry accidental comedy, never cartoonish.',
    defaultPerformance: '[tired] [matter-of-fact]',
    browser: {
      voiceHints: ['Daniel', 'George', 'David', 'Male'],
      rate: 0.82,
      pitch: 0.76,
      volume: 0.9,
    },
  },
  control: {
    key: 'control',
    character: 'Mission Control',
    description:
      'Androgynous synthetic announcer; clinical, dry and faintly delighted by failure.',
    designPrompt:
      'An androgynous mission-control voice with a subtle synthetic quality. Medium-low pitch, clean precise diction, calm radio-announcer cadence, clinically deadpan, faint hidden amusement when reporting failure. Futuristic but still human and intelligible.',
    defaultPerformance: '[robotic] [deadpan]',
    browser: {
      voiceHints: ['Zira', 'Samantha', 'Google UK English Female'],
      rate: 0.9,
      pitch: 0.66,
      volume: 0.88,
    },
  },
  kanye: {
    key: 'kanye',
    character: 'Kanye',
    description:
      'Original theatrical rapper voice: grand, animated, unpredictable and laughter-heavy. It must not imitate or clone Kanye West’s real voice.',
    designPrompt:
      'An original adult male theatrical rapper voice that does not resemble or imitate any real public figure. Rich medium-low register, American accent, grand animated confidence, unpredictable pacing, sudden warm belly laughs, moves from quiet reflection to stadium-sized excitement. Charismatic, playful, eccentric and highly expressive.',
    defaultPerformance: '[confident and theatrical] [laughs warmly]',
    browser: {
      voiceHints: ['Guy', 'Davis', 'Aaron', 'Male'],
      rate: 1.0,
      pitch: 0.94,
      volume: 1,
    },
  },
  manager: {
    key: 'manager',
    character: 'Manager',
    description:
      'Unflappable tour manager; clipped, low, efficient, and always already done with the conversation.',
    designPrompt:
      'An adult female tour-manager voice. Low register, controlled American accent, clipped efficient phrases, unflappable authority, dry and unimpressed, never raises her voice because everyone already listens. Professional with sharp comic timing.',
    defaultPerformance: '[firmly] [controlled]',
    browser: {
      voiceHints: ['Ava', 'Samantha', 'Jenny', 'Female'],
      rate: 0.94,
      pitch: 0.86,
      volume: 0.96,
    },
  },
  security: {
    key: 'security',
    character: 'Security',
    description:
      'Huge venue guard; very low, very slow, never uses six words when three work.',
    designPrompt:
      'A large adult male security-guard voice. Very deep register, slow sparse delivery, firm and calm, each word carries weight, no unnecessary emotion, intimidating without shouting. Short commands with absolute finality.',
    defaultPerformance: '[deep voice] [firmly]',
    browser: {
      voiceHints: ['George', 'Daniel', 'David', 'Male'],
      rate: 0.76,
      pitch: 0.56,
      volume: 1,
    },
  },
};

export function getVoicePersona(key: string): VoicePersona | undefined {
  return VOICE_PERSONAS[key];
}
