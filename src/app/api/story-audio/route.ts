import { getScenario } from '@/data/scenarios';
import { createElevenLabsService } from '@/services/audio/elevenlabs';

/**
 * Generates one authored story line on demand.
 *
 * The client sends identifiers, never arbitrary text or a voice id. Looking the
 * line up in the scenario prevents this endpoint from becoming an open TTS
 * proxy while still making mock/cutout mode audible before batch assets exist.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const scenarioId = params.get('scenario') ?? '';
  const nodeId = params.get('node') ?? '';
  const lineIndex = Number(params.get('line'));

  if (!scenarioId || !nodeId || !Number.isInteger(lineIndex) || lineIndex < 0) {
    return Response.json(
      { error: 'A valid scenario, node and line index are required.' },
      { status: 400 },
    );
  }

  const scenario = getScenario(scenarioId);
  const node = scenario?.nodes[nodeId];
  const line = node?.clip.audio?.lines[lineIndex];

  if (!scenario || !node || !line) {
    return Response.json({ error: 'Story line not found.' }, { status: 404 });
  }

  const eleven = createElevenLabsService();
  if (!eleven) {
    return Response.json(
      {
        error:
          'ElevenLabs is not configured. Add ELEVENLABS_API_KEY and character voice IDs to .env.local.',
        fallback: 'browser-speech',
      },
      { status: 503 },
    );
  }

  try {
    const result = await eleven.synthesize(line);
    return new Response(result.audio, {
      headers: {
        'Content-Type': result.contentType,
        // Authored dialogue is immutable until the deployed scenario changes.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Slanguage-Voice': result.voice.key,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TTS failed.';
    console.error(
      `[story-audio:${scenarioId}/${nodeId}/${lineIndex}]`,
      message,
    );
    return Response.json(
      { error: message, fallback: 'browser-speech' },
      { status: 502 },
    );
  }
}
