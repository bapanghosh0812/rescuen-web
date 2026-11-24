import type { Lang, LegalDoc } from "@/lib/ai/types";

// Plain-language summaries of each policy. The full policy always applies.
export const LEGAL_SUMMARY: Record<LegalDoc, Record<Lang, string[]>> = {
  terms: {
    en: [
      "RESCUEN is a safety aid, not an emergency service. Call 112 first.",
      "Alerts can fail because of battery, GPS, network or other people.",
      "You must be 18+, or use it with a parent or guardian’s consent.",
      "Never send fake alerts or use RESCUEN to track or harm someone.",
      "Core safety features are free. Indian law applies (Durgapur courts).",
    ],
    hg: [
      "RESCUEN madad ka saadhan hai, emergency service nahi. Pehle 112.",
      "Battery, GPS, network ya kisi aur wajah se alert fail ho sakta hai.",
      "18+ hona zaroori hai, warna parent ya guardian ki ijazat se.",
      "Jhootha alert na bhejein, na kisi ko track ya nuksaan pahunchayein.",
      "Core safety features free hain. Bharat ka kanoon laagu (Durgapur).",
    ],
  },
  privacy: {
    en: [
      "We collect only what safety features need.",
      "Your location is used by SOS, Follow-Me and the radar; one setting hides it when you are safe.",
      "Your data is never sold or used for advertising.",
      "It is encrypted in transit and at rest, but not end-to-end.",
      "You can see, correct or delete your data by emailing us.",
    ],
    hg: [
      "Hum sirf utna data lete hain jitna safety ke liye zaroori hai.",
      "Location SOS, Follow-Me aur radar ke kaam aati hai; ek setting ise safe samay mein chhupa deti hai.",
      "Data na becha jaata hai, na ads mein use hota hai.",
      "Data bhejte aur rakhte waqt encrypted hai, par end-to-end nahi.",
      "Email karke apna data dekh, sudhar ya delete karwa sakte hain.",
    ],
  },
  disclaimer: {
    en: [
      "RESCUEN supports official services and never replaces them.",
      "No app can promise that help will arrive in time.",
      "AI answers are general guidance and can be wrong.",
      "Other websites and services we link to are not under our control.",
      "In danger, call 112 before anything else.",
    ],
    hg: [
      "RESCUEN sarkari seva ki madad karta hai, unki jagah nahi leta.",
      "Koi app yeh vaada nahi kar sakti ki madad samay par aayegi.",
      "AI ke jawab general salah hain aur galat ho sakte hain.",
      "Doosri websites aur services hamare control mein nahi hain.",
      "Khatre mein sabse pehle 112.",
    ],
  },
  refund: {
    en: [
      "Core safety features are free, so there is nothing to refund.",
      "Subscriptions, if offered, can be cancelled any time.",
      "Google Play purchases follow Google’s refund policy.",
      "Direct purchases: ask within 7 days if the feature didn’t work.",
      "Price changes apply only to later billing periods.",
    ],
    hg: [
      "Core safety features free hain, isliye refund ki baat nahi.",
      "Subscription ho toh kabhi bhi cancel kar sakte hain.",
      "Google Play ki kharid par Google ki refund policy chalti hai.",
      "Seedhi kharid: feature na chale toh 7 din mein bolein.",
      "Price badle toh sirf aage ke billing period par lagu hota hai.",
    ],
  },
  cookies: {
    en: [
      "Only essential storage is used, such as keeping you signed in.",
      "There are no advertising or tracking cookies.",
      "Your chat is kept in this browser tab and clears when you close it.",
      "You can block cookies, but sign-in may stop working.",
    ],
    hg: [
      "Sirf zaroori storage use hota hai, jaise sign-in banaye rakhna.",
      "Koi advertising ya tracking cookie nahi hai.",
      "Aapki chat isi tab mein rehti hai aur band karte hi hat jaati hai.",
      "Cookies block kar sakte hain, par sign-in ruk sakta hai.",
    ],
  },
};
