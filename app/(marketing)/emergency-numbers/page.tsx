import { Phone, Sparkles } from "lucide-react";
import AskButton from "@/components/ai/AskButton";
import { HELPLINES } from "@/lib/guides";
import { breadcrumbs, faqPage, jsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "India Emergency Numbers: 112, 181, 108, 1098, 1930",
  description:
    "Every important helpline in India on one page: 112 emergency, 100 police, 108 ambulance, 181 women, 1098 child, 1930 cyber fraud and 14416 mental health.",
  path: "/emergency-numbers",
});

const GROUPS = ["Emergency", "Women & children", "Support"] as const;

const FAQ = [
  { q: "What is the single emergency number in India?", a: "112. It connects you to police, fire and ambulance services from any phone." },
  { q: "What is the women helpline number in India?", a: "181 is the women helpline for support, shelter and referral. 1091 is the police helpline for women in distress. In immediate danger call 112." },
  { q: "Can I call 112 without balance?", a: "Emergency calls to 112 do not need call balance. Your phone does need to reach a mobile network." },
  { q: "Where do I report cyber fraud?", a: "Call 1930 as soon as possible and file a complaint at cybercrime.gov.in." },
];

export default function EmergencyNumbersPage() {
  return (
    <div className="bg-paper pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd([faqPage(FAQ), breadcrumbs([["Emergency numbers", "/emergency-numbers"]])]),
        }}
      />
      <section className="border-b border-line bg-white pb-14 pt-36">
        <div className="container-x grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-2xl">
            <h1 className="h-display text-4xl sm:text-5xl lg:text-6xl">Emergency numbers in India</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">Save this page before you need it. Tap any number to call it, and if you’re not sure which one, call 112 and simply tell them what’s happening.</p>
          </div>
          <a href="tel:112" className="btn-sos px-8 py-5 text-xl">
            <Phone className="h-6 w-6" aria-hidden="true" /> Call 112
          </a>
        </div>
      </section>

      <div className="container-x py-14">
        {GROUPS.map((group) => (
          <section key={group} className="mb-12">
            <h2 className="font-display text-2xl font-bold text-ink">{group}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {HELPLINES.filter((h) => h.group === group).map((h) => (
                <a
                  key={h.num}
                  href={`tel:${h.num}`}
                  className="group rounded-3xl border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-card"
                >
                  <span className="font-display text-4xl font-extrabold text-brand">{h.num}</span>
                  <span className="mt-3 block font-bold text-ink">{h.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-faint">{h.use}</span>
                </a>
              ))}
            </div>
          </section>
        ))}

        <section className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-ink">Common questions</h2>
          <div className="mt-5 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item rounded-2xl border border-line bg-white shadow-soft">
                <summary className="cursor-pointer px-5 py-4 font-semibold text-ink">{f.q}</summary>
                <p className="px-5 pb-5 leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <AskButton question="Emergency numbers" className="btn-primary mt-6">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Not sure who to call? Ask
          </AskButton>
        </section>
      </div>
    </div>
  );
}
