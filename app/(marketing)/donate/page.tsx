import { HeartHandshake, ShieldCheck, Server, Users, Sparkles } from "lucide-react";
import DonationPortal from "@/components/DonationPortal";
import Reveal from "@/components/ui/Reveal";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "Support the Mission (Daan)",
  description: "Support Team RESCUEN with any amount from ₹1 by UPI, card, net banking or wallet, and help keep core safety features free.",
  path: "/donate",
});

const MISSION_PILLARS = [
  {
    icon: Server,
    title: "24×7 Emergency SOS & Location Servers",
    desc: "Somebody, somewhere, may press SOS at three in the morning. Your support keeps the 1 KM live rescue radar, Follow-Me and our location servers awake for them.",
  },
  {
    icon: ShieldCheck,
    title: "100% Free Life-Saving Access",
    desc: "No student, night-shift worker or woman in danger should meet a paywall in the middle of an emergency. Your support makes sure they don’t.",
  },
  {
    icon: Users,
    title: "Pan-India Safety Awareness & Reach",
    desc: "The radar is only as strong as the people around you. Your support helps us bring verified Heroes to more cities, colleges and towns, so that help is closer for everyone.",
  },
];

export default function DonatePage() {
  return (
    <div className="bg-paper">
      {/* Luxury Hero Section */}
      <section className="relative overflow-hidden border-b border-line bg-white pt-32 pb-16 sm:pt-36 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-55 mask-fade-b" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="chip border-gold-300/60 bg-gold-100/70 text-gold-600">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" />
              Surakshit Bharat Abhiyan · Team RESCUEN
            </span>
            <h1 className="h-display mt-4 text-balance text-4xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Empower <span className="text-gradient-brand">Team RESCUEN</span> to Protect Every Life
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-soft">
              We built RESCUEN as a 100% free, life-saving safety platform for every citizen of India. Whatever you choose to give,
              from ₹1 to ₹1,00,000, keeps our emergency services running and helps us reach more families across the country.
            </p>
          </div>

          {/* Interactive Donation Portal */}
          <DonationPortal />
        </div>
      </section>

      {/* Where Your Contribution Goes */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="chip">
              <HeartHandshake className="h-4 w-4 text-brand" /> Complete Transparency
            </span>
            <h2 className="h-display mt-4 text-3xl sm:text-4xl">
              How <span className="text-gradient-brand">Team RESCUEN</span> Uses Every Rupee
            </h2>
            <p className="mt-3 text-ink-soft">
              Every contribution goes straight into maintaining and growing this life-saving work, and we’re grateful for each one.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MISSION_PILLARS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="card h-full p-7 transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-faint">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

