import type { Scenario } from '@/domain/scenario';

import { CUTOUT_LOOK as LOOK } from './style';

/**
 * Placeholder footage of last resort.
 *
 * Every node carries an `art` spec, so in mock mode the player draws the actual
 * beat as cutout animation rather than showing stock video. These URLs only
 * matter if scene art is switched off (`NEXT_PUBLIC_USE_SCENE_ART=false`) before
 * the real library exists. Trim windows stay inside each file's real duration
 * (A = 5.0s, B = 6.1s).
 */
const DEMO_A =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEMO_B =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';

/**
 * Repeated verbatim in every Higgsfield prompt. Text-to-video has no memory
 * between calls, so a fixed cast description plus a per-node seed is what keeps
 * the same four kids on screen across sixteen renders instead of sixteen
 * different strangers.
 */
const CAST =
  'Characters, all drawn as crude paper cutouts with huge round heads and tiny bodies: ARI, 16, the newcomer, flat brown skin, round dark curly hair drawn as three overlapping circles, navy shirt, enormous backpack. DEZ, 16, flat dark brown skin, box braids drawn as five circles on top of his head, bright red hoodie, permanent grin. PRIYA, 16, flat tan skin, black blunt bob drawn as one solid shape, oatmeal cardigan, phone fused to her hand, expression never changes. TYLER, 16, flat pale skin, messy brown hair drawn as a zigzag, green t-shirt, eyes slightly too wide. MR. OKAFOR, adult teacher, bald with two tufts, off-white shirt and maroon tie, entirely oblivious.';

/**
 * "First Bell" — planet Scholaris. 4 decision points, 5 endings.
 *
 * Ari is a recent immigrant on their first day at a US high school. The lesson
 * of the whole scenario is that fluency is not vocabulary volume: the failure
 * branches are all about using *more* slang, or *louder* slang, than the moment
 * asked for.
 *
 * The comedy is South Park-shaped — deadpan kids, catastrophically fast social
 * consequences, an adult who never once notices — but the feedback and lessons
 * play straight. The joke is never on Ari for being new.
 *
 *   homeroom ──"bet"──────► dez-approves ──┬─► priya-intro ──┬──► lunch-table ──┬─► ending-table
 *      │                                   │                 │                  ├─► ending-almost
 *      │                                   │                 └─► glaze-fail ────┴─► ending-glazer
 *      ├──polite──► dez-warm ──────────────┤
 *      │                                   └─► priya-skeptical ──┬──► lunch-table
 *      │                                                         └─► npc-arc ──► ending-npc
 *      └──slang dump──► cringe-silence ──► tyler-warning ─────────┘
 *                                                                 lunch-table ──► ending-solo
 */
export const firstDayOfClass: Scenario = {
  id: 'first-day-of-class',
  planetId: 'scholaris',
  title: 'First Bell',
  tagline: 'New country, new school, and everyone is speaking in shorthand.',
  description:
    'It is 8:02am on your first day. You speak fluent English and understand almost none of this. Four moments decide whether you eat lunch alone.',
  difficulty: 'starter',
  estimatedMinutes: 5,
  emoji: '🎒',
  defaultArtSetting: 'homeroom',
  defaultArtCharacter: 'ari',
  entryNodeId: 'homeroom',
  slangTermIds: [
    'bet',
    'no-cap',
    'lowkey',
    'deadass',
    'vibe-check',
    'w-l',
    'bussin',
    'mid',
    'glaze',
    'sigma',
    'npc',
    'fanum-tax',
    'extra',
    'flex',
    'skibidi',
    'gyatt',
    'its-giving',
    'cooked',
    'drip',
  ],
  nodes: {
    homeroom: {
      kind: 'scene',
      id: 'homeroom',
      title: 'Homeroom',
      speaker: 'Dez',
      caption: '"Yo — you new? Bet, sit here, nobody claimed it."',
      clip: {
        assetPath: 'first-day-of-class/homeroom.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.4 },
        generation: {
          prompt: `${CAST} ARI stands frozen in the homeroom doorway clutching a paper class schedule with both hands, eyes darting for an empty desk. DEZ swivels around in his chair, grins enormously, and slaps the empty desk beside him. MR. OKAFOR stands at the chalkboard reading a clipboard, facing away, completely unaware anyone entered. ${LOOK}`,
          motion: 'Hold on ARI in the doorway, hard cut to DEZ already turned around',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110001,
        },
        audio: {
          assetPath: 'first-day-of-class/homeroom.mp3',
          lines: [
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Okay. Okay. Attendance. If you are not here, please say so now.',
              delivery: 'flat, exhausted, reading a clipboard, not waiting for answers',
              atSec: 0.3,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Yo. You new? Bet — sit here, nobody claimed it.',
              delivery: 'loud, friendly, rushed, overlapping hallway noise',
              atSec: 1.4,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'teacher', expression: 'flat', back: true },
            { key: 'ari', expression: 'neutral' },
            { key: 'dez', expression: 'happy' },
          ],
          prop: 'schedule',
          crowd: true,
          gag: 'ROOM 108 — 8:02 AM',
        },
      },
      slangTermIds: ['bet'],
      prompt: 'Dez just saved you a seat. What do you say?',
      choiceCueAtSec: 3.8,
      choices: [
        {
          id: 'c-bet',
          label: 'Bet. Thanks.',
          tone: '(easy, matching his energy)',
          nextNodeId: 'dez-approves',
          outcome: 'optimal',
          slangTermIds: ['bet'],
          auraDelta: 15,
          feedback:
            '"Bet" is the highest-value word in this building. One syllable, means yes, and it tells him you can hear the room.',
        },
        {
          id: 'c-formal',
          label: 'Thank you very much, I appreciate your kindness.',
          tone: '(warm, careful, very correct)',
          nextNodeId: 'dez-warm',
          outcome: 'acceptable',
          slangTermIds: [],
          auraDelta: 5,
          feedback:
            'Nothing wrong with this — it just marks you as new. Being polite is never the mistake people warn you about.',
        },
        {
          id: 'c-slang-dump',
          label: 'Skibidi! Gyatt! No cap, fam!',
          tone: '(everything you learned from one video, at volume)',
          nextNodeId: 'cringe-silence',
          outcome: 'wrong',
          slangTermIds: ['skibidi', 'gyatt', 'no-cap'],
          auraDelta: -25,
          feedback:
            'Each of those words exists. Together, at volume, to a stranger, they read as a bit — and "gyatt" is about bodies, which is why the room went quiet.',
        },
      ],
    },

    'dez-approves': {
      kind: 'scene',
      id: 'dez-approves',
      title: 'Where You From',
      speaker: 'Dez',
      caption: '"Wait, where you from? My cousin\u2019s out there."',
      clip: {
        assetPath: 'first-day-of-class/dez-approves.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} ARI sits down beside DEZ. DEZ leans all the way over his desk with both arms out, talking with enormous gestures. ARI half-smiles, still guarded, backpack still on. MR. OKAFOR in the background writes the date on the chalkboard, gets it wrong, and does not correct it. ${LOOK}`,
          motion: 'Flat locked-off two-shot, only DEZ animates',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 110002,
        },
        audio: {
          assetPath: 'first-day-of-class/dez-approves.mp3',
          lines: [
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "Aight, aight. Wait, where you from? My cousin's out there. It's giving vacation, no cap.",
              delivery: 'fast, genuinely curious, laughing at his own joke',
              atSec: 0.8,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'teacher', expression: 'neutral', back: true },
            { key: 'ari', expression: 'happy' },
            { key: 'dez', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: ['its-giving', 'no-cap'],
      prompt: 'He asked where you are from. How do you play it?',
      choiceCueAtSec: 3.2,
      choices: [
        {
          id: 'c-honest',
          label: 'Moved here in June. Lowkey still figuring out the vibe.',
          tone: '(honest, relaxed)',
          nextNodeId: 'priya-intro',
          outcome: 'optimal',
          slangTermIds: ['lowkey', 'vibe-check'],
          auraDelta: 15,
          feedback:
            '"Lowkey" does the work here — it admits you are lost without making it heavy, and it invites help instead of pity.',
        },
        {
          id: 'c-flex',
          label: "Everywhere, honestly. I'm basically international.",
          tone: '(reaching)',
          nextNodeId: 'priya-skeptical',
          outcome: 'risky',
          slangTermIds: ['flex'],
          auraDelta: -10,
          feedback:
            'That is a flex, and flexing in the first four minutes invites someone to test you. Somebody always does.',
        },
      ],
    },

    'dez-warm': {
      kind: 'scene',
      id: 'dez-warm',
      title: 'Mad Polite',
      speaker: 'Dez',
      caption: '"You\u2019re mad polite. That\u2019s a W actually."',
      clip: {
        assetPath: 'first-day-of-class/dez-warm.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0.6, endSec: 5.8 },
        generation: {
          prompt: `${CAST} DEZ throws his head back laughing, delighted rather than mocking, and taps ARI on the shoulder twice. ARI's shoulders drop slightly — relaxing for the first time. MR. OKAFOR, still facing the chalkboard, raises one hand for silence at nothing in particular. ${LOOK}`,
          motion: 'Static shot, DEZ bobs violently while laughing, ARI barely moves',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110003,
        },
        audio: {
          assetPath: 'first-day-of-class/dez-warm.mp3',
          lines: [
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "Yo, you're mad polite. Nah that's a W actually, I respect it.",
              delivery: 'delighted, laughing, not mocking',
              atSec: 1.2,
            },
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Thank you. Whoever that was.',
              delivery: 'flat, addressed to the chalkboard, entirely misreading the room',
              atSec: 3.6,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'teacher', expression: 'flat', back: true },
            { key: 'ari', expression: 'neutral' },
            { key: 'dez', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: ['w-l'],
      prompt: 'He is being kind about it. Lean in, or start copying?',
      choiceCueAtSec: 4.2,
      choices: [
        {
          id: 'c-ask',
          label: 'Teach me one thing I should not say here.',
          tone: '(curious, no ego)',
          nextNodeId: 'priya-intro',
          outcome: 'optimal',
          slangTermIds: ['w-l'],
          auraDelta: 20,
          feedback:
            'Asking what *not* to say is the single fastest way to sound fluent. You skip a month of mistakes and he gets to be the expert.',
        },
        {
          id: 'c-copy',
          label: 'Aight... bet... deadass?',
          tone: '(test-driving the words out loud)',
          nextNodeId: 'priya-skeptical',
          outcome: 'acceptable',
          slangTermIds: ['bet', 'deadass'],
          auraDelta: 0,
          feedback:
            'The words are right, the delivery is a rehearsal. Slang copied word-for-word in the same breath always sounds like a rehearsal.',
        },
      ],
    },

    'cringe-silence': {
      kind: 'beat',
      id: 'cringe-silence',
      title: 'The Quiet',
      speaker: 'Homeroom',
      caption: 'Four rows go silent. Someone is already filming.',
      clip: {
        assetPath: 'first-day-of-class/cringe-silence.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 3.4 },
        generation: {
          prompt: `${CAST} Total silence in the homeroom. Every student's head turns to face ARI in one jerky motion, all at exactly the same time. ARI's eyes go enormous. DEZ winces and leans away. TYLER, in the back row, holds a phone up high, filming, absolutely thrilled. MR. OKAFOR does not turn around. ${LOOK}`,
          motion: 'Every head snaps toward ARI on one frame, then nothing moves at all',
          aspectRatio: '9:16',
          durationSec: 4,
          seed: 110004,
        },
        audio: {
          assetPath: 'first-day-of-class/cringe-silence.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Aura points: catastrophic loss. Recalculating.',
              delivery: 'dry, radio-filtered, unhelpful',
              atSec: 1.6,
            },
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Good. Much better. Keep that.',
              delivery: 'flat, pleased, still facing the chalkboard',
              atSec: 2.6,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'tyler', expression: 'happy', back: true },
            { key: 'ari', expression: 'shock' },
            { key: 'dez', expression: 'shock' },
          ],
          prop: 'phone-raised',
          crowd: true,
          gag: 'FOUR SECONDS OF SILENCE',
        },
      },
      slangTermIds: ['cooked'],
      autoAdvanceToId: 'tyler-warning',
    },

    'tyler-warning': {
      kind: 'scene',
      id: 'tyler-warning',
      title: 'Ghost of Last Year',
      speaker: 'Tyler',
      caption: '"They clipped you, bro. I was you last year."',
      clip: {
        assetPath: 'first-day-of-class/tyler-warning.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.4 },
        generation: {
          prompt: `${CAST} TYLER has moved to the desk directly behind ARI and leans forward far too close, holding out his phone which shows a tiny looping video of ARI. ARI stares straight ahead, mortified, not looking at the phone. TYLER is having the best morning of his life. ${LOOK}`,
          motion: 'Flat profile two-shot, TYLER leans in on jerky steps, ARI frozen',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110005,
        },
        audio: {
          assetPath: 'first-day-of-class/tyler-warning.mp3',
          lines: [
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: "Bro. They clipped you. It's already in the group chat. I was you last year, I'm just saying.",
              delivery: 'urgent whisper, slightly too excited to be helping',
              atSec: 1.0,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: "Mine got nine hundred views. We don't talk about it.",
              delivery: 'whispered, weirdly proud, then immediately sad',
              atSec: 3.9,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'ari', expression: 'sad' },
            { key: 'tyler', expression: 'happy' },
          ],
          prop: 'phone',
          crowd: true,
          gag: "IT'S ALREADY IN THE GROUP CHAT",
        },
      },
      slangTermIds: ['cooked'],
      prompt: 'Tyler is offering damage control. Take it?',
      // The only node with a clock: saying nothing while a room stares is
      // exactly the mistake this beat is about.
      choiceCueAtSec: 3.6,
      decisionSeconds: 12,
      timeoutChoiceId: 'c-freeze',
      choices: [
        {
          id: 'c-humble',
          label: 'Yeah, I was doing way too much. My bad.',
          tone: '(owning it, out loud)',
          nextNodeId: 'priya-skeptical',
          outcome: 'acceptable',
          slangTermIds: ['extra'],
          auraDelta: 15,
          feedback:
            'Naming your own overreach before anyone else does takes the joke away from them. "Doing too much" is the phrase people actually use.',
        },
        {
          id: 'c-freeze',
          label: '— say nothing, look at the desk —',
          tone: '(the silence stretches)',
          nextNodeId: 'npc-arc',
          outcome: 'wrong',
          slangTermIds: ['npc'],
          auraDelta: -15,
          feedback:
            'Freezing is understandable and still costly. A day of silence after a bad first impression is how the impression becomes your reputation.',
        },
      ],
    },

    'priya-intro': {
      kind: 'scene',
      id: 'priya-intro',
      title: 'Vibe Check',
      speaker: 'Priya',
      caption: '"Adding you to the chat. Vibe check first: cafeteria pizza."',
      clip: {
        assetPath: 'first-day-of-class/priya-intro.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0.3, endSec: 4.8 },
        generation: {
          prompt: `${CAST} PRIYA is suddenly standing beside ARI's desk, having appeared between frames with no walk cycle. She holds her phone up at ARI like a scanner. Her face does not move at all. DEZ leans in from the side with an enormous grin, enjoying the test enormously. ARI looks trapped. ${LOOK}`,
          motion: 'PRIYA appears in one cut with no transition, then absolutely no movement',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 110006,
        },
        audio: {
          assetPath: 'first-day-of-class/priya-intro.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: "I'm adding you to the group chat. Vibe check first. Cafeteria pizza. Go.",
              delivery: 'completely deadpan, no warmth, not unkind',
              atSec: 0.9,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Oh, she does this. Just answer, bro, she will stand there all day.',
              delivery: 'stage whisper, delighted, unhelpfully cheerful',
              atSec: 3.2,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'ari', expression: 'neutral' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'phone-raised',
          gag: 'VIBE CHECK',
        },
      },
      slangTermIds: ['vibe-check'],
      prompt: 'It is a test, and there is more than one right answer.',
      choiceCueAtSec: 3.4,
      choices: [
        {
          id: 'c-bussin',
          label: "Honestly? It's bussin. No cap.",
          tone: '(committing to the take)',
          nextNodeId: 'lunch-table',
          outcome: 'optimal',
          slangTermIds: ['bussin', 'no-cap'],
          auraDelta: 15,
          feedback:
            'She was not testing your vocabulary, she was testing whether you have opinions. Any real answer passes.',
        },
        {
          id: 'c-mid',
          label: 'Looks kind of mid, ngl.',
          tone: '(honest, a little risky)',
          nextNodeId: 'lunch-table',
          outcome: 'optimal',
          slangTermIds: ['mid'],
          auraDelta: 15,
          feedback:
            'Also correct. "Mid" is safe here because it is aimed at cafeteria pizza, not at a person — the same word to her face would land very differently.',
        },
        {
          id: 'c-glaze',
          label: "Whatever you think! You seem like you'd know.",
          tone: '(agreeing with everything)',
          nextNodeId: 'glaze-fail',
          outcome: 'wrong',
          slangTermIds: ['glaze'],
          auraDelta: -20,
          feedback:
            'That is glazing, and it fails the actual test. Having no opinion reads as having no self.',
        },
      ],
    },

    'priya-skeptical': {
      kind: 'scene',
      id: 'priya-skeptical',
      title: 'Relax',
      speaker: 'Priya',
      caption: '"You\u2019re trying really hard. You can just relax."',
      clip: {
        assetPath: 'first-day-of-class/priya-skeptical.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0.4, endSec: 5.6 },
        generation: {
          prompt: `${CAST} School corridor lined with lockers. PRIYA stands directly in front of ARI, staring, then shrugs with her whole body in one jerky movement. ARI shifts from foot to foot. Other cutout students slide past behind them in a repeating loop, all identical. A bell rings and nobody reacts. ${LOOK}`,
          motion: 'Flat corridor shot, background students loop past on a cycle',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110007,
        },
        audio: {
          assetPath: 'first-day-of-class/priya-skeptical.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: "You're trying really hard. You can just relax, it's not a test.",
              delivery: 'flat, mildly bored, a little bit kind underneath',
              atSec: 1.1,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'It was a test earlier. This one is not.',
              delivery: 'flat, clarifying a technicality, unhelpfully honest',
              atSec: 3.4,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'priya', expression: 'flat' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'She is not wrong. What now?',
      choiceCueAtSec: 3.8,
      choices: [
        {
          id: 'c-relax',
          label: "Fair. I'll stop. What's the actual move at lunch?",
          tone: '(dropping the act)',
          nextNodeId: 'lunch-table',
          outcome: 'optimal',
          slangTermIds: [],
          auraDelta: 20,
          feedback:
            'You took the note without getting defensive, then asked a real question. That is the whole skill.',
        },
        {
          id: 'c-double',
          label: "Nah, I'm sigma. I don't need a group chat.",
          tone: '(armour up)',
          nextNodeId: 'npc-arc',
          outcome: 'wrong',
          slangTermIds: ['sigma'],
          auraDelta: -20,
          feedback:
            'Teens use "sigma" as a joke about lone wolves. Said sincerely, as a wall, it tells her you would rather be alone — so she lets you be.',
        },
      ],
    },

    'glaze-fail': {
      kind: 'beat',
      id: 'glaze-fail',
      title: 'Screenshotted',
      speaker: 'Priya',
      caption: 'She screenshots it. Three phones buzz at once.',
      clip: {
        assetPath: 'first-day-of-class/glaze-fail.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 3.2 },
        generation: {
          prompt: `${CAST} PRIYA taps her phone once, gives the smallest possible flat smile, and walks off screen without another frame of reaction. Three nearby cutout students' phones light up at exactly the same moment and all three heads snap up toward ARI in unison. ARI's eyes go wide. ${LOOK}`,
          motion: 'Hard cut to phone screen, then three heads snap up on the same frame',
          aspectRatio: '9:16',
          durationSec: 4,
          seed: 110008,
        },
        audio: {
          assetPath: 'first-day-of-class/glaze-fail.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Transmission archived. Permanently.',
              delivery: 'dry, radio-filtered, faintly amused',
              atSec: 1.4,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'ari', expression: 'shock' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'phone',
          crowd: true,
          gag: 'SCREENSHOTTED',
        },
      },
      slangTermIds: ['glaze'],
      autoAdvanceToId: 'ending-glazer',
    },

    'npc-arc': {
      kind: 'beat',
      id: 'npc-arc',
      title: 'Background Character',
      speaker: 'Mission Control',
      caption: 'The day continues without you in it.',
      clip: {
        assetPath: 'first-day-of-class/npc-arc.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 3.6 },
        generation: {
          prompt: `${CAST} Cutaway to MISSION CONTROL: a single hooded figure with glowing cyan hair floating in flat black space, surrounded by paper stars and a purple ringed planet, speaking into a paper microphone. Cardboard mission-control desk. Utterly unbothered. Brief insert of ARI standing motionless against school lockers while identical students loop past. ${LOOK}`,
          motion: 'Static space shot, only the paper stars flicker on and off',
          aspectRatio: '9:16',
          durationSec: 4,
          seed: 110009,
        },
        audio: {
          assetPath: 'first-day-of-class/npc-arc.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'You have entered background mode. Nobody is filming. That is the problem.',
              delivery: 'dry, radio-filtered, deadpan sympathy',
              atSec: 1.2,
            },
          ],
        },
        art: {
          setting: 'void',
          characters: [{ key: 'control', expression: 'flat' }],
          gag: 'MISSION CONTROL',
        },
      },
      slangTermIds: ['npc'],
      autoAdvanceToId: 'ending-npc',
    },

    'lunch-table': {
      kind: 'scene',
      id: 'lunch-table',
      title: 'Fanum Tax',
      speaker: 'Priya',
      caption: 'She reaches for one of your fries. "Fanum tax."',
      clip: {
        assetPath: 'first-day-of-class/lunch-table.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.8 },
        generation: {
          prompt: `${CAST} Crowded flat cafeteria with a long paper table and a red LUNCH banner. DEZ waves both arms overhead at ARI. ARI sits down with a tray of fries. PRIYA's arm extends across the table in one straight jerky motion, takes exactly one fry, and holds eye contact the entire time without blinking. ${LOOK}`,
          motion: 'Wide flat cafeteria, then hard cut to PRIYA’s arm crossing the frame',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 110010,
        },
        audio: {
          assetPath: 'first-day-of-class/lunch-table.mp3',
          lines: [
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Ayo! Over here, we saved you a spot!',
              delivery: 'shouted across a loud cafeteria, delighted',
              atSec: 0.5,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Fanum tax.',
              delivery: 'flat, matter-of-fact, mid-chew, maintaining eye contact',
              atSec: 3.0,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'ari', expression: 'neutral' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'fries',
          crowd: true,
          gag: 'FANUM TAX',
        },
      },
      slangTermIds: ['fanum-tax'],
      prompt: 'Last move of the day. This one is the whole test.',
      choiceCueAtSec: 3.2,
      decisionSeconds: 15,
      timeoutChoiceId: 'c-hesitate',
      choices: [
        {
          id: 'c-share',
          label: 'Take two. Fanum tax with interest.',
          tone: '(pushing the tray over)',
          nextNodeId: 'ending-table',
          outcome: 'optimal',
          slangTermIds: ['fanum-tax', 'w-l'],
          auraDelta: 25,
          feedback:
            'You used the joke back at her and escalated it generously. Fanum tax is a friendship test disguised as fry theft, and you passed it.',
        },
        {
          id: 'c-hesitate',
          label: '— reach out, hesitate, pull the tray back —',
          tone: '(unsure if this is a joke)',
          nextNodeId: 'ending-almost',
          outcome: 'risky',
          slangTermIds: [],
          auraDelta: -5,
          feedback:
            'Completely reasonable — you had no way to know. But hesitation reads as "I do not know if we are friends yet", and she reads it.',
        },
        {
          id: 'c-refuse',
          label: "Please don't touch my food.",
          tone: '(firm, serious)',
          nextNodeId: 'ending-solo',
          outcome: 'wrong',
          slangTermIds: [],
          auraDelta: -20,
          feedback:
            'You are entitled to this, and it still ends the bit. She was extending an invitation in the only language she uses.',
        },
      ],
    },

    'ending-table': {
      kind: 'ending',
      id: 'ending-table',
      title: 'You Have a Table',
      badge: 'Got a Table',
      outcome: 'success',
      caption: 'Your phone buzzes. 47 unread messages.',
      clip: {
        assetPath: 'first-day-of-class/ending-table.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.8 },
        generation: {
          prompt: `${CAST} ARI laughs with their whole head thrown back for the first time. DEZ and PRIYA are locked in a silent tug-of-war over the fry carton across the table. ARI's phone lies on the table lighting up over and over with notifications. The whole cafeteria bobs cheerfully in the background. ${LOOK}`,
          motion: 'Flat wide of the table, everyone bobbing on the same jerky cycle',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110011,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-table.mp3',
          lines: [
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "Yo he's actually funny. Aight, you're in.",
              delivery: 'laughing, warm, talking over cafeteria noise',
              atSec: 1.5,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'I renamed the chat. It is your name now. Do not make it weird.',
              delivery: 'completely flat, delivering enormous news as an admin note',
              atSec: 3.8,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'ari', expression: 'happy' },
            { key: 'dez', expression: 'happy' },
            { key: 'priya', expression: 'neutral' },
          ],
          prop: 'tray',
          crowd: true,
        },
      },
      slangTermIds: ['w-l'],
      summary: 'Dez added you to the chat before you finished eating.',
      lesson:
        'You did it with about five slang words total. Fluency was never volume — it was hearing what each moment was actually asking for and answering that.',
    },

    'ending-almost': {
      kind: 'ending',
      id: 'ending-almost',
      title: 'Almost In',
      badge: 'Almost In',
      outcome: 'partial',
      caption: 'You sat down. The invite comes next week.',
      clip: {
        assetPath: 'first-day-of-class/ending-almost.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} ARI eats in tiny careful movements at the far end of the lunch table while DEZ and PRIYA talk animatedly straight past them. Not excluded, not included. ARI turns over a phone with a completely empty screen. ${LOOK}`,
          motion: 'Static flat wide, ARI pushed to the edge of frame with a gap alongside',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 110012,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-almost.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: "He's alright. Bit stiff.",
              delivery: 'flat aside, not meant to be overheard, clearly overheard',
              atSec: 2.2,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'ari', expression: 'flat' },
            { key: 'priya', expression: 'neutral' },
          ],
          prop: 'tray',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'You have a seat. You do not have the group chat.',
      lesson:
        'Nothing you said was wrong. Hesitating just told them you were not sure you belonged yet, and people believe you about that.',
      retryFromNodeId: 'lunch-table',
    },

    'ending-glazer': {
      kind: 'ending',
      id: 'ending-glazer',
      title: 'Certified Glazer',
      badge: 'Certified Glazer',
      outcome: 'failure',
      caption: 'The chat is named after what you said. You are not in it.',
      clip: {
        assetPath: 'first-day-of-class/ending-glazer.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0.5, endSec: 5.6 },
        generation: {
          prompt: `${CAST} A tight cluster of cutout students hunch around one phone in a locker-lined corridor, all laughing on the same two-frame cycle. ARI walks past staring rigidly forward. PRIYA is among them and does not look up once. ${LOOK}`,
          motion: 'Flat side-on tracking as ARI slides past the laughing cluster',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110013,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-glazer.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Aura points: zero. You agreed with everything and became nothing.',
              delivery: 'dry, radio-filtered, brutal but fond',
              atSec: 1.8,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'ari', expression: 'sad' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'phone',
          crowd: true,
          gag: 'CERTIFIED GLAZER',
        },
      },
      slangTermIds: ['glaze'],
      summary: 'Agreeing with everything got you a nickname, not a seat.',
      lesson:
        'Glazing feels safe because you cannot be wrong. But a vibe check is asking whether there is anyone in there, and total agreement answers no.',
      retryFromNodeId: 'priya-intro',
    },

    'ending-npc': {
      kind: 'ending',
      id: 'ending-npc',
      title: 'NPC Arc',
      badge: 'NPC Arc',
      outcome: 'failure',
      caption: 'Nobody was mean to you. Nobody spoke to you either.',
      clip: {
        assetPath: 'first-day-of-class/ending-npc.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0.2, endSec: 4.4 },
        generation: {
          prompt: `${CAST} ARI sits alone at the exact centre of an enormous empty paper cafeteria table, eating in small slow movements. Vast flat empty space on both sides. Tiny distant cutout students laugh at the far edge of frame. ${LOOK}`,
          motion: 'Locked-off wide, absolutely nothing else in frame moves',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 110014,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-npc.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Day one complete. Social contacts acquired: zero. Retry available.',
              delivery: 'dry, radio-filtered, gentle',
              atSec: 1.5,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [{ key: 'ari', expression: 'sad' }],
          prop: 'tray',
          gag: 'DAY ONE COMPLETE',
        },
      },
      slangTermIds: ['npc'],
      summary: 'You got through the day without saying much of anything.',
      lesson:
        'Silence feels like the safe option after a bad moment, and it is the one thing that guarantees nothing changes. One question to one person breaks it.',
      retryFromNodeId: 'priya-skeptical',
    },

    'ending-solo': {
      kind: 'ending',
      id: 'ending-solo',
      title: 'Solo Lunch',
      badge: 'Solo Lunch',
      outcome: 'failure',
      caption: 'The table keeps talking. Just not to you.',
      clip: {
        assetPath: 'first-day-of-class/ending-solo.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.2 },
        generation: {
          prompt: `${CAST} PRIYA's arm retracts from the fry carton in one snap and her expression closes completely. The rest of the table carries on talking in a loop as if ARI has been erased from the scene. DEZ glances over exactly once, then away. ${LOOK}`,
          motion: 'Hard cut on PRIYA’s arm snapping back, then hold on ARI alone',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 110015,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-solo.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'My bad. Won\u2019t happen again.',
              delivery: 'flat, polite, completely closed',
              atSec: 1.6,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'ari', expression: 'sad' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'fries',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'You defended your fries and lost the table.',
      lesson:
        'Your boundary was legitimate. The lesson is not "give up your food" — it is that fanum tax was an offer, and turning it down flat answers a question nobody asked out loud.',
      retryFromNodeId: 'lunch-table',
    },
  },
};
