"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

export default function VerificationSuccess({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm mb-6">
        <Check className="w-12 h-12 text-emerald-700" />
      </div>
      <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Verifiziert</h2>
      <p className="text-[#86868b] mb-6">Vielen Dank! Dein Ausweis und die Lebenderkennung wurden erfolgreich geprüft. Du wirst jetzt zum Helfer-Dashboard weitergeleitet.</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={onFinish} className="bg-[#1d1d1f] hover:bg-black text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-sm">Zu meinem Profil</button>
        <Link href="/" className="py-3 px-5 rounded-full border border-slate-300 text-sm text-[#1d1d1f]">Zur Startseite</Link>
      </div>
    </div>
  );
}
