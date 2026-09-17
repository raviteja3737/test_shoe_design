# Shoe Studio Kickoff — Design (vertical slice, API first)

Date: 2026-09-17 | Mode: one sitting (hours) | Goal: full loop works | Hosting: localhost (VPS later)
Approach: A — vertical slice, API first. Sources: `shoe_image_studio_mvp.md`, `docs/designs/image-studio-fusion.md` (APPROVED), eng-review report in MVP.

## Architecture
Next.js + TS + Tailwind in `app/` subfolder (docs stay at root). Server owns all AI: `lib/gemini.ts` (model check, generate, edit, logging), `lib/prompts.ts` (v1 templates, 3 tracks, distinct seeds), `lib/traits.json` (5 entries). Two routes: `POST /api/design/generate`, `POST /api/design/refine`. Key in `.env` (`GEMINI_API_KEY`), server-only, VERIFIED live 2026-09-17 (`models.list` returns `gemini-3-pro-image`). Generation model: `gemini-3-pro-image` (Nano Banana Pro, user override 2026-09-17 — reverses "Pro = V2-only"; costs more per call and runs slower than Flash, p50 <15s target at risk).

## Components
Picker (1–4 elements) + prompt box + Generate → gallery tabs (Concept 1/2/3 + lineage) → refine bar → download. Staged loading tied to real milestones only.

## Data flow
Client → generate route (validate: elements 1–4, prompt 3–500 chars) → builder stamps 3 track prompts (trait-only, distinct seeds) → 3 parallel `gemini-2.5-flash-image` via `Promise.allSettled` → base64 JPEG 1024px → render what landed. Refine: active image + instruction → edit call.

## Error handling
No AI call on validation failure. Retry timeouts/5xx once with backoff; NEVER on SAFETY_BLOCK/4xx. Partial batch: 1–2/3 shows inline retry for missing tracks; 0/3 shows error panel with retry. In-memory cache: full-input key (prompt + elements + artStyle + template version), cap 20, in-flight dedup, cleared on version bump.

## Testing
Vitest route tests (mocked AI): validation, partial failure, no-retry-on-block, cache key. One mocked Playwright demo-flow run. Live smoke manual only, never CI. Failure rehearsal before stop: blocked prompt, 1 failed concept, refine failure, refresh mid-run.

## Build order
0. `.env` + `.env.example`, key handoff, `models.list` verify. 1. Scaffold. 2. lib + trait JSON. 3. Generate route, ONE concept on screen (go/no-go gate). 4. Fan to 3 tracks, tabs, refine, download. 5. Tests + rehearsal. Stop when full loop works.
