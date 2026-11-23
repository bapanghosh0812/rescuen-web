"use client";

// Phone sign-in in the browser. The web config is public by design; nothing
// secret is ever referenced from this file.

import { getApp, getApps, initializeApp, type FirebaseApp } from "@firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from "@firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const ready = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

let app: FirebaseApp | null = null;

function auth(): Auth {
  if (!ready) throw Object.assign(new Error("sign-in unavailable"), { code: "auth/unavailable" });
  app ??= getApps().length ? getApp() : initializeApp(config);
  const instance = getAuth(app);
  instance.useDeviceLanguage();
  return instance;
}

let verifier: RecaptchaVerifier | null = null;

/** Sends a one-time code to an E.164 number such as +919876543210. */
export async function sendOtp(phone: string, containerId: string): Promise<ConfirmationResult> {
  const instance = auth();
  verifier ??= new RecaptchaVerifier(instance, containerId, { size: "invisible" });
  try {
    return await signInWithPhoneNumber(instance, phone, verifier);
  } catch (err) {
    // A used verifier cannot be reused, so start fresh on the next attempt.
    verifier.clear();
    verifier = null;
    throw err;
  }
}

export type { ConfirmationResult };
