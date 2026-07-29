/**
 * Validates ElevenLabs before a generation run without printing secrets.
 *
 * It checks the API key, selected model, every character voice id, and confirms
 * each id is visible to the current account.
 */
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
loadEnv({ path: path.join(projectRoot, '.env.local') });
loadEnv({ path: path.join(projectRoot, '.env') });

type ElevenVoice = { voice_id: string; name: string };
type ElevenModel = {
  model_id: string;
  can_do_text_to_speech: boolean;
  can_use_style: boolean;
  can_use_speaker_boost: boolean;
};

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'ELEVENLABS_API_KEY is missing. Copy .env.example to .env.local and add your key.',
    );
  }

  const headers = { 'xi-api-key': apiKey };
  const [voicesResponse, modelsResponse] = await Promise.all([
    fetch('https://api.elevenlabs.io/v1/voices', { headers }),
    fetch('https://api.elevenlabs.io/v1/models', { headers }),
  ]);

  if (!voicesResponse.ok) {
    throw new Error(
      `ElevenLabs key check failed (${voicesResponse.status}). Verify the key and account access.`,
    );
  }
  if (!modelsResponse.ok) {
    throw new Error(
      `Could not list ElevenLabs models (${modelsResponse.status}).`,
    );
  }

  const { voices } = (await voicesResponse.json()) as { voices: ElevenVoice[] };
  const models = (await modelsResponse.json()) as ElevenModel[];
  const { VOICES } = await import('../src/data/voices');

  const modelId = process.env.ELEVENLABS_MODEL ?? 'eleven_v3';
  const model = models.find((candidate) => candidate.model_id === modelId);
  if (!model?.can_do_text_to_speech) {
    throw new Error(
      `ELEVENLABS_MODEL="${modelId}" is unavailable for text-to-speech on this account.`,
    );
  }

  console.log(`✓ API key valid`);
  console.log(
    `✓ model ${modelId} (style=${model.can_use_style}, speakerBoost=${model.can_use_speaker_boost})`,
  );

  let missing = 0;
  for (const profile of Object.values(VOICES)) {
    const id = profile.elevenLabsVoiceId.trim();
    const match = voices.find((voice) => voice.voice_id === id);
    if (!id || id.startsWith('REPLACE_')) {
      missing += 1;
      console.error(
        `✗ ${profile.character}: set ELEVENLABS_VOICE_${profile.key.toUpperCase()}`,
      );
    } else if (!match) {
      missing += 1;
      console.error(
        `✗ ${profile.character}: configured voice id is not visible to this account`,
      );
    } else {
      console.log(`✓ ${profile.character}: ${match.name}`);
    }
  }

  if (missing > 0) {
    throw new Error(
      `${missing} character voice${missing === 1 ? '' : 's'} need configuration.`,
    );
  }

  console.log('\nElevenLabs is ready for every authored character.');
}

main().catch((error) => {
  console.error(`\n${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
