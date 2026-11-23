"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, RotateCcw, X } from "lucide-react";
import { openAssistant } from "@/components/feedback/bus";

const QUESTIONS: { q: string; weight: number; fix: string; ask: string }[] = [
  { q: "At least two people know my usual routes and timings", weight: 14, fix: "Tell two people your usual routes and timings", ask: "Write a message for my family" },
  { q: "My phone is usually above 40% when I travel late", weight: 10, fix: "Carry a small power bank for late travel", ask: "Does it drain my battery?" },
  { q: "I know that 112 is the one number for all emergencies", weight: 14, fix: "Save 112, 181 and 108 as favourites", ask: "Emergency numbers" },
  { q: "I have trusted contacts saved in a safety app", weight: 16, fix: "Add up to five trusted contacts in RESCUEN", ask: "How do I add trusted contacts?" },
  { q: "I can call for help without unlocking my phone", weight: 14, fix: "Practise the triple volume-key SOS", ask: "How do I trigger SOS?" },
  { q: "I check the number plate before sitting in a cab", weight: 12, fix: "Match plate, car and driver photo every time", ask: "How do I stay safe in a cab?" },
  { q: "My family and I share a code word for “I need help”", weight: 10, fix: "Agree a code word with your family tonight", ask: "Make me a safety plan" },
  { q: "My social posts don’t show my live location", weight: 10, fix: "Turn off public location tags", ask: "I am being harassed online" },
];

export default function SafetyCheck() {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const score = QUESTIONS.reduce((n, item, i) => n + (answers[i] ? item.weight : 0), 0);
  const gaps = QUESTIONS.filter((_, i) => !answers[i]).sort((a, b) => b.weight - a.weight).slice(0, 3);
  const level = score >= 80 ? "Well prepared" : score >= 50 ? "Getting there" : "Let’s build this up";

  if (done) {
    const r = 52;
    const length = 2 * Math.PI * r;
    return (
      <div className="card grid gap-8 p-7 sm:p-9 md:grid-cols-[220px_1fr]" aria-live="polite">
        <div className="text-center">
          <svg viewBox="0 0 128 128" className="mx-auto h-40 w-40" role="img" aria-label={`Score ${score} out of 100`}>
            <circle cx="64" cy="64" r={r} fill="none" stroke="#e5e9f2" strokeWidth="11" />
            <circle
              cx="64"
              cy="64"
              r={r}
              fill="none"
              stroke={score >= 80 ? "#27ae60" : score >= 50 ? "#e6b02f" : "#e74c3c"}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={length * (1 - score / 100)}
              transform="rotate(-90 64 64)"
            />
            <text x="64" y="74" textAnchor="middle" className="fill-ink font-display text-[32px] font-extrabold">
              {score}
            </text>
          </svg>
          <p className="mt-3 font-display text-lg font-extrabold text-ink">{level}</p>
        </div>
        <div>
          {gaps.length ? (
            <>
              <p className="font-bold text-ink">Fix these first</p>
              <ul className="mt-3 space-y-2.5">
                {gaps.map((g) => (
                  <li key={g.fix} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                    <span className="text-sm font-medium text-ink-soft">{g.fix}</span>
                    <button type="button" onClick={() => openAssistant({ question: g.ask })} className="text-xs font-bold text-brand hover:underline">
                      Show me how
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-ink-soft">Excellent. You have the essentials covered. Help someone you love take this check too.</p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="#planner" className="btn-primary px-5 py-3">
              Build a safety plan
            </Link>
            <button type="button" onClick={() => setAnswers([])} className="btn-ghost px-5 py-3">
              <RotateCcw className="h-4 w-4" /> Start again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-2xl p-7 text-center sm:p-9">
      <div className="h-1.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-brand-gradient transition-all duration-300" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="mt-6 text-xs font-bold text-ink-faint">
        {step + 1} of {QUESTIONS.length}
      </p>
      <p className="mx-auto mt-3 min-h-[4.5rem] max-w-lg font-display text-xl font-bold text-ink sm:text-2xl" aria-live="polite">
        {QUESTIONS[step].q}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setAnswers([...answers, true])} className="btn-primary whitespace-nowrap px-3 py-4 text-base">
          <Check className="h-5 w-5" /> Yes
        </button>
        <button type="button" onClick={() => setAnswers([...answers, false])} className="btn-ghost whitespace-nowrap px-3 py-4 text-base">
          <X className="h-5 w-5" /> Not yet
        </button>
      </div>
      <p className="mt-5 text-xs text-ink-faint">Your answers never leave this device.</p>
    </div>
  );
}
