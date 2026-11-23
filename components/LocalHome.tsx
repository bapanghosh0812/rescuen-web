import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Smartphone, Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import BotAvatar from "@/components/ai/BotAvatar";
import SetLang from "@/components/i18n/SetLang";
import { HELPLINES } from "@/lib/guides";
import { LANGS, localeOf } from "@/lib/i18n/languages";
import { HOME_LANGUAGES, LOCAL_META, translator, type LocalLang } from "@/lib/i18n/server";
import { faqPage, jsonLd, pageMeta } from "@/lib/seo";
import { FAQS, FEATURES, HOW_STEPS, SITE } from "@/lib/site";

/** Search and link-preview details for a page written in one language. */
export const localMeta = (lang: LocalLang): Metadata =>
  pageMeta({
    title: LOCAL_META[lang].title,
    description: LOCAL_META[lang].description,
    path: `/${lang}`,
    absoluteTitle: true,
    languages: HOME_LANGUAGES,
    locale: localeOf(lang).replace("-", "_"),
  });

/** The whole introduction to RESCUEN in one language: /hi, /bn, /mr, /ta and /te. */
export default function LocalHome({ lang }: { lang: LocalLang }) {
  const t = translator(lang);
  const faqs = FAQS.map((f) => ({ q: t(f.q), a: t(f.a) }));
  const lines = HELPLINES.filter((h) => ["112", "100", "108", "181", "1091", "1098", "1930", "14416"].includes(h.num));

  return (
    <div lang={localeOf(lang)}>
      <SetLang id={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd({ ...faqPage(faqs), inLanguage: localeOf(lang) }) }}
      />

      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-60 mask-fade-b" />
        <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="chip">{t("Community-driven safety · Live on Google Play")}</p>
            <h1 className="h-display mt-5 text-balance text-4xl leading-tight sm:text-5xl lg:text-6xl lg:leading-tight">
              {t("Your 24×7 personal safety bodyguard.")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t(
                "Some moments don’t give you time to explain. So we made it one simple action: hold the button for two seconds and your phone starts asking for help on your behalf. People within 1 km see you on a live rescue radar, your family and the police silently receive your location, nearby heroes are guided to you, and an AI safety assistant stays by your side in your own language."
              )}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary text-base">
                <Smartphone className="h-5 w-5" aria-hidden="true" /> {t("Download on Android")}
              </a>
              <AskButton className="btn-ghost text-base">
                <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" /> {t("Ask RESCUEN AI")}
              </AskButton>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/promo/promo-1.webp"
              alt={t("RESCUEN app home screen with the SOS button, live location and Follow-Me")}
              width={941}
              height={1672}
              priority
              quality={75}
              sizes="(max-width: 640px) 260px, 340px"
              className="h-auto w-[260px] rounded-[1.6rem] shadow-lift sm:w-[340px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-x">
          <h2 className="h-display mx-auto max-w-2xl text-center text-3xl sm:text-4xl">
            {t("Everything you need to feel safe")}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-line bg-white p-6 shadow-soft">
                <h3 className="text-lg font-bold text-ink">{t(f.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t(f.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <h2 className="h-display text-center text-3xl sm:text-4xl">{t("Protected in three simple steps")}</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {HOW_STEPS.map((s, i) => (
              <li key={s.step} className="rounded-3xl border border-line bg-white p-7 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient font-display font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">{t(s.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t(s.desc)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-5">
            <BotAvatar size={72} />
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t("Emergency numbers in India")}</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lines.map((h) => (
              <a
                key={h.num}
                href={`tel:${h.num}`}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition-colors hover:bg-white/[0.12]"
              >
                <span className="flex items-center gap-2 font-display text-3xl font-extrabold text-gold-300">
                  <Phone className="h-5 w-5" aria-hidden="true" /> {h.num}
                </span>
                <span className="mt-2 block font-bold">{t(h.name)}</span>
                <span className="mt-1 block text-sm leading-relaxed text-white/70">{t(h.use)}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="container-x max-w-3xl">
          <h2 className="h-display text-center text-3xl sm:text-4xl">{t("Questions, answered")}</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="faq-item rounded-2xl border border-line bg-white shadow-soft">
                <summary className="cursor-pointer px-5 py-4 font-semibold text-ink">{f.q}</summary>
                <p className="px-5 pb-5 leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x max-w-4xl text-center">
          <p className="text-lg leading-relaxed text-ink-soft">{t(SITE.story)}</p>
          <p className="mt-10 text-sm font-semibold text-ink-faint">{LOCAL_META[lang].also}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2" data-no-translate>
            {LANGS.filter((l) => l.id !== lang).map((l) => (
              <Link
                key={l.id}
                href={l.id === "en" ? "/" : `/${l.id}`}
                hrefLang={l.locale}
                lang={l.locale}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft hover:border-brand/40 hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
