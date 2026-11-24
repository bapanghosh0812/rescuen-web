import "server-only";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

// Email through Gmail SMTP (server only), using an app password from
// GMAIL_USER / GMAIL_APP_PASSWORD. CONTACT_TO is the support inbox.

const BRAND = "#004aad";
const SITE_URL = SITE.url;

function getTransport() {
  const user = (process.env.GMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!user || !pass) {
    console.error("[mailer] mail credentials are not set");
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}

/** Inline logo as a CID attachment when the file is readable; else null. */
function getLogoAttachment() {
  try {
    const file = path.join(process.cwd(), "public", "rescuen-logo.png");
    return { filename: "rescuen-logo.png", content: fs.readFileSync(file), cid: "rescuenlogo" };
  } catch {
    return null;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A single header-safe line (no line breaks, no angle brackets). */
function line(s: string, max: number) {
  return s
    .replace(/[\u0000-\u001f\u007f<>]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** A name that is safe to greet someone with: letters only, no links or sentences. */
function greetingName(s: string) {
  const name = line(s, 40);
  return /^[\p{L}\p{M}][\p{L}\p{M}'’ -]{0,39}$/u.test(name) && name.split(" ").length <= 4 ? name : "there";
}

export function newReference(prefix: string) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

// At most two automatic replies per address per day, so nobody can use the form to flood an inbox.
const replied = new Map<string, number[]>();
function mayAutoReply(email: string) {
  const key = email.toLowerCase();
  const dayAgo = Date.now() - 24 * 60 * 60_000;
  const recent = (replied.get(key) || []).filter((t) => t > dayAgo);
  if (recent.length >= 2) return false;
  if (replied.size > 5000) replied.clear();
  replied.set(key, [...recent, Date.now()]);
  return true;
}

type ContactPayload = { name: string; email: string; message: string; subject?: string };

/** Delivers an enquiry to the support inbox, then sends the visitor a short confirmation. */
export async function sendContactEmails(
  p: ContactPayload
): Promise<{ sent: boolean; replied: boolean; ref: string }> {
  const ref = newReference("RES");
  const transport = getTransport();
  if (!transport) return { sent: false, replied: false, ref };

  const from = `RESCUEN Support <${process.env.GMAIL_USER}>`;
  const email = line(p.email, 120);
  const name = line(p.name, 80);
  const subject = line(p.subject || "", 120) || "General enquiry";
  const logo = getLogoAttachment();
  const logoSrc = logo ? "cid:rescuenlogo" : `${SITE_URL}/rescuen-logo.png`;
  const logoImg = `<img src="${logoSrc}" width="44" height="44" alt="RESCUEN" style="display:block;border-radius:10px;background:#fff" />`;
  const attachments = logo ? [logo] : [];

  await transport.sendMail({
    from,
    to: process.env.CONTACT_TO || process.env.GMAIL_USER,
    replyTo: email,
    subject: `New RESCUEN enquiry: ${subject} [${ref}]`,
    text: `Reference: ${ref}\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${p.message}`,
    attachments,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
        <div style="background:${BRAND};color:#fff;padding:18px 24px">
          ${logoImg}<div style="margin-top:10px;font-size:18px;font-weight:800;letter-spacing:.3px">New enquiry · ${ref}</div>
        </div>
        <div style="padding:24px;color:#0a2540">
          <p style="margin:0 0 6px"><b>Name:</b> ${escapeHtml(name)}</p>
          <p style="margin:0 0 6px"><b>Email:</b> ${escapeHtml(email)}</p>
          <p style="margin:0 0 14px"><b>Subject:</b> ${escapeHtml(subject)}</p>
          <div style="background:#f1f4fa;border-radius:12px;padding:16px;line-height:1.6">${escapeHtml(p.message).replace(/\n/g, "<br/>")}</div>
          <p style="margin:16px 0 0;color:#697089;font-size:13px">Press “Reply” to answer ${escapeHtml(name)} directly.</p>
        </div>
      </div>`,
  });

  let didReply = false;
  if (mayAutoReply(email)) {
    const hello = greetingName(p.name);
    try {
      // The visitor's own text is deliberately not repeated here: the address is unverified.
      await transport.sendMail({
        from,
        to: email,
        subject: `We received your message [${ref}]`,
        headers: { "Auto-Submitted": "auto-replied" },
        attachments,
        text: `Hi ${hello},\n\nThank you for reaching out to RESCUEN Support. Your message has reached our team and you can expect a personal reply within 1-2 working days.\n\nYour reference: ${ref}\n\nIf you are in danger right now, call 112 first.\n\nStay safe,\nTeam RESCUEN\n${SITE_URL}`,
        html: `
          <div style="background:#0b0d12;padding:24px 12px;font-family:Georgia,'Times New Roman',serif">
            <div style="max-width:560px;margin:auto;background:#12151c;border:1px solid #222836;border-radius:18px;overflow:hidden">
              <div style="background:${BRAND};padding:22px 24px;text-align:center">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:auto"><tr>
                  <td style="background:#ffffff;border-radius:12px;padding:6px;vertical-align:middle">${logoImg}</td>
                  <td style="padding-left:14px;vertical-align:middle;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1.2px">RESCUEN</td>
                </tr></table>
              </div>
              <div style="padding:30px 26px;color:#e5e9f0;line-height:1.65;font-size:15px">
                <div style="font-size:21px;font-weight:700;color:#ffffff;margin-bottom:14px">Hi ${escapeHtml(hello)}, we’ve got your message</div>
                <p style="margin:0 0 18px;color:#b8c1d1">Thank you for reaching out to <b style="color:#ffffff">RESCUEN Support</b>. Your message has reached our team. You can expect a personal reply within <b style="color:#ffffff">1-2 working days</b>.</p>
                <div style="background:#1c2029;border-left:4px solid #3b82f6;border-radius:12px;padding:16px 18px;margin:20px 0">
                  <div style="font-family:Arial,sans-serif;font-size:11px;color:#8b96a9;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">Your reference</div>
                  <div style="color:#ffffff;font-family:monospace;font-size:17px;font-weight:700">${ref}</div>
                </div>
                <p style="margin:18px 0;color:#93c5fd;font-size:13px">If you are in danger right now, please call 112 first.</p>
                <p style="margin:24px 0 4px;color:#b8c1d1">Stay safe,</p>
                <p style="margin:0;font-weight:700;color:#ffffff;font-size:16px">Team RESCUEN</p>
              </div>
              <div style="background:#082347;color:#8fa6c9;padding:18px 24px;font-size:12px;text-align:center;line-height:1.6">This is an automatic confirmation. Reply to this email to add anything more.</div>
            </div>
          </div>`,
      });
      didReply = true;
    } catch {
      console.error("[mailer] confirmation email failed");
    }
  }
  return { sent: true, replied: didReply, ref };
}

export type IssueReport = {
  ref: string;
  code: string;
  page: string;
  area: string;
  message: string;
  email: string;
  device: string;
};

/** Delivers a visitor's problem report to the support inbox. */
/** What each problem code means, so a report can be acted on straight away. */
const MEANING: Record<string, string> = {
  "E-AUTH-SMS": "SMS codes are off in Firebase (rescuen-web): the Blaze plan is off, or India is not allowed.",
  "E-AUTH-DOMAIN": "This address is missing from Firebase > Authentication > Settings > Authorized domains.",
  "E-AUTH-CHECK": "The robot check did not finish on the visitor's device.",
  "E-AUTH-LIMIT": "Too many sign-in tries from this number or device.",
  "E-AUTH-OTHER": "Sign-in failed for another reason. Check Firebase > Authentication.",
  "E-TOKEN": "The sign-in could not be confirmed. Check the Firebase project ID in the site settings.",
  "E-AI-REST": "The AI service is out of credit or busy. Visitors got the built-in answers instead.",
  "E-MAIL": "Gmail did not accept the message. Check the app password.",
  "E-REPORT": "Gmail did not accept the report. Check the app password.",
  "E-PAY-OFF": "The Razorpay keys are missing from the site settings.",
  "E-PAY-ORDER": "Razorpay refused to start a payment. Check the keys and the account status.",
  "E-PAY-FETCH": "Razorpay could not be reached to confirm a payment.",
  "E-PAY-SIGN": "A payment signature did not match. Check the key secret; if it is right, someone may be tampering.",
  "E-PAY-TOKEN": "A payment came back too late, or with changed details.",
  "E-PAY-STATUS": "The bank has not confirmed this payment.",
};

export async function sendIssueReport(r: IssueReport): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;
  const rows: [string, string][] = [
    ["Reference", r.ref],
    ["Problem code", r.code || "none"],
    ...(MEANING[r.code] ? ([["Meaning", MEANING[r.code]]] as [string, string][]) : []),
    ["Area", r.area || "not given"],
    ["Page", r.page || "not given"],
    ["Reply to", r.email || "not given"],
    ["Device", r.device || "not given"],
  ];
  const note = r.message || "No note was added.";
  await transport.sendMail({
    from: `RESCUEN Reports <${process.env.GMAIL_USER}>`,
    to: process.env.CONTACT_TO || process.env.GMAIL_USER,
    replyTo: r.email || undefined,
    subject: `Website report ${r.ref}${r.code ? ` · ${r.code}` : ""}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${note}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e9f2;border-radius:16px;overflow:hidden">
        <div style="background:${BRAND};color:#fff;padding:18px 24px;font-size:18px;font-weight:800">Website report · ${r.ref}</div>
        <div style="padding:24px;color:#0a2540;line-height:1.6">
          ${rows.map(([k, v]) => `<p style="margin:0 0 6px"><b>${k}:</b> ${escapeHtml(v)}</p>`).join("")}
          <div style="margin-top:14px;background:#f1f4fa;border-radius:12px;padding:16px">${escapeHtml(note).replace(/\n/g, "<br/>")}</div>
        </div>
      </div>`,
  });
  return true;
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

/** Sends the receipt to the donor (if they left an email) and a notice to the team, together. */
export async function sendDonationEmails(
  p: DonationEmailPayload
): Promise<{ donorEmailSent: boolean; teamEmailSent: boolean }> {
  const transport = getTransport();
  if (!transport) return { donorEmailSent: false, teamEmailSent: false };

  const toTeam = (process.env.CONTACT_TO || process.env.GMAIL_USER || "rescuensupport@gmail.com").trim();
  const from = `RESCUEN Support <${(process.env.GMAIL_USER || "rescuensupport@gmail.com").trim()}>`;
  const cleanDonorEmail = (p.email || "").trim();
  const hasValidDonorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanDonorEmail);

  const displayName = line(p.name || "", 80) || "Well-Wisher";
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

  const logoImg = `<img src="${SITE_URL}/rescuen-logo.png" width="40" height="40" alt="RESCUEN" style="display:block;border-radius:10px;background:#ffffff;padding:4px" />`;


  const toDonor = async () => {
    if (!hasValidDonorEmail) return false;
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
                      <img src="${SITE_URL}/daan/namaste-mail.jpg" alt="Namaste from Team RESCUEN" width="280" style="display:block;margin:0 auto;max-width:100%;height:auto;border-radius:14px" />
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
      return true;
    } catch (err) {
      console.error("[mailer] receipt email failed:", (err as { code?: string })?.code ?? "unknown");
      return false;
    }
  };

  const toInbox = async () => {
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
      return true;
    } catch (err) {
      console.error("[mailer] team receipt notice failed:", (err as { code?: string })?.code ?? "unknown");
      return false;
    }
  };

  const [donorEmailSent, teamEmailSent] = await Promise.all([toDonor(), toInbox()]);
  return { donorEmailSent, teamEmailSent };
}
