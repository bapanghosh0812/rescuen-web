import "server-only";
import { claimReceipt, receiptIdFor, releaseReceipt } from "@/lib/donation-security";
import { sendDonationEmails } from "@/lib/mailer";
import type { Settled } from "@/lib/razorpay";

export function buildReceipt(p: {
  paymentId: string;
  orderId: string;
  settled: Settled;
  name: string;
  email: string;
  message: string;
}) {
  return {
    receiptId: receiptIdFor(p.paymentId, p.settled.paidAt),
    name: p.name || "Well-Wisher",
    email: p.email,
    amount: p.settled.amount,
    paymentMethod: p.settled.method,
    transactionId: p.paymentId,
    orderId: p.orderId,
    timestamp: p.settled.paidAt.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "long",
      timeStyle: "short",
    }),
    message: p.message,
  };
}

/** Emails a receipt exactly once, whichever of the browser or the bank reports the payment first. */
export async function deliverReceipt(receipt: ReturnType<typeof buildReceipt>): Promise<boolean> {
  const id = receipt.transactionId;
  if (!(await claimReceipt(id))) return Boolean(receipt.email);
  try {
    const mail = await sendDonationEmails({ ...receipt, email: receipt.email || undefined });
    if (!mail.donorEmailSent && !mail.teamEmailSent) await releaseReceipt(id);
    return mail.donorEmailSent;
  } catch {
    console.error("[receipt] email failed");
    await releaseReceipt(id);
    return false;
  }
}
