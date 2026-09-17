import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Server, KeyRound, EyeOff, Fingerprint, ShieldCheck, Phone, BadgeCheck, Bug } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Trust & Security Centre",
  description: "How RESCUEN keeps your data encrypted, private, and secure — and important emergency numbers.",
};

const PRACTICES = [
  { icon: Lock, title: "Encrypted in transit & at rest", desc: "All data travels over TLS and is encrypted at rest in Firebase — strong transport and storage protection (we don’t claim end-to-end encryption)." },
  { icon: KeyRound, title: "Passwordless sign-in", desc: "Google Sign-In + phone OTP via Firebase, verified server-side. No password to phish, leak or reuse, plus a 60-day change-lock on emergency numbers." },
  { icon: Server, title: "Backend-only secrets", desc: "API keys and credentials are stored as Firebase secrets and injected at runtime — never inside the app bundle or the browser." },
  { icon: EyeOff, title: "No data selling", desc: "No ad-trackers, no data brokers. Your location is never used for ads — only shared with your contacts and nearby rescuers when you trigger SOS." },
  { icon: Fingerprint, title: "App Check & strict rules", desc: "Firebase App Check plus default-deny Firestore/Storage rules require an authenticated user for every read and write." },
  { icon: ShieldCheck, title: "Hardened platform", desc: "Server-side proximity filtering, a write-only evidence vault, rate-limiting and strict security headers reduce the attack surface." },
];

const EMERGENCY = [
  { label: "All-in-one Emergency (India)", num: "112" },
  { label: "Police", num: "100" },
  { label: "Ambulance", num: "108" },
  { label: "Fire", num: "101" },
  { label: "Women Helpline", num: "1091" },
  { label: "Child Helpline", num: "1098" },
];

export default function SecurityPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50 mask-fade-b" />
        <div className="container-x relative max-w-3xl">
          <span className="chip"><ShieldCheck className="h-4 w-4 text-brand" /> Trust & Security</span>
          <h1 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
            Your data, <span className="text-gradient-brand">locked down</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            We treat your safety data with the seriousness it deserves. Here’s exactly how we protect
            it — in plain language, no jargon.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/legal/privacy" className="btn-ghost">Read the Privacy Policy</Link>
            <Link href="/#contact" className="btn-primary">Report a concern</Link>
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRACTICES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.08}>
                <div className="card h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand ring-1 ring-black/5">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-faint">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency numbers */}
      <section id="emergency" className="scroll-mt-28 py-8">
        <div className="container-x">
          <Reveal>
            <div className="rounded-4xl border border-line bg-white p-8 shadow-card sm:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="h-display text-2xl">Emergency numbers (India)</h2>
                  <p className="text-sm text-ink-faint">In a real emergency, call these first.</p>
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EMERGENCY.map((e) => (
                  <a
                    key={e.num}
                    href={`tel:${e.num}`}
                    className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className="text-sm font-medium text-ink-soft">{e.label}</span>
                    <span className="font-display text-lg font-extrabold text-brand">{e.num}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Responsible disclosure */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-ink">
                <Bug className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Responsible disclosure</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-faint">
                Found a security issue? We welcome responsible reports and will work with you to fix it
                quickly. Please don’t exploit or disclose it publicly before we’ve resolved it.
              </p>
              <a href={`mailto:${SITE.supportEmail}?subject=Security disclosure`} className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
                Email our security team →
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-ink">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Your part in staying secure</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-faint">
                <li>• Never share your OTP with anyone — we’ll never ask for it.</li>
                <li>• Keep your phone locked and your number secure.</li>
                <li>• Review your trusted contacts regularly.</li>
                <li>• Report anything suspicious to us right away.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
