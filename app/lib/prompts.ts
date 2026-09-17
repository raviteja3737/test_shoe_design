// All prompt wording lives here, versioned. Routes never inline prompt text.
export const PROMPT_TEMPLATE_VERSION = 'v1';

export type Track = 'safe' | 'balanced' | 'experimental';

const TRACK_MODIFIERS: Record<Track, string> = {
  safe: 'conservative commercial silhouette, true-to-brief colors, classic sole, safe retail-ready styling',
  balanced: 'even creative remix of the listed elements, modern sole, one subtle accent detail',
  experimental: 'exaggerated proportions within wearable limits, bold material combination, fashion-forward but still a real shoe',
};

const STUDIO_SUFFIX =
  'photorealistic studio product photo, side 3/4 view, white seamless background, ' +
  'softbox lighting, soft ground shadow, realistic proportions, no logo, no text, ' +
  'no watermark, no human foot';

const WEARABILITY_GUARDRAIL =
  'Design footwear that could plausibly be manufactured and worn. Prioritize recognizable human ' +
  'footwear proportions with realistic sole, upper, heel, toe, collar and panel structures. ' +
  'Treat futuristic or artistic language as styling guidance, never literal fantasy objects.';

/** traits = DesignRequest.elements[].trait strings (NEVER brand names). */
export function buildPrompt(traits: string[], userPrompt: string, track: Track): string {
  const elements = traits.map((t) => `- ${t}`).join('\n');
  return (
    `${userPrompt}\n\nDesign elements to fuse:\n${elements}\n\n` +
    `Direction (${track}): ${TRACK_MODIFIERS[track]}.\n\n` +
    `${STUDIO_SUFFIX}.\n${WEARABILITY_GUARDRAIL}`
  );
}

/** Edit prompt for refine: preservation targets, never "pixel-identical" promises. */
export function buildEditPrompt(instruction: string): string {
  return (
    `${instruction}. Keep the same shoe identity, silhouette, camera angle, lighting and background. ` +
    `Change only what was asked; preserve all other parts, colors and materials as closely as possible. ` +
    `No logo, no text, no watermark.`
  );
}
