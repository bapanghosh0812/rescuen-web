import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { signOrderToken } from "@/lib/donation-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`rzp-order:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many payment requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) } }
    );
  }

  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return NextResponse.json(
      { ok: false, error: "Razorpay credentials are not configured on server." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // Support both `amount` in paise (>= 100) or `amountInr` in rupees (>= 1)
  const rawAmountPaise =
    typeof body.amount === "number"
      ? Math.round(body.amount)
      : typeof body.amountInr === "number"
      ? Math.round(body.amountInr * 100)
      : 0;

  if (!Number.isInteger(rawAmountPaise) || rawAmountPaise < 100 || rawAmountPaise > 10000000) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid amount. Minimum order amount is 100 paise (₹1) and maximum is ₹1,00,000.",
      },
      { status: 400 }
    );
  }

  const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "INR";
  const receipt =
    typeof body.receipt === "string" && body.receipt.trim()
      ? body.receipt.trim().slice(0, 40)
      : `rcpt_${Date.now()}_${crypto.randomBytes(2).toString("hex")}`;

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Supporter";
  const email =
    typeof body.email === "string" && body.email.trim()
      ? body.email.trim()
      : "supporter@rescuen.app";

  const orderToken = signOrderToken({
    orderRef: receipt,
    amount: Math.round(rawAmountPaise / 100),
    email,
    name,
    exp: Date.now() + 20 * 60 * 1000,
  });

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount: rawAmountPaise,
      currency,
      receipt,
      notes: {
        supporter_name: name,
        supporter_email: email,
        platform: "RESCUEN Official Web",
      },
    });

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id,
      orderToken,
    });
  } catch (err: unknown) {
    console.error("[api/create-order] Razorpay SDK error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}

