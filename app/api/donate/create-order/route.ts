import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { signOrderToken } from "@/lib/donation-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  // Name and Email are 100% optional! Only users who fill Email receive the receipt email.
  name: z.string().trim().max(80, "Name is too long.").optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address or leave it blank.")
    .max(120, "Email is too long.")
    .optional()
    .or(z.literal("")),
  amount: z
    .number()
    .int("Amount must be a whole rupee amount.")
    .min(1, "Minimum contribution is ₹1 (100 paise).")
    .max(100000, "Maximum single contribution is ₹1,00,000."),
  method: z.enum(["upi", "qr", "card", "wallet", "netbanking"]),
  message: z.string().trim().max(400, "Message must be under 400 characters.").optional(),
  // Honeypot field against automated bots
  company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limited = rateLimit(`donate-order:${ip}`, { limit: 20, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many payment attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid input fields." },
      { status: 400 }
    );
  }

  // Bot honeypot triggered
  if (parsed.data.company) {
    return NextResponse.json({ ok: false, error: "Request blocked." }, { status: 400 });
  }

  const cleanName = parsed.data.name ? parsed.data.name.trim() : "";
  const cleanEmail = parsed.data.email ? parsed.data.email.trim() : "";
  const { amount, method } = parsed.data;
  const amountInPaise = amount * 100; // Minimum 100 paise (₹1)
  const orderRef = `ORD_${Date.now()}_${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  // Sign tamper-proof token valid for 20 minutes
  const orderToken = signOrderToken({
    orderRef,
    amount,
    email: cleanEmail,
    name: cleanName || "Well-Wisher",
    exp: Date.now() + 20 * 60 * 1000,
  });

  const rzpKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKeyId || !rzpKeySecret) {
    return NextResponse.json(
      { ok: false, error: "Payment gateway credentials are not configured on the server." },
      { status: 401 }
    );
  }

  try {
    const razorpay = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpKeySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderRef,
      notes: {
        supporter_name: cleanName || "Well-Wisher (Anonymous)",
        supporter_email: cleanEmail || "not_provided",
        preferred_method: method,
        platform: "RESCUEN Official Web",
      },
    });

    return NextResponse.json({
      ok: true,
      mode: "razorpay",
      keyId: rzpKeyId,
      order_id: order.id,
      razorpayOrderId: order.id,
      amount: order.amount, // in paise
      amountInr: amount, // in INR
      currency: order.currency,
      orderRef,
      orderToken,
    });
  } catch (err: unknown) {
    console.error("[donate/create-order] Razorpay SDK error:", err);
    const statusCode =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 500;

    if (statusCode === 401) {
      return NextResponse.json(
        { ok: false, error: "Razorpay authentication failed. Please verify API keys." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { ok: false, error: "Failed to create order with Razorpay." },
      { status: 500 }
    );
  }
}
