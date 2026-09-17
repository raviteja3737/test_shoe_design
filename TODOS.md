# TODOS

## VPS deploy hardening (from eng-review 2026-09-17)
- **What:** Run this checklist the day the app moves from localhost to VPS: per-IP rate limiting on `/api/design/*`, request body caps (base64 images), reverse-proxy timeouts ≥60s, secrets via env (never in image), restart-safe result store (replace in-memory cache).
- **Why:** An open VPS endpoint exposes the Gemini key to quota theft; big payloads die at proxy defaults.
- **Context:** MVP assumes localhost-only. See `shoe_image_studio_mvp.md` build order + review report. In-memory cache (cap 20, full-input key) is fine locally, must not ship to VPS as-is.
- **Depends on:** core features 1–7 working locally first.
