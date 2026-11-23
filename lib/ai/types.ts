// Shared by the server and the browser. Keep it free of secrets.

export type Action =
  | { type: "link"; label: string; href: string }
  | { type: "call"; label: string; number: string }
  | { type: "ask"; label: string; question: string }
  | { type: "report"; label: string };

export type ChatMessage = { role: "user" | "model"; text: string };

/** One line of the streamed reply. */
export type StreamEvent =
  | { t: "d"; v: string }
  | { t: "a"; v: Action[] }
  | { t: "q"; v: string[] }
  | { t: "done"; live: boolean };

export type Lang = "en" | "hg";

export const PLAN_SITUATIONS = [
  { id: "night", label: "Walking home at night" },
  { id: "cab", label: "Cab or auto ride" },
  { id: "travel", label: "Travelling alone" },
  { id: "campus", label: "College or hostel" },
  { id: "work", label: "Late shift at work" },
  { id: "followed", label: "Someone keeps following me" },
  { id: "online", label: "Online harassment" },
  { id: "home", label: "Feeling unsafe at home" },
] as const;

export type PlanId = (typeof PLAN_SITUATIONS)[number]["id"];

export type SafetyPlan = {
  title: string;
  before: string[];
  during: string[];
  ifWrong: string[];
};

export const LEGAL_DOCS = ["terms", "privacy", "disclaimer", "refund", "cookies"] as const;
export type LegalDoc = (typeof LEGAL_DOCS)[number];
