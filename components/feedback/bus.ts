"use client";

// Small event bus so any button on any page can open the assistant or the
// report form without every page having to load them.

export type ReportDetail = { code?: string; area?: string; note?: string };
export type AskDetail = { question?: string };

const ASK = "rescuen:ask";
const REPORT = "rescuen:report";

export const openAssistant = (detail: AskDetail = {}) =>
  window.dispatchEvent(new CustomEvent<AskDetail>(ASK, { detail }));

export const openReport = (detail: ReportDetail = {}) =>
  window.dispatchEvent(new CustomEvent<ReportDetail>(REPORT, { detail }));

function listen<T>(name: string, fn: (detail: T) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<T>).detail || ({} as T));
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}

export const onAsk = (fn: (d: AskDetail) => void) => listen(ASK, fn);
export const onReport = (fn: (d: ReportDetail) => void) => listen(REPORT, fn);
