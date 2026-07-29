/**
 * Designs a distinct, original ElevenLabs voice for every character.
 *
 * Dry-run by default because `--run` consumes ElevenLabs quota and creates
 * account resources.
 *
 *   npm run voices:design
 *   npm run voices:design -- --run
 */
import { config as loadEnv } from 'dotenv';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { VOICE_PERSONAS } from '../src/data/voice-personas';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const envPath = path.join(projectRoot, '.env.local');
loadEnv({ path: envPath });
loadEnv({ path: path.join(projectRoot, '.env') });

const shouldRun = process.argv.includes('--run');

function envName(key: string): string {
  return `ELEVENLABS_VOICE_${key.toUpperCase()}`;
}

function upsertEnv(source: string, name: string, value: string): string {
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  if (pattern.test(source)) return source.replace(pattern, line);
  return `${source.trimEnd()}\n${line}\n`;
}

async function elevenRequest<T>(
  endpoint: string,
  apiKey: string,
  body: object,
): Promise<T> {
  const response = await fetch(`https://api.elevenlabs.io${endpoint}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`ElevenLabs ${response.status}: ${detail}`);
  }
  return (await response.json()) as T;
}

async function main() {
  const missing = Object.values(VOICE_PERSONAS).filter(
    (persona) => !process.env[envName(persona.key)]?.trim(),
  );

  console.log(`\nSlanguage voice design — ${shouldRun ? 'LIVE' : 'dry-run'}\n`);
  if (missing.length === 0) {
    console.log('Every character already has a configured voice id.');
    return;
  }

  for (const persona of missing) {
    console.log(`• ${persona.character}`);
    console.log(`  ${persona.designPrompt}`);
  }

  if (!shouldRun) {
    console.log(
      `\nWould design ${missing.length} original voices. Re-run with --run to create them and update .env.local.`,
    );
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'ELEVENLABS_API_KEY is missing. Add it to .env.local before using --run.',
    );
  }

  let envSource = await readFile(envPath, 'utf8').catch(() => '');

  for (const [index, persona] of missing.entries()) {
    console.log(`\nDesigning ${persona.character}…`);
    const preview = await elevenRequest<{
      previews: { generated_voice_id: string }[];
    }>('/v1/text-to-voice/design', apiKey, {
      voice_description: persona.designPrompt,
      auto_generate_text: true,
      loudness: 0.55,
      guidance_scale: 8,
      quality: 0.8,
      seed: 73000 + index,
    });
    const generatedVoiceId = preview.previews[0]?.generated_voice_id;
    if (!generatedVoiceId) {
      throw new Error(
        `ElevenLabs returned no preview for ${persona.character}.`,
      );
    }

    const created = await elevenRequest<{ voice_id: string }>(
      '/v1/text-to-voice',
      apiKey,
      {
        voice_name: `Slanguage — ${persona.character}`,
        voice_description: persona.description,
        generated_voice_id: generatedVoiceId,
      },
    );
    if (!created.voice_id) {
      throw new Error(
        `ElevenLabs returned no voice id for ${persona.character}.`,
      );
    }

    const name = envName(persona.key);
    envSource = upsertEnv(envSource, name, created.voice_id);
    await writeFile(envPath, envSource, 'utf8');
    console.log(`✓ ${persona.character} saved and ${name} updated`);
  }

  console.log(
    '\nAll character voices created. Run `npm run voices:check` next.',
  );
}

main().catch((error) => {
  console.error(`\n${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
