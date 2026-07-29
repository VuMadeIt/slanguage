/**
 * Server-only configuration. Importing this from a client component is a bug —
 * these values must never reach the browser bundle.
 */

export const serverEnv = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5',
} as const;

export function hasAnthropicCredentials(): boolean {
  return serverEnv.anthropicApiKey.length > 0;
}
