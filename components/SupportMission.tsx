"use client";

import { Sparkles } from "lucide-react";
import DonationPortal from "@/components/DonationPortal";
import Reveal from "@/components/ui/Reveal";

export default function SupportMission() {
  return (
    <section
      id="donate"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-gradient-to-b from-paper via-white to-brand-50/30 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" />
      <div className="container-x relative">
        <Reveal className="no-print mx-auto max-w-3xl text-center mb-12">
          <span className="chip border-gold-300/60 bg-gold-100/70 text-gold-600">
            <Sparkles className="h-3.5 w-3.5 text-gold-600" />
            Support Team RESCUEN · Surakshit Bharat Mission 🙏
          </span>
          <h2 className="h-display mt-4 text-balance text-3xl sm:text-4xl lg:text-5xl">
            Stand With <span className="text-gradient-brand">Team RESCUEN</span> — Keep Safety 100%
            Free
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-soft">
            RESCUEN ek 100% free, life-saving safety platform hai. Apni marzi se{" "}
            <b>₹1 se ₹1,00,000</b> tak Daan karke <b>Team RESCUEN</b> ko har beti aur citizen tak
            yeh suraksha kavach pahunchane mein sahyog karein.
          </p>
        </Reveal>

        <DonationPortal compact />
      </div>
    </section>
  );
}

