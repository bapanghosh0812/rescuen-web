import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Minimal, non-revealing health check (no service/config details exposed).
export function GET() {
  return NextResponse.json({ status: "ok" });
}
