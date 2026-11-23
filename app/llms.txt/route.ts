import { GUIDES } from "@/lib/guides";
import { FAQS, SITE } from "@/lib/site";

export const dynamic = "force-static";

/** A plain-text summary for search assistants. */
export function GET() {
  const link = (title: string, path: string, note: string) => `- [${title}](${SITE.url}${path}): ${note}`;
  const text = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "RESCUEN supports official emergency services and never replaces them. In India call 112 first.",
    "",
    "## Pages",
    link("Home", "/", "features, how it works and download"),
    link("AI tools", "/ai", "safety planner, safety check and message writer"),
    link("Emergency numbers", "/emergency-numbers", "every important helpline in India"),
    link("Security", "/security", "how data is protected"),
    link("About", "/about", "Team RESCUEN"),
    `- [Android app](${SITE.appStoreUrl}): Google Play`,
    "",
    "## Safety guides",
    ...GUIDES.map((g) => link(g.title, `/guides/${g.slug}`, g.summary)),
    "",
    "## Common questions",
    ...FAQS.flatMap((f) => ["", `**${f.q}** ${f.a}`]),
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
