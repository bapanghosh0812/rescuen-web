import { Smartphone, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
  return (
    <section className="pb-8 pt-4">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-brand-gradient px-6 py-16 text-center shadow-glow sm:px-12">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -left-10 top-0 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-safe-300/40 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-2xl">
              <h2 className="h-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Carry a guardian in your pocket
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join the RESCUEN community and feel safer every day. Free to download — set up in under
                a minute.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={SITE.appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-ink shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  <Smartphone className="h-5 w-5" /> Download on Google Play
                </a>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-5 py-4 text-sm font-semibold text-white/80">
                  iOS coming soon
                </span>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4" /> Free · Privacy-first · No password required
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
