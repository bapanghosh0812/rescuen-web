"use client";

import { useSyncExternalStore } from "react";

/**
 * What this device remembers about the signed-in visitor, so a greeting can
 * show at once. The real profile lives with their sign-in, not here.
 */
export type Profile = { name: string; contact: string };

const KEY = "rescuen-profile";
const EVENT = "rescuen:profile";

let raw: string | null = null;
let cached: Profile | null = null;

export function getProfile(): Profile | null {
  try {
    const now = localStorage.getItem(KEY);
    if (now !== raw) {
      raw = now;
      cached = null;
      const p = now ? (JSON.parse(now) as Partial<Profile> | null) : null;
      if (p && typeof p.name === "string" && p.name && typeof p.contact === "string") {
        cached = { name: p.name.slice(0, 40), contact: p.contact.slice(0, 80) };
      }
    }
  } catch {
    cached = null;
  }
  return cached;
}

export function rememberProfile(p: Profile | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch {
    // private mode: the profile still opens, it just isn't shown ahead of time
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(fn: () => void) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

/** The signed-in visitor, or null. Always null while the page is first drawn. */
export const useProfile = () => useSyncExternalStore(subscribe, getProfile, () => null);

/** Letters and simple punctuation only: a name, never a link or a sentence. */
export function cleanName(value: string): string | null {
  const name = value.replace(/\s+/g, " ").trim();
  return /^[\p{L}\p{M}][\p{L}\p{M}.'’ -]{1,39}$/u.test(name) ? name : null;
}

/** +919876543210 becomes +91 ••••• •3210. */
export const maskPhone = (phone: string) => phone.replace(/^(\+91)\d{6}(\d{4})$/, "$1 ••••• •$2");
