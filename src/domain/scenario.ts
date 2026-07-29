import { z } from 'zod';

/**
 * A scenario is a directed graph of nodes, not a linear timeline.
 *
 * Three node kinds keep authoring simple while covering every beat we need:
 *  - `scene`  : a clip that pauses at a cue point and asks the user to choose.
 *  - `beat`   : a clip with no decision that auto-advances (consequence shots,
 *               reaction inserts, establishing shots).
 *  - `ending` : a terminal clip carrying the outcome + the lesson.
 *
 * Nodes are stored in a keyed record rather than an array so traversal and
 * preloading are O(1) lookups, and so authoring tools can patch a single node
 * without reindexing.
 */

/**
 * Generation spec for Higgsfield AI text-to-video.
 *
 * Stored on the node rather than in a separate script file so a clip can never
 * drift from the beat it illustrates: the prompt, the dialogue and the branch
 * logic are edited together. `scripts/generate-assets.mjs` reads these to build
 * the video library.
 */
export const videoGenerationSchema = z.object({
  /** Subject and setting prompt handed to Higgsfield. */
  prompt: z.string().min(1),
  /** Camera and motion direction, kept separate so it can be tuned per shot. */
  motion: z.string().optional(),
  model: z.string().optional(),
  /** Vertical by default — this is a phone-first app. */
  aspectRatio: z.enum(['9:16', '16:9', '1:1']).optional(),
  durationSec: z.number().positive().optional(),
  /** Pinned so a re-run reproduces the same shot rather than a new character. */
  seed: z.number().int().optional(),
});

/** One spoken line, rendered by ElevenLabs text-to-speech. */
export const voiceLineSchema = z.object({
  speaker: z.string().min(1),
  /** Key into `services/audio/voices.ts`, not a raw ElevenLabs id. */
  voice: z.string().min(1),
  text: z.string().min(1),
  /** Delivery note mapped onto ElevenLabs stability/style settings. */
  delivery: z.string().optional(),
  /** Seconds into the clip where this line starts. */
  atSec: z.number().min(0).optional(),
});

/**
 * Dialogue track played over the clip.
 *
 * Higgsfield returns silent video, so audio is a separate synced layer rather
 * than something baked into the file. That is a feature: re-recording a line
 * after a slang term goes stale costs one ElevenLabs call instead of a re-shoot.
 */
export const audioTrackSchema = z.object({
  assetPath: z.string().min(1),
  mockUrl: z.string().url().optional(),
  /** Shift the track if the render and the dialogue drift apart. */
  offsetSec: z.number().optional(),
  lines: z.array(voiceLineSchema),
});

/** Sets a beat can take place in. Drives both the art renderer and the prompt. */
export const sceneSettingSchema = z.enum([
  'homeroom',
  'hallway',
  'cafeteria',
  'street',
  'void',
]);

export const sceneExpressionSchema = z.enum([
  'neutral',
  'happy',
  'flat',
  'shock',
  'angry',
  'sad',
  'yell',
]);

export const scenePropSchema = z.enum([
  'none',
  'phone',
  'phone-raised',
  'fries',
  'tray',
  'schedule',
  'clipboard',
]);

/**
 * Cutout-animation spec for a beat.
 *
 * This is what makes each beat *look* like the beat it is before any video
 * exists: the art renderer draws these characters, in this room, wearing these
 * expressions. Until now every node fell back to the same unrelated stock clip,
 * which broke the illusion at exactly the moment the branching should sell it.
 *
 * It doubles as structured direction for the Higgsfield prompt, so the generated
 * clip and the placeholder depict the same thing.
 */
export const sceneArtSchema = z.object({
  setting: sceneSettingSchema,
  characters: z
    .array(
      z.object({
        /** Key into `data/characters.ts`. */
        key: z.string().min(1),
        expression: sceneExpressionSchema,
        /** Draw further back and smaller, for depth. */
        back: z.boolean().optional(),
      }),
    )
    .max(4),
  prop: scenePropSchema.optional(),
  /** Crowd silhouettes behind the principals. */
  crowd: z.boolean().optional(),
  /** Deadpan on-screen gag card, South Park chapter-title energy. */
  gag: z.string().optional(),
});

/** Points at a file in the video library; never a bundled asset. */
export const videoClipSchema = z.object({
  /**
   * Library path, conventionally `<scenarioId>/<nodeId>.mp4`, resolved against
   * NEXT_PUBLIC_VIDEO_BASE_URL at runtime.
   */
  assetPath: z.string().min(1),
  /** Stock stand-in used while `useMockVideos` is on. */
  mockUrl: z.string().url().optional(),
  posterUrl: z.string().url().optional(),
  /**
   * In/out points within the source file. Lets several nodes share one master
   * file during pre-production, and lets us re-cut a beat without re-encoding.
   */
  trim: z
    .object({
      startSec: z.number().min(0),
      endSec: z.number().min(0),
    })
    .optional(),
  generation: videoGenerationSchema.optional(),
  audio: audioTrackSchema.optional(),
  art: sceneArtSchema.optional(),
});

/**
 * How "correct" a choice was. Note that only `wrong` is a real mistake —
 * `risky` is the interesting middle ground where the slang is right but the
 * read of the room is off.
 */
export const choiceOutcomeSchema = z.enum([
  'optimal',
  'acceptable',
  'risky',
  'wrong',
]);

export const choiceSchema = z.object({
  id: z.string().min(1),
  /** The line the user "says" — written as dialogue, not as an answer. */
  label: z.string().min(1),
  /** Optional tone direction, e.g. "(deadpan)". */
  tone: z.string().optional(),
  nextNodeId: z.string().min(1),
  outcome: choiceOutcomeSchema,
  /** Terms this line teaches; drives Slang Journal auto-capture. */
  slangTermIds: z.array(z.string()),
  /** Shown after the branch resolves, so the lesson lands with the reaction. */
  feedback: z.string().optional(),
  /** Aura points, the playful score the space theme scores you on. */
  auraDelta: z.number().int().optional(),
});

const nodeBaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  clip: videoClipSchema,
  /** Terms spoken in this clip by other characters. */
  slangTermIds: z.array(z.string()),
  /** Who is on screen, for the caption bar. */
  speaker: z.string().optional(),
  /** Caption line, for accessibility and for the sound-off majority. */
  caption: z.string().optional(),
});

export const sceneNodeSchema = nodeBaseSchema.extend({
  kind: z.literal('scene'),
  /** The question framing the decision, e.g. "What do you say?" */
  prompt: z.string().min(1),
  /**
   * Absolute time in the source file at which playback pauses and the choices
   * appear. Defaults to the end of the clip.
   */
  choiceCueAtSec: z.number().min(0).optional(),
  /**
   * Telltale-style pressure. When set, hesitating auto-selects
   * `timeoutChoiceId` — silence is itself a social choice.
   */
  decisionSeconds: z.number().positive().optional(),
  timeoutChoiceId: z.string().optional(),
  choices: z.array(choiceSchema).min(2).max(3),
});

export const beatNodeSchema = nodeBaseSchema.extend({
  kind: z.literal('beat'),
  autoAdvanceToId: z.string().min(1),
});

export const endingOutcomeSchema = z.enum(['success', 'partial', 'failure']);

export const endingNodeSchema = nodeBaseSchema.extend({
  kind: z.literal('ending'),
  outcome: endingOutcomeSchema,
  /** Short label for the trophy shelf, e.g. "Found the Table". */
  badge: z.string().min(1),
  summary: z.string().min(1),
  /** The takeaway. Failure endings must still teach. */
  lesson: z.string().min(1),
  /**
   * Where "Try again" rewinds to. Retrying from the decision that went wrong
   * (rather than the top) is what makes failure a loop instead of a wall.
   */
  retryFromNodeId: z.string().optional(),
});

export const storyNodeSchema = z.discriminatedUnion('kind', [
  sceneNodeSchema,
  beatNodeSchema,
  endingNodeSchema,
]);

export const scenarioSchema = z.object({
  id: z.string().min(1),
  /** Which planet this scenario orbits. */
  planetId: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['starter', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().positive(),
  posterUrl: z.string().url().optional(),
  /** Emoji stand-in until real key art exists. */
  emoji: z.string().min(1),
  /** Fallback set for nodes that do not spell out their own `art`. */
  defaultArtSetting: sceneSettingSchema.optional(),
  /** Fallback cast member when a node's speaker cannot be matched. */
  defaultArtCharacter: z.string().optional(),
  entryNodeId: z.string().min(1),
  nodes: z.record(z.string(), storyNodeSchema),
  /** Everything this scenario can teach, for the planet detail screen. */
  slangTermIds: z.array(z.string()),
});

/**
 * A planet is a dialect world and the unit of monetization — the entitlement
 * gate lives here, so a paid content drop is one new planet entry.
 */
export const planetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** The flavour of slang spoken here, e.g. "Hallway Standard". */
  dialect: z.string().min(1),
  blurb: z.string().min(1),
  emoji: z.string().min(1),
  /** CSS gradient describing the planet surface. */
  surface: z.string().min(1),
  /** Rendered diameter on the star map, in px. */
  size: z.number().positive(),
  ring: z.boolean(),
  /** Flavour text for the travel card. */
  distanceLabel: z.string().min(1),
  requiredTier: z.enum(['free', 'plus', 'pro']),
  status: z.enum(['available', 'coming-soon']),
});

export type SceneSetting = z.infer<typeof sceneSettingSchema>;
export type SceneExpression = z.infer<typeof sceneExpressionSchema>;
export type SceneProp = z.infer<typeof scenePropSchema>;
export type SceneArt = z.infer<typeof sceneArtSchema>;
export type VideoGeneration = z.infer<typeof videoGenerationSchema>;
export type VoiceLine = z.infer<typeof voiceLineSchema>;
export type AudioTrack = z.infer<typeof audioTrackSchema>;
export type VideoClip = z.infer<typeof videoClipSchema>;
export type ChoiceOutcome = z.infer<typeof choiceOutcomeSchema>;
export type Choice = z.infer<typeof choiceSchema>;
export type SceneNode = z.infer<typeof sceneNodeSchema>;
export type BeatNode = z.infer<typeof beatNodeSchema>;
export type EndingNode = z.infer<typeof endingNodeSchema>;
export type EndingOutcome = z.infer<typeof endingOutcomeSchema>;
export type StoryNode = z.infer<typeof storyNodeSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Planet = z.infer<typeof planetSchema>;
