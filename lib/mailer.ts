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
//   CONTACT_TO=rescuensupport@gmail.com   (where enquiries land)
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
    subject: "Welcome to RESCUEN 🛡️ — we’ve received your message",
    attachments: logo ? [logo] : [],
    text: `Hi ${p.name},\n\nWelcome to RESCUEN — and thank you for reaching out! We’ve received your message and our team will get back to you shortly (usually within 24 hours).\n\nYour message:\n"${p.message}"\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
    html: `
      <div style="background:#f1f4fa;padding:24px 0;font-family:Inter,Arial,sans-serif">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 18px 40px -20px rgba(10,37,64,.25)">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1257bd 0%,${BRAND} 52%,${NAVY} 100%);padding:34px 28px;text-align:center">
            <div style="display:inline-block;background:#fff;border-radius:16px;padding:10px;margin-bottom:14px">
              ${logoImg.replace('width="44" height="44"', 'width="54" height="54"')}
            </div>
            <div style="color:#fff;font-size:24px;font-weight:800;letter-spacing:.4px">Welcome to RESCUEN 🎉</div>
            <div style="color:#d7e2fb;font-size:14px;margin-top:6px">Your Personal Safety Companion</div>
          </div>
          <!-- Body -->
          <div style="padding:30px 28px;color:${NAVY};line-height:1.65">
            <p style="margin:0 0 12px;font-size:16px">Hi <b>${safeName}</b>,</p>
            <p style="margin:0 0 12px">Thank you for reaching out to <b>RESCUEN</b>. We’re genuinely glad you’re here. Your message has reached our team and we’ll get back to you shortly — usually within <b>24 hours</b>.</p>
            <div style="background:#f1f4fa;border-left:4px solid ${BRAND};border-radius:12px;padding:14px 16px;margin:18px 0">
              <div style="font-size:11px;color:#697089;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">Your message</div>
              <div style="color:#37415a">${safeMsg}</div>
            </div>
            <p style="margin:0 0 20px">Meanwhile, feel free to explore the app and our channels:</p>
            <div style="text-align:center;margin:0 0 8px">
              <a href="${SITE.appStoreUrl}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px;margin:4px">📲 Get the App</a>
              <a href="${SITE.instagram}" style="display:inline-block;background:#fff;border:1px solid #e5e9f2;color:${NAVY};text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px;margin:4px">Instagram</a>
            </div>
            <p style="margin:22px 0 2px">Stay safe,</p>
            <p style="margin:0;font-weight:800;color:${BRAND}">Team RESCUEN</p>
          </div>
          <!-- Footer -->
          <div style="background:${NAVY};color:#9fb0c9;padding:18px 28px;font-size:12px;text-align:center;line-height:1.6">
            RESCUEN · A Safer India, A Brighter Tomorrow<br/>
            For your safety, we’ll never ask for your OTP, password or payment details over email.
          </div>
        </div>
      </div>`,
  });

  return { sent: true };
}
