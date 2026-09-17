import "server-only";

// ─────────────────────────────────────────────────────────────
// Firebase Admin (server only) — verifies the ID token that the
// client receives after OTP sign-in, so the backend can trust "this
// request really is that verified phone number". The service-account
// private key NEVER leaves the server.
//
// Set in .env.local (server-only):
//   FIREBASE_ADMIN_PROJECT_ID
//   FIREBASE_ADMIN_CLIENT_EMAIL
//   FIREBASE_ADMIN_PRIVATE_KEY   (paste the whole key; \n are handled)
// ─────────────────────────────────────────────────────────────

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

let adminApp: App | null = null;

export const isAdminConfigured =
  !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
  !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

function getAdminApp(): App | null {
  if (!isAdminConfigured) return null;
  if (adminApp) return adminApp;
  adminApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }),
      });
  return adminApp;
}

/** Verify a Firebase ID token. Returns the decoded token or null. */
export async function verifyIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return await getAuth(app).verifyIdToken(idToken, true);
  } catch {
    return null;
  }
}
