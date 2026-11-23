import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const OG_IMAGE = {
  url: "/og/rescuen.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "RESCUEN, your 24×7 personal safety companion",
};

/** Complete metadata for one page: its own canonical, link preview and card. */
export function pageMeta({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = "website",
  index = true,
  absoluteTitle = false,
  languages,
  locale = "en_IN",
}: {
  title: string;
  description: string;
  path: string;
  image?: typeof OG_IMAGE;
  type?: "website" | "article";
  index?: boolean;
  absoluteTitle?: boolean;
  languages?: Record<string, string>;
  locale?: string;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, languages },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: SITE.name,
      locale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

/** Safe to place inside a <script> tag: "<" can never close it early. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export const breadcrumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE.url}${path}`,
  })),
});

export const faqPage = (items: readonly { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
