import OTPLogin from "@/components/OTPLogin";
import SiteShell from "@/components/feedback/SiteShell";
import LanguageMenu from "@/components/i18n/LanguageMenu";
import { pageMeta } from "@/lib/seo";
import { googleSignInReady } from "@/lib/sign-in";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Sign in",
  description: "Sign in to RESCUEN with Google, or with your phone number and a one-time code.",
  path: "/login",
  index: false,
});

export default async function LoginPage() {
  const google = await googleSignInReady();
  return (
    <>
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LanguageMenu className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20" />
      </div>
      <main>
        <OTPLogin google={google} />
      </main>
      <SiteShell />
    </>
  );
}
