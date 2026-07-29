import type { Scenario } from '@/domain/scenario';

import { CUTOUT_LOOK as LOOK } from './style';

/**
 * Placeholder footage of last resort.
 *
 * Every node carries an `art` spec, so in mock mode the player draws the actual
 * beat as cutout animation instead of stock video. These URLs only matter if
 * scene art is switched off (`NEXT_PUBLIC_USE_SCENE_ART=false`) before the real
 * library exists. Windows stay inside each demo file's real duration
 * (A = 5.0s, B = 6.1s).
 */
const DEMO_A =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEMO_B =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4';

/** Fixed cast description, repeated per render so the same people show up twice. */
const CAST =
  'Characters, all drawn as crude paper cutouts with huge round heads and tiny bodies: YOU, 17, flat brown skin, round dark curly hair drawn as three overlapping circles, navy shirt, phone in hand. KANYE, adult rapper and designer, flat brown skin, black cap, black jacket, small dark sunglasses, holding a smoothie cup; this is a satirical cutout likeness, never photorealistic. THE MANAGER, adult, flat pale skin, black bob, round glasses, dark coat, permanently unimpressed. SECURITY, adult, enormous, flat tan skin, buzz cut, all black, sunglasses, no neck. Setting: flat painted city sidewalk outside a smoothie shop.';

/**
 * "Kanye in the Wild" — 4 decision points, 5 endings.
 *
 * Shape of the graph:
 *
 *   intro ──ate──────────► compliment-hit ──humble──► pitch-humble ──┬──► photo-op ──┬─► ending-mutuals
 *     │                          │                                   │              └─► ending-photo-no-follow
 *     │                          └──delulu──► pitch-delulu ──┬───────┘
 *     │                                                      └──────────────────────────► ending-meme
 *     ├──mid──► compliment-miss ──recover──► recover ─────────┴──► over-ask ──┬─► ending-photo-no-follow
 *     │                │                                                     └─► ending-blocked
 *     │                └──double down──► double-down (beat) ────────────────────► ending-blocked
 *     └──chat──► compliment-chaos ──keep filming──► security-step-in (beat) ───► ending-escorted
 */
export const meetingACelebrity: Scenario = {
  id: 'meeting-a-celebrity',
  planetId: 'clout',
  title: 'Kanye in the Wild',
  tagline:
    'You just clocked Kanye buying a smoothie. Every era is in the room.',
  description:
    'Ninety seconds, one smoothie, and a discography-sized personality. Reference the right era, survive the laugh, and do not turn Graduation into your graduation speech.',
  difficulty: 'starter',
  estimatedMinutes: 4,
  emoji: '🎤',
  defaultArtSetting: 'street',
  defaultArtCharacter: 'ari',
  entryNodeId: 'intro',
  slangTermIds: [
    'ate',
    'no-cap',
    'mid',
    'lowkey',
    'fr',
    'delulu',
    'aura-farming',
    'glaze',
    'its-giving',
    'the-plug',
    'cooked',
    'chat-is-this-real',
  ],
  nodes: {
    intro: {
      kind: 'scene',
      id: 'intro',
      title: 'The Clock',
      speaker: 'Kanye',
      caption: "Kanye looks up from his phone. He's already laughing.",
      clip: {
        assetPath: 'meeting-a-celebrity/intro.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 8 },
        generation: {
          prompt: `${CAST} KANYE stands outside the smoothie shop looking down at his phone, then lifts his head in one jerky movement and laughs directly at YOU as if the encounter was his idea. YOU stand frozen a few feet away. Flat sidewalk, identical cutout pedestrians looping past behind them. ${LOOK}`,
          motion:
            'Static flat two-shot, KANYE’s head snaps up on a single frame',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 120001,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/intro.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'You froze like the beat just dropped. Ha! What era brought you over here?',
              delivery:
                'grand, amused, welcoming himself into the conversation',
              performance:
                'laughs loudly, then speaks with theatrical confidence',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'shock' },
            { key: 'kanye', expression: 'happy' },
          ],
          prop: 'phone',
          crowd: true,
          gag: 'NINETY SECONDS OF ACCESS',
        },
      },
      slangTermIds: [],
      prompt: 'He clocked you. What do you open with?',
      choiceCueAtSec: 6.4,
      choices: [
        {
          id: 'c-ate',
          label: 'You ate on Donda. No cap — but Graduation still owns me.',
          tone: '(calm, like a peer)',
          nextNodeId: 'compliment-hit',
          outcome: 'optimal',
          slangTermIds: ['ate', 'no-cap'],
          feedback:
            '"Ate" praises the work instead of the fame, and "no cap" reads as sincerity rather than hype. He relaxes.',
        },
        {
          id: 'c-mid',
          label: 'Ngl, Yeezus was kinda mid, but I still rock with you.',
          tone: '(honest, badly timed)',
          nextNodeId: 'compliment-miss',
          outcome: 'wrong',
          slangTermIds: ['mid'],
          feedback:
            '"Mid" is lukewarm, which is why it lands as a verdict, not a joke. Said to the person who made the thing, it stings.',
        },
        {
          id: 'c-chat',
          label: 'CHAT. CHAT, IS THIS REAL?? — phone already up',
          tone: '(streamer voice, full volume)',
          nextNodeId: 'compliment-chaos',
          outcome: 'risky',
          slangTermIds: ['chat-is-this-real'],
          feedback:
            'Funny online, alarming in person — narrating a stranger turns him into content he never agreed to.',
        },
      ],
    },

    'compliment-hit': {
      kind: 'scene',
      id: 'compliment-hit',
      title: 'Respect Registered',
      speaker: 'Kanye',
      caption: '"Appreciate that, fr. What do you do?"',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-hit.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 9.7 },
        generation: {
          prompt: `${CAST} KANYE's shoulders drop and he nods twice, genuinely pleased, gesturing at YOU with the smoothie cup, then laughing loudly at his own reference to Graduation. YOU relax slightly. The looping pedestrians behind them do not care at all. ${LOOK}`,
          motion: 'Flat two-shot, KANYE nods and laughs on a two-frame cycle',
          aspectRatio: '9:16',
          durationSec: 10,
          seed: 120002,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/compliment-hit.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'You said I ate? Ha ha! Graduation appetite. College Dropout ambition. I hear you. What do you make?',
              delivery:
                'delighted, fast, delighted by his own album comparison',
              performance: 'laughs warmly, excited and expansive',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'happy' },
            { key: 'kanye', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: ['fr'],
      prompt: 'He asked what you do. How do you answer?',
      choiceCueAtSec: 8.1,
      choices: [
        {
          id: 'c-humble',
          label: 'I make edits. Lowkey chasing that Graduation stadium energy.',
          tone: '(understated)',
          nextNodeId: 'pitch-humble',
          outcome: 'optimal',
          slangTermIds: ['lowkey', 'fr'],
          feedback:
            '"Lowkey" makes the ambition admissible without making it a pitch. He nods.',
        },
        {
          id: 'c-delulu',
          label: 'Same thing as you. Watch the Throne has room for me.',
          tone: '(straight-faced)',
          nextNodeId: 'pitch-delulu',
          outcome: 'risky',
          slangTermIds: ['delulu'],
          feedback:
            'Delusion is charming when you name it yourself and unsettling when you mean it. He can\u2019t tell which this is.',
        },
      ],
    },

    'compliment-miss': {
      kind: 'scene',
      id: 'compliment-miss',
      title: 'Temperature Drop',
      speaker: 'Kanye',
      caption: 'The smile goes flat. "Kinda mid."',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-miss.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 7.2 },
        generation: {
          prompt: `${CAST} KANYE's smile disappears between one frame and the next, replaced by a completely flat line of a mouth. He does not move otherwise. He takes one very slow sip of the smoothie as if evaluating whether your opinion belongs on Yeezus. YOU realise immediately. ${LOOK}`,
          motion:
            'No camera move at all; the smile swaps out on a single frame',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 120003,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/compliment-miss.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Mid? Ha. You walked up to Yeezus and brought a six out of ten.',
              delivery: 'one dry laugh, then total disbelief',
              performance: 'short disbelieving laugh, then dead serious',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'kanye', expression: 'flat' },
          ],
          crowd: true,
          gag: 'TEMPERATURE DROP',
        },
      },
      slangTermIds: ['mid'],
      prompt: 'You felt that land. Fix it, or stand on it?',
      choiceCueAtSec: 5.6,
      choices: [
        {
          id: 'c-recover',
          label: "That came out wrong — it's giving 808s at 3am.",
          tone: '(quick save)',
          nextNodeId: 'recover',
          outcome: 'acceptable',
          slangTermIds: ['its-giving'],
          feedback:
            '"It\u2019s giving" reframes the album as a mood rather than a failure. Not a full recovery, but he stays.',
        },
        {
          id: 'c-double',
          label: "I'm just being real. Everyone else glazes you.",
          tone: '(doubling down)',
          nextNodeId: 'double-down',
          outcome: 'wrong',
          slangTermIds: ['glaze'],
          feedback:
            'Calling other fans glazers frames your rudeness as integrity. He has heard this one before.',
        },
      ],
    },

    'compliment-chaos': {
      kind: 'scene',
      id: 'compliment-chaos',
      title: 'Somebody Call Security',
      speaker: 'Kanye',
      caption: 'He laughs, but he steps back. Someone in black moves in.',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-chaos.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 9.3 },
        generation: {
          prompt: `${CAST} YOU hold a phone up high with both arms, mouth wide open mid-shout. KANYE laughs very loudly but slides one full body-width away without bending his legs. SECURITY enters frame from the right, filling a third of it, and stops. The looping pedestrians keep looping. ${LOOK}`,
          motion:
            'KANYE slides sideways laughing in flat jerky steps; SECURITY arrives on one cut',
          aspectRatio: '9:16',
          durationSec: 10,
          seed: 120004,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/compliment-chaos.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Chat? Ha ha ha! This is a sidewalk, not The Life of Pablo listening party.',
              delivery: 'big laugh, entertained but stepping away',
              performance: 'bursts into loud laughter, then speaks playfully',
              atSec: 0.6,
            },
            {
              speaker: 'Security',
              voice: 'security',
              text: 'Phone down.',
              delivery: 'low, final, no wasted air',
              performance: 'deep voice, firmly',
              atSec: 6.1,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'security', expression: 'flat', back: true },
            { key: 'ari', expression: 'yell' },
            { key: 'kanye', expression: 'happy' },
          ],
          prop: 'phone-raised',
          crowd: true,
          gag: 'CHAT? CHAT??',
        },
      },
      slangTermIds: [],
      prompt: 'Security is walking over. Say something.',
      choiceCueAtSec: 7.7,
      // The only node with a clock: freezing here is itself a decision, and the
      // timeout lands you in the branch where you never stopped filming.
      decisionSeconds: 12,
      timeoutChoiceId: 'c-keep-filming',
      choices: [
        {
          id: 'c-aura',
          label: "My bad — I was aura farming for the story. Phone's down.",
          tone: '(self-deprecating, phone lowered)',
          nextNodeId: 'pitch-humble',
          outcome: 'acceptable',
          slangTermIds: ['aura-farming'],
          feedback:
            'Naming your own bit as aura farming defuses it. Admitting the performance is what makes him laugh with you.',
        },
        {
          id: 'c-keep-filming',
          label: "— keeps filming — GUYS HE'S RIGHT HERE—",
          tone: '(louder)',
          nextNodeId: 'security-step-in',
          outcome: 'wrong',
          slangTermIds: [],
          feedback:
            'You kept the camera up. At that point you stopped talking to him and started talking about him.',
        },
      ],
    },

    'pitch-humble': {
      kind: 'scene',
      id: 'pitch-humble',
      title: 'The Opening',
      speaker: 'Kanye',
      caption: '"Respect. Send me one." He\u2019s got about a minute.',
      clip: {
        assetPath: 'meeting-a-celebrity/pitch-humble.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 10.4 },
        generation: {
          prompt: `${CAST} KANYE points at YOU with the smoothie straw, approving, and laughs about The College Dropout meeting Late Registration on a sidewalk. YOU stand a little straighter. Behind them THE MANAGER waits by a car door, tapping one foot on a two-frame loop, watching the clock. ${LOOK}`,
          motion:
            'Flat two-shot, THE MANAGER visible and looping impatiently behind',
          aspectRatio: '9:16',
          durationSec: 11,
          seed: 120005,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/pitch-humble.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Edits? Ha! College Dropout energy with Late Registration paperwork. Send me the one that feels like a stadium.',
              delivery: 'approving, building the idea bigger as he speaks',
              performance: 'chuckles, then speaks with growing excitement',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'manager', expression: 'flat', back: true },
            { key: 'ari', expression: 'happy' },
            { key: 'kanye', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'This is the moment. What do you actually ask for?',
      choiceCueAtSec: 8.8,
      choices: [
        {
          id: 'c-photo',
          label: 'One Graduation-pose pic? I’ll tag you, no pressure.',
          tone: '(easy to say no to)',
          nextNodeId: 'photo-op',
          outcome: 'optimal',
          slangTermIds: [],
          feedback:
            'A small ask with an exit built in. "No pressure" is why he says yes.',
        },
        {
          id: 'c-track',
          label:
            "Put me on the next track. I'm the plug — Kids See Ghosts energy.",
          tone: '(swinging big)',
          nextNodeId: 'over-ask',
          outcome: 'wrong',
          slangTermIds: ['the-plug'],
          feedback:
            'Claiming to be the plug to someone who already has access reads as a hustle, because it usually is one.',
        },
      ],
    },

    'pitch-delulu': {
      kind: 'scene',
      id: 'pitch-delulu',
      title: 'Read the Eyebrow',
      speaker: 'Kanye',
      caption: 'One eyebrow. Amused, but measuring you.',
      clip: {
        assetPath: 'meeting-a-celebrity/pitch-delulu.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 7.6 },
        generation: {
          prompt: `${CAST} KANYE tilts his head very slightly and one eyebrow rises above the rim of his sunglasses. Nothing else on him moves for a long time. YOU wait. A tiny paper sign reading FANTASY appears and vanishes behind him, a visual reference to My Beautiful Dark Twisted Fantasy. ${LOOK}`,
          motion: 'Absolutely locked off; only one eyebrow animates, once',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 120006,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/pitch-delulu.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Peers? Ha ha. That is a beautiful dark twisted fantasy right there.',
              delivery: 'amused, measuring, enjoying the audacity',
              performance: 'slow amused laugh, then theatrically',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'kanye', expression: 'flat' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'That landed strange. Do you own it?',
      choiceCueAtSec: 6,
      choices: [
        {
          id: 'c-selfaware',
          label: 'Okay, that was MBDTF-level delulu. I’m cooked.',
          tone: '(laughing at yourself)',
          nextNodeId: 'photo-op',
          outcome: 'acceptable',
          slangTermIds: ['delulu', 'cooked'],
          feedback:
            'Calling your own bluff converts the cringe into a joke you\u2019re both in on. "Cooked" works because it\u2019s aimed at you.',
        },
        {
          id: 'c-insist',
          label: 'I’m serious. Check my numbers — The Life of Pablo rollout.',
          tone: '(pulling out analytics)',
          nextNodeId: 'ending-meme',
          outcome: 'wrong',
          slangTermIds: [],
          feedback:
            'Delulu stops being funny the second you defend it with evidence.',
        },
      ],
    },

    recover: {
      kind: 'scene',
      id: 'recover',
      title: 'Borrowed Time',
      speaker: 'Kanye',
      caption: 'He half-nods. "Alright." The smoothie is almost done.',
      clip: {
        assetPath: 'meeting-a-celebrity/recover.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 8.9 },
        generation: {
          prompt: `${CAST} KANYE gives one small grudging nod, chuckles once, and drains the smoothie with a long loud slurp, watching YOU the entire time. The empty cup is now an 808s-style heartbreak countdown. ${LOOK}`,
          motion:
            'Flat two-shot, one nod, then total stillness while he drinks',
          aspectRatio: '9:16',
          durationSec: 9,
          seed: 120007,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/recover.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Three A.M. album? Okay. That is 808s weather. Ha. You recovered. You have five seconds.',
              delivery: 'grudging approval followed by a tiny laugh',
              performance: 'small chuckle, thoughtful, then firm',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'kanye', expression: 'neutral' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: "You've got about five seconds of goodwill. Spend them.",
      choiceCueAtSec: 7.3,
      choices: [
        {
          id: 'c-photo-2',
          label: 'One pic, Graduation pose, then I’m gone.',
          tone: '(short and out)',
          nextNodeId: 'photo-op',
          outcome: 'acceptable',
          slangTermIds: [],
          feedback:
            'After a misstep, the winning move is the smallest possible ask.',
        },
        {
          id: 'c-track-2',
          label: 'So can I hop on a track though?',
          tone: '(pushing)',
          nextNodeId: 'over-ask',
          outcome: 'wrong',
          slangTermIds: ['the-plug'],
          feedback:
            'You spent goodwill you had just borrowed. Escalating after a save resets the save.',
        },
      ],
    },

    'photo-op': {
      kind: 'scene',
      id: 'photo-op',
      title: 'One Pic',
      speaker: 'Kanye',
      caption: 'Shutter. He\u2019s already turning toward the door.',
      clip: {
        assetPath: 'meeting-a-celebrity/photo-op.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 9.1 },
        generation: {
          prompt: `${CAST} YOU and KANYE stand shoulder to shoulder facing the camera for a selfie. KANYE laughs during the photo. A white flash frame. On the very next frame KANYE's body has already rotated toward the shop door while YOU are still smiling at the phone. ${LOOK}`,
          motion:
            'Hold, one white flash frame, then KANYE is instantly facing away',
          aspectRatio: '9:16',
          durationSec: 10,
          seed: 120008,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/photo-op.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'One photo. Ha! Make it Graduation, not school-picture day.',
              delivery: 'laughing through the instruction',
              performance: 'laughs brightly, playful and confident',
              atSec: 0.6,
            },
            {
              speaker: 'Manager',
              voice: 'manager',
              text: 'That was the one photo.',
              delivery: 'precise, already ending the interaction',
              performance: 'controlled and matter-of-fact',
              atSec: 5,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'happy' },
            { key: 'kanye', expression: 'happy' },
          ],
          prop: 'phone-raised',
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'Last words. Make them count.',
      choiceCueAtSec: 7.5,
      decisionSeconds: 15,
      timeoutChoiceId: 'c-followback',
      choices: [
        {
          id: 'c-gracious',
          label:
            'Appreciate you fr. Donda stays in rotation. Enjoy your night.',
          tone: '(and you actually leave)',
          nextNodeId: 'ending-mutuals',
          outcome: 'optimal',
          slangTermIds: ['fr'],
          feedback:
            '"Fr" closes it as sincere, and ending the conversation yourself is the whole flex.',
        },
        {
          id: 'c-followback',
          label: 'Follow me back tho?',
          tone: '(one ask too many)',
          nextNodeId: 'ending-photo-no-follow',
          outcome: 'risky',
          slangTermIds: [],
          feedback:
            'Nothing here was rude — it was just one beat too long. Timing is tone.',
        },
      ],
    },

    'over-ask': {
      kind: 'scene',
      id: 'over-ask',
      title: 'The Manager',
      speaker: 'Manager',
      caption: 'A hand lands on Kanye\u2019s shoulder. "We\u2019re good?"',
      clip: {
        assetPath: 'meeting-a-celebrity/over-ask.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 9.9 },
        generation: {
          prompt: `${CAST} THE MANAGER's arm extends across the frame in one straight jerky motion and lands flat on KANYE's shoulder. THE MANAGER looks only at YOU, never at KANYE, and does not blink. KANYE quietly laughs once. ${LOOK}`,
          motion:
            'The arm crosses frame in a single hard movement, then everything stops',
          aspectRatio: '9:16',
          durationSec: 10,
          seed: 120009,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/over-ask.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'The plug? Ha! Watch the Throne had two chairs. Neither one was an internship.',
              delivery: 'huge laugh, then an absurdly specific correction',
              performance: 'laughs loudly, then speaks with mock seriousness',
              atSec: 0.6,
            },
            {
              speaker: 'Manager',
              voice: 'manager',
              text: 'We are good now.',
              delivery: 'not phrased as a question',
              performance: 'firmly and quietly',
              atSec: 6.3,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'kanye', expression: 'happy' },
            { key: 'manager', expression: 'angry' },
          ],
          crowd: true,
          gag: 'THE MANAGER',
        },
      },
      slangTermIds: [],
      prompt: 'Walk it back, or stand on business?',
      choiceCueAtSec: 8.3,
      choices: [
        {
          id: 'c-joke',
          label: "I'm playing — but I'd love to send you something.",
          tone: '(hands up)',
          nextNodeId: 'ending-photo-no-follow',
          outcome: 'acceptable',
          slangTermIds: [],
          feedback:
            'Retreating into a joke is a legitimate exit. You keep the photo.',
        },
        {
          id: 'c-serious',
          label: "Nah I'm dead serious. I'm the plug.",
          tone: '(stepping closer)',
          nextNodeId: 'ending-blocked',
          outcome: 'wrong',
          slangTermIds: ['the-plug'],
          feedback:
            'Insisting on status in front of the person paid to remove you is how the night ends.',
        },
      ],
    },

    // Beats: consequence footage with no decision, so the fallout plays as a
    // shot rather than as a results screen.
    'double-down': {
      kind: 'beat',
      id: 'double-down',
      title: 'Standing On It',
      speaker: 'Kanye',
      caption: '"Aight." He turns. He does not turn back.',
      clip: {
        assetPath: 'meeting-a-celebrity/double-down.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.5 },
        generation: {
          prompt: `${CAST} KANYE's whole body flips to face away on one frame. He laughs once, drops the empty smoothie cup in a bin without looking, and walks off in flat jerky steps. YOU are left alone in frame with the looping pedestrians. ${LOOK}`,
          motion:
            'Body flips on one frame, then a repeating two-pose walk out of frame',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120010,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/double-down.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Aight. Ha. That take can live on its own little Donda island.',
              delivery: 'one dismissive laugh while already leaving',
              performance: 'brief dry laugh, dismissive',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'flat' },
            { key: 'kanye', expression: 'flat' },
          ],
          crowd: true,
          gag: 'HE DOES NOT TURN BACK',
        },
      },
      slangTermIds: [],
      autoAdvanceToId: 'ending-blocked',
    },

    'security-step-in': {
      kind: 'beat',
      id: 'security-step-in',
      title: 'Escorted',
      speaker: 'Security',
      caption: '"Phone down. Let\u2019s go."',
      clip: {
        assetPath: 'meeting-a-celebrity/security-step-in.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 6.2 },
        generation: {
          prompt: `${CAST} SECURITY fills most of the frame, standing directly in front of the camera so KANYE is entirely hidden behind him. Kanye's laugh continues from somewhere off-screen. One enormous flat hand reaches out and covers the lens. YOU look very small beside him. ${LOOK}`,
          motion:
            'SECURITY steps in on one cut; the hand covers the lens on the next',
          aspectRatio: '9:16',
          durationSec: 7,
          seed: 120011,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/security-step-in.mp3',
          lines: [
            {
              speaker: 'Security',
              voice: 'security',
              text: 'Phone down. Let us go.',
              delivery: 'deep, slow, completely final',
              performance: 'deep voice, firmly',
              atSec: 0.6,
            },
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Ha ha ha! He said it like an album title!',
              delivery: 'off-screen, delighted by security',
              performance: 'distant loud laughter',
              atSec: 2.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'shock' },
            { key: 'security', expression: 'flat' },
          ],
          prop: 'phone',
          crowd: true,
          gag: 'PHONE DOWN',
        },
      },
      slangTermIds: [],
      autoAdvanceToId: 'ending-escorted',
    },

    'ending-mutuals': {
      kind: 'ending',
      id: 'ending-mutuals',
      title: 'Mutuals',
      badge: 'Mutuals',
      outcome: 'success',
      caption: 'Your phone buzzes before he\u2019s out the door.',
      clip: {
        assetPath: 'meeting-a-celebrity/ending-mutuals.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 7.6 },
        generation: {
          prompt: `${CAST} YOU walk away first, grinning, phone lighting up in your hand. KANYE glances back over his shoulder from the shop doorway, nods, and laughs. THE MANAGER, holding the car door, notices and looks mildly betrayed. A paper graduation cap falls from nowhere. ${LOOK}`,
          motion:
            'Flat wide, YOU exit one side while KANYE nods once from the doorway',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 120012,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/ending-mutuals.mp3',
          lines: [
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Ha! You knew when to leave. That is Graduation. Follow earned.',
              delivery: 'calling back from the doorway, genuinely impressed',
              performance: 'laughs warmly, then calls out with approval',
              atSec: 0.6,
            },
            {
              speaker: 'Manager',
              voice: 'manager',
              text: 'Please get in the car.',
              delivery: 'tired, routine, not surprised',
              performance: 'controlled and tired',
              atSec: 5.3,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'manager', expression: 'flat', back: true },
            { key: 'ari', expression: 'happy' },
            { key: 'kanye', expression: 'happy' },
          ],
          prop: 'phone',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'Kanye followed you back before he reached the door.',
      lesson:
        'You praised the work, kept the ask small, and ended the conversation yourself. Slang got you in the door; timing got you the follow.',
    },

    'ending-photo-no-follow': {
      kind: 'ending',
      id: 'ending-photo-no-follow',
      title: 'Got the Pic',
      badge: 'Got the Pic',
      outcome: 'partial',
      caption: 'Good photo. No notification.',
      clip: {
        assetPath: 'meeting-a-celebrity/ending-photo-no-follow.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 6.9 },
        generation: {
          prompt: `${CAST} YOU stand alone on the flat sidewalk staring at a phone showing a good photo and an entirely empty notification list. Pedestrians loop past on both sides without stopping. KANYE is gone. A tiny paper moon references Donda in the distance. ${LOOK}`,
          motion: 'Locked off, only the looping background pedestrians move',
          aspectRatio: '9:16',
          durationSec: 7,
          seed: 120013,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/ending-photo-no-follow.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Photo acquired. Follow not acquired. Your 808 is currently experiencing heartbreak.',
              delivery: 'clinical mission report with one album joke',
              performance: 'robotic and deadpan',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [{ key: 'ari', expression: 'flat' }],
          prop: 'phone',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'You got the photo. You did not get the follow.',
      lesson:
        'Every word was fine — the length was not. One ask past the natural ending turns a peer into a fan.',
      retryFromNodeId: 'photo-op',
    },

    'ending-blocked': {
      kind: 'ending',
      id: 'ending-blocked',
      title: 'Blocked',
      badge: 'Blocked',
      outcome: 'failure',
      caption: 'You check his page later. You can\u2019t see it.',
      clip: {
        assetPath: 'meeting-a-celebrity/ending-blocked.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 7.9 },
        generation: {
          prompt: `${CAST} YOU stand alone under a streetlight holding a phone showing an empty grey profile page. Head tilted down. The sidewalk is completely empty now — even the looping pedestrians have stopped. ${LOOK}`,
          motion: 'Static, nothing in frame moves at all',
          aspectRatio: '9:16',
          durationSec: 8,
          seed: 120014,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/ending-blocked.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Contact lost. Yeezus has left the server. You are now experiencing a beautiful dark twisted block.',
              delivery: 'dry system notice',
              performance: 'robotic and faintly amused',
              atSec: 0.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [{ key: 'ari', expression: 'sad' }],
          prop: 'phone',
          gag: 'BLOCKED',
        },
      },
      slangTermIds: [],
      summary: 'Blocked before you got home.',
      lesson:
        'Honesty and "glaze" both aimed at the same target: proving you were not a fan. He never asked you to prove it. Criticism needs an invitation.',
    },

    'ending-escorted': {
      kind: 'ending',
      id: 'ending-escorted',
      title: 'Escorted Out',
      badge: 'Escorted Out',
      outcome: 'failure',
      caption: 'The clip does numbers. You are not the hero of it.',
      clip: {
        assetPath: 'meeting-a-celebrity/ending-escorted.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 6.3 },
        generation: {
          prompt: `${CAST} SECURITY walks YOU away by the elbow in flat jerky steps. Six identical cutout bystanders hold up six phones, all filming YOU rather than KANYE, who has already left laughing. ${LOOK}`,
          motion: 'Side-on flat tracking shot past a row of raised phones',
          aspectRatio: '9:16',
          durationSec: 7,
          seed: 120015,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/ending-escorted.mp3',
          lines: [
            {
              speaker: 'Security',
              voice: 'security',
              text: 'Keep walking.',
              delivery: 'three syllables, no emotion',
              performance: 'deep voice, firmly',
              atSec: 0.6,
            },
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Ha ha ha! This is not the Runaway ending you wanted!',
              delivery: 'distant, laughing at the entire scene',
              performance: 'distant explosive laughter',
              atSec: 2,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'sad' },
            { key: 'security', expression: 'flat' },
          ],
          prop: 'phone-raised',
          crowd: true,
          gag: 'ESCORTED OUT',
        },
      },
      slangTermIds: [],
      summary: 'You got your footage and a hand on your elbow.',
      lesson:
        'Streamer language assumes an audience that consented. "Chat, is this real?" out loud makes a bystander into content — the phone was the problem, not the phrase.',
    },

    'ending-meme': {
      kind: 'ending',
      id: 'ending-meme',
      title: 'Main Character',
      badge: 'Main Character (Bad)',
      outcome: 'failure',
      caption: 'Someone else was filming. Of course they were.',
      clip: {
        assetPath: 'meeting-a-celebrity/ending-meme.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 11.2 },
        generation: {
          prompt: `${CAST} YOU stand alone mid-gesture, still holding up a phone showing an analytics graph, mouth open, frozen in the exact pose that is about to be a sound. A single bystander films from the edge of frame. KANYE is nowhere in the shot. Album-title placards for Graduation, Yeezus, Donda and The Life of Pablo tumble past like paper debris. ${LOOK}`,
          motion: 'Freeze on the worst possible pose and hold it far too long',
          aspectRatio: '9:16',
          durationSec: 12,
          seed: 120016,
        },
        audio: {
          assetPath: 'meeting-a-celebrity/ending-meme.mp3',
          lines: [
            {
              speaker: 'Mission Control',
              voice: 'control',
              text: 'Your analytics speech is now a four-hundred-thousand-view sound. The Life of Pablo has become the life of your comment section.',
              delivery: 'brutally neutral mission report',
              performance: 'robotic and deadpan',
              atSec: 0.6,
            },
            {
              speaker: 'Kanye',
              voice: 'kanye',
              text: 'Ha ha ha ha!',
              delivery: 'very distant laugh, as if from another block',
              performance: 'distant genuine belly laugh',
              atSec: 9.6,
            },
          ],
        },
        art: {
          setting: 'street',
          characters: [{ key: 'ari', expression: 'shock' }],
          prop: 'phone-raised',
          crowd: true,
          gag: '400K VIEWS',
        },
      },
      slangTermIds: ['delulu'],
      summary: 'Your analytics pitch is a 400k-view sound now.',
      lesson:
        'Delulu is a joke you tell on yourself. Defending it with a screenshot moves you from self-aware to just aware of yourself.',
      retryFromNodeId: 'pitch-delulu',
    },
  },
};
