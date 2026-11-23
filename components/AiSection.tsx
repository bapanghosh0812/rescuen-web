import Link from "next/link";
import { ArrowRight, ListChecks, MessageSquareText, Route, Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import BotAvatar from "@/components/ai/BotAvatar";
import Reveal from "@/components/ui/Reveal";

const TOOLS = [
  { href: "/ai#planner", icon: Route, title: "Safety Planner", desc: "Tell it what worries you, a late cab, a night walk, a trip or a difficult home, and it gives you a simple plan for before, during and after." },
  { href: "/ai#check", icon: ListChecks, title: "Safety Check", desc: "Eight honest questions. You’ll get a score, and the three things worth fixing first." },
  { href: "/ai#message", icon: MessageSquareText, title: "Message Writer", desc: "When your hands are shaking, words are hard to find. Pick what’s happening and send a clear message with your location." },
];

const ASKS = ["What if someone is following me?", "How do I stay safe in a cab?", "I am being harassed online", "First aid basics"];

export default function AiSection() {
  return (
    <section id="ai" className="scroll-mt-24 px-3 py-6 sm:px-5">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-5xl bg-ink py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 glow [--g:theme(colors.brand.DEFAULT/50%)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 glow [--g:theme(colors.gold.DEFAULT/15%)]" />
        <div className="container-x relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <BotAvatar size={112} mood="talking" />
            <h2 className="mt-7 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Meet <span className="text-gradient-gold">RESCUEN AI</span>
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/70">
              Think of it as the calm friend who always picks up. It knows our app inside out, listens without judging, and
              gives you clear steps in English, हिन्दी, বাংলা or Hinglish, at any hour of the night.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {ASKS.map((q) => (
                <AskButton key={q} question={q} className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-left text-[13px] font-semibold text-white/85 transition-colors hover:border-gold-400 hover:text-white">
                  {q}
                </AskButton>
              ))}
            </div>
            <AskButton className="btn-gold mt-7">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask RESCUEN AI
            </AskButton>
          </Reveal>
          <div className="space-y-4">
            {TOOLS.map((t, i) => (
              <Reveal key={t.href} delay={i * 0.12}>
                <Link href={t.href} className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-5 transition-colors hover:bg-white/[0.12] sm:p-6">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-ink">
                    <t.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-bold">{t.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/60">{t.desc}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-gold-400" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
