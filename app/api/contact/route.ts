import { z } from "zod";
import { fail, guard, json } from "@/lib/http";
import { sendContactEmails } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please shorten your name."),
  email: z.email("Please enter a valid email address.").max(120, "Please shorten your email address."),
  subject: z.string().trim().max(120, "Please shorten the subject.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail to your message.")
    .max(4000, "Please shorten your message."),
  // Hidden field: people never see it, bots fill it in.
  company: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "contact",
    schema,
    limit: { limit: 5, windowMs: 60 * 60_000 },
    globalLimit: { limit: 80, windowMs: 60 * 60_000 },
    maxBytes: 12_000,
  });
  if (res) return res;
  if (data.company) return json({ ok: true, ref: "RES-00000000", replied: false });

  try {
    const result = await sendContactEmails(data);
    if (result.sent) return json({ ok: true, ref: result.ref, replied: result.replied });
  } catch (err) {
    console.error("[contact] send failed:", (err as { code?: string })?.code ?? "unknown");
  }
  return fail(502, "Your message couldn’t be sent just now. Please try again, or email us directly.", "E-MAIL");
}
