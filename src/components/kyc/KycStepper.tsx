"use client";

import React from "react";

export default function KycStepper({ step }: { step: number }) {
  const labels = ["Dokument", "Lebenderkennung", "Systemprüfungen", "Verifiziert"];
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {labels.map((label, i) => {
          const idx = i + 1;
          const done = idx < step;
          const active = idx === step;
          return (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className={`w-8 h-8 rounded-full border ${done ? "border-[#3d7066] bg-[#3d7066] text-white" : active ? "border-[#1d1d1f] bg-white text-[#1d1d1f]" : "border-black/[0.08] bg-white text-[#86868b]"} flex items-center justify-center text-sm font-semibold`}>
                {done ? "✓" : idx}
              </div>
              <div className={`text-[11px] uppercase tracking-[0.24em] ${active || done ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>{label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 h-px bg-slate-200 rounded-full overflow-hidden">
        <div className="h-px bg-[#3d7066] transition-all duration-300" style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }} />
      </div>
    </div>
  );
}
