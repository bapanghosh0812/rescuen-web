import { z } from "zod";
import { fail, guard, json } from "@/lib/http";
import { verifyIdToken } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ idToken: z.string().min(20).max(6000) });

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "verify",
    schema,
    limit: { limit: 20, windowMs: 10 * 60_000 },
  });
  if (res) return res;
  const user = await verifyIdToken(data.idToken);
  return user ? json({ ok: true }) : fail(401, "Your sign-in has expired. Please sign in again.", "E-TOKEN");
}
