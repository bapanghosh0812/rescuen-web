import { verifyWebhook } from "@/lib/donation-security";
import { json, readText } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { PLATFORM, razorpay, settlePayment } from "@/lib/razorpay";
import { buildReceipt, deliverReceipt } from "@/lib/receipts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const note = (v: unknown, empty: string, max: number) => {
  const text = typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]+/g, " ").trim().slice(0, max) : "";
  return text === empty ? "" : text;
};

/**
 * Razorpay calls this when money is captured, so a supporter who closed the tab
 * still gets a receipt. Nothing here is trusted until its signature is proven,
 * and the payment itself is always read again from Razorpay.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const pay = razorpay();
  if (!secret || !pay) return json({ ok: false }, 404);
  if (!rateLimit(`hook:${clientIp(req)}`, { limit: 120, windowMs: 5 * 60_000 }).ok) return json({ ok: false }, 429);

  const raw = await readText(req, 64_000);
  if (!raw || !verifyWebhook(raw, req.headers.get("x-razorpay-signature") || "", secret)) return json({ ok: false }, 400);

  let payment: { id?: unknown; order_id?: unknown } | undefined;
  try {
    const body = JSON.parse(raw);
    if (body?.event !== "payment.captured") return json({ ok: true });
    payment = body?.payload?.payment?.entity;
  } catch {
    return json({ ok: false }, 400);
  }
  const paymentId = String(payment?.id ?? "");
  const orderId = String(payment?.order_id ?? "");
  if (!/^pay_[A-Za-z0-9]{6,40}$/.test(paymentId) || !/^order_[A-Za-z0-9]{6,40}$/.test(orderId)) return json({ ok: true });

  try {
    const order = await pay.client.orders.fetch(orderId);
    const notes = (order.notes || {}) as Record<string, unknown>;
    if (notes.platform !== PLATFORM) return json({ ok: true });
    const settled = await settlePayment(pay.client, paymentId, orderId);
    if (!settled) return json({ ok: true });
    await deliverReceipt(
      buildReceipt({
        paymentId,
        orderId,
        settled,
        name: note(notes.supporter_name, "Well-Wisher (Anonymous)", 80),
        email: note(notes.supporter_email, "not_provided", 120),
        message: note(notes.supporter_message, "", 250),
      })
    );
    return json({ ok: true });
  } catch (err) {
    // A failure here makes Razorpay try again later.
    console.error("[hook] failed:", (err as { statusCode?: number })?.statusCode ?? "unknown");
    return json({ ok: false }, 502);
  }
}
