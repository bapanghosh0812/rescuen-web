"use client";

import type { ReactNode } from "react";
import { openReport, type ReportDetail } from "@/components/feedback/bus";

export default function ReportLink({
  children,
  className = "",
  ...detail
}: ReportDetail & { children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={() => openReport(detail)} className={className}>
      {children}
    </button>
  );
}
