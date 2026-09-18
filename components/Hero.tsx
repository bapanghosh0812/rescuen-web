"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone, ShieldCheck, Star, Sparkles, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";

export default function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: py * -6, ry: px * 8 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dotgrid opacity-60 mask-fade-b" />
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-200/45 blur-3xl animate-aurora" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-safe-200/40 blur-3xl animate-aurora [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl animate-aurora [animation-delay:-10s]" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        {/* Left copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="chip"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sos opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sos" />
            </span>
            Community-driven safety · Live on Google Play
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="h-display mt-5 text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            Your 24×7 personal
            <br />
            safety <span className="text-gradient-brand">bodyguard.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            One <b>2-second hold</b> turns your phone into an emergency broadcaster — a live{" "}
            <b>1&nbsp;KM rescue radar</b>, silent SMS to family &amp; police, community{" "}
            <b>Hero Mode</b>, and a multilingual <b>AI safety assistant</b>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary text-base">
              <Smartphone className="h-5 w-5" />
              Download on Android
            </a>
            <Link href="/#features" className="btn-ghost text-base">
              Explore Features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-ink-faint"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </span>
              <b className="text-ink">Loved</b> by users
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" /> Encrypted &amp; private
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand" /> No password — phone + OTP
            </span>
          </motion.div>
        </div>

        {/* Right — premium poster with 3D tilt */}
        <div className="perspective relative flex justify-center">
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-[80%] w-[80%] rounded-full bg-brand-300/25 blur-3xl" />
          </div>
          <motion.div
            ref={frameRef}
            onMouseMove={onMove}
            onMouseLeave={reset}
            initial={{ opacity: 0, y: 40, rotateY: 8 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="preserve-3d relative z-10 overflow-hidden rounded-[1.6rem] border border-white/60 shadow-lift ring-1 ring-brand-900/5 transition-transform duration-200 ease-out will-change-transform"
          >
            <Image
              src="/promo/promo-1.png"
              alt="RESCUEN app — Home screen with one-tap SOS, live location and Follow-Me"
              width={941}
              height={1672}
              priority
              className="h-[68vh] max-h-[680px] w-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
