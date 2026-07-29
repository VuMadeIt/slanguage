import { z } from 'zod';

/**
 * Where a term is socially safe. This is the field that makes Slanguage more
 * useful than a dictionary — knowing "mid" means mediocre is easy, knowing you
 * can't say it to someone's face is the actual lesson.
 */
export const slangRegisterSchema = z.enum([
  'online-only',
  'friends',
  'casual-irl',
  'classroom-safe',
  'workplace-safe',
]);

/**
 * Slang decays fast, and freshness is part of the product's appeal — using a
 * dead term is its own kind of mistake. Tagging it lets us surface "trending
 * now" content, warn about terms on the way out, and re-shoot clips when a
 * phrase ages out.
 */
export const slangFreshnessSchema = z.enum([
  /** Peaking right now; expect churn within a year. */
  'trending',
  /** Established and widely understood. */
  'classic',
  /** Still understood, but saying it earns an eye-roll. */
  'fading',
]);

export const slangTermSchema = z.object({
  id: z.string().min(1),
  term: z.string().min(1),
  aliases: z.array(z.string()),
  /** Rough phonetic hint; the voice API will eventually replace this. */
  pronunciation: z.string().min(1),
  definition: z.string().min(1),
  exampleUsage: z.string().min(1),
  /** Where it came from and who owns it — credit matters for AAVE/ballroom terms. */
  culturalContext: z.string().min(1),
  whenToUse: z.string().min(1),
  whenNotToUse: z.string().min(1),
  registers: z.array(slangRegisterSchema),
  freshness: slangFreshnessSchema,
  tags: z.array(z.string()),
});

export type SlangRegister = z.infer<typeof slangRegisterSchema>;
export type SlangFreshness = z.infer<typeof slangFreshnessSchema>;
export type SlangTerm = z.infer<typeof slangTermSchema>;

export const FRESHNESS_LABEL: Record<SlangFreshness, string> = {
  trending: 'Trending now',
  classic: 'Classic',
  fading: 'On the way out',
};
