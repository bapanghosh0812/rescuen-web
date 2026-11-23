"use client";

import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";

const DonationPortal = dynamic(() => import("@/components/DonationPortal"), { ssr: false });

export default function SupportMission() {
  return (
    <section
      id="donate"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-gradient-to-b from-paper via-white to-brand-50/30 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" />
      <div className="container-x relative">
        <Reveal className="no-print mx-auto mb-12 max-w-3xl text-center">
          <h2 className="h-display text-balance text-3xl sm:text-4xl lg:text-5xl">
            Stand with <span className="text-gradient-brand">Team RESCUEN</span> and keep safety 100% free
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            RESCUEN is a 100% free, life-saving safety platform, and we want it to stay that way. If this work means
            something to you, give any amount you like, from ₹1 to ₹1,00,000, and help Team RESCUEN carry this shield of
            safety to every daughter and every citizen of our country.
          </p>
        </Reveal>
        <LazyMount minHeight={980}>
          <DonationPortal compact />
        </LazyMount>
      </div>
    </section>
  );
}
