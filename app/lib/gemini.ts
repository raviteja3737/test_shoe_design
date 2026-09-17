// All Gemini API knowledge lives here. Nothing else touches the REST shape.
export const GEMINI_MODEL = 'gemini-3-pro-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export type ApiErrorCode = 'SAFETY_BLOCK' | 'RATE_LIMIT' | 'TIMEOUT' | 'BAD_REQUEST' | 'UPSTREAM';

export class GeminiError extends Error {
  code: ApiErrorCode;
  retryable: boolean;
  constructor(code: ApiErrorCode, message: string, retryable: boolean) {
    super(message);
    this.code = code;
    this.retryable = retryable;
  }
}

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError('BAD_REQUEST', 'GEMINI_API_KEY is not set', false);
  return key;
}

interface InlineImage {
  mimeType: string;
  base64: string;
}

export interface GenerateResult extends InlineImage {
  text?: string;
  model: string;
  latencyMs: number;
}

async function callGenerate(body: object, timeoutMs = 60000): Promise<any> {
  const started = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey() },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (res.status === 429) throw new GeminiError('RATE_LIMIT', 'Gemini quota/rate limit hit', true);
    if (res.status >= 500) throw new GeminiError('UPSTREAM', `Gemini server error ${res.status}`, true);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new GeminiError('BAD_REQUEST', `Gemini rejected request (${res.status}): ${text.slice(0, 200)}`, false);
    }
    const json = await res.json();
    (json as any).__latencyMs = Date.now() - started;
    return json;
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError')
      throw new GeminiError('TIMEOUT', 'Gemini request timed out', true);
    throw new GeminiError('UPSTREAM', `Gemini request failed: ${(err as Error).message}`, true);
  } finally {
    clearTimeout(timer);
  }
}

function extractImage(json: any): GenerateResult {
  const feedback = json?.promptFeedback;
  if (feedback?.blockReason)
    throw new GeminiError('SAFETY_BLOCK', `Blocked by Gemini safety filter: ${feedback.blockReason}`, false);
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p: any) => p?.inlineData?.data);
  if (!img) throw new GeminiError('UPSTREAM', 'Gemini returned no image data', true);
  const textPart = parts.find((p: any) => typeof p?.text === 'string');
  return {
    mimeType: img.inlineData.mimeType ?? 'image/jpeg',
    base64: img.inlineData.data as string,
    text: textPart?.text,
    model: GEMINI_MODEL,
    latencyMs: (json as any).__latencyMs ?? 0,
  };
}

/** Text-to-image: brand-new concept render. */
export async function generateImage(prompt: string): Promise<GenerateResult> {
  const json = await callGenerate({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  });
  return extractImage(json);
}

/** Image+text edit: refine a previous concept. imageBase64 must be raw base64 (no data: prefix). */
export async function editImage(imageBase64: string, mimeType: string, instruction: string): Promise<GenerateResult> {
  const json = await callGenerate({
    contents: [
      { parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: instruction }] },
    ],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  });
  return extractImage(json);
}

/** T0 connectivity check. Throws GeminiError on failure. */
export async function listImageModels(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/models`, {
    headers: { 'x-goog-api-key': apiKey() },
  });
  if (!res.ok) throw new GeminiError('BAD_REQUEST', `models.list failed (${res.status})`, false);
  const json = await res.json();
  return (json?.models ?? []).map((m: any) => m?.name).filter((n: string) => /image/i.test(n ?? ''));
}
