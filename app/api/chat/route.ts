import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSafetyReply } from "@/lib/gemini";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  message: z.string().trim().min(1).max(1500),
  history: z
    .array(z.object({ role: z.enum(["user", "model"]), text: z.string().max(4000) }))
    .max(20)
    .optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`chat:${ip}`, { limit: 25, windowMs: 5 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "You’re sending messages too fast. Please slow down." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid message." }, { status: 400 });
  }

  try {
    const { reply, ai } = await generateSafetyReply(parsed.data.message, parsed.data.history || []);
    return NextResponse.json({ reply, ai });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json(
      { error: "The assistant is unavailable right now. In an emergency call 112." },
      { status: 502 }
    );
  }
}
