import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmails, isMailerConfigured } from "@/lib/mailer";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Message is too short").max(4000),
  // Honeypot: bots fill this hidden field; humans never see it.
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) } }
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
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 }
    );
  }

  // Honeypot tripped → pretend success, drop silently.
  if (parsed.data.company) return NextResponse.json({ ok: true, delivered: true });

  if (!isMailerConfigured) {
    // Received & validated, but email creds not set yet.
    console.warn("[contact] Mailer not configured — message received but not emailed:", {
      name: parsed.data.name,
      email: parsed.data.email,
    });
    return NextResponse.json({
      ok: true,
      delivered: false,
      note: "Message received. Email delivery is not configured yet.",
    });
  }

  try {
    const { name, email, subject, message } = parsed.data;
    await sendContactEmails({ name, email, subject, message });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn’t send your message. Please try again or email us directly." },
      { status: 502 }
    );
  }
}
