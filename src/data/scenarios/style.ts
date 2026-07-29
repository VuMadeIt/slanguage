/**
 * The house visual style, appended verbatim to every Higgsfield prompt.
 *
 * Shared rather than per-scenario on purpose: text-to-video has no memory
 * between calls, and any drift in line weight, shading or frame rate breaks the
 * cutout illusion far more visibly than a wrong camera move. One string means
 * one place to tune the look for the whole library.
 */
export const CUTOUT_LOOK =
  'Style: crude 2D construction-paper cutout animation in the manner of South Park. Flat solid colours only, absolutely no shading, gradients or texture. Thick black outlines on every shape. Simple geometric forms, oversized circular heads on small rectangular bodies, stubby limbs. Characters face the camera almost straight on with flat stage-like perspective. Deliberately cheap limited animation, low frame rate, jerky two-position mouth flaps, bodies that bob rather than walk. Flat painted backgrounds with no depth of field. Vertical 9:16 framing. No text overlays, no captions, no photorealism.';
