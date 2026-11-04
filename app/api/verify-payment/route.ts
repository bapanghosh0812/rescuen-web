import { NextResponse } from "next/server";
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

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Server payment verification secret is not configured." },
      { status: 500 }
    );
  }

  // Step 3: Verify HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    secret
  );

  if (!isValid) {
    return NextResponse.json(
      { ok: false, verified: false, error: "Invalid payment signature. Verification failed." },
      { status: 400 }
    );
  }

  if (isTransactionProcessed(razorpay_payment_id)) {
    return NextResponse.json(
      { ok: false, error: "Payment ID has already been verified and processed." },
      { status: 409 }
    );
  }
  markTransactionProcessed(razorpay_payment_id);

  // Extract donor metadata from signed orderToken if provided, else fallback to request fields
  const orderToken = typeof body.orderToken === "string" ? body.orderToken : "";
  const tokenPayload = orderToken ? verifyOrderToken(orderToken) : null;

  const donorName =
    tokenPayload?.name ||
    (typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Valued Supporter");
  const donorEmail =
    tokenPayload?.email ||
    (typeof body.email === "string" && body.email.trim() ? body.email.trim() : "");
  const amountInr =
    tokenPayload?.amount ||
    (typeof body.amount === "number" && body.amount >= 1 ? Math.round(body.amount) : 101);
  const paymentMethod =
    typeof body.paymentMethod === "string" && body.paymentMethod.trim()
      ? body.paymentMethod.trim().toUpperCase()
      : "RAZORPAY VERIFIED";
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
  if (isMailerConfigured && donorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
    try {
      const mailRes = await sendDonationEmails({
        receiptId,
        name: donorName,
        email: donorEmail,
        amount: amountInr,
        paymentMethod,
        transactionId: razorpay_payment_id,
        message: message || undefined,
        timestamp,
      });
      emailDelivered = mailRes.sent;
    } catch (err) {
      console.error("[api/verify-payment] Email dispatch error:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    verified: true,
    receipt: {
      receiptId,
      name: donorName,
      email: donorEmail,
      amount: amountInr,
      paymentMethod,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id,
      timestamp,
      message,
      emailDelivered,
    },
  });
}

