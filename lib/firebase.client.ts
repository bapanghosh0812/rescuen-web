"use client";

// ─────────────────────────────────────────────────────────────
// Firebase (client) — phone-number OTP sign-in.
// The web config below is PUBLIC by design (Firebase ships it in the
// browser). Real secrets (Admin private key, Gmail password) live only
// in server-side env and never reach the client.
//
// Fill these in .env.local  →  NEXT_PUBLIC_FIREBASE_*   (see .env.local.example)
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True only when every required web-config value is present. */
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.authDomain &&
  !!firebaseConfig.projectId &&
  !!firebaseConfig.appId;

let cachedApp: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (cachedApp) return cachedApp;
  cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  const auth = getAuth(app);
  auth.useDeviceLanguage();
  return auth;
}

/**
 * Create (once) an invisible reCAPTCHA verifier bound to a DOM node id.
 * Invisible => no visible checkbox, no extra "permission" for the user.
 */
export function createRecaptcha(containerId: string): RecaptchaVerifier | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  // Reuse a verifier if one already exists on the window.
  const w = window as unknown as { __rescuenRecaptcha?: RecaptchaVerifier };
  if (w.__rescuenRecaptcha) return w.__rescuenRecaptcha;
  const verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  w.__rescuenRecaptcha = verifier;
  return verifier;
}

/** Send an OTP to an E.164 phone number (e.g. +919876543210). */
export async function sendOtp(
  phoneE164: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not configured");
  return signInWithPhoneNumber(auth, phoneE164, verifier);
}

export type { ConfirmationResult };
