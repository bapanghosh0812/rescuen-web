import type { Metadata } from "next";
import OTPLogin from "@/components/OTPLogin";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to RESCUEN securely with your phone number and a one-time code. No password required.",
};

export default function LoginPage() {
  return <OTPLogin />;
}
