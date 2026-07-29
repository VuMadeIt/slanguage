/**
 * Rasterises scene art to PNG for eyeballing without a browser.
 *
 * Cutout art is the one part of this codebase that cannot be verified by types
 * or tests — geometry either reads as a kid standing in a room or it does not.
 *
 *   npx tsx scripts/preview-scene-art.tsx [nodeId ...]
 *
 * Writes to .preview/. Defaults to one node per setting.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';

import { CutoutScene } from '../src/features/story/components/CutoutScene';
import { SCENARIOS } from '../src/data/scenarios';
import { resolveSceneArt, resolveSpeakingKey } from '../src/features/story/lib/resolveSceneArt';

const OUT_DIR = join(process.cwd(), '.preview');

const DEFAULTS = [
  'homeroom',
  'cringe-silence',
  'priya-intro',
  'priya-skeptical',
  'lunch-table',
  'npc-arc',
  'over-ask',
];

async function main() {
  const wanted = process.argv.slice(2);
  const targets = wanted.length > 0 ? wanted : DEFAULTS;
  mkdirSync(OUT_DIR, { recursive: true });

  for (const scenario of SCENARIOS) {
    for (const nodeId of targets) {
      const node = scenario.nodes[nodeId];
      if (!node) continue;

      const markup = renderToStaticMarkup(
        React.createElement(CutoutScene, {
          art: resolveSceneArt(scenario, node),
          speakingKey: resolveSpeakingKey(node),
        }),
      );

      // The component sizes itself via CSS in the app; give the standalone
      // render an explicit phone-shaped canvas instead.
      const svg = markup.replace(
        '<svg',
        '<svg xmlns="http://www.w3.org/2000/svg" width="440" height="660"',
      );

      const file = join(OUT_DIR, `${scenario.id}--${nodeId}.png`);
      await sharp(Buffer.from(svg)).png().toFile(file);
      console.log(`wrote ${file}`);
    }
  }
}

void main();
