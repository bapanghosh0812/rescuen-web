import { Phone, Mail, MapPin, MessageCircle, Instagram, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="chip">Contact Us</span>
          <h2 className="h-display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            We’re here, <span className="text-gradient-brand">around the clock</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            Questions, feedback or need help? Leave a message and we’ll get back to you fast — you’ll
            also receive an instant email confirmation.
          </p>

          <div className="mt-8 space-y-3">
            <ContactRow icon={Mail} label="Email" value={SITE.supportEmail} href={`mailto:${SITE.supportEmail}`} />
            <ContactRow icon={MessageCircle} label="WhatsApp Channel" value="Join for updates & help" href={SITE.whatsapp} external />
            <ContactRow icon={Instagram} label="Instagram" value="@hello.officialrescuen" href={SITE.instagram} external />
            <ContactRow icon={Phone} label="Emergency (India)" value="Call 112 · 100 · 108" href="tel:112" />
            <ContactRow icon={MapPin} label="Based in" value={SITE.address} />
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-ink-soft shadow-soft">
            <Clock className="h-4 w-4 text-brand" />
            Support hours: <b className="text-ink">24 × 7</b> · Avg. reply within a few hours
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</p>
        <p className="truncate font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
  if (!href) return inner;
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="block">
      {inner}
    </a>
  );
}
