import { z } from "zod";
import { fail, guard, json } from "@/lib/http";
import { newReference, sendIssueReport } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const short = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.replace(/[\u0000-\u001f\u007f<>]+/g, " ").trim())
    .optional();

const schema = z
  .object({
    code: z
      .string()
      .regex(/^[A-Z0-9-]{0,40}$/)
      .optional(),
    area: short(60),
    page: short(160),
    device: short(200),
    message: z.string().trim().max(2000, "Please shorten your note.").optional(),
    email: z.email("Please enter a valid email address or leave it blank.").max(120).optional().or(z.literal("")),
    company: z.string().max(200).optional(),
  })
  .refine((r) => r.code || r.message, "Please tell us what happened.");

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "report",
    schema,
    limit: { limit: 6, windowMs: 60 * 60_000 },
    globalLimit: { limit: 120, windowMs: 60 * 60_000 },
    maxBytes: 8_000,
  });
  if (res) return res;

  const ref = newReference("RPT");
  if (data.company) return json({ ok: true, ref });
  try {
    const sent = await sendIssueReport({
      ref,
      code: data.code || "",
      area: data.area || "",
      page: data.page || "",
      device: data.device || "",
      message: data.message || "",
      email: data.email || "",
    });
    if (sent) return json({ ok: true, ref });
  } catch (err) {
    console.error("[report] send failed:", (err as { code?: string })?.code ?? "unknown");
  }
  return fail(502, "Your report couldn’t be sent just now. You can email it to us instead.", "E-REPORT");
}
