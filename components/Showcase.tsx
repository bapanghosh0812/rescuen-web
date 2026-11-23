import Image from "next/image";
import { Smartphone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const POSTERS = [
  { src: "/promo/promo-5.webp", alt: "RESCUEN SOS active screen with live map, nearby alerts and broadcast status" },
  { src: "/promo/promo-1.webp", alt: "RESCUEN home screen with one-tap SOS, live location and Follow-Me" },
  { src: "/promo/promo-2.webp", alt: "RESCUEN AI safety assistant with helplines" },
  { src: "/promo/promo-6.webp", alt: "RESCUEN health tab with wellness and safety guides" },
  { src: "/promo/promo-4.webp", alt: "RESCUEN profile and dashboard" },
  { src: "/promo/promo-3.webp", alt: "RESCUEN onboarding and sign-in screen" },
];

export default function Showcase() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="h-display text-3xl sm:text-4xl lg:text-5xl">
            Designed to feel <span className="text-gradient-brand">effortless</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">Here’s a preview of what you’ll see on your phone. We kept every screen calm and clear, because the best time to
            learn an app is before you need it. Install it and every feature unlocks.</p>
        </Reveal>
      </div>
      <div className="showcase mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8" tabIndex={0} role="region" aria-label="App screens">
        {POSTERS.map((p) => (
          <figure key={p.src} className="w-[68vw] max-w-[290px] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-card transition-transform duration-300 hover:-translate-y-2">
            <Image src={p.src} alt={p.alt} width={941} height={1672} loading="lazy" quality={70} sizes="(max-width: 640px) 68vw, 290px" className="h-auto w-full" />
          </figure>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <a href={SITE.appStoreUrl} target="_blank" rel="noreferrer" className="btn-dark text-base">
          <Smartphone className="h-5 w-5" aria-hidden="true" /> Get RESCUEN free
        </a>
      </div>
    </section>
  );
}
