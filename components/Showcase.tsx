"use client";

import { motion } from "framer-motion";
import { Smartphone, PlayCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import PhoneMock, { type ScreenKind } from "@/components/PhoneMock";

const SHOTS: { screen: ScreenKind; title: string; desc: string }[] = [
  { screen: "sos", title: "SOS Active", desc: "Family & police alerted, silently." },
  { screen: "radar", title: "1 KM Rescue Radar", desc: "Heroes navigate straight to you." },
  { screen: "home", title: "One-Touch Home", desc: "Hold 2s to trigger. That’s it." },
  { screen: "ai", title: "AI Assistant", desc: "Multilingual, 24×7 guidance." },
  { screen: "profile", title: "Your Dashboard", desc: "Full control of your data." },
];

export default function Showcase() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">
            <PlayCircle className="h-4 w-4 text-brand" /> A look inside the app
          </span>
          <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Designed to feel <span className="text-gradient-brand">effortless</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            A preview of the RESCUEN mobile experience. The full app lives on your phone — install it
            to unlock every feature.
          </p>
        </Reveal>

        {/* horizontal scroll on mobile, centred row on desktop */}
        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-6 [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden">
          {SHOTS.map((s, i) => (
            <motion.figure
              key={s.screen}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative shrink-0 snap-center"
              style={{ transform: `rotate(${(i - 2) * 1.4}deg)` }}
            >
              <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0">
                <PhoneMock screen={s.screen} className="h-[440px] w-[212px]" />
              </div>
              <figcaption className="mt-4 text-center">
                <p className="text-sm font-bold text-ink">{s.title}</p>
                <p className="text-xs text-ink-faint">{s.desc}</p>
              </figcaption>
              <span className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft shadow-soft">
                Preview
              </span>
            </motion.figure>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-dark text-base">
            <Smartphone className="h-5 w-5" />
            Get RESCUEN free
          </a>
        </div>
      </div>
    </section>
  );
}
