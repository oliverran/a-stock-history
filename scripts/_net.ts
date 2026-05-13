export async function fetchJsonWithRetry(url: string, init: RequestInit, opts?: { retries?: number; retryDelayMs?: number }) {
  const retries = opts?.retries ?? 4;
  const retryDelayMs = opts?.retryDelayMs ?? 500;

  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          await new Promise((r) => setTimeout(r, retryDelayMs * Math.pow(2, attempt)));
          continue;
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (attempt >= retries) break;
      await new Promise((r) => setTimeout(r, retryDelayMs * Math.pow(2, attempt)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('fetchJsonWithRetry failed');
}

