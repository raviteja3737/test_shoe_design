import { GEMINI_MODEL, GeminiError, generateImage } from '@/lib/gemini';
import { PROMPT_TEMPLATE_VERSION, Track, buildPrompt } from '@/lib/prompts';
import { cached } from '@/lib/cache';
import { mockConceptImage } from '@/lib/mock';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALL_TRACKS: Track[] = ['safe', 'balanced', 'experimental'];
const TRACK_NAMES: Record<Track, string> = {
  safe: 'Clean Classic',
  balanced: 'Urban Fusion',
  experimental: 'Bold Concept',
};

interface ElementInput {
  trait: string;
  element?: string;
  brand?: string;
  model?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** One retry on retryable errors only. Never retries blocks/bad requests. */
async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof GeminiError && err.retryable) {
      await sleep(2000);
      return await fn();
    }
    throw err;
  }
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: { code: 'BAD_REQUEST', message: 'Invalid JSON body', retryable: false } }, { status: 400 });
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const elements: ElementInput[] = Array.isArray(body?.elements) ? body.elements : [];
  const traits = elements.map((e) => (typeof e?.trait === 'string' ? e.trait.trim() : '')).filter(Boolean);
  const tracks: Track[] =
    Array.isArray(body?.tracks) && body.tracks.length > 0
      ? body.tracks.filter((t: unknown): t is Track => t === 'safe' || t === 'balanced' || t === 'experimental')
      : ALL_TRACKS;

  if (prompt.length < 3 || prompt.length > 500)
    return Response.json({ error: { code: 'BAD_REQUEST', message: 'prompt must be 3–500 characters', retryable: false } }, { status: 400 });
  if (traits.length < 1 || traits.length > 4)
    return Response.json({ error: { code: 'BAD_REQUEST', message: 'elements must contain 1–4 traits', retryable: false } }, { status: 400 });
  if (tracks.length === 0)
    return Response.json({ error: { code: 'BAD_REQUEST', message: 'tracks must include at least one of safe/balanced/experimental', retryable: false } }, { status: 400 });

  const lineage = elements.map((e, i) => `${e.element ?? `element ${i + 1}`}: ${traits[i]}`);
  const useMock = process.env.MOCK_AI === 'true';
  const artStyle = Array.isArray(body?.artStyle) ? body.artStyle.filter((s: unknown) => typeof s === 'string') : [];

  const settled = await Promise.allSettled(
    tracks.map(async (track) => {
      const fullPrompt = buildPrompt(traits, prompt, track);
      // Cache key covers every generation input (D5 fix: artStyle included).
      const cacheKey = JSON.stringify({ v: PROMPT_TEMPLATE_VERSION, prompt, traits, artStyle, track });
      const started = Date.now();
      try {
        const { value: result, hit } = await cached(cacheKey, async () => {
          if (useMock) {
            const m = mockConceptImage(track, prompt);
            return { mimeType: m.mimeType, base64: m.base64, model: 'mock', latencyMs: 0 };
          }
          return await withRetry(() => generateImage(fullPrompt), track);
        });
        // Privacy-safe log: shape + timing only, never prompt text or image bytes.
        console.log(JSON.stringify({ route: 'generate', model: result.model, templateVersion: PROMPT_TEMPLATE_VERSION, track, latencyMs: result.latencyMs, cacheHit: hit }));
        return {
          id: `${track}-${Date.now()}`,
          name: TRACK_NAMES[track],
          track,
          imageUrl: `data:${result.mimeType};base64,${result.base64}`,
          lineage,
          summary: `${prompt.slice(0, 140)}`,
        };
      } catch (err) {
        const code = err instanceof GeminiError ? err.code : 'UPSTREAM';
        console.log(JSON.stringify({ route: 'generate', model: GEMINI_MODEL, templateVersion: PROMPT_TEMPLATE_VERSION, track, latencyMs: Date.now() - started, error: code }));
        throw { track, code, message: err instanceof Error ? err.message : 'Generation failed' };
      }
    }),
  );

  const concepts = settled.filter((s) => s.status === 'fulfilled').map((s) => (s as PromiseFulfilledResult<any>).value);
  const failures = settled.filter((s) => s.status === 'rejected').map((s) => (s as PromiseRejectedResult).reason);

  return Response.json({ concepts, failures, templateVersion: PROMPT_TEMPLATE_VERSION, model: GEMINI_MODEL });
}
