import "server-only";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Email via Gmail SMTP (server only). Uses a Gmail *App Password*
// (NOT your normal password). Create one at:
//   Google Account → Security → 2-Step Verification → App passwords
//
// .env.local:
//   GMAIL_USER=rescuensupport@gmail.com
//   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
//   CONTACT_TO=rescuensupport@gmail.com   (where enquiries & donation alerts land)
// ─────────────────────────────────────────────────────────────

export const isMailerConfigured =
  !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;

const BRAND = "#004aad";
const NAVY = "#0a2540";
const SITE_URL =
  process.env.URL || process.env.DEPLOY_PRIME_URL || "https://rescuen-web.netlify.app";

function getTransport() {
  if (!isMailerConfigured) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

/** Inline logo as a CID attachment when the file is readable; else null. */
function getLogoAttachment() {
  try {
    const p = path.join(process.cwd(), "public", "rescuen-logo.png");
    return { filename: "rescuen-logo.png", content: fs.readFileSync(p), cid: "rescuenlogo" };
  } catch {
    return null;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type ContactPayload = { name: string; email: string; message: string; subject?: string };

/**
 * Sends two emails:
 *  1) the enquiry to the RESCUEN support inbox (Reply-To = the visitor,
 *     so support can just hit "Reply" in Gmail), and
 *  2) a premium, branded welcome + thank-you auto-reply to the visitor.
 */
export async function sendContactEmails(p: ContactPayload): Promise<{ sent: boolean }> {
  const transport = getTransport();
  if (!transport) return { sent: false };

  const to = process.env.CONTACT_TO || process.env.GMAIL_USER!;
  const from = `RESCUEN Support <${process.env.GMAIL_USER}>`;
  const safeName = escapeHtml(p.name);
  const safeMsg = escapeHtml(p.message).replace(/\n/g, "<br/>");
  const subject = p.subject ? escapeHtml(p.subject) : "General enquiry";

  const logo = getLogoAttachment();
  const logoImg = logo
    ? `<img src="cid:rescuenlogo" width="44" height="44" alt="RESCUEN" style="display:block;border-radius:10px;background:#fff" />`
    : `<img src="${SITE_URL}/rescuen-logo.png" width="44" height="44" alt="RESCUEN" style="display:block;border-radius:10px;background:#fff" />`;

  // 1) Notification to support inbox
  await transport.sendMail({
    from,
    to,
    replyTo: `${p.name} <${p.email}>`,
    subject: `🛟 New RESCUEN enquiry — ${subject}`,
    text: `Name: ${p.name}\nEmail: ${p.email}\nSubject: ${p.subject || "General"}\n\n${p.message}`,
    attachments: logo ? [logo] : [],
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
        <div style="background:${BRAND};color:#fff;padding:18px 24px;display:flex;align-items:center;gap:12px">
          ${logoImg}<span style="font-size:18px;font-weight:800;letter-spacing:.3px">RESCUEN — New Enquiry</span>
        </div>
        <div style="padding:24px;color:#0a2540">
          <p style="margin:0 0 6px"><b>Name:</b> ${safeName}</p>
          <p style="margin:0 0 6px"><b>Email:</b> ${escapeHtml(p.email)}</p>
          <p style="margin:0 0 14px"><b>Subject:</b> ${subject}</p>
          <div style="background:#f1f4fa;border-radius:12px;padding:16px;line-height:1.6">${safeMsg}</div>
          <p style="margin:16px 0 0;color:#697089;font-size:13px">Hit “Reply” to answer ${safeName} directly.</p>
        </div>
      </div>`,
  });

  // 2) Premium welcome + thank-you auto-reply to the visitor
  await transport.sendMail({
    from,
    to: `${p.name} <${p.email}>`,
    subject: "We received your message — RESCUEN Support",
    attachments: logo ? [logo] : [],
    text: `Hi ${p.name},\n\nThank you for reaching out to RESCUEN Support. Your message has reached our team and we're already looking into it. You can expect a personal reply within 1-2 working days.\n\nYour message:\n"${p.message}"\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
    html: `
      <div style="background:#0b0d12;padding:24px 12px;font-family:Georgia,'Times New Roman',Inter,serif">
        <div style="max-width:560px;margin:auto;background:#12151c;border:1px solid #222836;border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.6)">
          <!-- Royal Blue Brand Header -->
          <div style="background:#004aad;padding:22px 24px;text-align:center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:auto">
              <tr>
                <td style="background:#ffffff;border-radius:12px;padding:6px;vertical-align:middle">
                  ${logoImg}
                </td>
                <td style="padding-left:14px;vertical-align:middle;color:#ffffff;font-family:Georgia,serif;font-size:24px;font-weight:700;letter-spacing:1.2px">
                  RESCUEN
                </td>
              </tr>
            </table>
          </div>
          <!-- Dark Luxury Body -->
          <div style="padding:30px 26px;color:#e5e9f0;line-height:1.65;font-size:15px">
            <div style="font-size:21px;font-weight:700;color:#ffffff;margin-bottom:14px">
              Hi ${safeName} , we’ve got your message ✅
            </div>
            <p style="margin:0 0 18px;color:#b8c1d1">
              Thank you for reaching out to <b style="color:#ffffff">RESCUEN Support</b>. Your message has reached our team and we’re already looking into it. You can expect a personal reply within <b style="color:#ffffff">1-2 working days</b>.
            </p>
            <div style="background:#1c2029;border-left:4px solid #3b82f6;border-radius:12px;padding:16px 18px;margin:20px 0">
              <div style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#7e8b9f;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px">
                YOUR MESSAGE TO US
              </div>
              <div style="color:#e5e9f0;font-size:15px">${safeMsg}</div>
            </div>
            <div style="background:rgba(230,126,34,0.08);border:1px solid rgba(230,126,34,0.45);border-radius:12px;padding:15px 18px;margin:20px 0;color:#f39c12;font-size:13.5px;line-height:1.55">
              ⚠️ If you are in immediate danger, use the SOS button in the RESCUEN app or call your local emergency number right now — please don’t wait for this email.
            </div>
            <p style="margin:24px 0 4px;color:#b8c1d1">Stay safe,</p>
            <p style="margin:0;font-weight:700;color:#ffffff;font-size:16px">Team RESCUEN</p>
          </div>
          <!-- Deep Navy Footer -->
          <div style="background:#082347;color:#8fa6c9;padding:18px 24px;font-size:12px;text-align:center;line-height:1.6">
            RESCUEN — Women’s safety, reimagined.<br/>
            This is an automated acknowledgement — just reply to this email to add anything more.
          </div>
        </div>
      </div>`,
  });

  return { sent: true };
}

export type DonationEmailPayload = {
  receiptId: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  message?: string;
  timestamp: string;
};

/**
 * Sends two emails upon verified donation / Daan:
 *  1) Official luxury dark-framed Donation Receipt + heartfelt Namaste greeting to the donor
 *     (matching the exact RESCUEN Support dark-card frame & logo layout),
 *  2) Instant audit notification to the Team RESCUEN inbox.
 */
export async function sendDonationEmails(p: DonationEmailPayload): Promise<{ sent: boolean }> {
  const transport = getTransport();
  if (!transport) return { sent: false };

  const toTeam = process.env.CONTACT_TO || process.env.GMAIL_USER!;
  const from = `RESCUEN Support <${process.env.GMAIL_USER}>`;
  const safeName = escapeHtml(p.name);
  const safeMethod = escapeHtml(p.paymentMethod.toUpperCase());
  const safeTxId = escapeHtml(p.transactionId);
  const safeReceiptId = escapeHtml(p.receiptId);
  const safeMsg = p.message ? escapeHtml(p.message).replace(/\n/g, "<br/>") : "";
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(p.amount);

  const logo = getLogoAttachment();
  const logoImg = logo
    ? `<img src="cid:rescuenlogo" width="44" height="44" alt="RESCUEN" style="display:block;border-radius:10px;background:#fff" />`
    : `<img src="${SITE_URL}/rescuen-logo.png" width="44" height="44" alt="RESCUEN" style="display:block;border-radius:10px;background:#fff" />`;

  // 1) Official Donation Receipt & Greeting Email to Donor (Exact Screenshot Style)
  await transport.sendMail({
    from,
    to: `${p.name} <${p.email}>`,
    subject: `We received your contribution (${formattedAmount}) — RESCUEN Support 🙏`,
    attachments: logo ? [logo] : [],
    text: `Namaste ${p.name},\n\nWe've got your generous contribution of ${formattedAmount}! Thank you from the bottom of our hearts for supporting Team RESCUEN.\n\nOFFICIAL DAAN RECEIPT\nReceipt No: ${p.receiptId}\nDonor Name: ${p.name}\nAmount Contributed: ${formattedAmount}\nPayment Mode: ${p.paymentMethod.toUpperCase()}\nTransaction Reference: ${p.transactionId}\nDate: ${p.timestamp}\n\nYour contribution directly empowers Team RESCUEN to keep our life-saving SOS radar, women safety shield, and AI emergency tools 100% free for every citizen.\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
    html: `
      <div style="background:#0b0d12;padding:24px 12px;font-family:Georgia,'Times New Roman',Inter,serif">
        <div style="max-width:560px;margin:auto;background:#12151c;border:1px solid #222836;border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.65)">
          
          <!-- Royal Blue Brand Header (Matches RESCUEN Support Frame) -->
          <div style="background:#004aad;padding:22px 24px;text-align:center">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:auto">
              <tr>
                <td style="background:#ffffff;border-radius:12px;padding:6px;vertical-align:middle">
                  ${logoImg}
                </td>
                <td style="padding-left:14px;vertical-align:middle;color:#ffffff;font-family:Georgia,serif;font-size:24px;font-weight:700;letter-spacing:1.2px">
                  RESCUEN
                </td>
              </tr>
            </table>
          </div>

          <!-- Dark Luxury Body -->
          <div style="padding:30px 26px;color:#e5e9f0;line-height:1.65;font-size:15px">
            <div style="font-size:21px;font-weight:700;color:#ffffff;margin-bottom:14px">
              Namaste ${safeName} 🙏, we’ve received your Daan ✅
            </div>

            <p style="margin:0 0 18px;color:#b8c1d1">
              Koti-koti Dhanyavaad for standing with <b style="color:#ffffff">Team RESCUEN</b>. Your generous contribution of <b style="color:#4ade80;font-size:17px">${formattedAmount}</b> has been safely received. Because of protectors like you, our life-saving 1&nbsp;KM SOS Radar, Women Protection Shield, and AI Emergency Companion remain <b style="color:#ffffff">100% free</b> for every citizen in danger.
            </p>

            <!-- Official Daan Receipt Box (Left Blue Accent Bar) -->
            <div style="background:#1c2029;border-left:4px solid #3b82f6;border-radius:12px;padding:18px 20px;margin:22px 0">
              <div style="font-family:Inter,Arial,sans-serif;font-size:11px;color:#7e8b9f;text-transform:uppercase;letter-spacing:0.9px;margin-bottom:12px">
                OFFICIAL CONTRIBUTION RECEIPT · TEAM RESCUEN
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#d8dee9;line-height:1.8">
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Receipt ID:</td>
                  <td style="text-align:right;font-weight:700;color:#ffffff;font-family:monospace">${safeReceiptId}</td>
                </tr>
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Supporter Name:</td>
                  <td style="text-align:right;font-weight:700;color:#ffffff">${safeName}</td>
                </tr>
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Amount Contributed:</td>
                  <td style="text-align:right;font-weight:800;color:#4ade80;font-size:16px">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Payment Mode:</td>
                  <td style="text-align:right;font-weight:600;color:#93c5fd">${safeMethod}</td>
                </tr>
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Reference / Txn ID:</td>
                  <td style="text-align:right;font-weight:600;color:#ffffff;font-family:monospace">${safeTxId}</td>
                </tr>
                <tr>
                  <td style="color:#8b96a9;padding:2px 0">Date &amp; Time:</td>
                  <td style="text-align:right;color:#b8c1d1">${escapeHtml(p.timestamp)}</td>
                </tr>
              </table>
              ${
                safeMsg
                  ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid #2a303c">
                       <div style="font-family:Inter,Arial,sans-serif;font-size:10.5px;color:#7e8b9f;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">YOUR BLESSING FOR TEAM RESCUEN</div>
                       <div style="color:#e5e9f0;font-style:italic">“${safeMsg}”</div>
                     </div>`
                  : ""
              }
            </div>

            <!-- Signature Amber Emergency Notice Box -->
            <div style="background:rgba(230,126,34,0.08);border:1px solid rgba(230,126,34,0.45);border-radius:12px;padding:15px 18px;margin:20px 0;color:#f39c12;font-size:13.5px;line-height:1.55">
              ⚠️ If you are in immediate danger, use the SOS button in the RESCUEN app or call your local emergency number right now — please don’t wait for this email.
            </div>

            <p style="margin:24px 0 4px;color:#b8c1d1">Stay safe &amp; blessed,</p>
            <p style="margin:0;font-weight:700;color:#ffffff;font-size:16px">Team RESCUEN</p>
          </div>

          <!-- Deep Navy Footer -->
          <div style="background:#082347;color:#8fa6c9;padding:18px 24px;font-size:12px;text-align:center;line-height:1.6">
            RESCUEN — Women’s safety, reimagined.<br/>
            This is an automated acknowledgement &amp; contribution receipt — just reply to this email to add anything more.
          </div>
        </div>
      </div>`,
  });

  // 2) Internal Audit Notification to Team RESCUEN Inbox
  await transport.sendMail({
    from,
    to: toTeam,
    replyTo: `${p.name} <${p.email}>`,
    subject: `🙏 New RESCUEN Daan Received: ${formattedAmount} from ${p.name} (${safeMethod})`,
    attachments: logo ? [logo] : [],
    text: `New Donation Received for Team RESCUEN!\n\nReceipt ID: ${p.receiptId}\nDonor: ${p.name} (${p.email})\nAmount: ${formattedAmount}\nMethod: ${p.paymentMethod}\nTransaction ID: ${p.transactionId}\nTime: ${p.timestamp}\nMessage: ${p.message || "None"}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
        <div style="background:${BRAND};color:#fff;padding:18px 24px;display:flex;align-items:center;gap:12px">
          ${logoImg}<span style="font-size:18px;font-weight:800">Team RESCUEN — New Contribution (${formattedAmount})</span>
        </div>
        <div style="padding:24px;color:#0a2540;line-height:1.6">
          <p style="margin:0 0 6px"><b>Receipt ID:</b> ${safeReceiptId}</p>
          <p style="margin:0 0 6px"><b>Supporter Name:</b> ${safeName}</p>
          <p style="margin:0 0 6px"><b>Supporter Email:</b> ${escapeHtml(p.email)}</p>
          <p style="margin:0 0 6px"><b>Amount:</b> <span style="color:#1f8f4f;font-weight:800">${formattedAmount}</span></p>
          <p style="margin:0 0 6px"><b>Payment Method:</b> ${safeMethod}</p>
          <p style="margin:0 0 6px"><b>Transaction / UTR ID:</b> <code>${safeTxId}</code></p>
          <p style="margin:0 0 12px"><b>Timestamp:</b> ${escapeHtml(p.timestamp)}</p>
          ${
            safeMsg
              ? `<div style="background:#f1f4fa;border-radius:12px;padding:14px"><b>Supporter Message:</b><br/>${safeMsg}</div>`
              : ""
          }
        </div>
      </div>`,
  });

  return { sent: true };
}
