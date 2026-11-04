import { NextResponse } from "next/server";
import Razorpay from "razorpay";
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

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`rzp-verify:${ip}`, { limit: 15, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many verification attempts. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const razorpay_order_id =
    typeof body.razorpay_order_id === "string" ? body.razorpay_order_id.trim() : "";
  const razorpay_payment_id =
    typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : "";
  const razorpay_signature =
    typeof body.razorpay_signature === "string" ? body.razorpay_signature.trim() : "";

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature.",
      },
      { status: 400 }
    );
  }

  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !secret) {
    return NextResponse.json(
      { ok: false, error: "Server payment verification credentials are not configured." },
      { status: 500 }
    );
  }

  // 1) Cryptographic HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET) Verification
  const isValidSignature = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    secret
  );

  if (!isValidSignature) {
    return NextResponse.json(
      { ok: false, verified: false, error: "Invalid payment signature. Verification failed." },
      { status: 400 }
    );
  }

  // 2) Server-to-Server Razorpay Payment Status Verification (Prevents any fake payment IDs)
  let actualAmountInr = 0;
  let actualMethod = "RAZORPAY VERIFIED";
  try {
    const razorpay = new Razorpay({ key_id, key_secret: secret });
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      (payment.status !== "captured" && payment.status !== "authorized")
    ) {
      return NextResponse.json(
        {
          ok: false,
          verified: false,
          error: `Payment is not captured/authorized by bank (status: ${payment.status}).`,
        },
        { status: 400 }
      );
    }

    actualAmountInr = Math.round(Number(payment.amount) / 100);
    if (payment.method) {
      actualMethod = String(payment.method).toUpperCase();
    }
  } catch (err) {
    console.error("[api/verify-payment] Failed to verify payment with Razorpay API:", err);
    return NextResponse.json(
      { ok: false, verified: false, error: "Unable to verify payment status with bank gateway." },
      { status: 400 }
    );
  }

  // 3) Replay Attack Protection
  if (isTransactionProcessed(razorpay_payment_id)) {
    return NextResponse.json(
      { ok: false, error: "This payment has already been verified and receipted." },
      { status: 409 }
    );
  }
  markTransactionProcessed(razorpay_payment_id);

  // 4) Extract Optional Donor Name & Email (Receipt Email is sent ONLY if user provided Email)
  const orderToken = typeof body.orderToken === "string" ? body.orderToken : "";
  const tokenPayload = orderToken ? verifyOrderToken(orderToken) : null;

  const rawFormName =
    (typeof body.name === "string" ? body.name.trim() : "") ||
    (tokenPayload?.name && tokenPayload.name !== "Well-Wisher" ? tokenPayload.name : "");
  const rawFormEmail =
    (typeof body.email === "string" ? body.email.trim() : "") ||
    (tokenPayload?.email ? tokenPayload.email.trim() : "");

  const donorName = rawFormName || "Well-Wisher";
  const hasDonorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawFormEmail);
  const amountInr =
    actualAmountInr ||
    tokenPayload?.amount ||
    (typeof body.amount === "number" && body.amount >= 1 ? Math.round(body.amount) : 101);
  const message =
    typeof body.message === "string" && body.message.trim()
      ? body.message.trim().slice(0, 400)
      : "";

  const receiptId = generateReceiptId();
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  let emailDelivered = false;
  if (isMailerConfigured) {
    try {
      const mailRes = await sendDonationEmails({
        receiptId,
        name: donorName,
        email: hasDonorEmail ? rawFormEmail : undefined,
        amount: amountInr,
        paymentMethod: actualMethod,
        transactionId: razorpay_payment_id,
        message: message || undefined,
        timestamp,
      });
      emailDelivered = mailRes.donorEmailSent;
    } catch (err) {
      console.error("[api/verify-payment] Email dispatch error:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    verified: true,
    receiptRequested: hasDonorEmail,
    receipt: {
      receiptId,
      name: donorName,
      email: hasDonorEmail ? rawFormEmail : "",
      amount: amountInr,
      paymentMethod: actualMethod,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      timestamp,
      message,
      emailDelivered,
    },
  });
}
