import { NextResponse } from "next/server";
import { isMailerConfigured } from "@/lib/mailer";
import { isGeminiConfigured } from "@/lib/gemini";
import { isAdminConfigured } from "@/lib/firebase.admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    services: {
      email: isMailerConfigured,
      ai: isGeminiConfigured,
      firebaseAdmin: isAdminConfigured,
      firebaseWeb: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    },
    time: new Date().toISOString(),
  });
}
