/**
 * Modular AI service. Story Mode does not use this — it is entirely graph-driven
 * — but Playground does, and the interface is provider-swappable so Claude can
 * be replaced by OpenAI or a self-hosted model without touching the UI.
 */

export type PlaygroundCharacter = {
  id: string;
  name: string;
  vibe: string;
  systemPrompt: string;
};

export type PlaygroundMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type PlaygroundReply = {
  content: string;
  /** Terms the model used that should be auto-saved to the journal. */
  slangTermIds: string[];
  provider: 'mock' | 'claude';
};

export interface PlaygroundService {
  reply(
    character: PlaygroundCharacter,
    history: PlaygroundMessage[],
    userMessage: string,
  ): Promise<PlaygroundReply>;
}

export const DEFAULT_CHARACTER: PlaygroundCharacter = {
  id: 'riley',
  name: 'Riley',
  vibe: 'Chronically online group-chat friend',
  systemPrompt: `You are Riley, a 24-year-old who is extremely online but also genuinely helpful.
Use contemporary internet slang naturally — not in every sentence, and never as a glossary.
When you use a slang term, weave it into normal dialogue.
Keep replies to 2–4 sentences. Be warm, a little chaotic, never preachy.
If the user misuses a term, gently redirect with an example of how it actually lands.`,
};

const MOCK_REPLIES = [
  {
    match: /rizz|flirt|smooth/i,
    content:
      "Okay so 'rizz' is charisma but specifically the flirting kind — and the moment you announce you have rizz is the moment everyone knows you don't. Lowkey just be normal and let it happen.",
    slangTermIds: ['rizz', 'lowkey'],
  },
  {
    match: /mid|mediocre/i,
    content:
      "Calling something 'mid' is a whole verdict. It's not even harsh, that's why it stings — it's just... fine. Don't say it about something someone made unless you're ready to defend that take.",
    slangTermIds: ['mid'],
  },
  {
    match: /ate|crumbs/i,
    content:
      "When someone 'ate,' they absolutely delivered — outfit, take, performance, whatever. 'Left no crumbs' is optional garnish. Use it when you mean it, not as a default compliment.",
    slangTermIds: ['ate'],
  },
  {
    match: /delulu|delusional/i,
    content:
      "Delulu works when you're roasting yourself — 'I'm being delulu but I think we'd vibe.' Say it about someone else and it stops being funny real fast.",
    slangTermIds: ['delulu'],
  },
  {
    match: /cap|lying|lie/i,
    content:
      "'No cap' means you're not lying. 'Cap' is the lie itself. It's from Atlanta rap originally — so yeah, treat it like borrowed language, not something you invented in a group chat.",
    slangTermIds: ['no-cap'],
  },
];

export class MockPlaygroundService implements PlaygroundService {
  async reply(
    _character: PlaygroundCharacter,
    _history: PlaygroundMessage[],
    userMessage: string,
  ): Promise<PlaygroundReply> {
    await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 350));

    const hit = MOCK_REPLIES.find((entry) => entry.match.test(userMessage));
    if (hit) {
      return { content: hit.content, slangTermIds: hit.slangTermIds, provider: 'mock' };
    }

    return {
      content:
        "Say more — give me the situation and I'll tell you how it would actually land. Like, who are you talking to and what's the vibe?",
      slangTermIds: [],
      provider: 'mock',
    };
  }
}

export class ClaudePlaygroundService implements PlaygroundService {
  constructor(private readonly apiKey: string, private readonly model: string) {}

  async reply(
    character: PlaygroundCharacter,
    history: PlaygroundMessage[],
    userMessage: string,
  ): Promise<PlaygroundReply> {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: this.apiKey });

    const response = await client.messages.create({
      model: this.model,
      max_tokens: 300,
      system: `${character.systemPrompt}

After your reply, on a new line write exactly:
SLANG: comma-separated ids from this list only when you used them: ate, no-cap, mid, lowkey, delulu, aura-farming, glaze, fr, the-plug, cooked, chat-is-this-real, its-giving, rizz
If none, write SLANG: none`,
      messages: [
        ...history.map((message) => ({
          role: message.role as 'user' | 'assistant',
          content: message.content,
        })),
        { role: 'user', content: userMessage },
      ],
    });

    const block = response.content.find((item) => item.type === 'text');
    const raw = block && 'text' in block ? block.text : '';
    const slangMatch = raw.match(/SLANG:\s*(.+)$/im);
    const content = raw.replace(/\nSLANG:.+$/im, '').trim();
    const slangTermIds =
      slangMatch && !/none/i.test(slangMatch[1])
        ? slangMatch[1]
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : [];

    return { content, slangTermIds, provider: 'claude' };
  }
}

export function createPlaygroundService(options: {
  provider: 'mock' | 'claude';
  apiKey?: string;
  model?: string;
}): PlaygroundService {
  if (options.provider === 'claude' && options.apiKey) {
    return new ClaudePlaygroundService(
      options.apiKey,
      options.model ?? 'claude-sonnet-4-5',
    );
  }
  return new MockPlaygroundService();
}
