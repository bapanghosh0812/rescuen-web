import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { jsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

// Kept in the project, so building never depends on another website.
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  // Body text never jumps: if the font is late, this visit uses the phone's own.
  display: "optional",
  adjustFontFallback: false,
  fallback: ["system-ui", "Segoe UI", "Roboto", "Noto Sans", "sans-serif"],
});
const sora = localFont({
  src: "./fonts/sora-latin.woff2",
  weight: "100 800",
  variable: "--font-sora",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Sora Swap", "Sora Swap R", "system-ui", "Noto Sans", "sans-serif"],
});

const HOME_TITLE = "RESCUEN: Personal Safety & Women Safety SOS App";

export const metadata: Metadata = {
  ...pageMeta({ title: HOME_TITLE, description: SITE.description, path: "/" }),
  metadataBase: new URL(SITE.url),
  title: { default: HOME_TITLE, template: `%s | ${SITE.name}` },
  applicationName: SITE.name,
  creator: SITE.owner,
  publisher: SITE.owner,
  category: "Safety",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#004aad",
  width: "device-width",
  initialScale: 1,
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      alternateName: ["Team RESCUEN", "Rescuen Safety App"],
      url: `${SITE.url}/`,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icons/icon-512.png`, width: 512, height: 512 },
      foundingDate: String(SITE.foundedYear),
      email: SITE.supportEmail,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Durgapur",
        addressRegion: "West Bengal",
        postalCode: "713212",
        addressCountry: "IN",
      },
      sameAs: [SITE.instagram, SITE.whatsapp, SITE.appStoreUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      alternateName: ["Rescuen", "RESCUEN App", "RESCUEN Safety App"],
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-canvas text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
        {children}
      </body>
    </html>
  );
}
