import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";

export type Block = string | { list: string[] } | { note: string };
export type Section = { id: string; heading: string; body: Block[] };

function renderBlock(b: Block, i: number) {
  if (typeof b === "string") {
    return (
      <p key={i} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
        {b}
      </p>
    );
  }
  if ("list" in b) {
    return (
      <ul key={i} className="mt-4 space-y-2">
        {b.list.map((li, k) => (
          <li key={k} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-brand" />
            <span>{li}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p key={i} className="mt-4 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
      {b.note}
    </p>
  );
}

export default function LegalShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-line bg-white pt-32 pb-14">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50 mask-fade-b" />
        <div className="container-x relative">
          <span className="chip">
            <ShieldCheck className="h-4 w-4 text-brand" /> Legal
          </span>
          <h1 className="h-display mt-5 text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-faint">Last updated: {updated}</p>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">{intro}</p>
        </div>
      </div>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[260px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-line bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">On this page</p>
            <nav className="mt-3 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-1.5 text-sm text-ink-faint transition-colors hover:bg-mist hover:text-brand"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="max-w-3xl">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-8 first:pt-0">
              <h2 className="font-display text-2xl font-bold text-ink">{s.heading}</h2>
              {s.body.map(renderBlock)}
            </section>
          ))}

          <div className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold text-ink">Questions about this policy?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Contact us at{" "}
              <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-brand">
                {SITE.supportEmail}
              </a>{" "}
              or through our{" "}
              <Link href="/#contact" className="font-semibold text-brand">
                contact page
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
