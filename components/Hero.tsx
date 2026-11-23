import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import HeroAsk from "@/components/ai/HeroAsk";
import Tilt from "@/components/ui/Tilt";
import { SITE } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dotgrid opacity-60 mask-fade-b" />
        <div className="absolute -left-24 top-10 h-80 w-80 glow [--g:theme(colors.brand.200/35%)]" />
        <div className="absolute right-0 top-40 h-96 w-96 glow [--g:theme(colors.safe.200/30%)]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 glow [--g:theme(colors.brand.100/40%)]" />
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="chip">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sos opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sos" />
            </span>
            Community-driven safety · Live on Google Play
          </div>

          <h1 className="hero-title h-display mt-5 text-balance">
            Your 24×7 personal safety <span className="text-gradient-brand">bodyguard.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Some moments don’t give you time to explain. So we made it one simple action: hold the button for two seconds
            and your phone starts asking for help on your behalf. People within 1 km see you on a live rescue radar, your
            family and the police silently receive your location, nearby heroes are guided to you, and an AI safety
            assistant stays by your side in your own language.
          </p>

          <HeroAsk />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-primary text-base">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
              Download on Android
            </a>
            <Link href="/#features" className="btn-ghost text-base">
              Explore features
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-ink-faint">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-safe-600" aria-hidden="true" /> 100% free to stay safe
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" /> Encrypted &amp; private
            </span>
            <span className="inline-flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-brand" aria-hidden="true" /> No password, just phone + OTP
            </span>
          </div>
        </div>

        <div className="perspective relative flex justify-center">
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-[80%] w-[80%] glow [--g:theme(colors.brand.300/25%)]" />
          </div>
          <Tilt className="relative z-10 overflow-hidden rounded-[1.6rem] border border-white/60 shadow-lift ring-1 ring-brand-900/5">
            <Image
              src="/promo/promo-1.webp"
              alt="RESCUEN app home screen with the SOS button, live location and Follow-Me"
              width={941}
              height={1672}
              priority
              fetchPriority="high"
              quality={75}
              sizes="(max-width: 640px) 260px, 383px"
              className="h-[68vh] max-h-[680px] min-h-[420px] w-auto"
            />
          </Tilt>
        </div>
      </div>
    </section>
  );
}
