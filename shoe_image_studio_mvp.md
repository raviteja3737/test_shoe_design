# AI Shoe Image Studio — MVP (Image-First, Gemini)

**Status:** MVP direction locked (supersedes `_archive/shoe_ai_mvp_plan.3d-superseded.md`, which required 3D/GLB).
**Design doc:** `docs/designs/image-studio-fusion.md` (APPROVED, quality 8/10)
**Wow moment:** photorealistic shoe images from simple instructions + brand-element fusion.
**Stack:** Next.js + TypeScript + Tailwind, Gemini image API, key server-side only.

## Core loop

```
Pick brand elements (1–4) + type prompt → Generate → 3 concepts (safe/balanced/experimental)
→ tabs 1/2/3 → refine with plain language → download
```

## MVP features (Sole Studio parity map)

| # | Feature (Sole equivalent) | Our build | Difficulty |
|---|---|---|---|
| 1 | Prompt box + generate 3 concepts | `POST /api/design/generate`, 3 parallel `gemini-2.5-flash-image` calls | Core |
| 2 | Brand reference library (their asset library) | Hardcoded JSON: 3 min / 10 max entries of brand→model→element→trait (trait-only, e.g. "breathable engineered mesh upper") | Core |
| 3 | Fusion: upper from A + sole from B | Multi-element prompt builder: selected traits + user prompt → 3 track prompts | Core |
| 4 | Prompt editing ("make it leather, white stitching") | `POST /api/design/refine`: prev image + instruction, multi-turn edit | Core |
| 5 | Concept tabs + lineage | Gallery tabs showing which element came from which shoe ("inspired by", never logos) | Core |
| 6 | Staged loading | "Analyzing inspiration → Exploring silhouettes → Balancing wearability → Applying materials → Rendering" | Core |
| 7 | Download | Canvas export PNG/JPEG | Core |
| 8 | Instant recolor preview (their click-part Fill) | SVG/canvas part-mask overlay per silhouette, `mix-blend-mode`, hex tint (browser-only, free) | Stretch 1 |
| 9 | Photoreal material finish (their Develop) | 1 Gemini edit call: "change upper to burgundy suede, everything else pixel-identical" | Stretch 1 |
| 10 | Background remove | `@imgly/background-removal` WASM, client-side, zero Gemini cost | Stretch 2 |
| 11 | Recipe/history replay | Persist `ShoeDesignSpec` in localStorage, re-issue same calls | Stretch 2 |
| 12 | Rotate / novel view, Drop-Kit, collections, image upload | V2 (consistency risk, needs ref-lock) | V2 |

## API (all `/api/design/*`, `GEMINI_API_KEY` server-only)

- `POST /api/design/generate` { prompt (3–500 chars), elements[1–4], artStyle? } → { concepts: [{id, name, imageUrl (base64 JPEG 1024px), lineage, summary}] }
- `POST /api/design/refine` { conceptId, imageUrl, instruction } → { conceptId, imageUrl, lineage }
- Errors: `{error:{code:'SAFETY_BLOCK|RATE_LIMIT|TIMEOUT', message, retryable}}`
- Rules: `Promise.allSettled` + partial render, smart retry (timeouts/5xx only with backoff, NEVER on SAFETY_BLOCK/4xx, total budget 2), 60s timeout, log model/prompt-version/latency/retries per call. Partial-batch contract: 3/3 → tabs; 1–2/3 → show what landed + inline retry for missing tracks; 0/3 → full error panel with retry. Rate limiting deferred to VPS phase (localhost-only for now).
- Result cache: in-memory, key = ALL generation inputs (prompt + elements + artStyle + template version), cap 20 entries, in-flight dedup against stampedes, cleared on template version bump.
- Models: generation = `gemini-3-pro-image` (Nano Banana Pro, VERIFIED live via `models.list` 2026-09-17, user override for max quality — slower + pricier than Flash, p50 target at risk). Fallback `gemini-2.5-flash-image` (also verified live). `gemini-3.1-flash-image` 2K upscale behind flag.

## Prompt builder (server only, string template, no extra LLM call)

- Inputs: trait strings only (NEVER brand names) + user prompt + track modifier (safe = conservative / balanced = even mix / experimental = exaggerated but wearable).
- Suffix: "photorealistic studio product photo, side 3/4 view, white seamless background, softbox lighting, soft ground shadow, realistic proportions, no logo, no text, no watermark, no human foot" + wearability guardrail.
- Edit suffix: "only change X, everything else pixel-identical".

## Demo script (Hemanth)

1. Pick elements: rocker sole type + mesh upper type + minimal palette. 2. Prompt: "premium everyday running shoe for college, works with smart casual". 3. Generate → switch Concept 1/2/3. 4. Refine: "thicker sole, deep blue accents". 5. Download hero.

## Build order (eng-review locked)

```
T0 spike: models.list + 1 real generation + 1 refine, log shapes/latency — UI waits on this
 → lib/gemini.ts + lib/prompts.ts (versioned) + trait JSON + 2 routes + smart retry
 → page + picker + gallery tabs + refine bar + download (staged copy tied to real milestones only)
 → vitest route tests (mocked AI) + 1 mocked Playwright demo-flow E2E + manual live smoke (NOT in CI)
 → cache + failure rehearsal (blocked prompt, quota error, 1 failed concept, refine failure, refresh mid-run)
```

Staged copy must reflect real milestones (request sent / first bytes / image N of 3 / done) — no fake "analyzing inspiration" step that performs no analysis.

## Non-goals (MVP)

No Three.js/GLB/Blender, no reference-image upload (V2), no auth/payments, no rotate/Drop-Kit (V2), no manufacturing/CAD accuracy. NFR: p50 <15s per 3-batch, cost logged, desktop-first.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | Not run (builder demo, scope already locked in office-hours) |
| Outside Review | codex CLI (gpt-5.6-luna) | Independent 2nd opinion | 1 | completed | 21 gaps, 3 tension points resolved |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | issues_found→folded | 5 findings, all decided |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | Deferred; premium-studio direction in design doc |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | N/A (no dev-facing surface) |

- **OUTSIDE COVERAGE:** codex, phase plan-review, completed. Verbatim verdict saved in session; Recommendation: prove 1 render + 1 refine before 3-way parallelism. Decision: kept 3-batch (variety is the wow) + diversity safeguards (distinct seeds, spike must show 3 visibly distinct outputs).
- **CROSS-MODEL:** agreed on spike-first, versioned prompts, mocked tests, cache, VPS hardening. Disagreed on scope (1+1 vs 3-batch) → decided: 3-batch stands. Disagreed on live E2E goldens → decided: mocked E2E + manual smoke.
- **VERDICT:** ENG REVIEW CLEAR — ready to implement in build order above.

### What already exists
No code (greenfield). Reused: `docs/designs/image-studio-fusion.md` (APPROVED premises, guardrails, data shapes), Sole Studio public knowledge base (feature parity map), Gemini image-gen docs (model IDs, responseModalities).

### NOT in scope (deferred with rationale)
- VPS rate limiting / body-limit / proxy-timeout hardening — localhost-only for now; becomes P1 at VPS deploy (TODO).
- Rotate / Drop-Kit / collections / image upload — V2, consistency risk needs ref-lock first.
- SVG recolor preview, bg-remove, recipe replay — stretch, ship core 1–7 first.
- Auth, payments, multi-user — no users yet.
- Live-AI tests in CI — flaky/expensive; manual smoke only.

### Failure modes (critical gaps: 0 open — all have owner)
- Quota/rate-limit mid-demo → smart retry + rehearsed fallback message (covered D5/T2).
- 1–2 of 3 concepts fail → partial-batch contract above (covered).
- Safety block on stage → error panel + prompt-edit hint (rehearse).
- Refine drift (whole shoe changes) → "preservation targets" copy, never "pixel-identical".
- Cache serves stale/wrong image → full-input key + version-bump clear (covered).

### Parallelization
Lane A: T0 spike → lib/gemini.ts + lib/prompts.ts + trait JSON → 2 routes + retry/cache. Lane B (after API contract frozen): page + picker + gallery + refine + download. Lane C (after UI): tests + rehearsal. A then B+C overlap; single builder → run A→B→C sequentially.

### Implementation Tasks (in-report)
Synthesized from this review's findings. Each task derives from a specific finding above. Run with Claude Code or Codex; checkbox as you ship.

- [ ] **T1 (P1, human: ~30min / CC: ~10min)** — spike — Run models.list + 1 generate + 1 refine, log shapes/latency/cost
  - Surfaced by: Architecture D1 — assumed Gemini response shape unverified
  - Files: `scripts/spike-gemini.*` (throwaway), then `lib/gemini.ts`
  - Verify: logged JSON shows image bytes, model ID valid, p50 noted
- [ ] **T2 (P1, human: ~2h / CC: ~20min)** — api — Build generate/refine routes with validation, smart retry, partial-batch contract
  - Surfaced by: Architecture D2 + Codex retry/partial-batch gaps
  - Files: `app/api/design/generate/route.ts`, `app/api/design/refine/route.ts`, `lib/gemini.ts`
  - Verify: `npm test` route tests incl. 1-of-3 failure and SAFETY_BLOCK no-retry
- [ ] **T3 (P1, human: ~1h / CC: ~15min)** — prompts — Versioned prompt templates + 3 golden prompts + diversity seeds per track
  - Surfaced by: Code quality D3 + Codex diversity gap
  - Files: `lib/prompts.ts`, `lib/traits.json`
  - Verify: spike shows 3 visibly distinct outputs; template version logged
- [ ] **T4 (P2, human: ~1h / CC: ~20min)** — ui — Studio page: picker (1–4), gallery tabs + lineage, refine bar, honest staged loading, download
  - Surfaced by: Test review user flows — untested click paths fail on stage
  - Files: `app/page.tsx`, `components/*`
  - Verify: mocked Playwright run walks the full demo script green
- [ ] **T5 (P2, human: ~30min / CC: ~10min)** — perf — In-memory result cache (full-input key, cap 20, in-flight dedup, version-bump clear)
  - Surfaced by: Performance D5 + Codex cache-key/stampede gaps
  - Files: `lib/cache.ts`
  - Verify: repeat Generate returns instantly; artStyle change misses cache
- [ ] **T6 (P2, human: ~30min / CC: ~10min)** — qa — Failure rehearsal checklist run live (blocked prompt, quota error, 1 failed concept, refine failure, refresh, download failure)
  - Surfaced by: Codex demo-path gap
  - Files: checklist only
  - Verify: each breakpoint shows a clean error, never a spinner of death

NO UNRESOLVED DECISIONS
