'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function DankePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-slate-200/80 space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#1B4D3E] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-[#0A2E23]">Vielen Dank!</h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Deine Anfrage ist bei uns eingegangen. Wir prüfen die Verfügbarkeit in deiner Region und melden uns innerhalb von 24 Stunden bei dir.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link 
            href="/"
            className="w-full bg-[#1B4D3E] hover:bg-[#143a2e] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition inline-flex items-center justify-center gap-2 shadow-md"
          >
            <span>Zurück zur Startseite</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}