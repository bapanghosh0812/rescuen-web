import { ListChecks, MessageSquareText, Route, Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import BotAvatar from "@/components/ai/BotAvatar";
import MessageWriter from "@/components/ai/MessageWriter";
import SafetyCheck from "@/components/ai/SafetyCheck";
import SafetyPlanner from "@/components/ai/SafetyPlanner";
import { breadcrumbs, jsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AI Safety Tools: Planner, Safety Check & Messages",
  description:
    "Free tools from RESCUEN AI. Build a personal safety plan, check how prepared you are, and write a message with your location for the people you trust.",
  path: "/ai",
});

const TOOLS = [
  { href: "#planner", icon: Route, title: "Safety Planner", desc: "A clear plan for your situation" },
  { href: "#check", icon: ListChecks, title: "Safety Check", desc: "Eight questions, one honest score" },
  { href: "#message", icon: MessageSquareText, title: "Message Writer", desc: "The right words, ready to send" },
];

const HEAD = "mx-auto mb-10 max-w-2xl text-center";

export default function AiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([["AI tools", "/ai"]])) }} />
      <section className="relative overflow-hidden bg-ink pb-20 pt-36 text-white">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 glow [--g:theme(colors.brand.DEFAULT/50%)]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 glow [--g:theme(colors.gold.DEFAULT/15%)]" />
        <div className="container-x relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              A safety expert, <span className="text-gradient-gold">beside you</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              Some days you need a plan, some days you need the right words, and some nights you just need someone to answer.
              Everything here is free, needs no account, and is ready in your language.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AskButton className="btn-gold">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Ask RESCUEN AI
              </AskButton>
              <a href="#planner" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">
                Build a plan
              </a>
            </div>
          </div>
          <BotAvatar size={240} mood="talking" className="mx-auto hidden drop-shadow-2xl sm:block" />
        </div>
        <div className="container-x relative mt-14 grid gap-4 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-colors hover:bg-white/[0.12]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300">
                <t.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold">{t.title}</span>
                <span className="block text-sm text-white/60">{t.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="planner" className="scroll-mt-24 bg-paper py-20">
        <div className="container-x">
          <div className={HEAD}>
            <h2 className="h-display text-3xl sm:text-4xl">Safety Planner</h2>
            <p className="mt-3 text-ink-soft">Pick what’s on your mind and we’ll tell you what to do before, during, and if something feels wrong.</p>
          </div>
          <SafetyPlanner />
        </div>
      </section>

      <section id="check" className="scroll-mt-24 py-20">
        <div className="container-x">
          <div className={HEAD}>
            <h2 className="h-display text-3xl sm:text-4xl">Safety Check</h2>
            <p className="mt-3 text-ink-soft">Answer honestly. Nobody else will see it. You’ll find out the three things worth fixing first.</p>
          </div>
          <SafetyCheck />
        </div>
      </section>

      <section id="message" className="scroll-mt-24 bg-paper py-20">
        <div className="container-x">
          <div className={HEAD}>
            <h2 className="h-display text-3xl sm:text-4xl">Message Writer</h2>
            <p className="mt-3 text-ink-soft">We’ll find the words for you, in four languages. Add your location if you want to, and send it in one tap.</p>
          </div>
          <MessageWriter />
        </div>
      </section>
    </>
  );
}
