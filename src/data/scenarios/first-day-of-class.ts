import type { Scenario } from '@/domain/scenario';

import { CUTOUT_LOOK as LOOK } from './style';

/**
 * Placeholder footage of last resort.
 *
 * Every node carries an `art` spec, so in mock mode the player draws the actual
 * beat as cutout animation rather than showing stock video. These URLs only
 * matter if scene art is switched off (`NEXT_PUBLIC_USE_SCENE_ART=false`) before
 * the real library exists — and because the authored beats now run 8–15s while
 * these demo files are 5.0s and 6.1s, `VideoStage` will clamp them. That is
 * expected: the art stage is the real placeholder path.
 */
const DEMO_A =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEMO_B =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';

/**
 * Repeated verbatim in every Higgsfield prompt. Text-to-video has no memory
 * between calls, so a fixed cast description plus a per-node seed is what keeps
 * the same five people on screen across twenty renders instead of twenty
 * different strangers.
 */
const CAST =
  'Characters, all drawn as crude paper cutouts with huge round heads and tiny bodies: ARI, 16, the newcomer, flat brown skin, round dark curly hair drawn as three overlapping circles, navy shirt, enormous backpack that never comes off. DEZ, 16, flat dark brown skin, box braids drawn as five circles on top of his head, bright red hoodie, permanent grin. PRIYA, 16, flat tan skin, black blunt bob drawn as one solid shape, oatmeal cardigan, phone fused to her hand, expression never changes. TYLER, 16, flat pale skin, messy brown hair drawn as a zigzag, green t-shirt, eyes slightly too wide. MR. OKAFOR, adult teacher, bald with two tufts, off-white shirt and maroon tie, entirely oblivious.';

/**
 * "First Bell" — planet Scholaris. 8 decision points, 6 endings, one school day.
 *
 * Ari is a recent immigrant on their first day at a US high school. The lesson
 * of the whole scenario is that fluency is not vocabulary volume: the failure
 * branches are all about using *more* slang, or *louder* slang, than the moment
 * asked for — or going silent when a moment asked for anything at all.
 *
 * The comedy is South Park-shaped — deadpan kids, catastrophically fast social
 * consequences, an adult who never once notices — but the feedback and lessons
 * play straight. The joke is never on Ari for being new.
 *
 * Act structure, which is also the shape of the graph:
 *
 *   ARRIVAL    bus-stop ──► locker-jam ──┬──────────────────► homeroom
 *                                        └─► tyler-latch ───►
 *
 *   HOMEROOM   homeroom ──┬─"bet"──────► dez-approves ──┬──► priya-intro
 *                         ├─polite─────► dez-warm ──────┤
 *                         └─slang dump─► cringe-silence └──► priya-skeptical
 *                                            │
 *                                            └─► tyler-warning ──┬──► priya-skeptical
 *                                                                └──► npc-arc
 *              priya-intro ──┬─► roll-call        priya-skeptical ──┬─► roll-call
 *                            └─► glaze-fail ──► ending-glazer       └─► npc-arc
 *                                                                        │
 *   LUNCH      roll-call ──► lunch-table ──┬─share────► group-project     ▼
 *                                          ├─hesitate─► fry-verdict ─►    ending-npc
 *                                          └─refuse───► cold-table ──►
 *
 *   AFTERNOON  group-project ──┬──► hallway-clip ──┬──► last-bell
 *                              └──► npc-arc        └──► big-yikes ──► ending-big-yikes
 *
 *   LAST BELL  last-bell ──┬─► ending-table   (success)
 *                          ├─► ending-almost  (partial)
 *                          └─► ending-solo    (failure)
 */
export const firstDayOfClass: Scenario = {
  id: 'first-day-of-class',
  planetId: 'scholaris',
  title: 'First Bell',
  tagline: 'New country, new school, and everyone is speaking in shorthand.',
  description:
    'One full school day, from the bus to the last bell. You speak fluent English and understand almost none of this. Eight moments decide whether you end the day in the group chat or eating lunch alone.',
  difficulty: 'starter',
  estimatedMinutes: 8,
  emoji: '🎒',
  defaultArtSetting: 'homeroom',
  defaultArtCharacter: 'ari',
  entryNodeId: 'bus-stop',
  slangTermIds: [
    'bet',
    'no-cap',
    'lowkey',
    'deadass',
    'bruh',
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
    'cook',
    'understood-the-assignment',
    'big-yikes',
    'drip',
  ],
  nodes: {
    // ── ACT 1 · ARRIVAL ──────────────────────────────────────────────────────

    'bus-stop': {
      kind: 'beat',
      id: 'bus-stop',
      title: 'Drop Off',
      speaker: 'Mission Control',
      caption: 'Scholaris. 7:54am. Local dialect: Hallway Standard.',
      clip: {
        assetPath: 'first-day-of-class/bus-stop.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 14.5 },
        generation: {
          prompt: `${CAST} ARI steps off a yellow school bus onto the sidewalk outside a wide flat school building and stops dead, gripping both backpack straps. Dozens of identical cutout students stream past on a loop in both directions, none of them looking at ARI. ${LOOK}`,
          motion: 'Hold wide on ARI standing still while the crowd loops past on two frames',
          aspectRatio: '9:16',
          durationSec: 15,
          seed: 110000,
        },
        audio: {
          assetPath: 'first-day-of-class/bus-stop.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Cadet. You have landed on Scholaris. Local dialect: Hallway Standard. You currently know eleven words of it.',
              delivery: 'radio-filtered mission briefing, entirely unbothered',
              performance: 'robotic and deadpan',
              atSec: 0.6,
            },
            {
              speaker: 'Ari',
              voice: 'ari',
              text: 'I know more than eleven words.',
              delivery: 'quiet, slightly offended, mostly to themselves',
              performance: 'softly, a little indignant',
              atSec: 8.4,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'You know eleven that will work. Good luck.',
              delivery: 'flat correction, then the transmission simply ends',
              performance: 'robotic and matter-of-fact',
              atSec: 10.9,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [{ key: 'ari', expression: 'neutral' }],
          prop: 'schedule',
          propHolder: 'ari',
          crowd: true,
          gag: 'SCHOLARIS — 7:54 AM',
        },
      },
      slangTermIds: [],
      autoAdvanceToId: 'locker-jam',
    },

    'locker-jam': {
      kind: 'scene',
      id: 'locker-jam',
      title: 'Locker 214',
      speaker: 'Tyler',
      caption: '"That locker\u2019s cooked. Permanently. I had it last year."',
      clip: {
        assetPath: 'first-day-of-class/locker-jam.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 16.5 },
        generation: {
          prompt: `${CAST} ARI yanks repeatedly at a locker handle that will not move. TYLER appears far too close beside them, gesturing at the locker with enormous confidence, then shoulder-checks it himself and it still does not open. DEZ walks past in the background, points at the locker without stopping, and keeps walking. ${LOOK}`,
          motion: 'Flat corridor two-shot; TYLER body-slams the locker on two frames; DEZ crosses frame once',
          aspectRatio: '9:16',
          durationSec: 17,
          seed: 110016,
        },
        audio: {
          assetPath: 'first-day-of-class/locker-jam.mp3',
          lines: [
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'Bro. Bro. That locker is cooked. Like permanently cooked. I had it last year.',
              delivery: 'immediate, unsolicited, thrilled to be useful',
              performance: 'speaks quickly, nervous and excited',
              atSec: 0.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'You gotta hip-check it. Watch. Watch me. ...Okay it does not always work.',
              delivery: 'demonstrates with total confidence, fails instantly',
              performance: 'excited, then deflating',
              atSec: 6.3,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Lift up, then pull. Every time.',
              delivery: 'called over his shoulder without breaking stride',
              performance: 'friendly and casual, mid-walk',
              atSec: 11.7,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'ari', expression: 'flat' },
            { key: 'tyler', expression: 'happy' },
          ],
          crowd: true,
          gag: 'LOCKER 214',
        },
      },
      slangTermIds: ['cooked'],
      prompt: 'Tyler tried. Dez actually solved it. Who gets your answer?',
      choiceCueAtSec: 14.7,
      choices: [
        {
          id: 'c-both',
          label: 'Bruh. Thank you — both of you.',
          tone: '(one exhale, then genuine)',
          nextNodeId: 'homeroom',
          outcome: 'optimal',
          slangTermIds: ['bruh', 'w-l'],
          auraDelta: 15,
          feedback:
            '"Bruh" is a whole reaction in one syllable — here it says "this locker has defeated me" without complaining. Thanking both of them costs nothing and buys you two people before first period.',
        },
        {
          id: 'c-dez-only',
          label: 'Lift and pull. Got it, thanks.',
          tone: '(efficient, to Dez)',
          nextNodeId: 'homeroom',
          outcome: 'acceptable',
          slangTermIds: [],
          auraDelta: 5,
          feedback:
            'Correct and efficient. You also walked straight past the person who tried first, and Tyler is going to remember that for the whole day.',
        },
        {
          id: 'c-tyler-hype',
          label: 'SKIBIDI! That was so cooked, no cap, deadass!',
          tone: '(matching Tyler at full volume)',
          nextNodeId: 'tyler-latch',
          outcome: 'wrong',
          slangTermIds: ['skibidi', 'cooked', 'no-cap', 'deadass'],
          auraDelta: -20,
          feedback:
            'You matched Tyler\u2019s volume instead of the hallway\u2019s. Four slang words in one breath is the tell — each of them is real, but nobody stacks them like that unless they are performing.',
        },
      ],
    },

    'tyler-latch': {
      kind: 'beat',
      id: 'tyler-latch',
      title: 'Acquired',
      speaker: 'Tyler',
      caption: '"So we\u2019re friends now. I\u2019ll walk you to all your classes."',
      clip: {
        assetPath: 'first-day-of-class/tyler-latch.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 12.5 },
        generation: {
          prompt: `${CAST} TYLER has attached himself to ARI's side and walks in perfect lockstep with them down the corridor, beaming. ARI keeps glancing sideways with dawning alarm. Every time ARI speeds up, TYLER speeds up identically. ${LOOK}`,
          motion: 'Side-on tracking shot, both bodies bobbing on the exact same two-frame cycle',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110017,
        },
        audio: {
          assetPath: 'first-day-of-class/tyler-latch.mp3',
          lines: [
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'Okay so we are friends now. I will walk you to homeroom. I will walk you to all of them.',
              delivery: 'delighted, absolutely sincere, no awareness',
              performance: 'thrilled and breathless',
              atSec: 0.6,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Warning. You have acquired a companion. This was not the objective.',
              delivery: 'dry radio interjection',
              performance: 'robotic and deadpan',
              atSec: 7,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'ari', expression: 'shock' },
            { key: 'tyler', expression: 'happy' },
          ],
          crowd: true,
          gag: 'COMPANION ACQUIRED',
        },
      },
      slangTermIds: [],
      autoAdvanceToId: 'homeroom',
    },

    // ── ACT 2 · HOMEROOM ─────────────────────────────────────────────────────

    homeroom: {
      kind: 'scene',
      id: 'homeroom',
      title: 'Homeroom',
      speaker: 'Dez',
      caption: '"Yo — you new? Bet, sit here, nobody claimed it."',
      clip: {
        assetPath: 'first-day-of-class/homeroom.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 16.5 },
        generation: {
          prompt: `${CAST} ARI stands frozen in the homeroom doorway clutching a paper class schedule with both hands, eyes darting for an empty desk. DEZ swivels around in his chair, grins enormously, and slaps the empty desk beside him. MR. OKAFOR stands at the chalkboard reading a clipboard, facing away, completely unaware anyone entered. ${LOOK}`,
          motion: 'Hold on ARI in the doorway, hard cut to DEZ already turned around',
          aspectRatio: '9:16',
          durationSec: 17,
          seed: 110001,
        },
        audio: {
          assetPath: 'first-day-of-class/homeroom.mp3',
          lines: [
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Okay. Attendance. If you are not here, please say so now.',
              delivery: 'flat, exhausted, reading a clipboard, not waiting for answers',
              performance: 'tired and matter-of-fact',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Yo. You new? Bet — sit here, nobody claimed it.',
              delivery: 'loud, friendly, rushed, overlapping hallway noise',
              performance: 'excited and friendly',
              atSec: 4.9,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Fair warning though. Okafor is gonna butcher your name. He butchers everybody.',
              delivery: 'cheerful, leaning in, genuinely trying to help',
              performance: 'chuckles, then friendly',
              atSec: 8.6,
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
          propHolder: 'ari',
          crowd: true,
          gag: 'ROOM 108 — 8:02 AM',
        },
      },
      slangTermIds: ['bet'],
      prompt: 'Dez just saved you a seat. What do you say?',
      choiceCueAtSec: 14.7,
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
        trim: { startSec: 0, endSec: 12.5 },
        generation: {
          prompt: `${CAST} ARI sits down beside DEZ. DEZ leans all the way over his desk with both arms out, talking with enormous gestures. ARI half-smiles, still guarded, backpack still on. MR. OKAFOR in the background writes the date on the chalkboard, gets it wrong, and does not correct it. ${LOOK}`,
          motion: 'Flat locked-off two-shot, only DEZ animates',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110002,
        },
        audio: {
          assetPath: 'first-day-of-class/dez-approves.mp3',
          lines: [
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "Aight, aight. Wait, where you from? My cousin's out there.",
              delivery: 'fast, genuinely curious',
              performance: 'excited and friendly',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "It's giving vacation, no cap. You probably think this whole school is mid.",
              delivery: 'laughing at his own joke, no malice at all',
              performance: 'chuckles, then playful',
              atSec: 5,
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
      slangTermIds: ['its-giving', 'no-cap', 'mid'],
      prompt: 'He asked where you are from. How do you play it?',
      choiceCueAtSec: 10.9,
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
        trim: { startSec: 0, endSec: 14.2 },
        generation: {
          prompt: `${CAST} DEZ throws his head back laughing, delighted rather than mocking, and taps ARI on the shoulder twice. ARI's shoulders drop slightly — relaxing for the first time. MR. OKAFOR, still facing the chalkboard, raises one hand for silence at nothing in particular. ${LOOK}`,
          motion: 'Static shot, DEZ bobs violently while laughing, ARI barely moves',
          aspectRatio: '9:16',
          durationSec: 15,
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
              performance: 'laughs warmly, then sincere',
              atSec: 0.6,
            },
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Thank you. Whoever that was.',
              delivery: 'flat, addressed to the chalkboard, entirely misreading the room',
              performance: 'tired and matter-of-fact',
              atSec: 5.2,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'See? He has no idea. He never does. It is kind of beautiful.',
              delivery: 'stage whisper, deeply fond of the man',
              performance: 'chuckles quietly, affectionate',
              atSec: 7.6,
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
      choiceCueAtSec: 12.5,
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
        trim: { startSec: 0, endSec: 11 },
        generation: {
          prompt: `${CAST} Total silence in the homeroom. Every student's head turns to face ARI in one jerky motion, all at exactly the same time. ARI's eyes go enormous. DEZ winces and leans away. TYLER, in the back row, holds a phone up high, filming, absolutely thrilled. MR. OKAFOR does not turn around. ${LOOK}`,
          motion: 'Every head snaps toward ARI on one frame, then nothing moves at all',
          aspectRatio: '9:16',
          durationSec: 11,
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
              performance: 'robotic and deadpan',
              atSec: 2,
            },
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Good. Much better. Keep that energy.',
              delivery: 'flat, pleased, still facing the chalkboard',
              performance: 'tired and pleased',
              atSec: 5.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'That was amazing.',
              delivery: 'awed whisper from the back row, phone still up',
              performance: 'whispers, thrilled',
              atSec: 8.8,
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
        trim: { startSec: 0, endSec: 16.5 },
        generation: {
          prompt: `${CAST} TYLER has moved to the desk directly behind ARI and leans forward far too close, holding out his phone which shows a tiny looping video of ARI. ARI stares straight ahead, mortified, not looking at the phone. DEZ turns around and swats the phone down. ${LOOK}`,
          motion: 'Flat profile two-shot, TYLER leans in on jerky steps, ARI frozen',
          aspectRatio: '9:16',
          durationSec: 17,
          seed: 110005,
        },
        audio: {
          assetPath: 'first-day-of-class/tyler-warning.mp3',
          lines: [
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: "Bro. They clipped you. It's already in the group chat.",
              delivery: 'urgent whisper, slightly too excited to be helping',
              performance: 'whispers quickly, urgent and excited',
              atSec: 0.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: "I was you last year. Mine got nine hundred views. We don't talk about it.",
              delivery: 'weirdly proud, then immediately devastated',
              performance: 'proud, then suddenly sad',
              atSec: 4.8,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Bro. Put the phone down. Nobody watches those twice.',
              delivery: 'firm but kind, shutting it down for Ari',
              performance: 'firmly, protective',
              atSec: 10.2,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'dez', expression: 'angry', back: true },
            { key: 'ari', expression: 'sad' },
            { key: 'tyler', expression: 'happy' },
          ],
          prop: 'phone',
          propHolder: 'tyler',
          crowd: true,
          gag: "IT'S ALREADY IN THE GROUP CHAT",
        },
      },
      slangTermIds: ['cooked'],
      prompt: 'Tyler is offering damage control. Take it?',
      // The only early node with a clock: saying nothing while a room stares is
      // exactly the mistake this beat is about.
      choiceCueAtSec: 14.5,
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
        trim: { startSec: 0, endSec: 14 },
        generation: {
          prompt: `${CAST} PRIYA is suddenly standing beside ARI's desk, having appeared between frames with no walk cycle. She holds her phone up at ARI like a scanner. Her face does not move at all. DEZ leans in from the side with an enormous grin, enjoying the test enormously. ARI looks trapped. ${LOOK}`,
          motion: 'PRIYA appears in one cut with no transition, then absolutely no movement',
          aspectRatio: '9:16',
          durationSec: 14,
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
              performance: 'deadpan and flat',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Oh, she does this. Just answer, bro, she will stand there all day.',
              delivery: 'stage whisper, delighted, unhelpfully cheerful',
              performance: 'chuckles, stage whisper',
              atSec: 5.9,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'I will.',
              delivery: 'two words, no inflection, total certainty',
              performance: 'deadpan and quiet',
              atSec: 10.9,
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
      choiceCueAtSec: 12.3,
      choices: [
        {
          id: 'c-bussin',
          label: "Honestly? It's bussin. No cap.",
          tone: '(committing to the take)',
          nextNodeId: 'roll-call',
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
          nextNodeId: 'roll-call',
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
        trim: { startSec: 0, endSec: 13.5 },
        generation: {
          prompt: `${CAST} School corridor lined with lockers. PRIYA stands directly in front of ARI, staring, then shrugs with her whole body in one jerky movement. ARI shifts from foot to foot. Other cutout students slide past behind them in a repeating loop, all identical. A bell rings and nobody reacts. ${LOOK}`,
          motion: 'Flat corridor shot, background students loop past on a cycle',
          aspectRatio: '9:16',
          durationSec: 14,
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
              performance: 'deadpan, quietly kind',
              atSec: 0.6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'It was a test earlier. This one is not.',
              delivery: 'clarifying a technicality, unhelpfully honest',
              performance: 'deadpan and precise',
              atSec: 5.4,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'So. What do you actually want to know?',
              delivery: 'an genuine offer, delivered with zero warmth',
              performance: 'deadpan, but sincere',
              atSec: 8.5,
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
      choiceCueAtSec: 11.9,
      choices: [
        {
          id: 'c-relax',
          label: "Fair. I'll stop. What's the actual move at lunch?",
          tone: '(dropping the act)',
          nextNodeId: 'roll-call',
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
        trim: { startSec: 0, endSec: 7.2 },
        generation: {
          prompt: `${CAST} PRIYA taps her phone once, gives the smallest possible flat smile, and walks off screen without another frame of reaction. Three nearby cutout students' phones light up at exactly the same moment and all three heads snap up toward ARI in unison. ARI's eyes go wide. ${LOOK}`,
          motion: 'Hard cut to phone screen, then three heads snap up on the same frame',
          aspectRatio: '9:16',
          durationSec: 8,
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
              performance: 'robotic and faintly amused',
              atSec: 1.6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'It is fine. It is just funny.',
              delivery: 'called back over her shoulder, genuinely not cruel',
              performance: 'deadpan, mid-walk',
              atSec: 4.5,
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
          propHolder: 'priya',
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
        trim: { startSec: 0, endSec: 12 },
        generation: {
          prompt: `${CAST} Cutaway to MISSION CONTROL: a single hooded figure with glowing cyan hair floating in flat black space, surrounded by paper stars and a purple ringed planet, speaking into a paper microphone. Cardboard mission-control desk. Utterly unbothered. Brief insert of ARI standing motionless against school lockers while identical students loop past. ${LOOK}`,
          motion: 'Static space shot, only the paper stars flicker on and off',
          aspectRatio: '9:16',
          durationSec: 12,
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
              performance: 'robotic with deadpan sympathy',
              atSec: 1.2,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Retry is available. It usually only takes one question to one person.',
              delivery: 'the closest this voice gets to gentle',
              performance: 'robotic but gentle',
              atSec: 6.6,
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

    'roll-call': {
      kind: 'beat',
      id: 'roll-call',
      title: 'Attendance',
      speaker: 'Mr. Okafor',
      caption: '"Uh... A-ree? Ah-rye? ...We\u2019ll figure it out."',
      clip: {
        assetPath: 'first-day-of-class/roll-call.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 12.5 },
        generation: {
          prompt: `${CAST} MR. OKAFOR squints at his clipboard and attempts ARI's name twice, both times differently, both times wrong, then simply moves on. ARI opens their mouth to correct him and does not. DEZ puts his face in his hands. PRIYA does not look up from her phone. ${LOOK}`,
          motion: 'Flat wide of the classroom; only OKAFOR and DEZ move, each once',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110018,
        },
        audio: {
          assetPath: 'first-day-of-class/roll-call.mp3',
          lines: [
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Uh. A-ree? Ah-rye? ...We will figure it out later.',
              delivery: 'two bad attempts, then gives up entirely and moves on',
              performance: 'tired, uncertain, then dismissive',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Bruh.',
              delivery: 'one syllable, face in hands, on Ari\u2019s behalf',
              performance: 'exasperated sigh',
              atSec: 5,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'He called me Priyanka for a year. Correct him once. He is actually fine about it.',
              delivery: 'flat, without looking up, genuinely useful advice',
              performance: 'deadpan but helpful',
              atSec: 6.2,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'teacher', expression: 'flat', back: true },
            { key: 'ari', expression: 'flat' },
            { key: 'dez', expression: 'sad' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'clipboard',
          propHolder: 'teacher',
          crowd: true,
          gag: 'ATTENDANCE',
        },
      },
      slangTermIds: ['bruh'],
      autoAdvanceToId: 'lunch-table',
    },

    // ── ACT 3 · LUNCH ────────────────────────────────────────────────────────

    'lunch-table': {
      kind: 'scene',
      id: 'lunch-table',
      title: 'Fanum Tax',
      speaker: 'Priya',
      caption: 'She reaches for one of your fries. "Fanum tax."',
      clip: {
        assetPath: 'first-day-of-class/lunch-table.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 17 },
        generation: {
          prompt: `${CAST} Crowded flat cafeteria with a long paper table and a red LUNCH banner. DEZ waves both arms overhead at ARI. ARI sits down with a tray of fries. PRIYA's arm extends across the table in one straight jerky motion, takes exactly one fry, and holds eye contact the entire time without blinking. TYLER watches with open envy. ${LOOK}`,
          motion: 'Wide flat cafeteria, then hard cut to PRIYA’s arm crossing the frame',
          aspectRatio: '9:16',
          durationSec: 17,
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
              performance: 'shouts excitedly',
              atSec: 0.6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Fanum tax.',
              delivery: 'flat, matter-of-fact, mid-chew, maintaining eye contact',
              performance: 'deadpan, mid-chew',
              atSec: 3.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'She does that to everybody. I have lost so much food this year. So much.',
              delivery: 'traumatised, still eating',
              performance: 'speaks quickly, wounded',
              atSec: 4.8,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'You are allowed to tax me back. Most people never figure that out.',
              delivery: 'flat, and it is absolutely a hint',
              performance: 'deadpan, offering a clue',
              atSec: 10.1,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'tyler', expression: 'sad', back: true },
            { key: 'ari', expression: 'neutral' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'fries',
          propHolder: 'ari',
          crowd: true,
          gag: 'FANUM TAX',
        },
      },
      slangTermIds: ['fanum-tax'],
      prompt: 'She told you the rule out loud. Use it.',
      choiceCueAtSec: 15.4,
      decisionSeconds: 15,
      timeoutChoiceId: 'c-hesitate',
      choices: [
        {
          id: 'c-share',
          label: 'Take two. Fanum tax with interest.',
          tone: '(pushing the tray over)',
          nextNodeId: 'group-project',
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
          nextNodeId: 'fry-verdict',
          outcome: 'risky',
          slangTermIds: [],
          auraDelta: -5,
          feedback:
            'Completely reasonable — you had no way to know she meant it. But hesitation reads as "I am not sure we are friends yet", and she reads it.',
        },
        {
          id: 'c-refuse',
          label: "Please don't touch my food.",
          tone: '(firm, serious)',
          nextNodeId: 'cold-table',
          outcome: 'wrong',
          slangTermIds: [],
          auraDelta: -20,
          feedback:
            'You are entitled to this, and it still ends the bit. She was extending an invitation in the only language she uses.',
        },
      ],
    },

    'fry-verdict': {
      kind: 'beat',
      id: 'fry-verdict',
      title: 'Noted',
      speaker: 'Priya',
      caption: '"Hm." That is the whole review.',
      clip: {
        assetPath: 'first-day-of-class/fry-verdict.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 9.8 },
        generation: {
          prompt: `${CAST} PRIYA withdraws her hand a few inches and makes a single small noise. Nothing on her face changes. DEZ waves the whole thing off with both hands, defending ARI. ARI stares at their own tray. TYLER eats faster. ${LOOK}`,
          motion: 'Locked-off flat three-shot; only DEZ’s arms animate',
          aspectRatio: '9:16',
          durationSec: 10,
          seed: 110019,
        },
        audio: {
          assetPath: 'first-day-of-class/fry-verdict.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Hm.',
              delivery: 'one syllable containing an entire verdict',
              performance: 'deadpan, one short sound',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'He froze, that is all. It is day one. Let him cook.',
              delivery: 'defending Ari, warm and quick',
              performance: 'friendly and protective',
              atSec: 2.4,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Hesitation logged. Not fatal. Noted.',
              delivery: 'clinical, mildly ominous',
              performance: 'robotic and deadpan',
              atSec: 6.2,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'ari', expression: 'sad' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'fries',
          propHolder: 'ari',
          crowd: true,
        },
      },
      slangTermIds: ['cook'],
      autoAdvanceToId: 'group-project',
    },

    'cold-table': {
      kind: 'beat',
      id: 'cold-table',
      title: 'Room Temperature',
      speaker: 'Priya',
      caption: '"My bad. Won\u2019t happen again." It will not.',
      clip: {
        assetPath: 'first-day-of-class/cold-table.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 9 },
        generation: {
          prompt: `${CAST} PRIYA's arm snaps back from the fry carton in one frame and her expression closes completely. DEZ's grin fades for the first time all day. The rest of the cafeteria carries on looping cheerfully behind them, which makes it worse. ${LOOK}`,
          motion: 'Hard cut on the arm retracting, then hold far too long on the silence',
          aspectRatio: '9:16',
          durationSec: 9,
          seed: 110020,
        },
        audio: {
          assetPath: 'first-day-of-class/cold-table.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'My bad. Will not happen again.',
              delivery: 'flat, polite, completely closed',
              performance: 'deadpan and closed off',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: '...aight.',
              delivery: 'the grin drops for the first time all day',
              performance: 'quietly, deflated',
              atSec: 3.6,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'The table has cooled. This is recoverable. Barely.',
              delivery: 'dry status report',
              performance: 'robotic and deadpan',
              atSec: 5,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [
            { key: 'dez', expression: 'sad', back: true },
            { key: 'ari', expression: 'flat' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'fries',
          propHolder: 'ari',
          crowd: true,
          gag: 'ROOM TEMPERATURE',
        },
      },
      slangTermIds: [],
      autoAdvanceToId: 'group-project',
    },

    // ── ACT 4 · AFTERNOON ────────────────────────────────────────────────────

    'group-project': {
      kind: 'scene',
      id: 'group-project',
      title: 'Partners',
      speaker: 'Mr. Okafor',
      caption: '"Ari, Priya, Tyler. One slideshow. Friday."',
      clip: {
        assetPath: 'first-day-of-class/group-project.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 16.5 },
        generation: {
          prompt: `${CAST} MR. OKAFOR reads three names off his clipboard without looking up and immediately turns back to the chalkboard. TYLER's arms shoot straight up in triumph. PRIYA slowly turns her head toward ARI with no expression whatsoever. ARI realises what has just been assigned to them. ${LOOK}`,
          motion: 'Flat wide, TYLER’s arms snap up on one frame, PRIYA’s head turns on another',
          aspectRatio: '9:16',
          durationSec: 17,
          seed: 110021,
        },
        audio: {
          assetPath: 'first-day-of-class/group-project.mp3',
          lines: [
            {
              speaker: 'Mr. Okafor',
              voice: 'teacher',
              text: 'Partners. Ari, Priya, Tyler. One slideshow. Friday.',
              delivery: 'read off a clipboard, then instantly forgotten',
              performance: 'tired and matter-of-fact',
              atSec: 0.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'YES. Okay. I already have a theme. It is a lot. You are gonna love it.',
              delivery: 'immediate, unstoppable, arms up',
              performance: 'shouts, thrilled and breathless',
              atSec: 4.6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'It is going to be a lot.',
              delivery: 'flat confirmation, not a compliment',
              performance: 'deadpan',
              atSec: 9.8,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'So. Who is actually doing this?',
              delivery: 'the real question, aimed directly at Ari',
              performance: 'deadpan, direct',
              atSec: 11.9,
            },
          ],
        },
        art: {
          setting: 'homeroom',
          characters: [
            { key: 'teacher', expression: 'flat', back: true },
            { key: 'tyler', expression: 'happy' },
            { key: 'ari', expression: 'shock' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'clipboard',
          propHolder: 'teacher',
          crowd: true,
          gag: 'ONE SLIDESHOW · DUE FRIDAY',
        },
      },
      slangTermIds: ['cook', 'understood-the-assignment'],
      prompt: 'Somebody has to divide this up. She is waiting on you.',
      choiceCueAtSec: 14.9,
      choices: [
        {
          id: 'c-cook',
          label: "I'll cook the slides. Tyler, you're on the theme. Priya, you edit us.",
          tone: '(handing out jobs)',
          nextNodeId: 'hallway-clip',
          outcome: 'optimal',
          slangTermIds: ['cook', 'understood-the-assignment'],
          auraDelta: 25,
          feedback:
            'You gave everyone a job — including the person nobody gives jobs to. That is "understood the assignment", and "cook" works because it claims the work without claiming credit.',
        },
        {
          id: 'c-carry',
          label: "I'll just do all of it, it's fine.",
          tone: '(taking the whole thing)',
          nextNodeId: 'hallway-clip',
          outcome: 'acceptable',
          slangTermIds: ['cooked'],
          auraDelta: 5,
          feedback:
            'Generous on Monday, a boundary problem by Friday. Doing all of it also means nobody learns anything about you except that you can be relied on to absorb work.',
        },
        {
          id: 'c-npc',
          label: '— shrug, wait for someone else to decide —',
          tone: '(no answer)',
          nextNodeId: 'npc-arc',
          outcome: 'wrong',
          slangTermIds: ['npc'],
          auraDelta: -20,
          feedback:
            'A shrug at the exact moment you were handed a role is how you get filed as a background character by people who were trying to include you.',
        },
      ],
    },

    'hallway-clip': {
      kind: 'scene',
      id: 'hallway-clip',
      title: 'Forty-One Views',
      speaker: 'Priya',
      caption: '"Someone posted a clip of homeroom. You\u2019re in it."',
      clip: {
        assetPath: 'first-day-of-class/hallway-clip.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 13 },
        generation: {
          prompt: `${CAST} PRIYA holds her phone flat out toward ARI in the corridor, showing a tiny looping video. TYLER leans in from the other side, far too pleased to be delivering statistics. DEZ reaches across and physically pushes TYLER's head out of frame. Identical students loop past behind them, entirely uninterested. ${LOOK}`,
          motion: 'Flat three-shot; DEZ’s arm shoves TYLER sideways on two frames',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110022,
        },
        audio: {
          assetPath: 'first-day-of-class/hallway-clip.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Someone posted a clip of homeroom. You are in it.',
              delivery: 'flat, holding the phone out, no judgement at all',
              performance: 'deadpan and neutral',
              atSec: 0.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'Forty-one views. That is rookie numbers. Mine was nine hundred.',
              delivery: 'genuinely trying to comfort, achieving the opposite',
              performance: 'speaks quickly, misplaced pride',
              atSec: 4.4,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Bro. Stop helping.',
              delivery: 'flat, exhausted, shoving Tyler aside',
              performance: 'firmly, exasperated',
              atSec: 9.2,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'dez', expression: 'angry', back: true },
            { key: 'tyler', expression: 'happy' },
            { key: 'ari', expression: 'shock' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'phone',
          propHolder: 'priya',
          crowd: true,
          gag: '41 VIEWS',
        },
      },
      slangTermIds: ['big-yikes', 'deadass'],
      prompt: 'Forty-one people have seen your first ten minutes here.',
      choiceCueAtSec: 11.3,
      decisionSeconds: 14,
      timeoutChoiceId: 'c-deny',
      choices: [
        {
          id: 'c-own',
          label: "Forty-one? Deadass, that's the biggest audience I've had all year.",
          tone: '(taking the joke off them)',
          nextNodeId: 'last-bell',
          outcome: 'optimal',
          slangTermIds: ['deadass', 'w-l'],
          auraDelta: 20,
          feedback:
            'You became the person telling the joke instead of the person in it. Once you are in on it there is nothing left to clip — and "deadass" sells it as sincere rather than defensive.',
        },
        {
          id: 'c-deny',
          label: "That wasn't me. That's a different guy.",
          tone: '(with the video still playing)',
          nextNodeId: 'last-bell',
          outcome: 'risky',
          slangTermIds: ['no-cap'],
          auraDelta: -5,
          feedback:
            'That is cap, and the evidence is in her hand. Denying something visible always costs more than the thing you were denying.',
        },
        {
          id: 'c-blowup',
          label: 'DELETE IT. Who posted it. WHO POSTED IT.',
          tone: '(volume rising, hallway turning)',
          nextNodeId: 'big-yikes',
          outcome: 'wrong',
          slangTermIds: ['big-yikes', 'extra'],
          auraDelta: -25,
          feedback:
            'Understandable, and still the worst option available. Demanding a deletion in a crowded hallway is how forty-one views becomes four hundred.',
        },
      ],
    },

    'big-yikes': {
      kind: 'beat',
      id: 'big-yikes',
      title: 'Second Clip',
      speaker: 'Mission Control',
      caption: 'This one has audio.',
      clip: {
        assetPath: 'first-day-of-class/big-yikes.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 7.5 },
        generation: {
          prompt: `${CAST} The corridor has stopped moving. Every looping student has halted and turned to face ARI mid-shout, and four of them are holding up phones. TYLER is one of them and is slowly, guiltily lowering his. ${LOOK}`,
          motion: 'Everything freezes on one frame except TYLER’s arm creeping downward',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 110023,
        },
        audio: {
          assetPath: 'first-day-of-class/big-yikes.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Second clip detected. This one has audio.',
              delivery: 'clinical, faintly delighted',
              performance: 'robotic and faintly amused',
              atSec: 0.6,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'Should I... should I not have filmed that?',
              delivery: 'genuine question, phone slowly lowering',
              performance: 'nervous and quiet',
              atSec: 3.9,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'tyler', expression: 'shock', back: true },
            { key: 'ari', expression: 'yell' },
          ],
          prop: 'phone-raised',
          crowd: true,
          gag: 'BIG YIKES',
        },
      },
      slangTermIds: ['big-yikes'],
      autoAdvanceToId: 'ending-big-yikes',
    },

    // ── ACT 5 · LAST BELL ────────────────────────────────────────────────────

    'last-bell': {
      kind: 'scene',
      id: 'last-bell',
      title: 'Last Bell',
      speaker: 'Priya',
      caption: '"Group chat. You want in or not? I need an actual answer."',
      clip: {
        assetPath: 'first-day-of-class/last-bell.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 17 },
        generation: {
          prompt: `${CAST} End of day. Emptying corridor, low warm light. PRIYA holds her phone out toward ARI with a group chat open on it and waits, absolutely still. DEZ hovers behind her with his whole face full of hope. TYLER is slightly too close, as always. ${LOOK}`,
          motion: 'Flat three-shot; nobody moves except DEZ bobbing hopefully',
          aspectRatio: '9:16',
          durationSec: 17,
          seed: 110024,
        },
        audio: {
          assetPath: 'first-day-of-class/last-bell.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Okay. Group chat. It is mostly Dez posting nothing at two in the morning.',
              delivery: 'flat, phone extended, offer on the table',
              performance: 'deadpan',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'It is called content.',
              delivery: 'immediate, wounded, proud',
              performance: 'chuckles, mock-offended',
              atSec: 6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'You want in or not? I need an actual answer.',
              delivery: 'flat, direct, genuinely asking',
              performance: 'deadpan and direct',
              atSec: 8,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'I am in it. I am barely in it. But I am in it.',
              delivery: 'unprompted, from slightly too close',
              performance: 'speaks quickly, hopeful',
              atSec: 11.5,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [
            { key: 'dez', expression: 'happy', back: true },
            { key: 'tyler', expression: 'happy' },
            { key: 'ari', expression: 'neutral' },
            { key: 'priya', expression: 'flat' },
          ],
          prop: 'phone',
          propHolder: 'priya',
          crowd: true,
          gag: '3:07 PM',
        },
      },
      slangTermIds: ['bet', 'sigma'],
      prompt: 'Last move of the day. She asked a direct question.',
      choiceCueAtSec: 15.4,
      decisionSeconds: 15,
      timeoutChoiceId: 'c-cool',
      choices: [
        {
          id: 'c-in',
          label: "Yeah, I'm in. Bet.",
          tone: '(no hedging)',
          nextNodeId: 'ending-table',
          outcome: 'optimal',
          slangTermIds: ['bet'],
          auraDelta: 30,
          feedback:
            'A direct question got a direct answer, and "bet" closes it without a speech. That is the entire day compressed into one syllable.',
        },
        {
          id: 'c-cool',
          label: "I mean, if you want. Whatever's easier.",
          tone: '(leaving yourself an exit)',
          nextNodeId: 'ending-almost',
          outcome: 'risky',
          slangTermIds: [],
          auraDelta: -10,
          feedback:
            'Making yourself easy to withdraw is how invitations get withdrawn. "Whatever\u2019s easier" answers a question about her convenience that she never asked.',
        },
        {
          id: 'c-sigma',
          label: "Nah, I'm good. I'm sigma, I don't need a chat.",
          tone: '(armour, at the finish line)',
          nextNodeId: 'ending-solo',
          outcome: 'wrong',
          slangTermIds: ['sigma'],
          auraDelta: -25,
          feedback:
            '"Sigma" is a joke about lone wolves. Said sincerely to someone holding an invitation out to you, it is a door closing — and you are the one closing it.',
        },
      ],
    },

    // ── ENDINGS ──────────────────────────────────────────────────────────────

    'ending-table': {
      kind: 'ending',
      id: 'ending-table',
      title: 'You Have a Table',
      badge: 'Got a Table',
      outcome: 'success',
      caption: 'Your phone buzzes before you reach the door.',
      clip: {
        assetPath: 'first-day-of-class/ending-table.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 14.5 },
        generation: {
          prompt: `${CAST} ARI walks out of the front doors between DEZ and PRIYA, laughing with their whole head thrown back for the first time all day. ARI's phone lights up over and over in their hand. TYLER trails half a step behind, thrilled to be tolerated. Warm low afternoon light. ${LOOK}`,
          motion: 'Flat wide tracking shot, all four bobbing on the same jerky cycle',
          aspectRatio: '9:16',
          durationSec: 15,
          seed: 110011,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-table.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Added. I renamed it after you. Do not make it weird.',
              delivery: 'completely flat, delivering enormous news as an admin note',
              performance: 'deadpan',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: "Yo he's actually funny. Aight, you're in.",
              delivery: 'laughing, warm, arm around a shoulder',
              performance: 'laughs warmly',
              atSec: 4.6,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Day one complete. Contacts acquired: three. One of them is Tyler.',
              delivery: 'dry mission report with one small betrayal in it',
              performance: 'robotic and deadpan',
              atSec: 7.9,
            },
            {
              speaker: 'Tyler',
              voice: 'tyler',
              text: 'I heard that.',
              delivery: 'from slightly off-mic, wounded',
              performance: 'quietly wounded',
              atSec: 12.8,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'tyler', expression: 'happy', back: true },
            { key: 'dez', expression: 'happy' },
            { key: 'ari', expression: 'happy' },
            { key: 'priya', expression: 'neutral' },
          ],
          prop: 'phone',
          propHolder: 'ari',
          crowd: true,
          gag: '3:11 PM',
        },
      },
      slangTermIds: ['w-l'],
      summary: 'You ended the day in the chat it is now named after.',
      lesson:
        'You did a whole school day on about six slang words. Fluency was never volume — it was hearing what each moment was asking for and answering that, whether the moment wanted "bet", a real opinion, or a job for Tyler.',
    },

    'ending-almost': {
      kind: 'ending',
      id: 'ending-almost',
      title: 'Almost In',
      badge: 'Almost In',
      outcome: 'partial',
      caption: 'You had a seat all day. The invite comes next week.',
      clip: {
        assetPath: 'first-day-of-class/ending-almost.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 8.6 },
        generation: {
          prompt: `${CAST} PRIYA lowers her phone without adding anyone and walks off with DEZ. ARI stands alone in the emptying corridor holding a phone with nothing on the screen. Not excluded, not included. ${LOOK}`,
          motion: 'Static wide, ARI slightly off-centre with a gap where the group was',
          aspectRatio: '9:16',
          durationSec: 9,
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
              performance: 'deadpan, walking away',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Give him a week.',
              delivery: 'genuinely optimistic, already down the hall',
              performance: 'friendly and hopeful',
              atSec: 2.8,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Partial success. The seat is yours. The chat is not.',
              delivery: 'flat mission report',
              performance: 'robotic and deadpan',
              atSec: 4.4,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [{ key: 'ari', expression: 'flat' }],
          prop: 'phone',
          propHolder: 'ari',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'You have a lunch table. You do not have the group chat.',
      lesson:
        'Nothing you said all day was wrong. Hedging at the last question just told them you were not sure you belonged yet — and people tend to believe you about that.',
      retryFromNodeId: 'last-bell',
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
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 14.5 },
        generation: {
          prompt: `${CAST} A tight cluster of cutout students hunch around one phone in a locker-lined corridor, all laughing on the same two-frame cycle. ARI walks past staring rigidly forward. PRIYA is among them and does not look up once. ${LOOK}`,
          motion: 'Flat side-on tracking as ARI slides past the laughing cluster',
          aspectRatio: '9:16',
          durationSec: 15,
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
              performance: 'robotic and deadpan',
              atSec: 0.6,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'You were allowed to have an opinion. That was the entire test.',
              delivery: 'flat, not cruel, genuinely explaining it',
              performance: 'deadpan but instructive',
              atSec: 5.5,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Tomorrow just say something you actually think, bro.',
              delivery: 'warm, quiet, walking past',
              performance: 'friendly and encouraging',
              atSec: 10.2,
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
          propHolder: 'priya',
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
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 10.7 },
        generation: {
          prompt: `${CAST} ARI sits alone at the exact centre of an enormous empty paper cafeteria table, eating in small slow movements. Vast flat empty space on both sides. Tiny distant cutout students laugh at the far edge of frame. ${LOOK}`,
          motion: 'Locked-off wide, absolutely nothing else in frame moves',
          aspectRatio: '9:16',
          durationSec: 11,
          seed: 110014,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-npc.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Day one complete. Social contacts acquired: zero.',
              delivery: 'dry, radio-filtered, gentle',
              performance: 'robotic and gentle',
              atSec: 1.5,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Nobody was unkind to you today. That is what makes this the hard one.',
              delivery: 'the most sincere this voice ever gets',
              performance: 'robotic but unexpectedly sincere',
              atSec: 5.3,
            },
          ],
        },
        art: {
          setting: 'cafeteria',
          characters: [{ key: 'ari', expression: 'sad' }],
          prop: 'tray',
          propHolder: 'ari',
          gag: 'DAY ONE COMPLETE',
        },
      },
      slangTermIds: ['npc'],
      summary: 'You got through the whole day without saying much of anything.',
      lesson:
        'Silence feels like the safe option after a bad moment, and it is the one choice that guarantees nothing changes. One question, to one person, breaks it.',
      retryFromNodeId: 'priya-skeptical',
    },

    'ending-solo': {
      kind: 'ending',
      id: 'ending-solo',
      title: 'Solo Lunch',
      badge: 'Solo Lunch',
      outcome: 'failure',
      caption: 'The offer stands until Friday. Then it does not.',
      clip: {
        assetPath: 'first-day-of-class/ending-solo.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 12.5 },
        generation: {
          prompt: `${CAST} PRIYA pockets her phone, shrugs once, and leaves with DEZ and TYLER in a tight group. ARI stands alone in the corridor with their backpack still on both shoulders, exactly as they arrived that morning. ${LOOK}`,
          motion: 'Flat wide; the group exits one side, ARI does not move at all',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110015,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-solo.mp3',
          lines: [
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'Cool. Offer stands till Friday. Then it does not.',
              delivery: 'flat, no resentment, simply stating the terms',
              performance: 'deadpan and final',
              atSec: 0.6,
            },
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'You successfully defended something nobody was attacking.',
              delivery: 'dry, radio-filtered, unsparing',
              performance: 'robotic and deadpan',
              atSec: 4.4,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'Yo, the offer is real though. She means it.',
              delivery: 'called back down the corridor, still trying',
              performance: 'friendly, calling out',
              atSec: 8.8,
            },
          ],
        },
        art: {
          setting: 'hallway',
          characters: [{ key: 'ari', expression: 'sad' }],
          crowd: true,
          gag: 'SOLO LUNCH',
        },
      },
      slangTermIds: ['sigma'],
      summary: 'You turned down the invitation you spent all day earning.',
      lesson:
        'Armour is a reasonable instinct on a first day in a new country. The cost is that people take it at face value — "I do not need this" is heard as "do not offer again".',
      retryFromNodeId: 'last-bell',
    },

    'ending-big-yikes': {
      kind: 'ending',
      id: 'ending-big-yikes',
      title: 'Big Yikes',
      badge: 'Big Yikes',
      outcome: 'failure',
      caption: 'The second clip outperformed the first.',
      clip: {
        assetPath: 'first-day-of-class/ending-big-yikes.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 12.5 },
        generation: {
          prompt: `${CAST} ARI sits on the front steps of the school alone with their head in their hands. DEZ sits down beside them and pats their back twice, mechanically. PRIYA stands a little apart, looking at her phone, saying nothing helpful. ${LOOK}`,
          motion: 'Static flat wide on the steps; only DEZ’s hand moves, twice',
          aspectRatio: '9:16',
          durationSec: 13,
          seed: 110025,
        },
        audio: {
          assetPath: 'first-day-of-class/ending-big-yikes.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Big yikes. The second clip outperformed the first by a considerable margin.',
              delivery: 'clinical, faintly impressed',
              performance: 'robotic and faintly impressed',
              atSec: 0.6,
            },
            {
              speaker: 'Dez',
              voice: 'dez',
              text: 'It is gonna blow over. Like... eventually.',
              delivery: 'patting a back, not believing himself',
              performance: 'gently, unconvincingly',
              atSec: 6.1,
            },
            {
              speaker: 'Priya',
              voice: 'priya',
              text: 'It is not going to blow over.',
              delivery: 'flat, without looking up from her phone',
              performance: 'deadpan',
              atSec: 9.5,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'priya', expression: 'flat', back: true },
            { key: 'ari', expression: 'sad' },
            { key: 'dez', expression: 'neutral' },
          ],
          prop: 'phone',
          propHolder: 'priya',
          crowd: true,
          gag: 'BIG YIKES',
        },
      },
      slangTermIds: ['big-yikes', 'extra'],
      summary: 'You tried to delete a clip and made a better one.',
      lesson:
        'The instinct is fair — being filmed without consent genuinely is not okay. But volume in a public hallway is the one response that guarantees a bigger audience. Handle it quietly, or hand the joke back.',
      retryFromNodeId: 'hallway-clip',
    },
  },
};
