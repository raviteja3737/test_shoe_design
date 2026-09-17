// Tiny in-memory result cache. Localhost/dev only — not restart-safe (see TODOS.md VPS item).
const store = new Map<string, { value: unknown; ts: number }>();
const inflight = new Map<string, Promise<unknown>>();
const CAP = 20;

export async function cached<T>(key: string, fn: () => Promise<T>): Promise<{ value: T; hit: boolean }> {
  const hit = store.get(key);
  if (hit) {
    store.delete(key);
    store.set(key, hit);
    return { value: hit.value as T, hit: true };
  }
  const ongoing = inflight.get(key);
  if (ongoing) return { value: (await ongoing) as T, hit: true };
  const p = fn();
  inflight.set(key, p);
  try {
    const value = await p;
    store.set(key, { value, ts: Date.now() });
    if (store.size > CAP) {
      const oldest = store.keys().next();
      if (!oldest.done) store.delete(oldest.value);
    }
    return { value, hit: false };
  } finally {
    inflight.delete(key);
  }
}

export function clearCache() {
  store.clear();
}
