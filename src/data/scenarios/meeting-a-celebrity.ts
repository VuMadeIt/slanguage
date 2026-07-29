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
  'Characters, all drawn as crude paper cutouts with huge round heads and tiny bodies: YOU, 17, flat brown skin, round dark curly hair drawn as three overlapping circles, navy shirt, phone in hand. RICO, 24, rapper, flat brown skin, black cap, black jacket, small dark sunglasses he never removes, holding a smoothie cup. THE MANAGER, adult, flat pale skin, black bob, round glasses, dark coat, permanently unimpressed. SECURITY, adult, enormous, flat tan skin, buzz cut, all black, sunglasses, no neck. Setting: flat painted city sidewalk outside a smoothie shop.';

/**
 * "Rico in the Wild" — 4 decision points, 5 endings.
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
  title: 'Rico in the Wild',
  tagline: 'You just clocked your favourite artist buying a smoothie.',
  description:
    'Ninety seconds of access and no script. Compliment him wrong and you learn what "mid" costs; get the tone right and you leave with a mutual follow.',
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
      speaker: 'Rico',
      caption: "Rico looks up from his phone. He's already half-smiling.",
      clip: {
        assetPath: 'meeting-a-celebrity/intro.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} RICO stands outside the smoothie shop looking down at his phone, then lifts his head in one jerky movement and half-smiles directly at YOU. YOU stand frozen a few feet away. Flat sidewalk, identical cutout pedestrians looping past behind them. ${LOOK}`,
          motion: 'Static flat two-shot, RICO’s head snaps up on a single frame',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120001,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'shock' },
            { key: 'rico', expression: 'neutral' },
          ],
          prop: 'phone',
          crowd: true,
          gag: 'NINETY SECONDS OF ACCESS',
        },
      },
      slangTermIds: [],
      prompt: 'He clocked you. What do you open with?',
      choiceCueAtSec: 3.2,
      choices: [
        {
          id: 'c-ate',
          label: 'Yo — you ate on that last album. No cap.',
          tone: '(calm, like a peer)',
          nextNodeId: 'compliment-hit',
          outcome: 'optimal',
          slangTermIds: ['ate', 'no-cap'],
          feedback:
            '"Ate" praises the work instead of the fame, and "no cap" reads as sincerity rather than hype. He relaxes.',
        },
        {
          id: 'c-mid',
          label: 'Ngl the last album was kinda mid, but I still rock with you.',
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
      speaker: 'Rico',
      caption: '"Appreciate that, fr. What do you do?"',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-hit.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.4 },
        generation: {
          prompt: `${CAST} RICO's shoulders drop and he nods twice, genuinely pleased, gesturing at YOU with the smoothie cup. YOU relax slightly. The looping pedestrians behind them do not care at all. ${LOOK}`,
          motion: 'Flat two-shot, RICO nods on a two-frame cycle',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120002,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'happy' },
            { key: 'rico', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: ['fr'],
      prompt: 'He asked what you do. How do you answer?',
      choiceCueAtSec: 3.8,
      choices: [
        {
          id: 'c-humble',
          label: "I make edits. Lowkey trying to go viral, but it's slow.",
          tone: '(understated)',
          nextNodeId: 'pitch-humble',
          outcome: 'optimal',
          slangTermIds: ['lowkey', 'fr'],
          feedback:
            '"Lowkey" makes the ambition admissible without making it a pitch. He nods.',
        },
        {
          id: 'c-delulu',
          label: "Same thing as you, basically. We're peers.",
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
      speaker: 'Rico',
      caption: 'The smile goes flat. "Kinda mid."',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-miss.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} RICO's smile disappears between one frame and the next, replaced by a completely flat line of a mouth. He does not move otherwise. He takes one very slow sip of the smoothie. YOU realise immediately. ${LOOK}`,
          motion: 'No camera move at all; the smile swaps out on a single frame',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120003,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'rico', expression: 'flat' },
          ],
          crowd: true,
          gag: 'TEMPERATURE DROP',
        },
      },
      slangTermIds: ['mid'],
      prompt: 'You felt that land. Fix it, or stand on it?',
      choiceCueAtSec: 3.2,
      choices: [
        {
          id: 'c-recover',
          label: "That came out wrong — it's a grower. It's giving 3am album.",
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
      speaker: 'Rico',
      caption: 'He laughs, but he steps back. Someone in black moves in.',
      clip: {
        assetPath: 'meeting-a-celebrity/compliment-chaos.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.4 },
        generation: {
          prompt: `${CAST} YOU hold a phone up high with both arms, mouth wide open mid-shout. RICO laughs but slides one full body-width away without bending his legs. SECURITY enters frame from the right, filling a third of it, and stops. The looping pedestrians keep looping. ${LOOK}`,
          motion: 'RICO slides sideways in flat jerky steps; SECURITY arrives on one cut',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120004,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'security', expression: 'flat', back: true },
            { key: 'ari', expression: 'yell' },
            { key: 'rico', expression: 'shock' },
          ],
          prop: 'phone-raised',
          crowd: true,
          gag: 'CHAT? CHAT??',
        },
      },
      slangTermIds: [],
      prompt: 'Security is walking over. Say something.',
      choiceCueAtSec: 3.6,
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
      speaker: 'Rico',
      caption: '"Respect. Send me one." He\u2019s got about a minute.',
      clip: {
        assetPath: 'meeting-a-celebrity/pitch-humble.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0.4, endSec: 4.8 },
        generation: {
          prompt: `${CAST} RICO points at YOU with the smoothie straw, approving. YOU stand a little straighter. Behind them THE MANAGER waits by a car door, tapping one foot on a two-frame loop, watching the clock. ${LOOK}`,
          motion: 'Flat two-shot, THE MANAGER visible and looping impatiently behind',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120005,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'manager', expression: 'flat', back: true },
            { key: 'ari', expression: 'happy' },
            { key: 'rico', expression: 'happy' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'This is the moment. What do you actually ask for?',
      choiceCueAtSec: 3.4,
      choices: [
        {
          id: 'c-photo',
          label: "Can I get one pic? I'll tag you, no pressure.",
          tone: '(easy to say no to)',
          nextNodeId: 'photo-op',
          outcome: 'optimal',
          slangTermIds: [],
          feedback:
            'A small ask with an exit built in. "No pressure" is why he says yes.',
        },
        {
          id: 'c-track',
          label: "Put me on the next track. I'm the plug out here.",
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
      speaker: 'Rico',
      caption: 'One eyebrow. Amused, but measuring you.',
      clip: {
        assetPath: 'meeting-a-celebrity/pitch-delulu.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0.5, endSec: 5.8 },
        generation: {
          prompt: `${CAST} RICO tilts his head very slightly and one eyebrow rises above the rim of his sunglasses. Nothing else on him moves for a long time. YOU wait. The silence is doing all the work. ${LOOK}`,
          motion: 'Absolutely locked off; only one eyebrow animates, once',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120006,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'rico', expression: 'flat' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'That landed strange. Do you own it?',
      choiceCueAtSec: 4,
      choices: [
        {
          id: 'c-selfaware',
          label: "Okay that was delulu, ignore me. I'm cooked.",
          tone: '(laughing at yourself)',
          nextNodeId: 'photo-op',
          outcome: 'acceptable',
          slangTermIds: ['delulu', 'cooked'],
          feedback:
            'Calling your own bluff converts the cringe into a joke you\u2019re both in on. "Cooked" works because it\u2019s aimed at you.',
        },
        {
          id: 'c-insist',
          label: "I'm serious. Check my numbers.",
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
      speaker: 'Rico',
      caption: 'He half-nods. "Alright." The smoothie is almost done.',
      clip: {
        assetPath: 'meeting-a-celebrity/recover.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} RICO gives one small grudging nod and drains the smoothie with a long loud slurp, watching YOU the entire time. The empty cup is now a countdown. ${LOOK}`,
          motion: 'Flat two-shot, one nod, then total stillness while he drinks',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120007,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'rico', expression: 'neutral' },
          ],
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: "You've got about five seconds of goodwill. Spend them.",
      choiceCueAtSec: 3.2,
      choices: [
        {
          id: 'c-photo-2',
          label: "Can I get one pic? Then I'll let you go.",
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
      speaker: 'Rico',
      caption: 'Shutter. He\u2019s already turning toward the door.',
      clip: {
        assetPath: 'meeting-a-celebrity/photo-op.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 5.6 },
        generation: {
          prompt: `${CAST} YOU and RICO stand shoulder to shoulder facing the camera for a selfie, both perfectly still. A white flash frame. On the very next frame RICO's body has already rotated toward the shop door while YOU are still smiling at the phone. ${LOOK}`,
          motion: 'Hold, one white flash frame, then RICO is instantly facing away',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120008,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'happy' },
            { key: 'rico', expression: 'neutral' },
          ],
          prop: 'phone-raised',
          crowd: true,
        },
      },
      slangTermIds: [],
      prompt: 'Last words. Make them count.',
      choiceCueAtSec: 3.8,
      decisionSeconds: 15,
      timeoutChoiceId: 'c-followback',
      choices: [
        {
          id: 'c-gracious',
          label: 'Appreciate you fr. Enjoy your night.',
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
      caption: 'A hand lands on Rico\u2019s shoulder. "We\u2019re good?"',
      clip: {
        assetPath: 'meeting-a-celebrity/over-ask.mp4',
        mockUrl: DEMO_A,
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} THE MANAGER's arm extends across the frame in one straight jerky motion and lands flat on RICO's shoulder. THE MANAGER looks only at YOU, never at RICO, and does not blink. RICO says nothing. ${LOOK}`,
          motion: 'The arm crosses frame in a single hard movement, then everything stops',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120009,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'neutral' },
            { key: 'rico', expression: 'flat' },
            { key: 'manager', expression: 'angry' },
          ],
          crowd: true,
          gag: 'THE MANAGER',
        },
      },
      slangTermIds: [],
      prompt: 'Walk it back, or stand on business?',
      choiceCueAtSec: 3.2,
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
      speaker: 'Rico',
      caption: '"Aight." He turns. He does not turn back.',
      clip: {
        assetPath: 'meeting-a-celebrity/double-down.mp4',
        mockUrl: DEMO_B,
        trim: { startSec: 0, endSec: 3.6 },
        generation: {
          prompt: `${CAST} RICO's whole body flips to face away on one frame. He drops the empty smoothie cup in a bin without looking and walks off in flat jerky steps. YOU are left alone in frame with the looping pedestrians. ${LOOK}`,
          motion: 'Body flips on one frame, then a repeating two-pose walk out of frame',
          aspectRatio: '9:16',
          durationSec: 4,
          seed: 120010,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'ari', expression: 'flat' },
            { key: 'rico', expression: 'angry' },
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
        trim: { startSec: 0, endSec: 3.4 },
        generation: {
          prompt: `${CAST} SECURITY fills most of the frame, standing directly in front of the camera so RICO is entirely hidden behind him. One enormous flat hand reaches out and covers the lens. YOU look very small beside him. ${LOOK}`,
          motion: 'SECURITY steps in on one cut; the hand covers the lens on the next',
          aspectRatio: '9:16',
          durationSec: 4,
          seed: 120011,
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
        trim: { startSec: 0, endSec: 5.8 },
        generation: {
          prompt: `${CAST} YOU walk away first, grinning, phone lighting up in your hand. RICO glances back over his shoulder once from the shop doorway and nods. THE MANAGER, holding the car door, notices and looks mildly betrayed. ${LOOK}`,
          motion: 'Flat wide, YOU exit one side while RICO nods once from the doorway',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120012,
        },
        art: {
          setting: 'street',
          characters: [
            { key: 'manager', expression: 'flat', back: true },
            { key: 'ari', expression: 'happy' },
            { key: 'rico', expression: 'happy' },
          ],
          prop: 'phone',
          crowd: true,
        },
      },
      slangTermIds: [],
      summary: 'Rico followed you back before he reached the door.',
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
        trim: { startSec: 0, endSec: 4.6 },
        generation: {
          prompt: `${CAST} YOU stand alone on the flat sidewalk staring at a phone showing a good photo and an entirely empty notification list. Pedestrians loop past on both sides without stopping. RICO is gone. ${LOOK}`,
          motion: 'Locked off, only the looping background pedestrians move',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120013,
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
        trim: { startSec: 0.5, endSec: 5.6 },
        generation: {
          prompt: `${CAST} YOU stand alone under a streetlight holding a phone showing an empty grey profile page. Head tilted down. The sidewalk is completely empty now — even the looping pedestrians have stopped. ${LOOK}`,
          motion: 'Static, nothing in frame moves at all',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120014,
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
        trim: { startSec: 0.2, endSec: 4.4 },
        generation: {
          prompt: `${CAST} SECURITY walks YOU away by the elbow in flat jerky steps. Six identical cutout bystanders hold up six phones, all filming YOU rather than RICO, who has already left. ${LOOK}`,
          motion: 'Side-on flat tracking shot past a row of raised phones',
          aspectRatio: '9:16',
          durationSec: 5,
          seed: 120015,
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
        trim: { startSec: 0, endSec: 5.2 },
        generation: {
          prompt: `${CAST} YOU stand alone mid-gesture, still holding up a phone showing an analytics graph, mouth open, frozen in the exact pose that is about to be a sound. A single bystander films from the edge of frame. RICO is nowhere in the shot. ${LOOK}`,
          motion: 'Freeze on the worst possible pose and hold it far too long',
          aspectRatio: '9:16',
          durationSec: 6,
          seed: 120016,
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
