import type { Metadata } from "next";
import Link from "next/link";
import { Target, HeartHandshake, Rocket, ShieldCheck, Mail, Newspaper, Briefcase } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Us",
  description: "The mission and story behind RESCUEN — building a safer world, one person at a time.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Safety first, always", desc: "Every decision we make is judged by one question: does this keep our users safer?" },
  { icon: HeartHandshake, title: "Privacy is a right", desc: "We protect your data like it’s our own and never sell it. Trust is earned, not assumed." },
  { icon: Rocket, title: "Relentless craft", desc: "Premium, reliable, and beautifully simple — because safety tools should feel effortless." },
];

export default function AboutPage() {
  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-white pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50 mask-fade-b" />
        <div className="container-x relative max-w-3xl">
          <span className="chip">Our Story</span>
          <h1 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl">
            Building a world where <span className="text-gradient-brand">no one feels unsafe</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            RESCUEN began with a simple belief: everyone deserves to feel protected — walking home at
            night, travelling alone, or just going about their day. So we set out to build the personal
            safety companion we wished existed: fast, private, and genuinely reassuring.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="h-display mt-5 text-2xl">Our Mission</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                To put a reliable guardian in every pocket — combining a live safety radar, instant
                alerts, and calm AI guidance so help is always one tap away.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-600">
                <Rocket className="h-6 w-6" />
              </span>
              <h2 className="h-display mt-5 text-2xl">Our Vision</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                A connected safety network where communities look out for one another — and where
                technology quietly closes the gap between a moment of danger and the help you need.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-8">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="h-display text-3xl sm:text-4xl">What we stand for</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="card h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-faint">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Careers / Press / Blog anchors */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 md:grid-cols-3">
          <Anchor id="careers" icon={Briefcase} title="Careers" desc="We’re a small team with a big mission. Passionate about safety and craft?" cta="Write to us" href={`mailto:${SITE.supportEmail}?subject=Careers at RESCUEN`} />
          <Anchor id="press" icon={Newspaper} title="Press & Media" desc="For press enquiries, brand assets, or interviews, reach our team." cta="Contact press" href={`mailto:${SITE.supportEmail}?subject=Press enquiry`} />
          <Anchor id="blog" icon={Mail} title="Blog & Updates" desc="Safety tips and product updates are coming soon. Stay tuned." cta="Get in touch" href="/#contact" />
        </div>
      </section>
    </div>
  );
}

function Anchor({
  id,
  icon: Icon,
  title,
  desc,
  cta,
  href,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  cta: string;
  href: string;
}) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  return (
    <div id={id} className="card scroll-mt-28 p-7">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-ink">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-faint">{desc}</p>
      {external ? (
        <a href={href} className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          {cta} →
        </a>
      ) : (
        <Link href={href} className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
          {cta} →
        </Link>
      )}
    </div>
  );
}
