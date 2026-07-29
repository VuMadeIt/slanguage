/** Audio asset-path and URL resolution for timed story lines. */

import { env } from '@/config/env';
import type { AudioTrack } from '@/domain/scenario';

export function getAudioLineAssetPath(
  track: AudioTrack,
  lineIndex: number,
): string {
  const dot = track.assetPath.lastIndexOf('.');
  const stem = dot >= 0 ? track.assetPath.slice(0, dot) : track.assetPath;
  return `${stem}.line-${lineIndex}.mp3`;
}

/**
 * Resolve one line rather than a pre-mixed scene track.
 *
 * In mock mode the secure API route synthesizes authored lines on demand. In
 * CDN mode it points at the per-line files produced by `generate:assets`.
 */
export function resolveAudioLineUrl(
  track: AudioTrack,
  lineIndex: number,
  context: { scenarioId: string; nodeId: string },
): string {
  if (!env.useMockVideos && env.videoBaseUrl) {
    const base = env.videoBaseUrl.replace(/\/+$/, '');
    const path = getAudioLineAssetPath(track, lineIndex).replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  const query = new URLSearchParams({
    scenario: context.scenarioId,
    node: context.nodeId,
    line: String(lineIndex),
  });
  return `/api/story-audio?${query.toString()}`;
}
