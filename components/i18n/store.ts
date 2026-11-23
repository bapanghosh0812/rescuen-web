"use client";

import { useSyncExternalStore } from "react";
import { isLang, type LangId } from "@/lib/i18n/languages";

const KEY = "rescuen-lang";
const EVENT = "rescuen:lang";

export function getLang(): LangId {
  try {
    const saved = localStorage.getItem(KEY);
    return isLang(saved) ? saved : "en";
  } catch {
    return "en";
  }
}

export function setLang(id: LangId) {
  if (getLang() === id) return;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // private mode: the choice lasts for this page only
  }
  window.dispatchEvent(new CustomEvent<LangId>(EVENT, { detail: id }));
}

export function onLang(fn: (id: LangId) => void) {
  const changed = (e: Event) => fn((e as CustomEvent<LangId>).detail);
  const otherTab = (e: StorageEvent) => e.key === KEY && fn(getLang());
  window.addEventListener(EVENT, changed);
  window.addEventListener("storage", otherTab);
  return () => {
    window.removeEventListener(EVENT, changed);
    window.removeEventListener("storage", otherTab);
  };
}

/** The chosen language. English while the page is first drawn. */
export function useLang(): LangId {
  return useSyncExternalStore(onLang, getLang, () => "en");
}
