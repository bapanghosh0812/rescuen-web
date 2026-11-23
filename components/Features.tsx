import {
  BatteryCharging,
  Bot,
  Fingerprint,
  HeartPulse,
  Languages,
  Lock,
  PhoneCall,
  PhoneOutgoing,
  Radar,
  Radio,
  Route,
  Send,
  ShieldAlert,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import Reveal from "@/components/ui/Reveal";
import { FEATURES } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = {
  Radar, ShieldAlert, Users, Bot, Send, Route, Video, PhoneCall, BatteryCharging, Radio, Fingerprint, HeartPulse, PhoneOutgoing, Languages, Lock,
};

// What each "Ask" button asks.
const ASK: Record<string, string> = {
  ShieldAlert: "How do I trigger SOS?",
  Radar: "How does the 1 KM radar work?",
  Send: "Does SOS work without internet?",
  Users: "What is Hero Mode?",
  Route: "What is Follow-Me?",
  Video: "How is evidence kept safe?",
  Bot: "What can you do?",
  Radio: "What permissions are needed?",
  Fingerprint: "How do I add trusted contacts?",
  PhoneCall: "Emergency numbers",
  HeartPulse: "First aid basics",
  BatteryCharging: "Does it drain my battery?",
  PhoneOutgoing: "What is Fake Call?",
  Languages: "Which languages are supported?",
  Lock: "Is my location private?",
};

const ACCENT: Record<string, { tile: string; ring: string }> = {
  brand: { tile: "bg-brand-50 text-brand", ring: "hover:border-brand/30" },
  sos: { tile: "bg-sos-50 text-sos-600", ring: "hover:border-sos/30" },
  safe: { tile: "bg-safe-50 text-safe-600", ring: "hover:border-safe/40" },
  ink: { tile: "bg-mist text-ink", ring: "hover:border-ink/20" },
};

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="h-display text-3xl sm:text-4xl lg:text-5xl">
            Everything you need to feel <span className="text-gradient-brand">safe</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            We thought through fifteen features, one worry at a time: the dark lane, the wrong turn, the call nobody picks
            up. They work together in a split second and stay out of your way the rest of the day.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? ShieldAlert;
            const accent = ACCENT[f.accent];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.1}>
                <div className={`group flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${accent.ring}`}>
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accent.tile} ring-1 ring-black/5`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{f.desc}</p>
                  <AskButton
                    question={ASK[f.icon] || f.title}
                    label={`Ask about ${f.title}`}
                    className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full py-2 pr-2 text-xs font-bold text-brand opacity-80 transition-opacity hover:opacity-100"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Ask about this
                  </AskButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
