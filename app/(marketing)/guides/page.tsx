import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDES } from "@/lib/guides";
import { breadcrumbs, jsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Personal Safety Guides for India",
  description:
    "Short, practical safety guides: being followed, cab rides, night shifts, solo travel, online harassment and setting up emergency contacts.",
  path: "/guides",
});

export default function GuidesPage() {
  const [first, ...rest] = GUIDES;
  return (
    <div className="bg-paper pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([["Guides", "/guides"]])) }} />
      <section className="border-b border-line bg-white pb-14 pt-36">
        <div className="container-x max-w-3xl">
          <h1 className="h-display text-4xl sm:text-5xl lg:text-6xl">Safety guides</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            We wrote these the way we’d explain them to a younger sister: clear steps you can read in a few minutes and remember
            when it counts.
          </p>
        </div>
      </section>
      <section className="container-x grid gap-5 py-14 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/guides/${first.slug}`}
          className="group relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-glow md:col-span-2 lg:row-span-1"
        >
          <span className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 glow [--g:theme(colors.white/10%)]" />
          <h2 className="relative max-w-md font-display text-2xl font-extrabold sm:text-3xl">{first.title}</h2>
          <p className="relative mt-3 max-w-md text-white/80">{first.summary}</p>
          <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold">
            Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
        {rest.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <h2 className="font-display text-xl font-bold text-ink">{g.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{g.summary}</p>
            <span className="mt-6 flex items-center justify-between text-xs font-semibold text-ink-faint">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {g.minutes} min
              </span>
              <ArrowRight className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
