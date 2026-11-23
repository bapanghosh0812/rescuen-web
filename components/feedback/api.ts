"use client";

export type Problem = { message: string; code: string };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; problem: Problem };

const OFFLINE: Problem = {
  message: "You seem to be offline. Please check your connection and try again.",
  code: "E-OFFLINE",
};
const SLOW: Problem = { message: "This is taking longer than usual. Please try again.", code: "E-SLOW" };
const GENERIC: Problem = { message: "Something didn’t work as expected. Please try again.", code: "E-SERVER" };

/** Posts JSON and always resolves to a result a visitor can be shown. */
export async function post<T>(url: string, body: unknown, timeoutMs = 28_000): Promise<ApiResult<T>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const data = (await res.json().catch(() => null)) as (T & { ok?: boolean; error?: string; code?: string }) | null;
    if (res.ok && data?.ok) return { ok: true, data };
    return {
      ok: false,
      problem: { message: data?.error || GENERIC.message, code: data?.code || `E-${res.status}` },
    };
  } catch {
    if (!navigator.onLine) return { ok: false, problem: OFFLINE };
    return { ok: false, problem: ctrl.signal.aborted ? SLOW : GENERIC };
  } finally {
    clearTimeout(timer);
  }
}
