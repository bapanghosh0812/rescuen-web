import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { SITE, SEO_KEYWORDS, PAGE_METADATA, FAQS } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: PAGE_METADATA.home.title,
    template: `%s · ${SITE.name} (The Ultimate Safety)`,
  },
  description: SITE.description,
  keywords: SEO_KEYWORDS,
  applicationName: SITE.name,
  authors: [
    {
      name: SITE.owner,
      url: SITE.developerUrl,
    },
    {
      name: SITE.legalName,
      url: SITE.canonicalUrl,
    },
  ],
  creator: SITE.owner,
  publisher: SITE.legalName,
  category: "SafetyAndRescueApplication",
  classification: "Personal Safety, Women Protection, Anti-Rape & Emergency SOS Platform",
  alternates: {
    canonical: SITE.canonicalUrl,
    languages: {
      "en-IN": SITE.canonicalUrl,
      "en-US": SITE.canonicalUrl,
      "hi-IN": SITE.canonicalUrl,
      "bn-IN": SITE.canonicalUrl,
    },
  },
  openGraph: {
    title: PAGE_METADATA.home.title,
    description: SITE.description,
    url: SITE.canonicalUrl,
    type: "website",
    siteName: SITE.fullName,
    locale: "en_IN",
    images: [
      {
        url: `${SITE.url}/promo/promo-1.png`,
        width: 941,
        height: 1672,
        alt: "RESCUEN — #1 Personal Safety App, 1KM Live Rescue Radar & Silent SOS Tool",
      },
      {
        url: `${SITE.url}/logo.png`,
        width: 512,
        height: 512,
        alt: "RESCUEN Official Shield Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_METADATA.home.title,
    description: SITE.description,
    creator: "@hello.officialrescuen",
    images: [`${SITE.url}/promo/promo-1.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    "geo.region": SITE.geo.region,
    "geo.placename": SITE.geo.placename,
    "geo.position": `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": SITE.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE.url}/#software-application`,
        name: SITE.name,
        alternateName: [
          "RESCUEN — The Ultimate Safety",
          "RESCUEN Personal Safety App",
          "RESCUEN Women Protection & SOS Radar",
        ],
        url: SITE.canonicalUrl,
        installUrl: SITE.appStoreUrl,
        downloadUrl: SITE.appStoreUrl,
        applicationCategory: "SafetyAndRescueApplication",
        applicationSubCategory:
          "Personal Safety, Women Security, Anti-Rape Prevention & Emergency SOS System",
        operatingSystem: "Android, Web",
        softwareVersion: "2.0.0",
        inLanguage: ["en", "hi", "bn", "mr", "ta", "te"],
        isAccessibleForFree: true,
        description: SITE.longSeoNarrative,
        featureList: [
          "2-Second Instant Panic Button & Triple Volume Key SOS Trigger",
          "1KM Live Community Rescue Radar with Geohash Proximity Siren",
          "Silent SOS & Offline SMS Location Broadcaster to Family & Police (112/100/1091)",
          "Hero Mode Real-Time Volunteer Rescue Navigation",
          "Follow-Me Dead-Man's Switch (Firebase Safe Journey Engine)",
          "Encrypted Private Write-Only Audio & AI Frame Court-Usable Evidence Vault",
          "24x7 Multilingual Gemini AI Safety Assistant Chat",
          "Background Danger Location Tracker & Fake Call Escape Tool",
        ],
        screenshot: [
          `${SITE.url}/promo/promo-1.png`,
          `${SITE.url}/1KM_sos-alert.jpeg`,
          `${SITE.url}/sos_trigger.png`,
          `${SITE.url}/AI_help_center.jpeg`,
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: SITE.appStoreUrl,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "1250",
        },
        author: {
          "@id": `${SITE.url}/#team-rescuen`,
        },
        creator: {
          "@id": `${SITE.url}/#team-rescuen`,
        },
        publisher: {
          "@id": `${SITE.url}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.canonicalUrl,
        logo: {
          "@type": "ImageObject",
          url: `${SITE.url}/logo.png`,
          width: 512,
          height: 512,
        },
        foundingDate: "2025",
        founder: {
          "@id": `${SITE.url}/#team-rescuen`,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Durgapur",
          addressRegion: "West Bengal",
          postalCode: "713212",
          addressCountry: "IN",
        },
        sameAs: [
          SITE.instagram,
          SITE.whatsapp,
          SITE.developerUrl,
          SITE.appStoreUrl,
          SITE.officialPolicyUrl,
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support & emergency platform inquiries",
            email: SITE.supportEmail,
            areaServed: ["IN", "Global"],
            availableLanguage: ["en", "hi", "bn", "mr", "ta", "te"],
          },
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}/#team-rescuen`,
        name: "Team RESCUEN",
        jobTitle: "Founding Team & Lead Architects of RESCUEN",
        description:
          "Team RESCUEN is the founding and engineering group behind RESCUEN (The Ultimate Safety), India's community-driven personal safety, women protection, and emergency SOS ecosystem.",
        url: SITE.developerUrl,
        nationality: {
          "@type": "Country",
          name: "India",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Durgapur",
          addressRegion: "West Bengal",
          postalCode: "713212",
          addressCountry: "IN",
        },
        knowsAbout: [
          "Personal Safety Systems",
          "Emergency SOS Architecture",
          "Women Protection & Anti-Rape Frameworks",
          "Next.js & TypeScript Engineering",
          "Firebase Real-Time Geohash Radar Systems",
          "Gemini AI Safety Agents",
        ],
        sameAs: [SITE.developerUrl, SITE.instagram, SITE.whatsapp],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.canonicalUrl,
        name: SITE.fullName,
        description: SITE.description,
        publisher: {
          "@id": `${SITE.url}/#organization`,
        },
        creator: {
          "@id": `${SITE.url}/#team-rescuen`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-canvas text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />
        {children}
      </body>
    </html>
  );
}
