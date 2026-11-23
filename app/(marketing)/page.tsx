import AiSection from "@/components/AiSection";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import GuidesStrip from "@/components/GuidesStrip";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Security from "@/components/Security";
import Showcase from "@/components/Showcase";
import Stats from "@/components/Stats";
import SupportMission from "@/components/SupportMission";
import Testimonials from "@/components/Testimonials";
import { HOME_LANGUAGES } from "@/lib/i18n/server";
import { faqPage, jsonLd, pageMeta } from "@/lib/seo";
import { FAQS, FEATURES, SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "RESCUEN: Personal Safety & Women Safety SOS App",
  description: SITE.description,
  path: "/",
  absoluteTitle: true,
  languages: HOME_LANGUAGES,
});

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "@id": `${SITE.url}/#app`,
    name: SITE.name,
    alternateName: ["RESCUEN Safety App", "Rescuen"],
    url: `${SITE.url}/`,
    installUrl: SITE.appStoreUrl,
    applicationCategory: "LifestyleApplication",
    applicationSubCategory: "Personal Safety",
    operatingSystem: "Android",
    inLanguage: ["en", "hi", "bn", "mr", "ta", "te"],
    isAccessibleForFree: true,
    description: SITE.description,
    featureList: FEATURES.map((f) => f.title),
    image: `${SITE.url}/og/rescuen.jpg`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": `${SITE.url}/#organization` },
  },
  faqPage(FAQS),
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Hero />
      <Stats />
      <Features />
      <AiSection />
      <HowItWorks />
      <Showcase />
      <Security />
      <GuidesStrip />
      <Testimonials />
      <SupportMission />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
