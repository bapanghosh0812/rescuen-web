import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { HOME_LANGUAGES, LOCAL_META } from "@/lib/i18n/server";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-24");
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified,
    priority,
  });
  const languages = Object.fromEntries(Object.entries(HOME_LANGUAGES).map(([k, v]) => [k, `${SITE.url}${v}`]));
  return [
    { ...page("/", 1), alternates: { languages }, images: [`${SITE.url}/og/rescuen.jpg`] },
    ...Object.keys(LOCAL_META).map((l) => ({ ...page(`/${l}`, 0.9), alternates: { languages } })),
    page("/ai", 0.9),
    page("/guides", 0.9),
    ...GUIDES.map((g) => ({ ...page(`/guides/${g.slug}`, 0.8), lastModified: new Date(g.updated) })),
    page("/emergency-numbers", 0.9),
    page("/about", 0.7),
    page("/security", 0.7),
    page("/donate", 0.6),
    page("/legal/privacy", 0.3),
    page("/legal/terms", 0.3),
    page("/legal/disclaimer", 0.3),
    page("/legal/refund", 0.3),
    page("/legal/cookies", 0.3),
  ];
}
