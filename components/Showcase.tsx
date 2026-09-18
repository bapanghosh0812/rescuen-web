"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone, PlayCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

const POSTERS = [
  { src: "/promo/promo-5.png", title: "SOS when you need it", alt: "RESCUEN SOS Active screen — live map, nearby alerts and broadcast status" },
  { src: "/promo/promo-1.png", title: "Your safety, our priority", alt: "RESCUEN Home — one-tap SOS, live location and Follow-Me" },
  { src: "/promo/promo-2.png", title: "AI assistant, always with you", alt: "RESCUEN AI safety assistant with helplines" },
  { src: "/promo/promo-6.png", title: "Wellness & safety hub", alt: "RESCUEN Health tab — wellness and safety guides" },
  { src: "/promo/promo-4.png", title: "A safer, stronger you", alt: "RESCUEN Profile & dashboard" },
  { src: "/promo/promo-3.png", title: "Sign in, simply", alt: "RESCUEN onboarding screen" },
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTERS.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={941}
                  height={1672}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-dark text-base">
            <Smartphone className="h-5 w-5" />
            Get RESCUEN free
          </a>
        </div>
      </div>
    </section>
  );
}
