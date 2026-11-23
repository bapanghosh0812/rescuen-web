import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { clientIp, rateLimit, type Limit } from "@/lib/rate-limit";
import { SITE } from "@/lib/site";

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
}

/** Visitor-safe failure. `code` is a short reference the Report button sends to support. */
export function fail(status: number, error: string, code: string, headers: Record<string, string> = {}) {
  return json({ ok: false, error, code }, status, headers);
}

function hostOf(url: string | undefined | null) {
  if (!url) return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

/** Only pages served by this site may call the API (blocks cross-site forgery). */
export function originAllowed(req: Request): boolean {
  const origin = hostOf(req.headers.get("origin"));
  if (!origin) return false;
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const allowed = [
    req.headers.get("host")?.toLowerCase(),
    req.headers.get("x-forwarded-host")?.toLowerCase(),
    hostOf(SITE.url),
    hostOf(process.env.URL),
    hostOf(process.env.DEPLOY_PRIME_URL),
    hostOf(process.env.DEPLOY_URL),
  ];
  return allowed.includes(origin);
}

const TOO_BIG = Symbol("too-big");
const BAD = Symbol("bad");

/** Reads a JSON body without ever buffering more than `maxBytes`. */
async function readJson(req: Request, maxBytes: number): Promise<unknown> {
  if (Number(req.headers.get("content-length") || 0) > maxBytes) return TOO_BIG;
  const reader = req.body?.getReader();
  if (!reader) return BAD;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return TOO_BIG;
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return BAD;
  }
}

type GuardOptions<T extends z.ZodType> = {
  name: string;
  schema: T;
  /** Per-visitor limit. */
  limit: Limit;
  /** Ceiling for everyone together, so many IPs cannot add up to a flood. */
  globalLimit?: Limit;
  maxBytes?: number;
};

type GuardResult<T extends z.ZodType> =
  | { data: z.output<T>; res?: undefined }
  | { data?: undefined; res: NextResponse };

/** Every POST route goes through here: origin, type, rate, size, shape. */
export async function guard<T extends z.ZodType>(
  req: Request,
  { name, schema, limit, globalLimit, maxBytes = 16_000 }: GuardOptions<T>
): Promise<GuardResult<T>> {
  if (!originAllowed(req)) return { res: fail(403, "This request isn’t allowed.", "E-ORIGIN") };

  const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return { res: fail(415, "This request isn’t supported.", "E-TYPE") };

  const checks = [
    rateLimit(`${name}:${clientIp(req)}`, limit),
    globalLimit ? rateLimit(`${name}:*`, globalLimit) : { ok: true, retryAfterMs: 0 },
  ];
  const blocked = checks.find((c) => !c.ok);
  if (blocked) {
    return {
      res: fail(429, "That’s a lot of requests in a short time. Please wait a moment and try again.", "E-RATE", {
        "Retry-After": String(Math.max(1, Math.ceil(blocked.retryAfterMs / 1000))),
      }),
    };
  }

  const body = await readJson(req, maxBytes);
  if (body === TOO_BIG) {
    return { res: fail(413, "That’s a little too long. Please shorten it and try again.", "E-SIZE") };
  }
  if (body === BAD) return { res: fail(400, "We couldn’t read that request. Please try again.", "E-JSON") };

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Our own messages end with a full stop; library defaults stay private.
    const first = parsed.error.issues[0];
    const friendly = first && first.code !== "invalid_type" && /^[A-Z][^:]{3,90}\.$/.test(first.message);
    return { res: fail(400, friendly ? first.message : "Please check the details and try again.", "E-INPUT") };
  }
  return { data: parsed.data };
}
