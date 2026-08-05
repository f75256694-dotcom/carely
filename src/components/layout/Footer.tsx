"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-warm-100 border-t border-warm-200">
      <div className="max-w-7xl mx-auto section-padding !py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-display text-lg font-semibold">Carely</span>
            </div>
            <p className="text-sm text-warm-500 max-w-xs">
              Wir verbinden Familien mit geprüften Alltagshelfer:innen. Nicht-medizinische Unterstützung mit menschlicher Wärme.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm">
            <Link href="/care-seeker" className="text-warm-500 hover:text-sage-600 transition-colors">Für Hilfesuchende</Link>
            <Link href="/family" className="text-warm-500 hover:text-sage-600 transition-colors">Familienübersicht</Link>
            <Link href="/caregiver" className="text-warm-500 hover:text-sage-600 transition-colors">Für Helfende</Link>
          </div>

          <Link href="/family" className="btn-primary text-sm">
            Jetzt starten
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-500">
          <p>&copy; {new Date().getFullYear()} Carely. Alle Rechte vorbehalten.</p>
          <p>Plattform für nicht-medizinische Alltagshilfe.</p>
          <div className="mt-2 sm:mt-0">
            <span className="text-slate-500">Bereits Mitglied? </span>
            <Link href="/login" className="text-[#3d7066] hover:underline font-medium">Hier anmelden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
