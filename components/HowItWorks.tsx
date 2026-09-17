"use client";

import { motion } from "framer-motion";
import { Smartphone, Users, ShieldCheck, type LucideIcon } from "lucide-react";
import { HOW_STEPS } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

const ICONS: Record<string, LucideIcon> = { Smartphone, Users, ShieldCheck };

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">How it Works</span>
          <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Protected in three simple steps
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            No lengthy setup, no password to forget. You’re ready in under a minute.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block" />
          {HOW_STEPS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Smartphone;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="relative rounded-3xl border border-line bg-white p-7 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-extrabold text-mist">{s.step}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-faint">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
