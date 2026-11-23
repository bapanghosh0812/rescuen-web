import { ShieldCheck, Smartphone, Users, type LucideIcon } from "lucide-react";
import SosDemo from "@/components/SosDemo";
import Reveal from "@/components/ui/Reveal";
import { HOW_STEPS } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = { Smartphone, Users, ShieldCheck };

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="h-display text-3xl sm:text-4xl lg:text-5xl">Protected in three simple steps</h2>
            <p className="mt-4 text-lg text-ink-soft">There’s no lengthy setup and no password to forget. In the time it takes to finish a cup of tea, you’ll be ready.</p>
          </Reveal>
          <ol className="mt-10 space-y-5">
            {HOW_STEPS.map((s, i) => {
              const Icon = ICONS[s.icon] ?? Smartphone;
              return (
                <li key={s.step}>
                  <Reveal delay={i * 0.12}>
                    <div className="flex gap-5 rounded-3xl border border-line bg-white p-6 shadow-soft">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-ink">{s.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-faint">{s.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
        <SosDemo />
      </div>
    </section>
  );
}
