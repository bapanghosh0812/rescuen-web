import Razorpay from "razorpay";
import { z } from "zod";
import {
  claimPayment,
  generateReceiptId,
  verifyOrderToken,
  verifyRazorpaySignature,
} from "@/lib/donation-security";
import { fail, guard, json } from "@/lib/http";
import { sendDonationEmails } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  razorpay_order_id: z.string().regex(/^order_[A-Za-z0-9]{6,40}$/),
  razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]{6,40}$/),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/),
  orderToken: z.string().min(20).max(4000),
});

export async function POST(req: Request) {
  const { data, res } = await guard(req, {
    name: "pay-verify",
    schema,
    limit: { limit: 12, windowMs: 15 * 60_000 },
    maxBytes: 8_000,
  });
  if (res) return res;

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) {
    console.error("[pay-verify] payment keys are not set");
    return fail(503, "We couldn’t confirm your payment yet.", "E-PAY-OFF");
  }

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId } = data;
  if (!verifyRazorpaySignature(orderId, paymentId, data.razorpay_signature, secret)) {
    return fail(400, "We couldn’t confirm this payment.", "E-PAY-SIGN");
  }

  // Donor details come only from the signed token, never from this request.
  const token = verifyOrderToken(data.orderToken);
  if (!token || token.orderId !== orderId) {
    return fail(400, "We couldn’t confirm this payment.", "E-PAY-TOKEN");
  }

  let amount = 0;
  let method = "RAZORPAY";
  try {
    const payment = await new Razorpay({ key_id: keyId, key_secret: secret }).payments.fetch(paymentId);
    if (payment.order_id !== orderId || !["captured", "authorized"].includes(String(payment.status))) {
      return fail(400, "Your bank hasn’t confirmed this payment yet.", "E-PAY-STATUS");
    }
    amount = Math.round(Number(payment.amount) / 100);
    if (payment.method) method = String(payment.method).toUpperCase();
  } catch (err) {
    console.error("[pay-verify] fetch failed:", (err as { statusCode?: number })?.statusCode ?? "unknown");
    return fail(502, "We couldn’t reach the payment network to confirm this.", "E-PAY-FETCH");
  }

  if (!(await claimPayment(paymentId))) {
    return fail(409, "This payment is already confirmed and its receipt was issued.", "E-PAY-DONE");
  }

  const receipt = {
    receiptId: generateReceiptId(),
    name: token.name || "Well-Wisher",
    email: token.email,
    amount,
    paymentMethod: method,
    transactionId: paymentId,
    orderId,
    timestamp: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "long",
      timeStyle: "short",
    }),
    message: token.message,
  };

  let emailDelivered = false;
  try {
    const mail = await sendDonationEmails({ ...receipt, email: token.email || undefined });
    emailDelivered = mail.donorEmailSent;
  } catch {
    console.error("[pay-verify] receipt email failed");
  }
  return json({ ok: true, verified: true, receipt: { ...receipt, emailDelivered } });
}
