'use client';

import { useState } from 'react';
import traits from '@/lib/traits.json';

interface TraitEntry {
  brand: string;
  model: string;
  element: string;
  trait: string;
}

interface Concept {
  id: string;
  name: string;
  track: string;
  imageUrl: string;
  lineage: string[];
  summary: string;
}

interface Failure {
  track: string;
  code: string;
  message: string;
}

const ART_STYLES = ['minimal', 'luxury', 'futuristic', 'retro', 'streetwear', 'performance'];
const ALL_TRAITS = traits as TraitEntry[];

export default function Studio() {
  const [selected, setSelected] = useState<number[]>([0, 1, 4]);
  const [prompt, setPrompt] = useState('premium everyday running shoe for college, works with smart casual');
  const [artStyle, setArtStyle] = useState('minimal');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState('');
  const [busy, setBusy] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');

  function toggle(i: number) {
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= 4) return prev;
      return [...prev, i];
    });
  }

  async function generate() {
    if (busy || selected.length === 0 || prompt.trim().length < 3) return;
    setBusy(true);
    setError('');
    setFailures([]);
    setStage('Request sent — rendering 3 concepts…');
    const started = Date.now();
    try {
      const res = await fetch('/api/design/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          elements: selected.map((i) => ALL_TRAITS[i]),
          artStyle: [artStyle],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? 'Generation failed');
      setConcepts(json.concepts ?? []);
      setFailures(json.failures ?? []);
      setActive(0);
      const secs = ((Date.now() - started) / 1000).toFixed(1);
      setStage(
        (json.concepts?.length ?? 0) === 3
          ? `Done in ${secs}s — 3 concepts`
          : `Partial: ${json.concepts?.length ?? 0}/3 landed in ${secs}s — retry the missing tracks`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
      setStage('');
    } finally {
      setBusy(false);
    }
  }

  async function refine() {
    const concept = concepts[active];
    if (!concept || refining || instruction.trim().length < 3) return;
    setRefining(true);
    setError('');
    try {
      const res = await fetch('/api/design/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: concept.id,
          imageUrl: concept.imageUrl,
          instruction: instruction.trim(),
          lineage: concept.lineage,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? 'Refine failed');
      setConcepts((prev) => prev.map((c, i) => (i === active ? { ...c, imageUrl: json.imageUrl } : c)));
      setInstruction('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refine failed');
    } finally {
      setRefining(false);
    }
  }

  const current = concepts[active];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Shoe Image Studio</h1>
          <span className="text-sm text-stone-500">AI concepts from brand elements + prompt</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 md:grid-cols-[280px_1fr_300px]">
        {/* References */}
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">References (pick 1–4)</h2>
          <div className="space-y-2">
            {ALL_TRAITS.map((t, i) => (
              <label key={i} className="flex cursor-pointer items-start gap-2 rounded-lg border border-stone-200 p-2 hover:border-stone-400">
                <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="mt-1" />
                <span>
                  <span className="block text-sm font-medium">{t.model} — {t.element}</span>
                  <span className="block text-xs text-stone-500">{t.trait}</span>
                  <span className="block text-[11px] text-stone-400">ref {t.brand} (inspired by)</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          {concepts.length === 0 ? (
            <div className="flex h-96 items-center justify-center text-center text-stone-400">
              <p>Pick references, write a prompt, hit Generate.<br />Three concepts will appear here.</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                {concepts.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(i)}
                    className={`rounded-full px-4 py-1 text-sm ${i === active ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}
                  >
                    Concept {i + 1}
                  </button>
                ))}
              </div>
              {current && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={current.imageUrl} alt={current.name} className="w-full rounded-lg border border-stone-200" />
                  <h3 className="mt-3 text-lg font-semibold">{current.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {current.lineage.map((l, i) => (
                      <span key={i} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">{l}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder="e.g. thicker sole, deep blue accents"
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={refine}
                      disabled={refining || instruction.trim().length < 3}
                      className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white disabled:opacity-40"
                    >
                      {refining ? 'Refining…' : 'Refine'}
                    </button>
                    <a href={current.imageUrl} download={`${current.name}.png`} className="rounded-lg border border-stone-300 px-4 py-2 text-sm">
                      Download
                    </a>
                  </div>
                </>
              )}
            </>
          )}
          {failures.length > 0 && (
            <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">
              {failures.length}/3 tracks failed ({failures.map((f) => `${f.track}: ${f.code}`).join(', ')}). Hit Generate again for the missing ones.
            </div>
          )}
        </section>

        {/* Brief */}
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">Design brief</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-stone-300 p-2 text-sm"
          />
          <label className="mt-3 block text-sm text-stone-600">
            Art style
            <select value={artStyle} onChange={(e) => setArtStyle(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm">
              {ART_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            onClick={generate}
            disabled={busy || selected.length === 0 || prompt.trim().length < 3}
            className="mt-4 w-full rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {busy ? 'Generating…' : 'Generate 3 concepts'}
          </button>
          {stage && <p className="mt-2 text-sm text-stone-500">{stage}</p>}
          {error && <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        </section>
      </main>
    </div>
  );
}
