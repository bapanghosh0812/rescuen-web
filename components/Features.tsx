"use client";

import { motion } from "framer-motion";
import {
  Radar,
  ShieldAlert,
  Users,
  Bot,
  Send,
  MapPin,
  Route,
  Video,
  PhoneCall,
  BatteryCharging,
  Radio,
  Fingerprint,
  HeartPulse,
  PhoneOutgoing,
  Languages,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

const ICONS: Record<string, LucideIcon> = {
  Radar,
  ShieldAlert,
  Users,
  Bot,
  Send,
  MapPin,
  Route,
  Video,
  PhoneCall,
  BatteryCharging,
  Radio,
  Fingerprint,
  HeartPulse,
  PhoneOutgoing,
  Languages,
  Lock,
};

const ACCENT: Record<string, { tile: string; ring: string }> = {
  brand: { tile: "bg-brand-50 text-brand", ring: "group-hover:border-brand/30" },
  sos: { tile: "bg-sos-50 text-sos-600", ring: "group-hover:border-sos/30" },
  safe: { tile: "bg-safe-50 text-safe-600", ring: "group-hover:border-safe/40" },
  ink: { tile: "bg-mist text-ink", ring: "group-hover:border-ink/20" },
};

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">Total Control</span>
          <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Everything you need to feel <span className="text-gradient-brand">safe</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Fifteen thoughtfully engineered features working together for split-second protection —
            without ever getting in your way.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? ShieldAlert;
            const accent = ACCENT[f.accent];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                className={`group relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${accent.ring}`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  className={`relative grid h-12 w-12 place-items-center rounded-2xl ${accent.tile} shadow-inset ring-1 ring-black/5`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold text-ink">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-faint">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
