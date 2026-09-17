import Link from "next/link";
import { Lock, Server, EyeOff, KeyRound, ShieldCheck, ArrowRight, FileLock2, Radar } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: Lock,
    title: "Encrypted in transit & at rest",
    desc: "All data travels over TLS and is encrypted at rest in Firebase. Strong transport and storage protection for your most personal information.",
  },
  {
    icon: Server,
    title: "Secrets stay on the backend",
    desc: "API keys and credentials are stored as Firebase secrets and injected at runtime — they never ship inside the app, so there’s nothing on-device to steal.",
  },
  {
    icon: KeyRound,
    title: "Passwordless sign-in",
    desc: "Google Sign-In + phone-number OTP, verified server-side. No password to phish, leak or reuse — plus a 60-day change-lock on emergency numbers.",
  },
  {
    icon: FileLock2,
    title: "Write-only evidence vault",
    desc: "Emergency recordings can be uploaded but never read back from a device — only the trusted backend can retrieve them, keeping evidence tamper-resistant.",
  },
  {
    icon: ShieldCheck,
    title: "Strict rules + App Check",
    desc: "Firestore & Storage require an authenticated user for every read/write with a default-deny fallback, and Firebase App Check blocks abuse and spam.",
  },
  {
    icon: Radar,
    title: "Server-side proximity",
    desc: "Distance filtering runs in the cloud, and the radar only exposes name & location — your phone and family numbers never leave your private document.",
  },
];

export default function Security() {
  return (
    <section id="security" className="scroll-mt-24 bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="chip">Trust &amp; Security</span>
            <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
              Built like a <span className="text-gradient-brand">vault</span>, not an app.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Your safety data is the most personal there is — so we protect it obsessively. A
              passwordless design, backend-only secrets and strict, default-deny security rules mean
              there’s simply nothing worth stealing on the front end.
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
