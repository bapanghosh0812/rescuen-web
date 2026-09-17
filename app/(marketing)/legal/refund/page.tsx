import type { Metadata } from "next";
import LegalShell, { type Section } from "@/components/LegalShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "How subscriptions, cancellations, and refunds work for RESCUEN premium features.",
};

const sections: Section[] = [
  {
    id: "free",
    heading: "1. Free Core Features",
    body: [
      "RESCUEN’s core safety features are free to use and require no payment. This policy applies only to optional paid/premium features and subscriptions, if and when offered.",
    ],
  },
  {
    id: "subscriptions",
    heading: "2. Subscriptions & Billing",
    body: [
      "Premium plans, where offered, are billed in advance on a recurring basis (e.g. monthly or annually) as shown at checkout. By subscribing, you authorise the applicable charge until you cancel.",
      "Payments are handled by third-party payment processors and, for in-app purchases, by the relevant app store (Google Play / Apple App Store), which may have their own billing terms.",
    ],
  },
  {
    id: "cancellation",
    heading: "3. Cancellation",
    body: [
      "You can cancel a subscription at any time from your account or app-store settings. Cancellation stops future renewals; you retain premium access until the end of the current paid period.",
    ],
  },
  {
    id: "refunds",
    heading: "4. Refunds",
    body: [
      "Except where required by law, subscription fees are generally non-refundable, including for partially used periods.",
      { list: [
        "For purchases made through Google Play or the Apple App Store, refunds are governed by that store’s refund policy and must be requested through them.",
        "For purchases made directly through us, you may request a refund within 7 days of the initial charge if the premium features were materially non-functional and we could not resolve the issue.",
      ]},
      `To request a refund, email ${SITE.supportEmail} with your account phone number and purchase details.`,
    ],
  },
  {
    id: "changes",
    heading: "5. Price Changes",
    body: [
      "We may change prices or plan features. Changes apply to future billing periods and will be communicated in advance where required. Continued use after a change constitutes acceptance.",
    ],
  },
];

export default function RefundPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      updated="17 September 2026"
      intro="Clear, fair terms for subscriptions, cancellations, and refunds."
      sections={sections}
    />
  );
}
