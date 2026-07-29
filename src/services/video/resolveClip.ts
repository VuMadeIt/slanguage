import { env } from '@/config/env';
import type { VideoClip } from '@/domain/scenario';

/**
 * The single place a clip becomes a URL. Everything downstream (player,
 * preloader, posters) goes through here, so migrating from stock stand-ins to a
 * real CDN — or to signed URLs, or to HLS manifests — is a change to this file
 * and nothing else.
 */
export function resolveClipUrl(clip: VideoClip): string {
  if (env.useMockVideos && clip.mockUrl) return clip.mockUrl;

  if (env.videoBaseUrl) {
    const base = env.videoBaseUrl.replace(/\/+$/, '');
    const path = clip.assetPath.replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  // No CDN configured and no stand-in: fail loudly rather than render a black box.
  if (clip.mockUrl) return clip.mockUrl;
  throw new Error(
    `Cannot resolve "${clip.assetPath}": set NEXT_PUBLIC_VIDEO_BASE_URL or give the clip a mockUrl.`,
  );
}

export function resolvePosterUrl(clip: VideoClip): string | undefined {
  return clip.posterUrl;
}
