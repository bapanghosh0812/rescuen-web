import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone, Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import BotAvatar from "@/components/ai/BotAvatar";
import GuideTools from "@/components/GuideTools";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { breadcrumbs, faqPage, jsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.seo,
    description: `${guide.summary} A free safety guide from RESCUEN for India.`,
    path: `/guides/${guide.slug}`,
    type: "article",
    absoluteTitle: true,
  });
}

export default async function GuidePage({ params }: Props) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.summary,
      datePublished: guide.updated,
      dateModified: guide.updated,
      inLanguage: "en-IN",
      image: `${SITE.url}/og/rescuen.jpg`,
      mainEntityOfPage: `${SITE.url}/guides/${guide.slug}`,
      author: { "@id": `${SITE.url}/#organization` },
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    faqPage(guide.faq),
    breadcrumbs([
      ["Guides", "/guides"],
      [guide.title, `/guides/${guide.slug}`],
    ]),
  ];

  return (
    <article className="bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <header className="border-b border-line bg-white pb-12 pt-36">
        <div className="container-x max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-faint">
            <Link href="/guides" className="font-semibold text-brand hover:underline">
              Safety guides
            </Link>
          </nav>
          <h1 className="h-display mt-4 text-balance text-4xl sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{guide.intro}</p>
          <p className="mt-4 text-sm text-ink-faint">
            {guide.minutes} minute read · Updated{" "}
            {new Date(guide.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <GuideTools
            title={guide.title}
            ask={guide.ask}
            parts={[guide.title, guide.intro, ...guide.sections.map((s) => [s.h, s.p, ...(s.list || [])].filter(Boolean).join(". "))]}
          />
        </div>
      </header>

      <div className="container-x max-w-3xl py-12">
        <a
          href="tel:112"
          className="flex items-center gap-4 rounded-2xl border border-sos-200 bg-sos-50 px-5 py-4 text-sos-700 transition-colors hover:bg-sos-100"
        >
          <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-[15px] font-semibold">In danger right now? Call 112 first, then read on.</span>
        </a>

        {guide.sections.map((s) => {
          const List = s.ordered ? "ol" : "ul";
          return (
            <section key={s.h} className="mt-10">
              <h2 className="font-display text-2xl font-bold text-ink">{s.h}</h2>
              {s.p && <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{s.p}</p>}
              {s.list && (
                <List className="mt-4 space-y-3">
                  {s.list.map((item, i) => (
                    <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                      {s.ordered ? (
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span>
                      ) : (
                        <Check className="mt-1 h-5 w-5 shrink-0 text-safe-600" aria-hidden="true" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </List>
              )}
            </section>
          );
        })}

        <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl bg-ink p-7 text-center text-white sm:flex-row sm:text-left">
          <BotAvatar size={72} mood="talking" className="shrink-0" />
          <div className="flex-1">
            <p className="font-display text-lg font-bold">Have a question about this?</p>
            <p className="text-sm text-white/65">Ask in English, हिन्दी, বাংলা or Hinglish.</p>
          </div>
          <AskButton question={guide.ask} className="btn-gold shrink-0">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask RESCUEN AI
          </AskButton>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-ink">Common questions</h2>
          <div className="mt-4 space-y-3">
            {guide.faq.map((f) => (
              <details key={f.q} className="faq-item rounded-2xl border border-line bg-white shadow-soft">
                <summary className="cursor-pointer px-5 py-4 font-semibold text-ink">{f.q}</summary>
                <p className="px-5 pb-5 leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-display text-lg font-bold text-ink">Read next</h2>
          <ul className="mt-3 space-y-1">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="group flex items-center justify-between rounded-xl px-3 py-3 font-semibold text-ink-soft hover:bg-white hover:text-brand">
                  {g.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="mt-8 text-sm text-ink-faint">General guidance only. It does not replace the police, a doctor or a lawyer.</p>
      </div>
    </article>
  );
}
