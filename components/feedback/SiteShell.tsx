"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WifiOff } from "lucide-react";
import AssistantLauncher from "@/components/ai/AssistantLauncher";
import { onReport, type ReportDetail } from "@/components/feedback/bus";
import Translator from "@/components/i18n/Translator";

const ReportDialog = dynamic(() => import("@/components/feedback/ReportDialog"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/ai/CommandPalette"), { ssr: false });

/** Everything that floats above the pages: assistant, search, report form, offline notice. */
export default function SiteShell({ assistant = true }: { assistant?: boolean }) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [palette, setPalette] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => onReport(setReport), []);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    const open = () => setPalette(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("rescuen:search", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("rescuen:search", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="no-print">
      <Translator />
      {offline && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-[80] flex items-center justify-center gap-2 bg-ink px-4 py-2 text-center text-xs font-semibold text-white"
        >
          <WifiOff className="h-4 w-4 text-gold-400" aria-hidden="true" />
          You’re offline. In an emergency you can still call 112.
        </div>
      )}
      {assistant && <AssistantLauncher />}
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
      {report && <ReportDialog detail={report} onClose={() => setReport(null)} />}
    </div>
  );
}
