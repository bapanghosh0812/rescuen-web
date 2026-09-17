import { STATS } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

export default function Stats() {
  return (
    <section className="py-6">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-ink px-6 py-12 shadow-lift sm:px-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
            <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
