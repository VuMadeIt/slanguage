/**
 * Asset generation for Slanguage scenarios.
 *
 * Reads every node's `clip.generation` (Higgsfield) and `clip.audio.lines`
 * (ElevenLabs) and writes files into `public/generated/<assetPath>`. Point
 * NEXT_PUBLIC_VIDEO_BASE_URL at that folder (or upload it to a CDN) and set
 * NEXT_PUBLIC_USE_MOCK_VIDEOS=false to play the real assets.
 *
 * Usage:
 *   npm run generate:assets                              # dry-run
 *   npm run generate:assets -- --run                     # call the APIs
 *   npm run generate:assets -- --run --scenario first-day-of-class
 */

import { config as loadEnv } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
loadEnv({ path: path.join(projectRoot, '.env.local') });
loadEnv({ path: path.join(projectRoot, '.env') });

const args = new Set(process.argv.slice(2));
const shouldRun = args.has('--run');
const scenarioFilter = (() => {
  const index = process.argv.indexOf('--scenario');
  return index >= 0 ? process.argv[index + 1] : null;
})();

async function main() {
  // Dynamic imports AFTER dotenv, because ESM would otherwise hoist the
  // scenario/voice modules and bake in empty env values.
  const { SCENARIOS } = await import('../src/data/scenarios/index');
  const { createElevenLabsService } = await import(
    '../src/services/audio/elevenlabs'
  );
  const { createHiggsfieldService } = await import(
    '../src/services/video/higgsfield'
  );

  const scenarios = SCENARIOS.filter((scenario) =>
    scenarioFilter ? scenario.id === scenarioFilter : true,
  );

  if (scenarios.length === 0) {
    console.error(
      `No scenarios matched${scenarioFilter ? ` "${scenarioFilter}"` : ''}.`,
    );
    process.exit(1);
  }

  const outRoot = path.join(projectRoot, 'public', 'generated');
  console.log(`\nSlanguage asset generation`);
  console.log(
    `  mode:      ${shouldRun ? 'LIVE' : 'dry-run (pass --run to call APIs)'}`,
  );
  console.log(`  scenarios: ${scenarios.map((s) => s.id).join(', ')}`);
  console.log(`  output:    ${outRoot}\n`);

  const eleven = createElevenLabsService();
  const higgs = createHiggsfieldService();

  if (shouldRun) {
    if (!eleven) console.warn('⚠  ELEVENLABS_API_KEY missing — skipping audio.');
    if (!higgs) console.warn('⚠  HIGGSFIELD_API_KEY missing — skipping video.');
  }

  let planned = 0;
  let written = 0;

  for (const scenario of scenarios) {
    for (const node of Object.values(scenario.nodes)) {
      const gen = node.clip.generation;
      if (gen) {
        planned += 1;
        const target = path.join(outRoot, node.clip.assetPath);
        console.log(`▶ video  ${node.clip.assetPath}`);
        console.log(
          `         ${gen.prompt.slice(0, 96).replace(/\s+/g, ' ')}…`,
        );
        if (shouldRun && higgs) {
          const job = await higgs.createJob(gen);
          console.log(`         job ${job.id}`);
          const done = await higgs.waitForJob(job.id);
          if (done.status !== 'succeeded' || !done.videoUrl) {
            console.error(`         FAILED: ${done.error ?? 'no video URL'}`);
          } else {
            const bytes = await (await fetch(done.videoUrl)).arrayBuffer();
            await mkdir(path.dirname(target), { recursive: true });
            await writeFile(target, Buffer.from(bytes));
            written += 1;
            console.log(`         wrote ${target}`);
          }
        }
      }

      const audio = node.clip.audio;
      if (audio?.lines.length) {
        planned += 1;
        const target = path.join(outRoot, audio.assetPath);
        console.log(`♪ audio  ${audio.assetPath}`);
        for (const line of audio.lines) {
          console.log(`         [${line.voice}] ${line.text.slice(0, 72)}`);
        }
        if (shouldRun && eleven) {
          // Multi-line remix is a follow-up; for v1 we write the primary line.
          const primary = audio.lines[0];
          const result = await eleven.synthesize(primary);
          await mkdir(path.dirname(target), { recursive: true });
          await writeFile(target, Buffer.from(result.audio));
          written += 1;
          console.log(`         wrote ${target}`);
        }
      }
    }
  }

  console.log(
    `\nDone. ${
      shouldRun
        ? `Wrote ${written}/${planned} assets.`
        : `Would generate ${planned} assets. Re-run with --run.`
    }\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
