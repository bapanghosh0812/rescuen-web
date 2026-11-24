import "server-only";
import crypto from "crypto";
import { getStore } from "@netlify/blobs";

export type SignedOrder = {
  orderId: string;
  email: string;
  name: string;
  message: string;
  exp: number;
};

/** Signing key derived from the payment secret. No secret means no tokens: there is no fallback. */
function signingKey(): Buffer {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("payment secret missing");
  return crypto.createHmac("sha256", secret).update("rescuen:order-token:v2").digest();
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a, "utf8");
  const y = Buffer.from(b, "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Binds the donor's details to one Razorpay order so they cannot be swapped later. */
export function signOrderToken(payload: SignedOrder): string {
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${data}.${crypto.createHmac("sha256", signingKey()).update(data).digest("base64url")}`;
}

export function verifyOrderToken(token: string): SignedOrder | null {
  try {
    const [data, sig, extra] = token.split(".");
    if (!data || !sig || extra !== undefined) return null;
    if (!safeEqual(sig, crypto.createHmac("sha256", signingKey()).update(data).digest("base64url"))) return null;
    const p = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SignedOrder;
    return typeof p.exp === "number" && Date.now() <= p.exp && typeof p.orderId === "string" ? p : null;
  } catch {
    return null;
  }
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  return safeEqual(signature, crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex"));
}

/** Proves a message really came from Razorpay's servers. */
export function verifyWebhook(raw: string, signature: string, secret: string) {
  return safeEqual(signature, crypto.createHmac("sha256", secret).update(raw).digest("hex"));
}

const seen = new Set<string>();
const receipts = () => getStore({ name: "receipts", consistency: "strong" });

/**
 * True for the one request that should send this payment's emails. Uses
 * Netlify's shared store when available; otherwise this instance's memory.
 */
export async function claimReceipt(paymentId: string): Promise<boolean> {
  if (seen.has(paymentId)) return false;
  if (seen.size > 5000) seen.clear();
  seen.add(paymentId);
  try {
    return (await receipts().setJSON(paymentId, { at: new Date().toISOString() }, { onlyIfNew: true })).modified;
  } catch {
    return true;
  }
}

/** Lets a later request try again when no email could be sent. */
export async function releaseReceipt(paymentId: string) {
  seen.delete(paymentId);
  try {
    await receipts().delete(paymentId);
  } catch {
    // nothing was stored
  }
}

/** The receipt number belongs to the payment: asking again always gives the same one. */
export function receiptIdFor(paymentId: string, paidAt: Date): string {
  const day = paidAt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).replace(/-/g, "");
  const tag = crypto.createHmac("sha256", signingKey()).update(`receipt:${paymentId}`).digest("hex").slice(0, 8);
  return `RES-DAAN-${day}-${tag.toUpperCase()}`;
}
