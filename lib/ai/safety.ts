import type { Action } from "@/lib/ai/types";

// Recognises someone in trouble. Runs in the browser too, so help appears
// instantly and never waits for the network or the AI.

export type Urgency = "danger" | "selfharm" | "medical";

const SELF_HARM =
  /\b(suicid\w*|kill (my ?self|myself)|end my life|want to die|don'?t want to live|self[- ]?harm|hurt myself)\b|marna chaht|mar jana|jeena nahi|jeene ka man nahi|khudkushi|आत्महत्या|मरना चाहत|जीना नहीं|আত্মহত্যা|মরে যেতে/i;

const MEDICAL =
  /\b(not breathing|unconscious|heart attack|chest pain|bleeding (a lot|badly|heavily)|snake ?bite|stroke|choking|seizure|poisoned|overdose)\b|behosh|saans nahi|khoon beh|बेहोश|साँस नहीं|सांस नहीं|অজ্ঞান|শ্বাস নিতে পার/i;

const DANGER =
  /\b(help me|save me|i(?:'m| am) (?:in danger|being (?:followed|attacked|chased|kidnapped|harassed|stalked)|trapped|scared for my life)|(?:someone|somebody|he|she|they|a man|a guy|men|some guys|strangers?|a car|a bike|the driver) (?:is|are|has|have|keeps?) (?:been )?(?:following|chasing|attacking|hitting|beating|threatening|harassing|stalking|touching) me|following me|chasing me|attacking me|beating me|threatening me|locked me|won'?t let me (?:go|leave)|taking me (?:to )?(?:the |a )?wrong|wrong (?:route|way).{0,20}(?:driver|cab|auto)|(?:driver|cab|auto).{0,30}wrong (?:route|way))\b|\bbachao\b|mujhe bacha|meri madad|madad karo|khatre mein|khatre me|peecha kar|picha kar|mujhe maar raha|mujhe mar raha|zabardasti kar|galat raste|galat jagah le ja|बचाओ|मदद करो|मुझे बचा|खतरे में|पीछा कर|বাঁচাও|সাহায্য করুন|পিছু নিচ্ছে|বিপদে/i;

export function detectUrgency(text: string): Urgency | null {
  const t = text.slice(0, 600);
  if (SELF_HARM.test(t)) return "selfharm";
  if (DANGER.test(t)) return "danger";
  if (MEDICAL.test(t)) return "medical";
  return null;
}

export const URGENT: Record<Urgency, { title: string; body: string; actions: Action[] }> = {
  danger: {
    title: "If you are in danger right now",
    body: "Call **112** first. Move towards people, light or an open shop, and keep someone on the line. In the RESCUEN app, hold **SOS for 2 seconds** or press the volume key three times.",
    actions: [
      { type: "call", label: "Call 112", number: "112" },
      { type: "call", label: "Women helpline 181", number: "181" },
    ],
  },
  selfharm: {
    title: "You matter, and you don’t have to carry this alone",
    body: "Please talk to someone now. **Tele-MANAS 14416** is free, confidential and open day and night. If you might act on these thoughts, call **112** and stay near someone you trust.",
    actions: [
      { type: "call", label: "Call 14416", number: "14416" },
      { type: "call", label: "Call 112", number: "112" },
    ],
  },
  medical: {
    title: "This may be a medical emergency",
    body: "Call **108** for an ambulance (or **112**) right away and put the phone on speaker. Stay with the person and follow the operator’s instructions.",
    actions: [
      { type: "call", label: "Call 108", number: "108" },
      { type: "call", label: "Call 112", number: "112" },
    ],
  },
};

/** True when the text reads like Hinglish, so local answers can mirror it. */
export function looksHinglish(text: string) {
  if (/[ऀ-ॿ]/.test(text)) return true;
  const hits = text
    .toLowerCase()
    .match(
      /\b(kya|kyaa|kaise|kese|kaisa|kaisi|kyu|kyun|kyon|hai|hain|he|nahi|nahin|nhi|mera|meri|mere|mujhe|muje|karo|karna|krna|kare|karen|kru|karu|batao|btao|bata|chahiye|hota|hoti|hoga|hogi|kaha|kahan|kab|kaun|kon|kitna|kitne|kitni|aur|agar|toh|bhai|bro|yeh|ye|woh|mein|raha|rahi|rha|rhi|sakta|sakti|sakte|bolo|samjhao|chalu|band|aap|aapka|apna|apni|tum|koi|kuch|sab|abhi|jab|liye|wala|wali|peecha|madad|bachao|lagega|milega|karega|kaam|paisa|paise|likho|dikhao|se|ko|ka|ki|ke)\b/g
    );
  return !!hits && hits.length >= 2;
}
