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

export const isMailerConfigured = true;

const BRAND = "#004aad";
const NAVY = "#0a2540";
const SITE_URL =
  process.env.URL || process.env.DEPLOY_PRIME_URL || "https://rescuen-web.netlify.app";

function getTransport() {
  const user = (process.env.GMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !pass) {
    console.warn("[mailer] GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment.");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
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
  const cleanVisitorEmail = p.email.trim();
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
    replyTo: cleanVisitorEmail,
    subject: `🛟 New RESCUEN enquiry — ${subject}`,
    text: `Name: ${p.name}\nEmail: ${cleanVisitorEmail}\nSubject: ${p.subject || "General"}\n\n${p.message}`,
    attachments: logo ? [logo] : [],
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
        <div style="background:${BRAND};color:#fff;padding:18px 24px;display:flex;align-items:center;gap:12px">
          ${logoImg}<span style="font-size:18px;font-weight:800;letter-spacing:.3px">RESCUEN — New Enquiry</span>
        </div>
        <div style="padding:24px;color:#0a2540">
          <p style="margin:0 0 6px"><b>Name:</b> ${safeName}</p>
          <p style="margin:0 0 6px"><b>Email:</b> ${escapeHtml(cleanVisitorEmail)}</p>
          <p style="margin:0 0 14px"><b>Subject:</b> ${subject}</p>
          <div style="background:#f1f4fa;border-radius:12px;padding:16px;line-height:1.6">${safeMsg}</div>
          <p style="margin:16px 0 0;color:#697089;font-size:13px">Hit “Reply” to answer ${safeName} directly.</p>
        </div>
      </div>`,
  });

  // 2) Premium welcome + thank-you auto-reply to the visitor
  await transport.sendMail({
    from,
    to: cleanVisitorEmail,
    subject: "We received your message — RESCUEN Support",
    attachments: logo ? [logo] : [],
    text: `Hi ${p.name},\n\nThank you for reaching out to RESCUEN Support. Your message has reached our team and we're already looking into it. You can expect a personal reply within 1-2 working days.\n\nYour message:\n"${p.message}"\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
    html: `
      <div style="background:#0b0d12;padding:24px 12px;font-family:Georgia,'Times New Roman',Inter,serif">
        <div style="max-width:560px;margin:auto;background:#12151c;border:1px solid #222836;border-radius:18px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.6)">
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
            <div style="background:#161f30;border:1px solid #233554;border-radius:12px;padding:14px 16px;margin:18px 0;color:#93c5fd;font-size:13px;line-height:1.55">
              Emergency SOS and 24&times;7 safety tools are always accessible directly inside the RESCUEN mobile app.
            </div>
            <p style="margin:24px 0 4px;color:#b8c1d1">Stay safe,</p>
            <p style="margin:0;font-weight:700;color:#ffffff;font-size:16px">Team RESCUEN</p>
          </div>
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
  name?: string;
  email?: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  message?: string;
  timestamp: string;
};

/**
 * Upon verified Razorpay payment:
 *  1) If the user provided their email, sends the Official Dark-Framed Daan Receipt + Greeting
 *     email directly to `p.email.trim()` (exact screenshot style).
 *  2) Always sends an audit notification to Team RESCUEN's inbox (`rescuensupport@gmail.com`).
 */
export async function sendDonationEmails(
  p: DonationEmailPayload
): Promise<{ donorEmailSent: boolean; teamEmailSent: boolean }> {
  const transport = getTransport();
  if (!transport) return { donorEmailSent: false, teamEmailSent: false };

  const toTeam = (process.env.CONTACT_TO || process.env.GMAIL_USER || "rescuensupport@gmail.com").trim();
  const from = `RESCUEN Support <${(process.env.GMAIL_USER || "rescuensupport@gmail.com").trim()}>`;
  const cleanDonorEmail = (p.email || "").trim();
  const hasValidDonorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanDonorEmail);

  const displayName = p.name && p.name.trim() ? p.name.trim() : "Well-Wisher";
  const safeName = escapeHtml(displayName);
  const safeMethod = escapeHtml(p.paymentMethod.toUpperCase());
  const safeTxId = escapeHtml(p.transactionId);
  const safeReceiptId = escapeHtml(p.receiptId);
  const safeMsg = p.message ? escapeHtml(p.message).replace(/\n/g, "<br/>") : "";
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(p.amount);

  const logoImg = `<img src="https://rescuen-web.netlify.app/rescuen-logo.png" width="40" height="40" alt="RESCUEN" style="display:block;border-radius:10px;background:#ffffff;padding:4px" />`;

  let donorEmailSent = false;
  let teamEmailSent = false;

  // 1) Send Official Receipt & Greeting Email to Donor ONLY IF they provided a valid email
  if (hasValidDonorEmail) {
    try {
      await transport.sendMail({
        from,
        to: cleanDonorEmail,
        replyTo: toTeam,
        subject: `Official Contribution Receipt: ${formattedAmount} - Team RESCUEN`,
        headers: {
          "Auto-Submitted": "auto-generated",
          "X-Entity-Ref-ID": safeReceiptId,
        },
        text: `Hi ${displayName},\n\nThank you for supporting Team RESCUEN. Your voluntary contribution of ${formattedAmount} has been verified and recorded.\n\nOFFICIAL CONTRIBUTION RECEIPT\nReceipt ID: ${p.receiptId}\nSupporter: ${displayName}\nAmount Contributed: ${formattedAmount}\nPayment Method: ${p.paymentMethod.toUpperCase()}\nTransaction Reference: ${p.transactionId}\nDate & Time: ${p.timestamp}\n\nYour contribution fuels Team RESCUEN's 24x7 emergency SOS infrastructure and keeps women safety 100% free.\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
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

              <!-- Cartoon Illustration & Warm Namaste Greeting Banner -->
              <div style="background:#171c26;padding:22px 20px 16px;text-align:center;border-bottom:1px solid #232a38">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:auto;max-width:320px">
                  <tr>
                    <td style="text-align:center">
                      <img src="https://rescuen-web.netlify.app/namaste-illustration.svg" alt="Namaste from Team RESCUEN" width="280" style="display:block;margin:0 auto;max-width:100%;height:auto;border-radius:14px" />
                    </td>
                  </tr>
                </table>
                <div style="margin-top:14px;font-family:Inter,Arial,sans-serif;font-size:11px;font-weight:700;color:#fbbf24;letter-spacing:1px;text-transform:uppercase">
                  🙏 KOTI-KOTI DHANYAVAAD · CITIZEN SAFETY PARTNER 🙏
                </div>
              </div>

              <!-- Dark Luxury Body -->
              <div style="padding:28px 24px;color:#e5e9f0;line-height:1.65;font-size:15px">
                <div style="font-size:22px;font-weight:700;color:#ffffff;margin-bottom:12px">
                  Namaste ${safeName}, we’ve received your contribution 🙏
                </div>

                <p style="margin:0 0 18px;color:#b8c1d1">
                  Thank you for supporting <b style="color:#ffffff">Team RESCUEN</b>. Your generous contribution of <b style="color:#4ade80;font-size:17px">${formattedAmount}</b> has reached our safety mission. Because of protectors like you, our life-saving emergency SOS tools and Women Protection Shield remain <b style="color:#ffffff">100% free</b> for every citizen across the nation.
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
                      <td style="color:#8b96a9;padding:2px 0">Reference / Payment ID:</td>
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
                           <div style="font-family:Inter,Arial,sans-serif;font-size:10.5px;color:#7e8b9f;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px">YOUR MESSAGE TO TEAM RESCUEN</div>
                           <div style="color:#e5e9f0;font-style:italic">“${safeMsg}”</div>
                         </div>`
                      : ""
                  }
                </div>

                <p style="margin:24px 0 4px;color:#b8c1d1">With sincere gratitude &amp; respect,</p>
                <p style="margin:0;font-weight:700;color:#ffffff;font-size:16px">Team RESCUEN</p>
                <p style="margin:2px 0 0;color:#93c5fd;font-size:12px">Surakshit Bharat Mission</p>
              </div>

              <!-- Deep Navy Footer -->
              <div style="background:#082347;color:#8fa6c9;padding:18px 24px;font-size:12px;text-align:center;line-height:1.6">
                RESCUEN — Women’s safety, reimagined.<br/>
                This is an official automated receipt · Keep this email for your personal financial records.
              </div>
            </div>
          </div>`,
      });
      donorEmailSent = true;
    } catch (err) {
      console.error("[mailer] Failed to send donation receipt to donor:", cleanDonorEmail, err);
    }
  }

  // 2) Internal Audit Notification to Team RESCUEN Inbox
  if (toTeam) {
    try {
      await transport.sendMail({
        from,
        to: toTeam,
        replyTo: hasValidDonorEmail ? cleanDonorEmail : undefined,
        subject: `🙏 New RESCUEN Daan Verified: ${formattedAmount} from ${displayName} (${safeMethod})`,
        attachments: [],
        text: `New Verified Donation Received for Team RESCUEN!\n\nReceipt ID: ${p.receiptId}\nDonor: ${displayName} (${cleanDonorEmail || "No email provided"})\nAmount: ${formattedAmount}\nMethod: ${p.paymentMethod}\nTransaction ID: ${p.transactionId}\nTime: ${p.timestamp}\nMessage: ${p.message || "None"}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
            <div style="background:${BRAND};color:#fff;padding:18px 24px;display:flex;align-items:center;gap:12px">
              ${logoImg}<span style="font-size:18px;font-weight:800">Team RESCUEN — Verified Daan (${formattedAmount})</span>
            </div>
            <div style="padding:24px;color:#0a2540;line-height:1.6">
              <p style="margin:0 0 6px"><b>Receipt ID:</b> ${safeReceiptId}</p>
              <p style="margin:0 0 6px"><b>Supporter Name:</b> ${safeName}</p>
              <p style="margin:0 0 6px"><b>Supporter Email:</b> ${
                hasValidDonorEmail ? escapeHtml(cleanDonorEmail) : "<i>Optional (Not provided)</i>"
              }</p>
              <p style="margin:0 0 6px"><b>Amount:</b> <span style="color:#1f8f4f;font-weight:800">${formattedAmount}</span></p>
              <p style="margin:0 0 6px"><b>Payment Method:</b> ${safeMethod}</p>
              <p style="margin:0 0 6px"><b>Razorpay Payment ID:</b> <code>${safeTxId}</code></p>
              <p style="margin:0 0 12px"><b>Timestamp:</b> ${escapeHtml(p.timestamp)}</p>
              ${
                safeMsg
                  ? `<div style="background:#f1f4fa;border-radius:12px;padding:14px"><b>Supporter Message:</b><br/>${safeMsg}</div>`
                  : ""
              }
            </div>
          </div>`,
      });
      teamEmailSent = true;
    } catch (err) {
      console.error("[mailer] Failed to send internal donation notification:", err);
    }
  }

  return { donorEmailSent, teamEmailSent };
}
