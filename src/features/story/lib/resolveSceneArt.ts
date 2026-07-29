import { characterKeyFromSpeaker } from '@/data/characters';
import type { Scenario, SceneArt, StoryNode } from '@/domain/scenario';

/**
 * Picks the art spec to draw for a beat.
 *
 * Hand-authored `clip.art` always wins. Everything else gets a derived scene
 * built from the scenario's default set and whoever is speaking, so a node added
 * without art still shows the right character in the right room instead of
 * falling back to unrelated footage.
 */
export function resolveSceneArt(scenario: Scenario, node: StoryNode): SceneArt {
  if (node.clip.art) return node.clip.art;

  const setting = scenario.defaultArtSetting ?? 'hallway';
  const speakerKey = characterKeyFromSpeaker(node.speaker);
  const fallbackKey = scenario.defaultArtCharacter ?? 'ari';

  const expression =
    node.kind === 'ending'
      ? node.outcome === 'success'
        ? 'happy'
        : node.outcome === 'failure'
          ? 'sad'
          : 'flat'
      : 'neutral';

  const characters: SceneArt['characters'] =
    speakerKey && speakerKey !== fallbackKey
      ? [
          { key: fallbackKey, expression: 'neutral' },
          { key: speakerKey, expression },
        ]
      : [{ key: fallbackKey, expression }];

  return { setting, characters, crowd: true };
}

/** Cast key of whoever has the current line, for the mouth flap. */
export function resolveSpeakingKey(node: StoryNode): string | null {
  return characterKeyFromSpeaker(node.speaker);
}
