import "server-only";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Enterprise Donation Security & Cryptographic Integrity Engine
// Protects Team RESCUEN's donation flow against tampering, replay attacks,
// forged callbacks, and timing side-channels.
// ─────────────────────────────────────────────────────────────────────────────

const SECRET_SEED =
  process.env.RAZORPAY_KEY_SECRET ||
  process.env.GMAIL_APP_PASSWORD ||
  process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
  "rescuen-enterprise-hmac-fallback-2026-shield";

// Replay protection cache (bounded in-memory store for serverless instances)
const processedTransactions = new Set<string>();
const MAX_CACHE_SIZE = 5000;

export function isTransactionProcessed(txId: string): boolean {
  return processedTransactions.has(txId.trim().toUpperCase());
}

export function markTransactionProcessed(txId: string): void {
  if (processedTransactions.size >= MAX_CACHE_SIZE) {
    const firstKey = processedTransactions.values().next().value;
    if (firstKey) processedTransactions.delete(firstKey);
  }
  processedTransactions.add(txId.trim().toUpperCase());
}

export type SignedOrderPayload = {
  orderRef: string;
  amount: number;
  email: string;
  name: string;
  exp: number;
};

/**
 * Creates a tamper-proof HMAC-SHA256 signed token binding the exact donation
 * amount, donor email, and order reference.
 */
export function signOrderToken(payload: SignedOrderPayload): string {
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET_SEED).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Verifies a signed order token in constant time (timingSafeEqual) and checks expiry.
 */
export function verifyOrderToken(token: string): SignedOrderPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, providedSig] = parts;
    const expectedSig = crypto.createHmac("sha256", SECRET_SEED).update(data).digest("base64url");

    const bufA = Buffer.from(providedSig, "utf8");
    const bufB = Buffer.from(expectedSig, "utf8");
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SignedOrderPayload;
    if (!decoded || typeof decoded.exp !== "number" || Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Constant-time verification of Razorpay HMAC-SHA256 payment signature.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    const bufA = Buffer.from(signature, "utf8");
    const bufB = Buffer.from(expected, "utf8");
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function generateReceiptId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RES-DAAN-${yyyy}${mm}${dd}-${rand}`;
}

