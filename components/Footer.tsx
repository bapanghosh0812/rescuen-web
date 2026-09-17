import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, Mail, MapPin, ShieldCheck, Code2 } from "lucide-react";
import { SITE, FOOTER_GROUPS } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-line bg-paper">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/#home" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-line">
                <Image src="/rescuen-logo.png" alt="RESCUEN" width={30} height={30} className="object-contain" />
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                RESCU<span className="text-brand">EN</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-faint">{SITE.description}</p>

            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Instagram, href: SITE.instagram, label: "Instagram" },
                { icon: MessageCircle, href: SITE.whatsapp, label: "WhatsApp Channel" },
                { icon: Code2, href: SITE.developerUrl, label: "Developer" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:text-brand"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-soft">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Encrypted in transit &amp; at rest · Privacy-first
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-ink">{group.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((l) => {
                    const external = l.href.startsWith("http");
                    return (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          className="text-sm text-ink-faint transition-colors hover:text-brand"
                        >
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-12 grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-soft sm:grid-cols-3">
          <a href={`mailto:${SITE.supportEmail}`} className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">
              <Mail className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-ink-faint">Email</span>
              <span className="truncate font-semibold text-ink">{SITE.supportEmail}</span>
            </span>
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-safe-50 text-safe-600">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-ink-faint">WhatsApp</span>
              <span className="font-semibold text-ink">Join our channel</span>
            </span>
          </a>
          <div className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">
              <MapPin className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[11px] uppercase tracking-wide text-ink-faint">Based in</span>
              <span className="font-semibold text-ink">{SITE.address}</span>
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-center text-xs text-ink-faint sm:flex-row sm:text-left">
          <p>
            © {year} {SITE.name} · Built by {SITE.owner}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/legal/terms" className="hover:text-brand">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-brand">Privacy</Link>
            <Link href="/legal/disclaimer" className="hover:text-brand">Disclaimer</Link>
            <Link href="/legal/refund" className="hover:text-brand">Refunds</Link>
            <Link href="/legal/cookies" className="hover:text-brand">Cookies</Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-faint/80 sm:text-left">
          RESCUEN is a personal-safety aid and does not replace official emergency services. In a
          life-threatening emergency, always call 112 (India) or your local emergency number first.
        </p>
      </div>
    </footer>
  );
}
