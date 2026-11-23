// English is always the default. A language changes only when the visitor picks one.
export const LANGS = [
  { id: "en", label: "English", locale: "en-IN" },
  { id: "hi", label: "हिन्दी", locale: "hi-IN" },
  { id: "bn", label: "বাংলা", locale: "bn-IN" },
  { id: "mr", label: "मराठी", locale: "mr-IN" },
  { id: "ta", label: "தமிழ்", locale: "ta-IN" },
  { id: "te", label: "తెలుగు", locale: "te-IN" },
] as const;

export type LangId = (typeof LANGS)[number]["id"];

export const LANG_IDS = LANGS.map((l) => l.id) as [LangId, ...LangId[]];

export const isLang = (v: unknown): v is LangId => LANG_IDS.includes(v as LangId);

export const localeOf = (id: LangId) => LANGS.find((l) => l.id === id)?.locale ?? "en-IN";
