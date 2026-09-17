import { GeminiError, editImage } from '@/lib/gemini';
import { buildEditPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_IMAGEURL_CHARS = 12_000_000;

function err(code: string, message: string, status: number) {
  return Response.json({ error: { code, message, retryable: false } }, { status });
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return err('BAD_REQUEST', 'Invalid JSON body', 400);
  }

  const conceptId = typeof body?.conceptId === 'string' ? body.conceptId : '';
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';
  const instruction = typeof body?.instruction === 'string' ? body.instruction.trim() : '';
  const lineage = Array.isArray(body?.lineage) ? body.lineage.filter((l: unknown) => typeof l === 'string') : [];

  if (!conceptId) return err('BAD_REQUEST', 'conceptId is required', 400);
  if (!imageUrl.startsWith('data:')) return err('BAD_REQUEST', 'imageUrl must be a data URL', 400);
  if (imageUrl.length > MAX_IMAGEURL_CHARS) return err('BAD_REQUEST', 'imageUrl too large', 413);
  if (instruction.length < 3 || instruction.length > 500)
    return err('BAD_REQUEST', 'instruction must be 3–500 characters', 400);

  try {
    if (process.env.MOCK_AI === 'true') {
      // Loop-test path: echo the input image so tabs/refine/download all exercise.
      console.log(JSON.stringify({ route: 'refine', model: 'mock', conceptId }));
      return Response.json({ conceptId, imageUrl, lineage });
    }
    const match = imageUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
    if (!match) return err('BAD_REQUEST', 'imageUrl must be base64 data URL', 400);
    const result = await editImage(match[2], match[1], buildEditPrompt(instruction));
    console.log(JSON.stringify({ route: 'refine', model: result.model, conceptId, latencyMs: result.latencyMs }));
    return Response.json({
      conceptId,
      imageUrl: `data:${result.mimeType};base64,${result.base64}`,
      lineage,
    });
  } catch (e) {
    const code = e instanceof GeminiError ? e.code : 'UPSTREAM';
    const retryable = e instanceof GeminiError ? e.retryable : true;
    console.log(JSON.stringify({ route: 'refine', conceptId, error: code }));
    return Response.json({ error: { code, message: e instanceof Error ? e.message : 'Refine failed', retryable } }, { status: code === 'SAFETY_BLOCK' || code === 'BAD_REQUEST' ? 400 : 502 });
  }
}
