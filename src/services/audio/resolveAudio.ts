/**
 * Resolves the audio URL for a clip's dialogue track the same way
 * `resolveClipUrl` resolves video — one place to change when the CDN moves.
 */

import { env } from '@/config/env';
import type { AudioTrack } from '@/domain/scenario';

export function resolveAudioUrl(track: AudioTrack): string | null {
  if (env.useMockVideos) {
    // Mock mode has no generated audio; the player just stays silent.
    return track.mockUrl ?? null;
  }
  if (!env.videoBaseUrl) return track.mockUrl ?? null;
  const base = env.videoBaseUrl.replace(/\/+$/, '');
  const path = track.assetPath.replace(/^\/+/, '');
  return `${base}/${path}`;
}
