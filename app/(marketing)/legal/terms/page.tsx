import type { Metadata } from "next";
import LegalShell, { type Section } from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of the RESCUEN website and app.",
};

const sections: Section[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: [
      `These Terms & Conditions (“Terms”) form a legally binding agreement between you (“User”, “you”) and ${SITE.legalName} (“RESCUEN”, “we”, “us”), governing your access to and use of the RESCUEN website, mobile applications, and related services (collectively, the “Services”).`,
      "By accessing, downloading, registering for, or using the Services in any way, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Services.",
      "RESCUEN is developed and operated by an independent developer (Bapan Ghosh) and is not, at present, a registered company. References to “RESCUEN”, “we”, or “us” mean that individual developer.",
      { note: "This is a general template provided for convenience. It is not legal advice. Please have a qualified lawyer review and adapt these Terms for your jurisdiction before relying on them as final." },
    ],
  },
  {
    id: "nature",
    heading: "2. Nature of the Service — Important Safety Notice",
    body: [
      "RESCUEN is a personal-safety assistance tool designed to help you notify your chosen contacts and access safety features. It is NOT an emergency response service, security agency, medical provider, or a substitute for the police, ambulance, fire, or any government emergency service.",
      { list: [
        "In any emergency, you must first contact official emergency services (in India: 112, police 100, ambulance 108, fire 101).",
        "RESCUEN does not guarantee that any alert, message, location update, or notification will be delivered, received, or acted upon in time or at all.",
        "Delivery depends on factors outside our control, including your device, battery, GPS accuracy, mobile network, internet connectivity, third-party providers, and the availability and response of your contacts.",
        "You must not rely on RESCUEN as your sole or primary means of obtaining help in a life-threatening situation.",
      ]},
    ],
  },
  {
    id: "eligibility",
    heading: "3. Eligibility & Accounts",
    body: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account. If you are a minor, you may use the Services only under the supervision and consent of a parent or legal guardian who agrees to these Terms.",
      "Sign-in is via your phone number and a one-time code (OTP). You are responsible for keeping access to your phone number secure and for all activity that occurs under your account. Notify us immediately of any unauthorised use.",
      "You agree to provide accurate information and to keep your emergency contacts and details up to date. RESCUEN is not responsible for failures caused by inaccurate or outdated information you provide.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "4. Acceptable Use",
    body: [
      "You agree not to misuse the Services. In particular, you must not:",
      { list: [
        "Trigger false alarms, hoax alerts, or misuse SOS, siren, or emergency features.",
        "Use the Services to harass, stalk, surveil, threaten, or harm any person, or to violate anyone’s privacy or rights.",
        "Attempt to hack, reverse-engineer, disrupt, overload, or gain unauthorised access to the Services or their infrastructure.",
        "Upload malware, scrape data, or use the Services for any unlawful, fraudulent, or unauthorised purpose.",
        "Impersonate others or share your account access with unauthorised persons.",
      ]},
      "We may suspend or terminate your access immediately and without notice for any breach, and may report unlawful activity to the authorities.",
    ],
  },
  {
    id: "no-warranty",
    heading: "5. Disclaimer of Warranties",
    body: [
      "THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, TO THE MAXIMUM EXTENT PERMITTED BY LAW.",
      "We expressly disclaim all warranties of merchantability, fitness for a particular purpose, accuracy, reliability, uninterrupted or error-free operation, and non-infringement. We do not warrant that alerts will be delivered, that the Services will be available at any given time, or that defects will be corrected.",
    ],
  },
  {
    id: "liability",
    heading: "6. Limitation of Liability",
    body: [
      "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RESCUEN, its founders, directors, employees, partners, and suppliers shall NOT be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, or for any loss of life, personal injury, property damage, loss of data, loss of profits, or emotional distress, arising out of or relating to your use of, or inability to use, the Services — even if we have been advised of the possibility of such damages.",
      "This includes, without limitation, any harm resulting from a failed, delayed, or undelivered alert; inaccurate location data; a contact’s failure to respond; device, network, or third-party failures; or any decision or action taken (or not taken) in reliance on the Services.",
      "Where liability cannot be excluded by law, our total aggregate liability to you for all claims shall not exceed the greater of (a) the total amount you paid us for the Services in the three (3) months preceding the claim, or (b) INR 1,000.",
    ],
  },
  {
    id: "assumption-risk",
    heading: "7. Assumption of Risk & Indemnity",
    body: [
      "You acknowledge that personal safety involves inherent risks that no technology can eliminate. You use the Services voluntarily and at your own risk, and you accept full responsibility for your own safety decisions.",
      "You agree to indemnify, defend, and hold harmless RESCUEN and its team from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or connected with: (a) your use or misuse of the Services; (b) your breach of these Terms or any law; or (c) your violation of the rights of any third party.",
    ],
  },
  {
    id: "third-parties",
    heading: "8. Third-Party Services",
    body: [
      "The Services rely on third-party providers, including Google Firebase (authentication), mapping and messaging providers, telecom carriers, and AI providers. Your use of such features may also be subject to those providers’ terms. We are not responsible for the acts, omissions, availability, or accuracy of any third party.",
    ],
  },
  {
    id: "ip",
    heading: "9. Intellectual Property",
    body: [
      "All content, trademarks, logos, software, and design in the Services are owned by or licensed to RESCUEN and are protected by law. We grant you a limited, non-exclusive, non-transferable, revocable licence to use the Services for their intended personal purpose. You may not copy, modify, distribute, or create derivative works without our written permission.",
    ],
  },
  {
    id: "payments",
    heading: "10. Subscriptions & Payments",
    body: [
      "Core safety features are offered free of charge. Optional premium features may be offered on a paid basis. Prices, billing cycles, and features are disclosed at the point of purchase. Payments are processed by third-party payment providers; we do not store your full card details. Refunds, where applicable, are governed by our Refund Policy.",
    ],
  },
  {
    id: "termination",
    heading: "11. Suspension & Termination",
    body: [
      "You may stop using the Services and request account deletion at any time. We may suspend, restrict, or terminate your access at our discretion, including for breach of these Terms, suspected misuse, legal requirements, or to protect users. Sections that by their nature should survive termination (including disclaimers, liability limits, and indemnity) will continue to apply.",
    ],
  },
  {
    id: "changes",
    heading: "12. Changes to the Services & Terms",
    body: [
      "We may modify, suspend, or discontinue any part of the Services at any time. We may update these Terms from time to time; the “Last updated” date reflects the latest version. Continued use after changes constitutes acceptance. If a change is material, we will make reasonable efforts to notify you.",
    ],
  },
  {
    id: "law",
    heading: "13. Governing Law & Dispute Resolution",
    body: [
      "These Terms are governed by the laws of India, without regard to conflict-of-law principles. Subject to applicable law, the courts at Durgapur, West Bengal, India shall have exclusive jurisdiction, and the parties agree to first attempt to resolve any dispute amicably and, failing that, through arbitration under the Arbitration and Conciliation Act, 1996, seated in Durgapur, West Bengal, in the English language.",
      "If any provision of these Terms is held invalid, the remaining provisions will remain in full force and effect.",
    ],
  },
  {
    id: "contact",
    heading: "14. Contact",
    body: [
      `For any questions about these Terms, contact us at ${SITE.supportEmail}. Registered address: ${SITE.address}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      updated="17 September 2026"
      intro="Please read these Terms carefully before using RESCUEN. They explain what RESCUEN is (and is not), your responsibilities, and the limits of our liability."
      sections={sections}
    />
  );
}
