import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyIdToken, isAdminConfigured } from "@/lib/firebase.admin";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ idToken: z.string().min(20).max(6000) });

// After OTP sign-in the client holds a Firebase ID token. It POSTs it here so
// the SERVER can cryptographically verify the user really owns that phone
// number before we trust them for any protected action.
export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`verify:${ip}`, { limit: 30, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  }

  if (!isAdminConfigured) {
    return NextResponse.json(
      { ok: false, error: "Server verification not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Missing token." }, { status: 400 });
  }

  const decoded = await verifyIdToken(parsed.data.idToken);
  if (!decoded) {
    return NextResponse.json({ ok: false, error: "Invalid or expired token." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    uid: decoded.uid,
    phone: decoded.phone_number ?? null,
  });
}
