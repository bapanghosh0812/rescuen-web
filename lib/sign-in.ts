import "server-only";
import { SITE } from "@/lib/site";

/**
 * Whether Google sign-in is switched on in Firebase. Asked from the server, so
 * the button appears by itself a few minutes after it is enabled.
 */
export async function googleSignInReady(): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: `${SITE.url}/` },
      body: JSON.stringify({ providerId: "google.com", continueUri: SITE.url }),
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    });
    return res.ok;
  } catch {
    return false;
  }
}
