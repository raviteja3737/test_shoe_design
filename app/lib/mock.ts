// Throwaway visuals for local loop testing while the Gemini key is blocked.
// Returns distinct SVG placeholders per track as base64 (no data: prefix).
// Flip to real generation by unsetting MOCK_AI. Never used in production builds.
import type { Track } from '@/lib/prompts';

const TRACK_STYLE: Record<Track, { bg1: string; bg2: string; sole: string; label: string }> = {
  safe: { bg1: '#f5f5f4', bg2: '#e7e5e4', sole: '#44403c', label: 'SAFE' },
  balanced: { bg1: '#eff6ff', bg2: '#dbeafe', sole: '#1e3a8a', label: 'BALANCED' },
  experimental: { bg1: '#faf5ff', bg2: '#f3e8ff', sole: '#6b21a8', label: 'EXPERIMENTAL' },
};

export function mockConceptImage(track: Track, prompt: string): { mimeType: string; base64: string } {
  const s = TRACK_STYLE[track];
  const short = prompt.slice(0, 42).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${s.bg1}"/><stop offset="1" stop-color="${s.bg2}"/></linearGradient></defs>` +
    `<rect width="1024" height="1024" fill="url(#g)"/>` +
    `<text x="64" y="120" font-family="sans-serif" font-size="56" font-weight="bold" fill="#1c1917">${s.label} (MOCK)</text>` +
    `<text x="64" y="180" font-family="sans-serif" font-size="30" fill="#57534e">${short}</text>` +
    `<path d="M140 640 C 260 560 340 540 470 540 L 700 540 C 800 540 860 600 880 680 L 890 730 L 150 730 Z" fill="#ffffff" stroke="#1c1917" stroke-width="10"/>` +
    `<path d="M150 700 L 890 700 L 880 760 L 160 760 Z" fill="${s.sole}"/>` +
    `<circle cx="330" cy="620" r="12" fill="#1c1917"/><circle cx="390" cy="610" r="12" fill="#1c1917"/><circle cx="450" cy="602" r="12" fill="#1c1917"/>` +
    `</svg>`;
  return { mimeType: 'image/svg+xml', base64: Buffer.from(svg).toString('base64') };
}
