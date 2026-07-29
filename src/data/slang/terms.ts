import type { SlangTerm } from '@/domain/slang';

/**
 * The term library. Scenarios and the AI Playground reference these by id, so a
 * definition is edited in exactly one place. Ships as a typed module for v1;
 * the shape is CMS-ready when the library outgrows a file.
 *
 * `freshness` is first-class because slang rots: a term marked `fading` is a
 * signal to re-shoot the clip that teaches it.
 */
export const SLANG_TERMS: SlangTerm[] = [
  // --- Hallway essentials ---------------------------------------------------
  {
    id: 'bet',
    term: 'bet',
    aliases: ['aight bet'],
    pronunciation: 'bet',
    definition: 'Yes / agreed / say no more.',
    exampleUsage: '"Meet you by the gym?" "Bet."',
    culturalContext:
      'From Black American English, where betting on something signalled confidence. Now the fastest way to agree without sounding formal.',
    whenToUse:
      'Accepting a plan. It is the single most useful word for sounding normal in a hallway.',
    whenNotToUse:
      'Replying to bad news or anything serious — it reads as flippant.',
    registers: ['friends', 'casual-irl', 'classroom-safe'],
    freshness: 'classic',
    tags: ['agreement', 'essential'],
  },
  {
    id: 'no-cap',
    term: 'no cap',
    aliases: ['cap', 'nocap', 'no 🧢'],
    pronunciation: 'noh KAP',
    definition: "I'm not lying. On its own, \"cap\" means the lie itself.",
    exampleUsage: 'That test was easy, no cap.',
    culturalContext:
      '"Cap" has meant a lie in Southern Black slang for decades; Atlanta rap pushed it global around 2017.',
    whenToUse: 'Marking a claim that sounds exaggerated but is true.',
    whenNotToUse:
      'On a claim nobody doubted — it starts to sound like you lie often.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['sincerity', 'essential'],
  },
  {
    id: 'deadass',
    term: 'deadass',
    aliases: ['deadass fr'],
    pronunciation: 'DED-ass',
    definition: 'Seriously, completely sincere.',
    exampleUsage: "I'm deadass, I studied for six hours.",
    culturalContext:
      'New York City slang, especially Brooklyn and Queens, that spread nationally through drill and TikTok.',
    whenToUse:
      'When someone doubts you and you need one word to settle it.',
    whenNotToUse:
      'Around teachers and parents — the "ass" reads as mild profanity to adults.',
    registers: ['friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['sincerity', 'nyc'],
  },
  {
    id: 'fr',
    term: 'fr',
    aliases: ['frfr', 'for real'],
    pronunciation: 'eff-ARR, or just say "for real"',
    definition: 'For real — sincerity, or a genuine question.',
    exampleUsage: 'Appreciate you fr.',
    culturalContext:
      'Texting shorthand that crossed back into speech, where people now pronounce the letters.',
    whenToUse: 'Closing a sincere statement, or asking "fr?" to confirm.',
    whenNotToUse:
      'Stacked on every sentence — it stops reading as sincere and becomes filler.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['sincerity', 'texting'],
  },
  {
    id: 'lowkey',
    term: 'lowkey',
    aliases: ['low-key', 'highkey'],
    pronunciation: 'LOH-kee',
    definition:
      'Slightly, secretly, or a little embarrassed to admit it. "Highkey" is the opposite.',
    exampleUsage: "I'm lowkey nervous about this.",
    culturalContext:
      'Originally "keep it low-key" — do it quietly. It softened into a hedge that makes an admission feel casual.',
    whenToUse:
      'Confessing something mildly vulnerable without making it heavy. Perfect for a first day.',
    whenNotToUse:
      'When you mean something strongly — hedging a real compliment makes it sound fake.',
    registers: ['online-only', 'friends', 'casual-irl', 'classroom-safe'],
    freshness: 'classic',
    tags: ['hedge', 'tone', 'essential'],
  },
  {
    id: 'bruh',
    term: 'bruh',
    aliases: ['bruv', 'bro'],
    pronunciation: 'bruh',
    definition: 'Expression of disbelief, disappointment, or mild annoyance.',
    exampleUsage: 'Bruh. The homework was due today?',
    culturalContext:
      'A worn-down "brother" that stopped being a noun and became a sigh you can type.',
    whenToUse:
      'Reacting to something dumb. Works addressed to nobody in particular.',
    whenNotToUse:
      'To a teacher, or as a way to address someone who has told you they dislike it.',
    registers: ['friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['reaction', 'essential'],
  },

  // --- Praise ---------------------------------------------------------------
  {
    id: 'ate',
    term: 'ate',
    aliases: ['ate and left no crumbs'],
    pronunciation: 'ayt',
    definition: 'Performed something flawlessly.',
    exampleUsage: 'She ate that presentation and left no crumbs.',
    culturalContext:
      'From Black queer and ballroom culture, carried into the mainstream by drag and then TikTok. Borrowed language, not invented online.',
    whenToUse:
      'Praising a performance, an outfit, a take — anything executed with confidence.',
    whenNotToUse:
      'Never in formal writing, and never about food, where it just sounds confusing.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'trending',
    tags: ['praise', 'ballroom'],
  },
  {
    id: 'slay',
    term: 'slay',
    aliases: ['slayed', 'slaying'],
    pronunciation: 'slay',
    definition: 'You did great — often about style or confidence.',
    exampleUsage: 'New haircut? Slay.',
    culturalContext:
      'Ballroom and drag vocabulary again, then absorbed so completely by brands that some people now use it ironically.',
    whenToUse: 'Quick, warm encouragement.',
    whenNotToUse:
      'In a corporate voice or to sound young on purpose — that is exactly where it turns cringe.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'fading',
    tags: ['praise', 'ballroom'],
  },
  {
    id: 'cook',
    term: 'cook',
    aliases: ['cooking', 'let him cook'],
    pronunciation: 'kuuk',
    definition: 'To be doing something impressively well, in progress.',
    exampleUsage: "Don't interrupt her, she's cooking.",
    culturalContext:
      'Gaming and basketball commentary, where a hot streak is "cooking". "Let him cook" means stop interfering.',
    whenToUse: 'Praising someone mid-effort, before the result is in.',
    whenNotToUse:
      'Confusing it with "cooked", which is the opposite and means doomed.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'trending',
    tags: ['praise', 'gaming'],
  },
  {
    id: 'understood-the-assignment',
    term: 'understood the assignment',
    aliases: ['understood the assignment fr'],
    pronunciation: 'un-der-STOOD the a-SSIGN-ment',
    definition: 'Did exactly what the moment called for, and did it well.',
    exampleUsage: 'Everyone dressed up but he understood the assignment.',
    culturalContext:
      'From a viral 2021 Twitter and TikTok phrasing about award-show outfits; the school-literal meaning is a coincidence people enjoy.',
    whenToUse:
      'Praising someone who read a situation correctly, not just someone who worked hard.',
    whenNotToUse:
      'About literal homework, unless you are making the joke on purpose.',
    registers: ['online-only', 'friends', 'casual-irl', 'classroom-safe'],
    freshness: 'classic',
    tags: ['praise'],
  },
  {
    id: 'bussin',
    term: "bussin'",
    aliases: ['bussin bussin'],
    pronunciation: 'BUSS-in',
    definition: 'Really good — almost always about food.',
    exampleUsage: 'The cafeteria pizza is actually bussin today.',
    culturalContext:
      'Black American English, popularised by food TikTok. Widely mocked when used by people performing slang.',
    whenToUse: 'Genuinely good food.',
    whenNotToUse:
      'About non-food things, where it sounds like you learned slang from a commercial.',
    registers: ['friends', 'casual-irl'],
    freshness: 'fading',
    tags: ['food', 'praise'],
  },
  {
    id: 'drip',
    term: 'drip',
    aliases: ['dripped out', 'drippy'],
    pronunciation: 'drip',
    definition: 'Stylish clothing, a strong outfit.',
    exampleUsage: 'Those shoes are serious drip.',
    culturalContext:
      'Hip-hop fashion vocabulary from the mid-2010s, now the default word for looking expensive on purpose.',
    whenToUse: 'Complimenting what someone is wearing.',
    whenNotToUse:
      'About anything not visual — drip is strictly about appearance.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['fashion', 'praise'],
  },
  {
    id: 'glow-up',
    term: 'glow up',
    aliases: ['glowed up'],
    pronunciation: 'GLOH-up',
    definition: 'A dramatic positive transformation, usually over time.',
    exampleUsage: 'Summer glow up is real, I did not recognise him.',
    culturalContext:
      'From a Chief Keef lyric, then years of before-and-after photo posts.',
    whenToUse: 'Praising visible growth or improvement.',
    whenNotToUse:
      'In a way that insults the "before" — that turns a compliment into a backhanded one.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['praise', 'transformation'],
  },

  // --- Judgement and risk --------------------------------------------------
  {
    id: 'mid',
    term: 'mid',
    aliases: [],
    pronunciation: 'mid',
    definition: 'Mediocre. Not terrible, which is the insult.',
    exampleUsage: 'The remix is fine, the original was mid.',
    culturalContext:
      'Gaming and rap-forum shorthand that became a general dismissal. Its power comes from being lukewarm rather than harsh.',
    whenToUse: 'Ranking things among friends who enjoy arguing about taste.',
    whenNotToUse:
      "About something the person you're talking to made. It reads as a verdict, not a joke.",
    registers: ['online-only', 'friends'],
    freshness: 'classic',
    tags: ['criticism', 'risky'],
  },
  {
    id: 'sus',
    term: 'sus',
    aliases: ['suspect'],
    pronunciation: 'suss',
    definition: 'Suspicious, sketchy, not adding up.',
    exampleUsage: 'He said he finished already? That is sus.',
    culturalContext:
      'Short for suspicious in British and Black slang for decades, then rocket-fuelled by the game Among Us in 2020.',
    whenToUse: 'Playfully doubting a story.',
    whenNotToUse:
      'As a real accusation — the Among Us association makes serious use sound like a joke.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['doubt', 'gaming'],
  },
  {
    id: 'cringe',
    term: 'cringe',
    aliases: ['cringey'],
    pronunciation: 'crinj',
    definition: 'Embarrassing to witness.',
    exampleUsage: 'The assembly icebreaker was pure cringe.',
    culturalContext:
      'Reddit and forum vocabulary that turned a physical reaction into a category of content.',
    whenToUse: 'Describing a situation, especially one you also suffered in.',
    whenNotToUse:
      'Aimed at a person trying something sincerely — that is how you become the villain of the story.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['criticism'],
  },
  {
    id: 'big-yikes',
    term: 'big yikes',
    aliases: ['yikes'],
    pronunciation: 'big YIKES',
    definition: 'Strong secondhand embarrassment.',
    exampleUsage: 'He called the teacher "mom". Big yikes.',
    culturalContext:
      'An intensified "yikes" from Twitter, used to react without insulting anyone directly.',
    whenToUse: 'Reacting to a situation rather than attacking a person.',
    whenNotToUse:
      "To someone's face right after they did the embarrassing thing.",
    registers: ['online-only', 'friends'],
    freshness: 'classic',
    tags: ['reaction', 'criticism'],
  },
  {
    id: 'cooked',
    term: 'cooked',
    aliases: ['we are so cooked'],
    pronunciation: 'kuukt',
    definition: 'Finished, doomed, beyond saving. The opposite of "cooking".',
    exampleUsage: 'Pop quiz? I am cooked.',
    culturalContext:
      'Australian slang amplified by gaming streams, now the default reaction to any small disaster.',
    whenToUse: 'Comic self-assessment right after something goes wrong for you.',
    whenNotToUse:
      "About someone else's real crisis — it turns their problem into your joke.",
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'trending',
    tags: ['reaction', 'humor'],
  },
  {
    id: 'salty',
    term: 'salty',
    aliases: [],
    pronunciation: 'SAWL-tee',
    definition: 'Bitter or annoyed, usually about losing.',
    exampleUsage: 'He is still salty about the group project grade.',
    culturalContext:
      'Naval and gaming slang for sore losers, mainstream since the early 2010s.',
    whenToUse: 'Teasing someone gently about holding a grudge.',
    whenNotToUse:
      'When the person has a legitimate complaint — calling it saltiness dismisses it.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['emotion', 'criticism'],
  },
  {
    id: 'extra',
    term: 'extra',
    aliases: ['doing too much'],
    pronunciation: 'EK-struh',
    definition: 'Over the top, more dramatic than the moment needed.',
    exampleUsage: 'Bringing a speaker to homeroom is extra.',
    culturalContext:
      'Black American English, spread widely by reality TV commentary.',
    whenToUse: 'Naming an overreaction, affectionately.',
    whenNotToUse:
      "About someone's genuine enthusiasm — it teaches them to shrink.",
    registers: ['friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['criticism', 'tone'],
  },

  // --- Social status -------------------------------------------------------
  {
    id: 'rizz',
    term: 'rizz',
    aliases: ['rizzed up', 'unspoken rizz'],
    pronunciation: 'riz',
    definition: 'Charisma, specifically the flirting kind.',
    exampleUsage: 'He talked his way out of detention on pure rizz.',
    culturalContext:
      "Clipped from charisma by streamer Kai Cenat's circle, then named Oxford word of the year in 2023.",
    whenToUse: "Complimenting or roasting someone's social smoothness.",
    whenNotToUse:
      "Announcing your own rizz. Claiming it is the fastest way to prove you don't have it.",
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'trending',
    tags: ['charisma', 'status'],
  },
  {
    id: 'aura-farming',
    term: 'aura farming',
    aliases: ['aura points', 'aura'],
    pronunciation: 'OR-uh FAR-ming',
    definition:
      'Doing something purely to look effortlessly cool. Aura points are gained or lost by how you handle a moment.',
    exampleUsage: 'He caught the pen behind his back. Aura points.',
    culturalContext:
      'Anime-fandom framing of charisma as a stat you grind, which blew up on TikTok in 2024–25.',
    whenToUse:
      'Teasing a performance of coolness — including your own, which defuses it.',
    whenNotToUse:
      'About genuine confidence, where it reads as an accusation of being fake.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['status', 'humor'],
  },
  {
    id: 'sigma',
    term: 'sigma',
    aliases: ['sigma male', 'sigma grindset'],
    pronunciation: 'SIG-muh',
    definition: 'Someone admired as an independent lone wolf.',
    exampleUsage: 'Eating lunch alone reading a book? Sigma behaviour.',
    culturalContext:
      'Born from pseudo-scientific "alpha male" internet hierarchies, now used almost entirely as a joke by younger teens.',
    whenToUse:
      'Ironically, about someone doing their own thing without caring.',
    whenNotToUse:
      'Sincerely as self-description — the sincere version comes from a genuinely unpleasant corner of the internet.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['status', 'ironic', 'risky'],
  },
  {
    id: 'main-character',
    term: 'main character',
    aliases: ['main character energy'],
    pronunciation: 'mayn KAR-ik-ter',
    definition: 'Acting like the confident centre of the story.',
    exampleUsage: 'She walked in late with sunglasses on, main character energy.',
    culturalContext:
      'A 2020 TikTok idea about romanticising your own life, which flipped into an insult for self-absorption.',
    whenToUse: 'Complimenting someone owning a moment.',
    whenNotToUse:
      'When you mean selfish — say that instead, because the compliment reading will be assumed.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['status', 'identity'],
  },
  {
    id: 'npc',
    term: 'NPC',
    aliases: ['npc behaviour'],
    pronunciation: 'en-pee-SEE',
    definition:
      'Someone acting robotic or scripted, like a background video-game character.',
    exampleUsage: 'He says the exact same thing every morning, full NPC.',
    culturalContext:
      'Gaming term for non-player character, turned into a way to call someone unremarkable.',
    whenToUse:
      'Self-deprecatingly, or about a routine rather than about a person.',
    whenNotToUse:
      'About a real classmate. It is a way of saying someone does not matter, and it lands hard.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['gaming', 'insult', 'risky'],
  },
  {
    id: 'clout',
    term: 'clout',
    aliases: ['clout chasing'],
    pronunciation: 'klowt',
    definition: 'Social influence or status, especially online.',
    exampleUsage: 'He only posted it for clout.',
    culturalContext:
      'An old word for influence that hip-hop re-pointed at internet fame.',
    whenToUse: 'Talking about why someone wants attention.',
    whenNotToUse:
      'As an accusation without proof — "clout chasing" is a real reputation hit.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['status'],
  },
  {
    id: 'flex',
    term: 'flex',
    aliases: ['flexing', 'weird flex'],
    pronunciation: 'fleks',
    definition: 'To show off.',
    exampleUsage: 'Bringing your own laptop charger is a weird flex but ok.',
    culturalContext:
      'Muscle-flexing as bragging, standard in hip-hop since the 1990s.',
    whenToUse:
      'Naming a brag, or admitting your own with "not to flex, but".',
    whenNotToUse:
      'About something someone needs rather than something they chose.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['status'],
  },

  // --- Group dynamics -----------------------------------------------------
  {
    id: 'vibe-check',
    term: 'vibe check',
    aliases: ['vibes', 'vibe'],
    pronunciation: 'VYBE chek',
    definition: "A quick read of someone's mood or energy.",
    exampleUsage: 'Vibe check — is everyone okay with this plan?',
    culturalContext:
      'A 2019 meme about being caught out, softened into a genuine way to ask how a room feels.',
    whenToUse: 'Checking in without making it a big conversation.',
    whenNotToUse:
      'To pressure someone into performing that they are fine.',
    registers: ['online-only', 'friends', 'casual-irl', 'classroom-safe'],
    freshness: 'classic',
    tags: ['social', 'essential'],
  },
  {
    id: 'fanum-tax',
    term: 'fanum tax',
    aliases: ['taxed'],
    pronunciation: 'FAY-num tax',
    definition: "Taking a portion of someone's food as a friendly toll.",
    exampleUsage: 'He fanum taxed half my fries.',
    culturalContext:
      'Named after streamer Fanum, who kept stealing food on Kai Cenat\u2019s streams. Peak 2023–24 middle-school vocabulary.',
    whenToUse:
      'Joking with a friend who is comfortable enough to share food.',
    whenNotToUse:
      "Actually taking a stranger's food. The joke only works when the friendship is already there.",
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['food', 'humor', 'streaming'],
  },
  {
    id: 'tea',
    term: 'tea',
    aliases: ['spill the tea', 'no tea no shade'],
    pronunciation: 'tee',
    definition: 'Gossip, or the truth of a situation.',
    exampleUsage: 'What is the tea about the schedule change?',
    culturalContext:
      'Black drag culture, where "T" meant truth. Spilling it means sharing.',
    whenToUse: 'Asking for the story in a light way.',
    whenNotToUse:
      'About something private or harmful — that is not tea, that is a rumour.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['gossip', 'ballroom'],
  },
  {
    id: 'ghost',
    term: 'ghost',
    aliases: ['ghosted', 'ghosting'],
    pronunciation: 'gohst',
    definition: 'To suddenly stop replying to someone with no explanation.',
    exampleUsage: 'I asked about the group chat and he ghosted me.',
    culturalContext:
      'Online-dating vocabulary from the 2010s that spread to every kind of relationship.',
    whenToUse: 'Describing a disappearance, including your own.',
    whenNotToUse:
      'About someone who was simply busy for a day — it accuses them of a choice.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['social'],
  },
  {
    id: 'w-l',
    term: 'W / L',
    aliases: ['dub', 'taking the L', 'big W'],
    pronunciation: 'dub / ell',
    definition: 'A win or a loss. "Take the L" means accept the loss.',
    exampleUsage: 'Free period instead of a quiz? Massive W.',
    culturalContext:
      'Sports box scores, adopted by gaming and then by everyone as a way to score daily life.',
    whenToUse: 'Scoring an outcome quickly and lightly.',
    whenNotToUse:
      "Calling someone else an L. Applied to a person it means they're a failure.",
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'classic',
    tags: ['outcome', 'essential'],
  },
  {
    id: 'yeet',
    term: 'yeet',
    aliases: ['yeeted'],
    pronunciation: 'yeet',
    definition: 'To throw something hard, or a shout of excitement.',
    exampleUsage: 'He yeeted his bag across the room.',
    culturalContext:
      'A 2014 dance and Vine shout that became a verb. Now firmly the older sibling of current slang.',
    whenToUse: 'Comic physical description.',
    whenNotToUse:
      'To sound current — this one dates you, which can be the joke if you know it.',
    registers: ['online-only', 'friends'],
    freshness: 'fading',
    tags: ['action', 'humor'],
  },

  // --- Chaos vocabulary ---------------------------------------------------
  {
    id: 'skibidi',
    term: 'skibidi',
    aliases: ['skibidi toilet'],
    pronunciation: 'SKIB-uh-dee',
    definition:
      'Nonsense word from a viral YouTube series. Means almost nothing, which is the point.',
    exampleUsage: 'What is this skibidi schedule?',
    culturalContext:
      'From the Skibidi Toilet animation series. Strongly associated with younger teens, and used by older ones mainly to mock them.',
    whenToUse:
      'As deliberate nonsense with people who find it funny.',
    whenNotToUse:
      'Trying to sound fluent. Adults using it reads as a parent quoting a meme.',
    registers: ['online-only', 'friends'],
    freshness: 'fading',
    tags: ['nonsense', 'meme', 'risky'],
  },
  {
    id: 'gyatt',
    term: 'gyatt',
    aliases: ['gyat'],
    pronunciation: 'gyat',
    definition: 'A loud exclamation of surprise, usually at someone attractive.',
    exampleUsage: 'Gyatt — that entrance was something.',
    culturalContext:
      'A drawn-out "god damn" from streaming culture. Almost always about bodies.',
    whenToUse: 'Honestly, rarely. Among close friends who are joking.',
    whenNotToUse:
      'At school, about a classmate, or out loud near an adult. It sexualises whoever it is aimed at and gets people in real trouble.',
    registers: ['online-only'],
    freshness: 'trending',
    tags: ['exclamation', 'risky', 'nsfw-adjacent'],
  },
  {
    id: 'delulu',
    term: 'delulu',
    aliases: ['delulu is the solulu'],
    pronunciation: 'duh-LOO-loo',
    definition: 'Delusional, said affectionately and usually about yourself.',
    exampleUsage: "I'm being delulu but I think I aced that.",
    culturalContext:
      'Coined in K-pop stan communities to mock parasocial fantasies, then reclaimed as self-aware optimism.',
    whenToUse:
      'Naming your own unrealistic hope, which makes it charming instead of alarming.',
    whenNotToUse:
      'Calling someone else delulu about something they are serious about.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['self-aware', 'humor'],
  },
  {
    id: 'glaze',
    term: 'glaze',
    aliases: ['glazing', 'glazer'],
    pronunciation: 'glayz',
    definition: 'Praising someone so hard it gets embarrassing.',
    exampleUsage: 'The whole class is glazing him for one right answer.',
    culturalContext:
      'Streaming-chat slang for sycophancy. Being called a glazer is worse than being wrong.',
    whenToUse: 'Calling out praise that has lost all perspective.',
    whenNotToUse:
      'About someone being sincerely kind — it punishes them for it.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['criticism', 'streaming'],
  },
  {
    id: 'its-giving',
    term: "it's giving",
    aliases: ['giving'],
    pronunciation: 'its GIH-ving',
    definition: 'It evokes or reads as ___.',
    exampleUsage: "It's giving first-day-of-school energy.",
    culturalContext:
      'Ballroom and drag commentary ("giving face") that TikTok turned into a comparison template.',
    whenToUse: 'Describing a vibe by naming what it resembles.',
    whenNotToUse:
      'When you need to be specific — it can dodge the actual compliment.',
    registers: ['online-only', 'friends', 'casual-irl'],
    freshness: 'trending',
    tags: ['vibe', 'ballroom'],
  },
  {
    id: 'chat-is-this-real',
    term: 'chat, is this real?',
    aliases: ['chat?'],
    pronunciation: 'chat, iz this REEL',
    definition:
      'A surreal-moment reaction, said as if narrating to a livestream audience.',
    exampleUsage: 'We get to leave early? Chat, is this real?',
    culturalContext:
      'Twitch streamers talk to "chat" constantly; saying it out loud with no stream running is the joke.',
    whenToUse: 'Something genuinely unbelievable is happening.',
    whenNotToUse:
      'Shouted at the person you are reacting to — it turns them into content.',
    registers: ['online-only', 'friends'],
    freshness: 'trending',
    tags: ['streaming', 'reaction', 'risky'],
  },
  {
    id: 'the-plug',
    term: 'the plug',
    aliases: ['plugged in'],
    pronunciation: 'thuh PLUHG',
    definition: 'The person with access or connections.',
    exampleUsage: 'Talk to Dee, she is the plug for tickets.',
    culturalContext:
      'Came out of drug-trade vocabulary in rap, generalised into any hookup. That origin still colours it.',
    whenToUse: 'Crediting someone who can actually get you something.',
    whenNotToUse:
      'Claiming it about yourself to a stranger. It sounds like a hustle.',
    registers: ['online-only', 'friends'],
    freshness: 'classic',
    tags: ['status', 'risky'],
  },
];

export const SLANG_TERMS_BY_ID: Record<string, SlangTerm> = Object.fromEntries(
  SLANG_TERMS.map((term) => [term.id, term]),
);

export function getSlangTerm(id: string): SlangTerm | undefined {
  return SLANG_TERMS_BY_ID[id];
}
