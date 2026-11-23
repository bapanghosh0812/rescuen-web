import { PenLine, Quote, Star } from "lucide-react";
import { SITE, TESTIMONIALS } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="h-display text-3xl sm:text-4xl lg:text-5xl">
            Peace of mind, in their words
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-soft">
                <Quote className="h-8 w-8 text-brand-200" />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  “{t.quote}”
                </blockquote>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <div>
                    <figcaption className="font-bold text-ink">{t.name}</figcaption>
                    <p className="text-xs text-ink-faint">{t.role}</p>
                  </div>
                  <div className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-gold" />
                    ))}
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="max-w-lg text-ink-soft">
            Have you used RESCUEN? Tell others how it went, in your own words. It helps someone else take that first step.
          </p>
          <a href={`${SITE.appStoreUrl}&showAllReviews=true`} target="_blank" rel="noreferrer" className="btn-ghost">
            <PenLine className="h-4 w-4" aria-hidden="true" /> Write a review on Google Play
          </a>
        </Reveal>
      </div>
    </section>
  );
}
