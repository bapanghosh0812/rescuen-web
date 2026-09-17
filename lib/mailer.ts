import "server-only";
import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────
// Email via Gmail SMTP (server only). Uses a Gmail *App Password*
// (NOT your normal password). Create one at:
//   Google Account → Security → 2-Step Verification → App passwords
//
// Set in .env.local:
//   GMAIL_USER=youraddress@gmail.com
//   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx   (16 chars, no spaces)
//   CONTACT_TO=where-support-mail-lands@gmail.com   (optional; defaults to GMAIL_USER)
// ─────────────────────────────────────────────────────────────

export const isMailerConfigured =
  !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;

function getTransport() {
  if (!isMailerConfigured) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const brandColor = "#e11d2a";

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
 *     so support can just hit "Reply" in Gmail to answer them), and
 *  2) a branded auto-acknowledgement back to the visitor.
 */
export async function sendContactEmails(p: ContactPayload): Promise<{ sent: boolean }> {
  const transport = getTransport();
  if (!transport) return { sent: false };

  const to = process.env.CONTACT_TO || process.env.GMAIL_USER!;
  const from = `RESCUEN Website <${process.env.GMAIL_USER}>`;
  const safeName = escapeHtml(p.name);
  const safeMsg = escapeHtml(p.message).replace(/\n/g, "<br/>");
  const subject = p.subject ? escapeHtml(p.subject) : "General enquiry";

  // 1) Notification to support
  await transport.sendMail({
    from,
    to,
    replyTo: `${p.name} <${p.email}>`,
    subject: `🛟 New RESCUEN enquiry — ${subject}`,
    text: `Name: ${p.name}\nEmail: ${p.email}\nSubject: ${p.subject || "General"}\n\n${p.message}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #eee;border-radius:16px;overflow:hidden">
        <div style="background:${brandColor};color:#fff;padding:20px 24px;font-size:18px;font-weight:800">RESCUEN — New Enquiry</div>
        <div style="padding:24px;color:#111">
          <p style="margin:0 0 6px"><b>Name:</b> ${safeName}</p>
          <p style="margin:0 0 6px"><b>Email:</b> ${escapeHtml(p.email)}</p>
          <p style="margin:0 0 14px"><b>Subject:</b> ${subject}</p>
          <div style="background:#f6f7f9;border-radius:12px;padding:16px;line-height:1.6">${safeMsg}</div>
          <p style="margin:16px 0 0;color:#666;font-size:13px">Reply to this email to answer ${safeName} directly.</p>
        </div>
      </div>`,
  });

  // 2) Auto-acknowledgement to the visitor
  await transport.sendMail({
    from,
    to: `${p.name} <${p.email}>`,
    subject: "We’ve received your message — RESCUEN Support",
    text: `Hi ${p.name},\n\nThank you for contacting RESCUEN. Our team has received your message and will reply shortly.\n\nYour message:\n"${p.message}"\n\nStay safe,\nTeam RESCUEN`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #eee;border-radius:16px;overflow:hidden">
        <div style="background:${brandColor};color:#fff;padding:22px 24px;font-size:20px;font-weight:800">RESCUEN</div>
        <div style="padding:26px;color:#111;line-height:1.65">
          <p style="margin:0 0 12px">Hi ${safeName},</p>
          <p style="margin:0 0 12px">Thank you for reaching out to <b>RESCUEN</b>. We’ve received your message and a member of our team will get back to you shortly — usually within 24 hours.</p>
          <div style="background:#f6f7f9;border-left:4px solid ${brandColor};border-radius:10px;padding:14px 16px;margin:14px 0">
            <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Your message</div>
            ${safeMsg}
          </div>
          <p style="margin:0 0 4px">Stay safe,</p>
          <p style="margin:0;font-weight:700">Team RESCUEN</p>
        </div>
        <div style="padding:14px 24px;background:#0b0d17;color:#9aa;font-size:12px">This is an automated confirmation. Please do not share OTPs or passwords over email.</div>
      </div>`,
  });

  return { sent: true };
}
