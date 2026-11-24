"use client";

// Phone and Google sign-in in the browser. The web config is public by design; nothing
// secret is ever referenced from this file.

import { getApp, getApps, initializeApp, type FirebaseApp } from "@firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type ConfirmationResult,
  type User,
  type UserCredential,
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

/** Opens Google's own sign-in window. */
export function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth(), provider);
}

/** Tells who is signed in on this device, now and whenever it changes. The sign-in is kept until they sign out. */
export function watchUser(fn: (user: User | null) => void) {
  return onAuthStateChanged(auth(), fn);
}

/** Saves the name with the sign-in itself, so the same number shows the same profile on every device. */
export async function saveName(name: string): Promise<User> {
  const user = auth().currentUser;
  if (!user) throw Object.assign(new Error("signed out"), { code: "auth/user-token-expired" });
  await updateProfile(user, { displayName: name });
  return user;
}

export function endSession() {
  return signOut(auth());
}

export type { ConfirmationResult, User };
