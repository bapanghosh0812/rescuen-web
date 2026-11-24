import { z } from "zod";
import { verifyOrderToken, verifyRazorpaySignature } from "@/lib/donation-security";
import { fail, guard, json } from "@/lib/http";
import { razorpay, settlePayment, type Settled } from "@/lib/razorpay";
import { buildReceipt, deliverReceipt } from "@/lib/receipts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]{6,40}$/),
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]{6,40}$/),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/),
  orderToken: z.string().min(20).max(4000),
});

/** Confirms a payment with the bank and returns its receipt. Safe to ask again: the answer never changes. */
export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "pay-verify",
    schema,
    limit: { limit: 20, windowMs: 15 * 60_000 },
    maxBytes: 8_000,
  });
  if (res) return res;

  const pay = razorpay();
  if (!pay) {
    console.error("[pay-verify] payment keys are not set");
    return fail(503, "We couldn’t confirm your payment yet.", "E-PAY-OFF");
  }

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId } = data;
  if (!verifyRazorpaySignature(orderId, paymentId, data.razorpay_signature, pay.secret)) {
    return fail(400, "We couldn’t confirm this payment.", "E-PAY-SIGN");
  }

  // Donor details come only from the signed token, never from this request.
  const token = verifyOrderToken(data.orderToken);
  if (!token || token.orderId !== orderId) {
    return fail(400, "We couldn’t confirm this payment.", "E-PAY-TOKEN");
  }

  let settled: Settled | null;
  try {
    settled = await settlePayment(pay.client, paymentId, orderId);
  } catch (err) {
    console.error("[pay-verify] fetch failed:", (err as { statusCode?: number })?.statusCode ?? "unknown");
    return fail(502, "We couldn’t reach the payment network to confirm this.", "E-PAY-FETCH");
  }
  if (!settled) return fail(400, "Your bank hasn’t confirmed this payment yet.", "E-PAY-STATUS");

  const receipt = buildReceipt({ paymentId, orderId, settled, name: token.name, email: token.email, message: token.message });
  const emailDelivered = await deliverReceipt(receipt);
  return json({ ok: true, verified: true, receipt: { ...receipt, emailDelivered } });
}
