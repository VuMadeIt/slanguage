/**
 * Public (client-safe) configuration. Anything secret belongs in `server-env.ts`.
 *
 * Video assets are never bundled: every clip is addressed as
 * `${videoBaseUrl}/${clip.assetPath}`. Until real footage exists, mock mode
 * falls back to each clip's `mockUrl` so the branching engine is fully
 * demoable against public stock video.
 */

export const env = {
  /** CDN / bucket origin that serves the scenario video library. */
  videoBaseUrl: process.env.NEXT_PUBLIC_VIDEO_BASE_URL ?? '',

  /** When true, clips resolve to their `mockUrl` stock footage instead of the CDN. */
  useMockVideos: (process.env.NEXT_PUBLIC_USE_MOCK_VIDEOS ?? 'true') !== 'false',

  /**
   * Draw un-generated beats as cutout art instead of stock footage.
   *
   * On by default: a placeholder that depicts the actual beat sells the
   * branching far better than the same unrelated stock clip on every node. Set
   * to `false` to force the real video path (useful for testing preloading).
   */
  useSceneArt: (process.env.NEXT_PUBLIC_USE_SCENE_ART ?? 'true') !== 'false',

  /** `mock` keeps AI Playground offline-friendly; `claude` proxies through /api/playground. */
  aiProvider: (process.env.NEXT_PUBLIC_AI_PROVIDER ?? 'mock') as 'mock' | 'claude',

  /** Dev-only affordances in the Story player (node jumping, graph debug panel). */
  showStoryDevTools:
    (process.env.NEXT_PUBLIC_SHOW_STORY_DEVTOOLS ?? 'true') !== 'false',
} as const;
