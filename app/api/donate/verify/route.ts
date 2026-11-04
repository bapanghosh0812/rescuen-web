import { POST as verifyPaymentPost } from "@/app/api/verify-payment/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return verifyPaymentPost(req);
}
