import LegalShell, { type Section } from "@/components/LegalShell";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: "What RESCUEN collects, why, how it is protected and the choices you have, with a summary in simple words.",
  path: "/legal/privacy",
});

const sections: Section[] = [
  {
    id: "intro",
    heading: "1. Our Commitment to Your Privacy",
    body: [
      `${SITE.legalName} (“RESCUEN”, “we”) respects your privacy and is committed to protecting your personal data. This Policy explains what we collect, why, how we protect it, and the choices and rights you have.`,
      "Because RESCUEN is a safety product, we follow a data-minimisation principle: we collect only what is necessary to keep you safe, and nothing more.",
    ],
  },
  {
    id: "data-we-collect",
    heading: "2. Information We Collect",
    body: [
      { list: [
        "Account data: your phone number (used for OTP sign-in) and, optionally, your name.",
        "Emergency contacts: names and phone numbers you choose to add to your trusted circle.",
        "Location data: collected only when you enable a location-based feature (e.g. radar, live sharing, SOS), and only for as long as needed.",
        "Usage & device data: app version, device type, and basic diagnostics to keep the service reliable and secure.",
        "Support data: information you provide when you contact us or report a problem (e.g. your message, email, the page address, browser type and a problem code).",
        "Website assistant: the questions you type, the last few messages of that chat and the page you are on. They are sent to our AI provider to write a reply. We do not keep a copy on our servers.",
        "Contributions: the name, email and message you choose to give, and the payment reference. Card, bank and UPI details are handled by the payment provider and never reach us.",
      ]},
      "We do not sell your personal data, and we do not use third-party advertising trackers.",
    ],
  },
  {
    id: "how-we-use",
    heading: "3. How We Use Your Data",
    body: [
      { list: [
        "To authenticate you securely and operate your account.",
        "To deliver safety features you activate (alerts, radar, location sharing, AI guidance).",
        "To notify your chosen contacts during an alert you trigger.",
        "To keep the Services secure, prevent abuse, and comply with legal obligations.",
        "To respond to your support requests and improve the product.",
      ]},
    ],
  },
  {
    id: "encryption",
    heading: "4. How We Protect Your Data",
    body: [
      "Security is central to RESCUEN. We apply layered technical and organisational safeguards:",
      { list: [
        "Encryption in transit (TLS) and encryption at rest in Firebase. We intentionally do not describe this as end-to-end encryption.",
        "Passwordless sign-in (Google Sign-In + phone OTP) via Firebase, verified server-side, so there is no password to leak, with a 60-day change-lock on emergency numbers.",
        "Secrets and keys are stored as protected secrets and injected at runtime — never exposed in the browser or the app bundle.",
        "Strict default-deny Firestore & Storage rules, Firebase App Check, server-side proximity filtering, a write-only evidence vault, rate-limiting and input validation.",
      ]},
      "No method of transmission or storage is 100% secure, but we continuously work to protect your data using industry best practices.",
    ],
  },
  {
    id: "sharing",
    heading: "5. When We Share Data",
    body: [
      "We share data only in limited circumstances:",
      { list: [
        "With the emergency contacts you choose, when you trigger an alert.",
        "With trusted service providers strictly to operate the Services: Google (Firebase, Gmail and Gemini, which powers AI replies), Razorpay (payments), Netlify (website hosting) and telecom providers.",
        "When required by law, valid legal process, or to protect the rights, safety, and security of users or the public.",
        "In connection with a merger or acquisition, with notice and continued protection of your data.",
      ]},
    ],
  },
  {
    id: "retention",
    heading: "6. Data Retention",
    body: [
      "We keep your data only as long as necessary for the purposes described here or as required by law. Location trails from features like live sharing auto-expire. When you delete your account, we delete or irreversibly anonymise your personal data, except where retention is legally required.",
    ],
  },
  {
    id: "rights",
    heading: "7. Your Rights",
    body: [
      "Subject to applicable law, you may:",
      { list: [
        "Access the personal data we hold about you.",
        "Correct inaccurate data.",
        "Request deletion of your account and data.",
        "Withdraw consent for optional data processing.",
        "Object to or restrict certain processing.",
      ]},
      `To exercise any right, email ${SITE.supportEmail}. We will respond within the timelines required by law.`,
    ],
  },
  {
    id: "children",
    heading: "8. Children’s Privacy",
    body: [
      "The Services are not directed to children under 18 without parental/guardian consent. We do not knowingly collect data from children without such consent. If you believe a child has provided data without consent, contact us and we will remove it.",
    ],
  },
  {
    id: "cookies",
    heading: "9. Cookies & Similar Technologies",
    body: [
      "Our website uses only essential cookies and privacy-respecting technologies needed to operate securely. See our Cookie Policy for details. We do not use non-essential advertising cookies.",
    ],
  },
  {
    id: "changes",
    heading: "10. Changes & Contact",
    body: [
      "We may update this Policy from time to time; the “Last updated” date shows the latest version. Material changes will be communicated where feasible.",
      `Questions or requests: ${SITE.supportEmail} · ${SITE.address}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      doc="privacy"
      title="Privacy Policy"
      updated="23 November 2026"
      intro="Your safety data is deeply personal — so we protect it obsessively and collect only what we need. Here’s exactly how."
      sections={sections}
    />
  );
}
