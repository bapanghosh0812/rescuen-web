import type { Metadata } from "next";
import LegalShell, { type Section } from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers regarding the use of RESCUEN safety services.",
};

const sections: Section[] = [
  {
    id: "safety",
    heading: "1. Not a Replacement for Emergency Services",
    body: [
      "RESCUEN is a personal-safety assistance tool. It is not an emergency service and does not dispatch police, medical, or rescue personnel. In any emergency, always contact official services first — in India, dial 112 (or 100 police, 108 ambulance, 101 fire).",
      "Never rely on RESCUEN as your only means of obtaining help.",
    ],
  },
  {
    id: "no-guarantee",
    heading: "2. No Guarantee of Delivery or Outcome",
    body: [
      "We do not guarantee that alerts, notifications, location data, or AI guidance will be timely, accurate, delivered, received, or acted upon. Performance depends on your device, battery, GPS, network, connectivity, third-party providers, and the availability of your contacts — all of which are outside our control.",
    ],
  },
  {
    id: "ai",
    heading: "3. AI Guidance Disclaimer",
    body: [
      "The AI Safety Companion provides general informational guidance only. It does not provide professional medical, legal, psychological, or emergency advice, and may occasionally be inaccurate or incomplete. Always use your own judgement and consult qualified professionals or emergency services where appropriate.",
    ],
  },
  {
    id: "external",
    heading: "4. External Links & Third Parties",
    body: [
      "Our Services may reference or link to third-party websites, apps, and services. We are not responsible for their content, policies, accuracy, or practices. Accessing them is at your own risk.",
    ],
  },
  {
    id: "liability",
    heading: "5. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, RESCUEN and its team accept no liability for any loss, injury, or damage arising from your use of, or reliance on, the Services. Your use of the Services is entirely at your own risk. Please also read our full Terms & Conditions.",
    ],
  },
  {
    id: "contact",
    heading: "6. Contact",
    body: [`Questions about this disclaimer? Email ${SITE.supportEmail}.`],
  },
];

export default function DisclaimerPage() {
  return (
    <LegalShell
      title="Disclaimer"
      updated="17 September 2026"
      intro="Please understand the limits of what RESCUEN can and cannot do before you rely on it."
      sections={sections}
    />
  );
}
