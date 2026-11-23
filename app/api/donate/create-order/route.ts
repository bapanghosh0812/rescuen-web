import crypto from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { signOrderToken } from "@/lib/donation-security";
import { fail, guard, json } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const oneLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.replace(/[\r\n\t<>]+/g, " ").trim());

const schema = z.object({
  name: oneLine(80).optional().or(z.literal("")),
  email: z.email("Please enter a valid email address or leave it blank.").max(120).optional().or(z.literal("")),
  amount: z
    .number()
    .int("Please enter a whole rupee amount.")
    .min(1, "The minimum contribution is ₹1.")
    .max(100000, "The maximum single contribution is ₹1,00,000."),
  method: z.enum(["upi", "card", "wallet", "netbanking"]),
  message: oneLine(250).optional(),
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "order",
    schema,
    limit: { limit: 12, windowMs: 15 * 60_000 },
    globalLimit: { limit: 300, windowMs: 15 * 60_000 },
    maxBytes: 4_000,
  });
  if (res) return res;

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("[order] payment keys are not set");
    return fail(503, "Contributions are paused for a short while. Please try again later.", "E-PAY-OFF");
  }

  const name = data.name || "";
  const email = data.email || "";
  try {
    const order = await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.create({
      amount: data.amount * 100,
      currency: "INR",
      receipt: `ORD_${Date.now()}_${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
      notes: {
        supporter_name: name || "Well-Wisher (Anonymous)",
        supporter_email: email || "not_provided",
        preferred_method: data.method,
        platform: "RESCUEN Official Web",
      },
    });
    return json({
      ok: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      orderToken: signOrderToken({
        orderId: order.id,
        email,
        name,
        message: data.message || "",
        exp: Date.now() + 60 * 60_000,
      }),
    });
  } catch (err) {
    console.error("[order] create failed:", (err as { statusCode?: number })?.statusCode ?? "unknown");
    return fail(
      502,
      "We couldn’t start the payment just now. Nothing has been charged. Please try again.",
      "E-PAY-ORDER"
    );
  }
}
