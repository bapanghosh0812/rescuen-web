import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotAvatar from "@/components/ai/BotAvatar";
import HeroAsk from "@/components/ai/HeroAsk";
import SiteShell from "@/components/feedback/SiteShell";
import ReportLink from "@/components/feedback/ReportLink";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grid min-h-[86vh] grid-cols-1 place-items-center bg-paper px-5 pb-16 pt-32 text-center">
        <div className="w-full min-w-0 max-w-xl">
          <BotAvatar size={104} className="mx-auto" />
          <h1 className="h-display mt-6 text-3xl sm:text-4xl">We couldn’t find that page</h1>
          <p className="mt-3 text-ink-soft">It may have moved. Ask RESCUEN AI and it will take you there.</p>
          <div className="flex justify-center text-left [&>form]:w-full">
            <HeroAsk />
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Go home
            </Link>
            <Link href="/guides" className="btn-ghost">
              Safety guides
            </Link>
            <ReportLink code="E-404" area="Missing page" className="btn-ghost">
              Report
            </ReportLink>
          </div>
        </div>
      </main>
      <Footer />
      <SiteShell />
    </>
  );
}
