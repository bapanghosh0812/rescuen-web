import "server-only";
import Razorpay from "razorpay";

export const PLATFORM = "RESCUEN Official Web";

/** The payment account, or null when its keys are not set. */
export function razorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return null;
  return { keyId, secret, client: new Razorpay({ key_id: keyId, key_secret: secret }) };
}

export type Settled = { amount: number; method: string; paidAt: Date };

/** A payment as the bank sees it. Null until the money for this order is really captured, in rupees. */
export async function settlePayment(client: Razorpay, paymentId: string, orderId: string): Promise<Settled | null> {
  let p = await client.payments.fetch(paymentId);
  if (p.order_id !== orderId || p.currency !== "INR") return null;
  if (p.status === "authorized") {
    try {
      p = await client.payments.capture(paymentId, Number(p.amount), "INR");
    } catch {
      p = await client.payments.fetch(paymentId);
    }
  }
  if (p.status !== "captured" || p.order_id !== orderId) return null;
  return {
    amount: Math.round(Number(p.amount) / 100),
    method: String(p.method || "razorpay").toUpperCase(),
    paidAt: p.created_at ? new Date(Number(p.created_at) * 1000) : new Date(),
  };
}
