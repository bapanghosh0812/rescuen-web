import "server-only";

// In-memory limiter, one per server instance. netlify/edge-functions/api-guard.ts
// adds a limit that is shared across all instances.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();
const MAX_KEYS = 20_000;

export type Limit = { limit: number; windowMs: number };

export function rateLimit(key: string, { limit, windowMs }: Limit) {
  const now = Date.now();
  if (store.size > MAX_KEYS) {
    for (const [k, b] of store) if (now > b.resetAt) store.delete(k);
    if (store.size > MAX_KEYS) store.clear();
  }

  const bucket = store.get(key);
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (bucket.count >= limit) return { ok: false, retryAfterMs: bucket.resetAt - now };
  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/**
 * The visitor's IP as reported by Netlify, which overwrites anything a visitor
 * sends. `x-forwarded-for` can be faked, so it is only used when that is missing.
 */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-nf-client-connection-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}
