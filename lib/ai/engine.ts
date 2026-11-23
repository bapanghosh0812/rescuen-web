import { KNOWLEDGE, STARTERS, type Entry } from "@/lib/ai/knowledge";
import { looksHinglish } from "@/lib/ai/safety";
import type { Action } from "@/lib/ai/types";

// Answers from the knowledge base without any AI service. Used when the AI is
// resting or the visitor is offline, so the assistant always responds.

export type LocalAnswer = { text: string; actions: Action[]; next: string[]; confident: boolean };

const STOP = new Set(
  "the a an is are am i you do does did to of in on for and or it my me we can how what when where why with this that be if at as will would should please tell about hai hain ka ki ke ko se mein me kya kaise karo karu kare batao bata mujhe mera meri aur toh bhai yeh ye".split(
    " "
  )
);

// Devanagari and Bengali words mapped onto the Latin keywords used above.
const ALIASES: [RegExp, string][] = [
  [/एसओएस|पैनिक|बटन/g, " sos panic button "],
  [/रेस्क्यू|रेस्क्यूएन|ऐप|एप/g, " rescuen app "],
  [/रडार/g, " radar "],
  [/पीछा/g, " following followed "],
  [/हेल्पलाइन|नंबर|नम्बर/g, " helpline number emergency "],
  [/मुफ्त|मुफ़्त|पैसे/g, " free price "],
  [/लॉगिन|ओटीपी/g, " login otp "],
  [/दान/g, " donate "],
  [/इंटरनेट/g, " internet offline "],
  [/डेटा|गोपनीय|लोकेशन/g, " privacy location data "],
  [/पुलिस|शिकायत/g, " police complaint "],
  [/রাডার/g, " radar "],
  [/সাহায্য|নম্বর/g, " helpline number emergency "],
  [/অ্যাপ/g, " rescuen app "],
];

function tokens(text: string): string[] {
  let t = text.toLowerCase();
  for (const [re, to] of ALIASES) t = t.replace(re, to);
  return t
    .replace(/[^a-z0-9ऀ-৿ ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** True when two words differ by at most one typo. */
function near(a: string, b: string) {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

const INDEX = KNOWLEDGE.map((entry) => ({
  entry,
  title: tokens(entry.q),
  keys: tokens(entry.k),
}));

// Words found in many entries say little, so rare words count for more.
const DF = new Map<string, number>();
for (const { title, keys } of INDEX) for (const w of new Set([...title, ...keys])) DF.set(w, (DF.get(w) || 0) + 1);
const weight = (w: string) => 1 + Math.log(INDEX.length / (DF.get(w) || 1));

export function search(text: string): { entry: Entry; score: number; cover: number }[] {
  const words = [...new Set(tokens(text))];
  if (!words.length) return [];
  const unknown = weight("");
  return INDEX.map(({ entry, title, keys }) => {
    let score = 0;
    let known = 0;
    let total = 0;
    for (const w of words) {
      const own = DF.has(w) ? weight(w) : unknown;
      total += own;
      if (title.includes(w)) {
        score += own * 1.6;
        known += own;
      } else if (keys.includes(w)) {
        score += own;
        known += own;
      } else {
        const close = [...title, ...keys].find((x) => near(w, x));
        if (close) {
          score += weight(close) * 0.7;
          known += own;
        }
      }
    }
    return { entry, score: score / Math.sqrt(words.length), cover: known / total };
  })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score);
}

/** Short questions must mostly be about the topic; long ones may carry extra detail. */
function isMatch(hit: { score: number; cover: number } | undefined, words: number, min: number) {
  return !!hit && hit.score >= min && (words > 6 || hit.cover >= 0.4);
}

const GREETING = /^(hi+|hey+|hello+|hii+|namaste|namaskar|salaam|yo|good (morning|evening|afternoon|night)|नमस्ते|হ্যালো|নমস্কার)\b/i;
const THANKS = /\b(thanks?|thank you|thanku|shukriya|dhanyavaad|dhanyawad|great|awesome|perfect|ok(ay)?|accha|acha|theek|badhiya)\b/i;

export function answerLocally(question: string, preferHinglish = false): LocalAnswer {
  const q = question.trim();
  const hg = preferHinglish || looksHinglish(q);
  const exact = KNOWLEDGE.find((e) => e.q.toLowerCase() === q.toLowerCase());
  const pick = (e: Entry): LocalAnswer => ({
    text: hg ? e.hg : e.en,
    actions: e.actions || [],
    next: e.next || [],
    confident: true,
  });
  if (exact) return pick(exact);

  const ranked = search(q);
  const words = new Set(tokens(q)).size;
  if (isMatch(ranked[0], words, 2.4)) return pick(ranked[0].entry);

  if (GREETING.test(q)) {
    return {
      text: hg
        ? "Namaste! Main **RESCUEN AI** hoon. App, website ya apni safety ke baare mein kuch bhi poochiye."
        : "Namaste! I’m **RESCUEN AI**. Ask me anything about the app, this website or staying safe.",
      actions: [],
      next: STARTERS,
      confident: true,
    };
  }
  if (THANKS.test(q) && q.length < 40) {
    return {
      text: hg ? "Khushi hui. Safe rahein, main yahin hoon." : "Happy to help. Stay safe, I’m right here.",
      actions: [],
      next: STARTERS.slice(0, 3),
      confident: true,
    };
  }
  if (isMatch(ranked[0], words, 1.5)) return pick(ranked[0].entry);

  return {
    text: hg
      ? "Is sawal ka pakka jawab mere paas abhi nahi hai, aur main andaza nahi lagana chahta. Neeche se chunein, ya hamari team se poochein."
      : "I don’t have a reliable answer to that yet, and I’d rather not guess. Try one of these, or ask our team directly.",
    actions: [
      { type: "link", label: "Ask our team", href: "/#contact" },
      { type: "report", label: "Report a problem" },
    ],
    next: ranked.length ? ranked.slice(0, 3).map((r) => r.entry.q) : STARTERS,
    confident: false,
  };
}

/** Buttons and follow-ups that suit a question, for replies written by the AI. */
export function suggestFor(question: string): { actions: Action[]; next: string[] } {
  const top = search(question)[0];
  if (!top || top.score < 2 || top.cover < 0.3) return { actions: [], next: [] };
  return { actions: (top.entry.actions || []).slice(0, 3), next: (top.entry.next || []).slice(0, 3) };
}
