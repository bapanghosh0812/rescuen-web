"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, MapPin, MessageCircle } from "lucide-react";
import ProblemNotice from "@/components/feedback/ProblemNotice";
import type { Problem } from "@/components/feedback/api";
import { useLang } from "@/components/i18n/store";

type Lang = "en" | "hi" | "bn" | "hg";
type Need = "checkin" | "pickup" | "uneasy" | "help";

const LANGS: [Lang, string][] = [
  ["en", "English"],
  ["hg", "Hinglish"],
  ["hi", "हिन्दी"],
  ["bn", "বাংলা"],
];

const NEEDS: [Need, string][] = [
  ["checkin", "I’m on my way"],
  ["pickup", "Please pick me up"],
  ["uneasy", "I feel uneasy"],
  ["help", "I need help now"],
];

const TEXT: Record<Lang, Record<Need, string>> = {
  en: {
    checkin: "I’ve started my journey. If you don’t hear from me soon, please call me.",
    pickup: "Can you please come and pick me up? Call me when you leave.",
    uneasy: "I don’t feel safe here. Please call me now and stay on the line.",
    help: "I need help right now. Please call 112 and come to me or send someone.",
  },
  hg: {
    checkin: "Main nikal gaya/gayi hoon. Thodi der mein message na aaye toh mujhe call karna.",
    pickup: "Please mujhe lene aa jao. Nikalte hi call karna.",
    uneasy: "Mujhe yahan theek nahi lag raha. Abhi call karo aur line par raho.",
    help: "Mujhe abhi madad chahiye. 112 par call karo aur mere paas aao ya kisi ko bhejo.",
  },
  hi: {
    checkin: "मैं निकल चुका/चुकी हूँ। थोड़ी देर में मेरा संदेश न आए तो मुझे कॉल करना।",
    pickup: "कृपया मुझे लेने आ जाइए। निकलते ही कॉल कीजिए।",
    uneasy: "मुझे यहाँ सुरक्षित नहीं लग रहा। अभी कॉल कीजिए और लाइन पर रहिए।",
    help: "मुझे अभी मदद चाहिए। 112 पर कॉल कीजिए और मेरे पास आइए या किसी को भेजिए।",
  },
  bn: {
    checkin: "আমি বেরিয়ে পড়েছি। কিছুক্ষণের মধ্যে খবর না পেলে আমাকে ফোন কোরো।",
    pickup: "দয়া করে আমাকে নিতে এসো। বেরোনোর সময় ফোন কোরো।",
    uneasy: "এখানে আমার নিরাপদ লাগছে না। এখনই ফোন করো এবং লাইনে থাকো।",
    help: "আমার এখনই সাহায্য দরকার। 112-এ ফোন করো এবং আমার কাছে এসো বা কাউকে পাঠাও।",
  },
};

export default function MessageWriter() {
  const siteLang = useLang();
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => setLang(siteLang === "hi" || siteLang === "bn" ? siteLang : "en"), [siteLang]);
  const [need, setNeed] = useState<Need>("checkin");
  const [extra, setExtra] = useState("");
  const [place, setPlace] = useState("");
  const [locating, setLocating] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [copied, setCopied] = useState(false);

  const message = [TEXT[lang][need], extra.trim(), place].filter(Boolean).join("\n");

  const locate = () => {
    setProblem(null);
    if (!navigator.geolocation) {
      return setProblem({ message: "This browser can’t share a location. You can still send your message.", code: "E-GEO-NONE" });
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPlace(`https://maps.google.com/?q=${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}`);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setProblem({ message: "We couldn’t read your location. Please allow it in your browser, or send without it.", code: "E-GEO" });
      },
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked
    }
  };

  const pill = (on: boolean) =>
    `rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
      on ? "border-brand bg-brand text-white" : "border-line bg-white text-ink-soft hover:border-brand/40"
    }`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="card space-y-5 p-6 sm:p-7">
        <div>
          <p className="field-label">What’s happening?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {NEEDS.map(([id, label]) => (
              <button key={id} type="button" aria-pressed={need === id} onClick={() => setNeed(id)} className={pill(need === id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="field-label">Language</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LANGS.map(([id, label]) => (
              <button data-no-translate key={id} type="button" aria-pressed={lang === id} onClick={() => setLang(id)} className={pill(lang === id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="field-label">Add a detail (optional)</span>
          <input value={extra} onChange={(e) => setExtra(e.target.value)} maxLength={160} placeholder="e.g. White cab, WB 40 AB 1234" className="field" />
        </label>
        <button type="button" onClick={locate} disabled={locating} className="btn-ghost w-full">
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4 text-sos-600" />}
          {place ? "Update my location" : "Add my location"}
        </button>
        {problem && <ProblemNotice problem={problem} area="Message Writer" />}
      </div>

      <div className="card flex flex-col p-6 sm:p-7">
        <p className="field-label">Your message</p>
        <div data-no-translate className="mt-2 flex-1 whitespace-pre-wrap break-words rounded-2xl rounded-tl-md bg-safe-50 p-5 text-[15px] leading-relaxed text-ink" aria-live="polite">
          {message}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-white"
            style={{ backgroundImage: "linear-gradient(135deg,#1f8f4f,#1b7d46)" }}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <button type="button" onClick={copy} className="btn-ghost">
            {copied ? <Check className="h-4 w-4 text-safe-600" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-faint">Your location stays on this device until you share the message yourself.</p>
      </div>
    </div>
  );
}
