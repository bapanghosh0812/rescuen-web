import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  verifyOrderToken,
  verifyRazorpaySignature,
  isTransactionProcessed,
  markTransactionProcessed,
  generateReceiptId,
} from "@/lib/donation-security";
import { sendDonationEmails, isMailerConfigured } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifySchema = z.object({
  orderToken: z.string().min(20).max(2048),
  mode: z.enum(["razorpay", "upi_direct"]),
  paymentMethod: z.enum(["upi", "qr", "card", "wallet", "netbanking"]),
  message: z.string().trim().max(400).optional(),
  // Razorpay fields
  razorpay_order_id: z.string().max(120).optional(),
  razorpay_payment_id: z.string().max(120).optional(),
  razorpay_signature: z.string().max(256).optional(),
  // Direct UPI UTR / Reference field (12-digit standard NPCI UTR or valid reference)
  upiTransactionId: z.string().trim().max(64).optional(),
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`donate-verify:${ip}`, { limit: 12, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many verification attempts. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid verification data." },
      { status: 400 }
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: false, error: "Blocked." }, { status: 400 });
  }

  // 1) Cryptographically verify the signed orderToken (prevents amount/email tampering)
  const orderPayload = verifyOrderToken(parsed.data.orderToken);
  if (!orderPayload) {
    return NextResponse.json(
      {
        ok: false,
        error: "Session expired or invalid security token. Please initiate the payment again.",
      },
      { status: 400 }
    );
  }

  let verifiedTransactionId = "";

  // 2) Verify payment authenticity based on mode
  if (parsed.data.mode === "razorpay") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !secret) {
      return NextResponse.json(
        { ok: false, error: "Missing payment gateway signature parameters." },
        { status: 400 }
      );
    }

    const isValidSig = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!isValidSig) {
      console.error("[donate/verify] Forged Razorpay signature rejected:", {
        ip,
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        { ok: false, error: "Payment signature verification failed. Tampering detected." },
        { status: 400 }
      );
    }

    verifiedTransactionId = razorpay_payment_id;
  } else {
    // Direct UPI / Dynamic QR confirmation via 12-digit NPCI UTR / Reference ID
    const rawUtr = (parsed.data.upiTransactionId || "").trim();
    if (!/^[A-Za-z0-9]{8,32}$/.test(rawUtr)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please enter a valid 12-digit UPI UTR / Reference ID from your payment app.",
        },
        { status: 400 }
      );
    }
    verifiedTransactionId = rawUtr.toUpperCase();
  }

  // 3) Replay Attack Check — prevent duplicate submissions of the same transaction
  if (isTransactionProcessed(verifiedTransactionId)) {
    return NextResponse.json(
      {
        ok: false,
        error: "This transaction reference has already been verified and receipted.",
      },
      { status: 409 }
    );
  }
  markTransactionProcessed(verifiedTransactionId);

  // 4) Generate Official Receipt & Dispatch Branded Emails
  const receiptId = generateReceiptId();
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  const methodLabel =
    parsed.data.paymentMethod === "qr"
      ? "UPI DYNAMIC QR"
      : parsed.data.paymentMethod.toUpperCase();

  let emailDelivered = false;
  if (isMailerConfigured) {
    try {
      const res = await sendDonationEmails({
        receiptId,
        name: orderPayload.name,
        email: orderPayload.email,
        amount: orderPayload.amount,
        paymentMethod: methodLabel,
        transactionId: verifiedTransactionId,
        message: parsed.data.message,
        timestamp,
      });
      emailDelivered = res.sent;
    } catch (err) {
      console.error("[donate/verify] Email dispatch failed:", err);
    }
  } else {
    console.warn("[donate/verify] Mailer not configured — receipt generated without SMTP:", {
      receiptId,
      name: orderPayload.name,
      amount: orderPayload.amount,
      verifiedTransactionId,
    });
  }

  return NextResponse.json({
    ok: true,
    receipt: {
      receiptId,
      name: orderPayload.name,
      email: orderPayload.email,
      amount: orderPayload.amount,
      paymentMethod: methodLabel,
      transactionId: verifiedTransactionId,
      timestamp,
      message: parsed.data.message || "",
      emailDelivered,
    },
  });
}
