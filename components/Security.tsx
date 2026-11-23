import Link from "next/link";
import { Lock, Server, EyeOff, KeyRound, ShieldCheck, ArrowRight, FileLock2, Radar } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: Lock,
    title: "Encrypted in transit & at rest",
    desc: "Everything you share travels over TLS and stays encrypted where we store it, because your most personal information deserves nothing less.",
  },
  {
    icon: Server,
    title: "Secrets stay on the backend",
    desc: "Our keys and credentials live only on our own servers. They never ship inside the app or the browser, so there’s nothing on your device for anyone to dig out.",
  },
  {
    icon: KeyRound,
    title: "Passwordless sign-in",
    desc: "You sign in with Google and a phone OTP that our servers check. With no password there’s nothing to phish, leak or reuse, and a 60-day lock guards your emergency numbers.",
  },
  {
    icon: FileLock2,
    title: "Write-only evidence vault",
    desc: "Emergency recordings can go in, but they can never be read back from a phone. Only our trusted backend can retrieve them, which keeps your evidence safe from tampering.",
  },
  {
    icon: ShieldCheck,
    title: "Strict, deny-by-default rules",
    desc: "Every read and write needs a signed-in user, and anything we haven’t clearly allowed is refused. It’s a strict rule, and we like it that way.",
  },
  {
    icon: Radar,
    title: "Server-side proximity",
    desc: "Alert distances are worked out on our servers, and the radar shows only a name and a location, not your phone number or your family’s.",
  },
];

export default function Security() {
  return (
    <section id="security" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
              Built like a <span className="text-gradient-brand">vault</span>, not an app.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Your safety data is the most personal thing you could ever trust us with, so we protect it obsessively. There’s no
              password to steal, our secrets never leave our own servers, and anything we haven’t clearly allowed is refused. Put
              simply, we’ve tried to leave nothing on the front end worth stealing.
            </p>
            <div className="mt-6">
              <Link href="/security" className="btn-ghost">
                Visit the Trust &amp; Security Centre
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 inline-flex items-center gap-4 rounded-3xl border border-line bg-white p-5 shadow-card">
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                <Lock className="h-7 w-7" />
                <span className="absolute inset-0 rounded-2xl border-2 border-white/30" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-ink">TLS in transit · encrypted at rest</p>
                <p className="text-sm text-ink-faint">Strong protection, honestly described.</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand ring-1 ring-black/5">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-faint">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
