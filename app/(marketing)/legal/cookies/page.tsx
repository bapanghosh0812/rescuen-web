import type { Metadata } from "next";
import LegalShell, { type Section } from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How RESCUEN uses cookies and similar technologies on its website.",
};

const sections: Section[] = [
  {
    id: "what",
    heading: "1. What Are Cookies?",
    body: [
      "Cookies are small text files stored on your device that help websites function and remember preferences. Similar technologies include local storage and secure tokens.",
    ],
  },
  {
    id: "how",
    heading: "2. How We Use Them",
    body: [
      "We use only what is necessary to run the site securely and reliably:",
      { list: [
        "Essential cookies/tokens for authentication and security (e.g. keeping you signed in, preventing abuse).",
        "Preference storage for basic settings, such as remembering your choices.",
        "Aggregated, privacy-respecting diagnostics to keep the service stable.",
      ]},
      "We do not use third-party advertising or cross-site tracking cookies.",
    ],
  },
  {
    id: "control",
    heading: "3. Managing Cookies",
    body: [
      "You can control or delete cookies through your browser settings. Blocking essential cookies may prevent parts of the site (such as sign-in) from working correctly.",
    ],
  },
  {
    id: "contact",
    heading: "4. Contact",
    body: [`Questions about cookies? Email ${SITE.supportEmail}.`],
  },
];

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      updated="17 September 2026"
      intro="We keep it simple: only essential, privacy-respecting cookies — no ad trackers."
      sections={sections}
    />
  );
}
