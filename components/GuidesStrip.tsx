import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { GUIDES } from "@/lib/guides";

export default function GuidesStrip() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="h-display max-w-xl text-3xl sm:text-4xl lg:text-5xl">Know what to do before you need it</h2>
          <Link href="/guides" className="btn-ghost">
            All guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.1}>
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <h3 className="font-display text-xl font-bold text-ink">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{g.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  {g.minutes} min read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
