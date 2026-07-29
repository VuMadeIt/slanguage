/**
 * Higgsfield AI text-to-video service.
 *
 * Higgsfield's public surface has shifted as the product matured, so this
 * client is deliberately thin: one create call and one poll. Endpoint paths and
 * the response shape can be adjusted in this file alone when their API moves —
 * the scenario `generation` specs and the `generate:assets` script do not care.
 *
 * Keys stay server-side.
 */

import type { VideoGeneration } from '@/domain/scenario';

export type HiggsfieldJob = {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  videoUrl?: string;
  error?: string;
};

type RawJob = {
  id?: string;
  job_id?: string;
  status?: string;
  state?: string;
  video_url?: string;
  output_url?: string;
  result?: { url?: string; video_url?: string };
  error?: string;
  message?: string;
};

function normalize(raw: RawJob): HiggsfieldJob {
  const id = raw.id ?? raw.job_id;
  if (!id) throw new Error('Higgsfield response missing a job id.');

  const rawStatus = (raw.status ?? raw.state ?? 'queued').toLowerCase();
  let status: HiggsfieldJob['status'] = 'queued';
  if (['running', 'processing', 'in_progress', 'started'].includes(rawStatus)) {
    status = 'running';
  } else if (['succeeded', 'completed', 'done', 'success'].includes(rawStatus)) {
    status = 'succeeded';
  } else if (['failed', 'error', 'cancelled'].includes(rawStatus)) {
    status = 'failed';
  }

  return {
    id,
    status,
    videoUrl:
      raw.video_url ??
      raw.output_url ??
      raw.result?.url ??
      raw.result?.video_url,
    error: raw.error ?? raw.message,
  };
}

export class HiggsfieldService {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = 'https://api.higgsfield.ai/v1',
  ) {}

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async createJob(spec: VideoGeneration): Promise<HiggsfieldJob> {
    const prompt = spec.motion
      ? `${spec.prompt}\n\nCamera / motion: ${spec.motion}`
      : spec.prompt;

    const response = await fetch(`${this.baseUrl}/generations`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        prompt,
        model: spec.model ?? process.env.HIGGSFIELD_MODEL ?? 'default',
        aspect_ratio: spec.aspectRatio ?? '9:16',
        duration: spec.durationSec ?? 5,
        seed: spec.seed,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `Higgsfield create ${response.status}: ${detail || response.statusText}`,
      );
    }

    return normalize((await response.json()) as RawJob);
  }

  async getJob(id: string): Promise<HiggsfieldJob> {
    const response = await fetch(`${this.baseUrl}/generations/${id}`, {
      headers: this.headers(),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `Higgsfield poll ${response.status}: ${detail || response.statusText}`,
      );
    }
    return normalize((await response.json()) as RawJob);
  }

  /** Blocks until the job finishes or the timeout fires. */
  async waitForJob(
    id: string,
    options: { timeoutMs?: number; pollMs?: number } = {},
  ): Promise<HiggsfieldJob> {
    const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
    const pollMs = options.pollMs ?? 4000;
    const started = Date.now();

    for (;;) {
      const job = await this.getJob(id);
      if (job.status === 'succeeded' || job.status === 'failed') return job;
      if (Date.now() - started > timeoutMs) {
        throw new Error(`Higgsfield job ${id} timed out after ${timeoutMs}ms.`);
      }
      await new Promise((resolve) => setTimeout(resolve, pollMs));
    }
  }
}

export function createHiggsfieldService(
  apiKey = process.env.HIGGSFIELD_API_KEY ?? '',
): HiggsfieldService | null {
  if (!apiKey) return null;
  return new HiggsfieldService(
    apiKey,
    process.env.HIGGSFIELD_API_BASE ?? 'https://api.higgsfield.ai/v1',
  );
}
