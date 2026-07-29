import { NextResponse } from 'next/server';

import { serverEnv, hasAnthropicCredentials } from '@/config/server-env';
import {
  createPlaygroundService,
  DEFAULT_CHARACTER,
  type PlaygroundMessage,
} from '@/services/ai/playground';

export const runtime = 'nodejs';

type Body = {
  message: string;
  history?: PlaygroundMessage[];
  characterId?: string;
};

/**
 * Server-side proxy so the Anthropic key never reaches the browser. The client
 * always hits this route; which provider answers is an env decision.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const useClaude = hasAnthropicCredentials();
  const service = createPlaygroundService({
    provider: useClaude ? 'claude' : 'mock',
    apiKey: serverEnv.anthropicApiKey,
    model: serverEnv.anthropicModel,
  });

  try {
    const reply = await service.reply(
      DEFAULT_CHARACTER,
      body.history ?? [],
      message,
    );
    return NextResponse.json(reply);
  } catch (error) {
    console.error('[playground]', error);
    return NextResponse.json(
      { error: 'Playground request failed.' },
      { status: 500 },
    );
  }
}
