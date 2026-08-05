"use client";

import React from "react";
import Link from "next/link";

export default function VerifiedProfile({ onFinish }: { onFinish?: () => void }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-5 p-8 bg-white/95 rounded-[2rem] border border-black/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="w-20 h-20 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white text-2xl font-semibold">✓</div>
        <div className="text-left">
          <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Verifizierter Helfer</div>
          <div className="text-sm text-[#86868b] mt-2">Ihr Identitätscheck wurde erfolgreich abgeschlossen. Ihr Profil zeigt nun das Verifiziert-Badge.</div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/caregiver" className="bg-[#1d1d1f] hover:bg-black text-white font-medium py-4 px-8 rounded-full shadow-sm">Zum Helfer-Dashboard</Link>
        <button onClick={() => onFinish?.()} className="text-sm text-[#86868b]">Später anpassen</button>
      </div>
    </div>
  );
}
