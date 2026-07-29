/**
 * ElevenLabs text-to-speech service.
 *
 * Dialogue is a separate layer from video because Higgsfield returns silent
 * clips. Keeping them separate also means a slang term can be re-recorded after
 * it ages out without re-shooting anything.
 *
 * Keys stay server-side — this module is imported by the generation script and
 * by the `/api/tts` route, never by client components.
 */

import { getVoice, type VoiceProfile } from '@/data/voices';
import type { VoiceLine } from '@/domain/scenario';

export type TtsResult = {
  audio: ArrayBuffer;
  contentType: string;
  voice: VoiceProfile;
  text: string;
};

export class ElevenLabsService {
  constructor(
    private readonly apiKey: string,
    private readonly modelId = 'eleven_multilingual_v2',
  ) {}

  async synthesize(line: VoiceLine): Promise<TtsResult> {
    const voice = getVoice(line.voice);
    if (!voice) {
      throw new Error(`Unknown voice key "${line.voice}". Add it to data/voices.ts.`);
    }
    if (voice.elevenLabsVoiceId.startsWith('REPLACE_')) {
      throw new Error(
        `Voice "${voice.key}" has no ElevenLabs id. Set ELEVENLABS_VOICE_${voice.key.toUpperCase()} or edit data/voices.ts.`,
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.elevenLabsVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: line.text,
          model_id: this.modelId,
          voice_settings: {
            stability: voice.settings.stability,
            similarity_boost: voice.settings.similarityBoost,
            style: voice.settings.style,
            use_speaker_boost: voice.settings.speakerBoost,
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `ElevenLabs ${response.status}: ${detail || response.statusText}`,
      );
    }

    return {
      audio: await response.arrayBuffer(),
      contentType: response.headers.get('content-type') ?? 'audio/mpeg',
      voice,
      text: line.text,
    };
  }
}

export function createElevenLabsService(
  apiKey = process.env.ELEVENLABS_API_KEY ?? '',
): ElevenLabsService | null {
  if (!apiKey) return null;
  return new ElevenLabsService(
    apiKey,
    process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2',
  );
}
