"use client";

import { useEffect, useState } from "react";
import { Check, Share2, Sparkles, Square, Volume2 } from "lucide-react";
import { openAssistant } from "@/components/feedback/bus";

/** Listen to a guide, have it explained simply, or share it. */
export default function GuideTools({ title, ask, parts }: { title: string; ask: string; parts: string[] }) {
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  const listen = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    if (speaking) return setSpeaking(false);
    setSpeaking(true);
    // One utterance per part: some browsers cut long ones off.
    parts.forEach((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN";
      u.rate = 0.97;
      if (i === parts.length - 1) u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
    });
  };

  const share = async () => {
    const data = { title: `${title} | RESCUEN`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // closed the share sheet
    }
  };

  const btn =
    "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-ink-soft shadow-soft transition-colors hover:border-brand/40 hover:text-brand";

  return (
    <div className="mt-6 flex flex-wrap gap-2.5">
      {canSpeak && (
        <button type="button" onClick={listen} className={btn}>
          {speaking ? <Square className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          {speaking ? "Stop" : "Listen"}
        </button>
      )}
      <button type="button" onClick={() => openAssistant({ question: ask })} className={btn}>
        <Sparkles className="h-4 w-4" aria-hidden="true" /> Explain simply
      </button>
      <button type="button" onClick={share} className={btn}>
        {copied ? <Check className="h-4 w-4 text-safe-600" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
        {copied ? "Link copied" : "Share"}
      </button>
    </div>
  );
}
