"use client";

import { useRef, useState } from "react";
import { AlarmClock, Copy, Check, Footprints, Loader2, MessageCircle, ShieldAlert, Sparkles } from "lucide-react";
import { openAssistant } from "@/components/feedback/bus";
import { post, type Problem } from "@/components/feedback/api";
import ProblemNotice from "@/components/feedback/ProblemNotice";
import { PLAN_SITUATIONS, type Lang, type PlanId, type SafetyPlan } from "@/lib/ai/types";

const PARTS = [
  { key: "before", title: "Before", icon: AlarmClock, tile: "bg-brand-50 text-brand" },
  { key: "during", title: "During", icon: Footprints, tile: "bg-safe-50 text-safe-600" },
  { key: "ifWrong", title: "If it feels wrong", icon: ShieldAlert, tile: "bg-sos-50 text-sos-600" },
] as const;

export default function SafetyPlanner() {
  const [situation, setSituation] = useState<PlanId>("night");
  const [lang, setLang] = useState<Lang>("en");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<SafetyPlan | null>(null);
  const [personal, setPersonal] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [copied, setCopied] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);

  const build = async () => {
    if (busy) return;
    setBusy(true);
    setProblem(null);
    const r = await post<{ plan: SafetyPlan; personal: boolean }>("/api/assist", {
      task: "plan",
      situation,
      lang,
      note: note.trim() || undefined,
    });
    setBusy(false);
    if (!r.ok) return setProblem(r.problem);
    setPlan(r.data.plan);
    setPersonal(r.data.personal);
  };

  /** The plan exactly as shown, so a translated plan is shared translated. */
  const asText = () => {
    const lines = [...(sheet.current?.querySelectorAll("[data-plan]") ?? [])].map((el) => {
      const text = (el.textContent || "").trim();
      return el.getAttribute("data-plan") === "step" ? `- ${text}` : `\n${text}`;
    });
    return `${lines.join("\n").trim()}\n\n112`;
  };

  const copy = async () => {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="card p-6 sm:p-7">
        <p className="field-label">What are you preparing for?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLAN_SITUATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={situation === s.id}
              onClick={() => setSituation(s.id)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                situation === s.id
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="mt-5 block">
          <span className="field-label">Anything specific? (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={240}
            rows={3}
            placeholder="e.g. I finish work at 11 pm and walk 2 km from the station"
            className="field resize-none"
          />
        </label>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div role="group" aria-label="Language" className="grid grid-cols-2 rounded-xl border border-line bg-paper p-1 text-xs font-bold">
            {(["en", "hg"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-lg px-3 py-2 ${lang === l ? "bg-white text-ink shadow-soft" : "text-ink-faint"}`}
              >
                {l === "en" ? "English" : "Hinglish"}
              </button>
            ))}
          </div>
          <button type="button" onClick={build} disabled={busy} className="btn-primary w-full whitespace-nowrap disabled:opacity-70 sm:flex-1">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Building" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {busy ? "Building your plan" : "Build my plan"}
          </button>
        </div>
        {problem && <ProblemNotice problem={problem} area="Safety Planner" className="mt-4" />}
      </div>

      <div ref={sheet} className="card flex min-h-[320px] flex-col p-6 sm:p-7" aria-live="polite">
        {plan ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 data-plan="title" className="font-display text-xl font-extrabold text-ink">{plan.title}</h3>
              <span className="rounded-full bg-gold-100 px-3 py-1 text-[11px] font-bold text-gold-600">
                {personal ? "Personalised for you" : "Reviewed plan"}
              </span>
            </div>
            <div className="mt-5 grid flex-1 gap-5 sm:grid-cols-3">
              {PARTS.map((p) => (
                <div key={p.key}>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${p.tile}`}>
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p data-plan="part" className="mt-3 text-sm font-bold text-ink">{p.title}</p>
                  <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-ink-soft">
                    {plan[p.key].map((s) => (
                      <li key={s} data-plan="step" className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/40" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
              <button type="button" onClick={copy} className="btn-ghost px-4 py-2.5 text-xs">
                {copied ? <Check className="h-4 w-4 text-safe-600" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(asText())}`, "_blank", "noopener")}
                className="btn-ghost px-4 py-2.5 text-xs"
              >
                <MessageCircle className="h-4 w-4 text-safe-600" aria-hidden="true" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => openAssistant({ question: `Give me more tips for: ${plan.title}` })}
                className="btn-ghost px-4 py-2.5 text-xs"
              >
                <Sparkles className="h-4 w-4 text-brand" /> Ask for more
              </button>
            </div>
          </>
        ) : (
          <div className="m-auto max-w-xs py-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-bold text-ink">Your plan appears here</p>
            <p className="mt-1 text-sm text-ink-faint">Pick a situation and build it in a few seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
