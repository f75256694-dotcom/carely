'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  HeartHandshake, 
  Lock, 
  Mail, 
  Phone,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const [zipCode, setZipCode] = useState('');

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col selection:bg-emerald-200">
      
      {/* Header Navigation */}
      <header className="w-full py-3.5 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b border-gray-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-md shrink-0">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#86EFAC]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0A2E23] font-serif leading-none">Helpify</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">Senioren & Alltagshilfe</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#1B4D3E] transition px-2.5 py-2"
          >
            Anmelden
          </Link>
          <Link 
            href="/register" 
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#1B4D3E] transition px-2.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            Registrieren
          </Link>
          <Link 
            href="/funnel" 
            className="bg-[#1B4D3E] hover:bg-[#13382d] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <span>Hilfe finden</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </header>

      {/* Zentrierter Hero-Bereich ohne rechtes Bild/Element */}
      <main className="flex-1">
        <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-20 max-w-4xl mx-auto text-center">
          <div className="space-y-6 sm:space-y-8">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDF4] border border-emerald-200/60 text-[#1B4D3E] text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#1B4D3E] shrink-0" />
              <span>Geprüfte Alltagsbegleiter in deiner Nähe</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1B4D3E] leading-[1.15] tracking-tight max-w-3xl mx-auto">
              Herzliche Alltagshilfe. <br />
              <span className="italic font-normal text-emerald-800/80">Einfach, sicher & nah.</span>
            </h1>

            {/* Subline */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Wir vermitteln qualifizierte Alltagsbegleitung für Senioren – fürs Einkaufen, Spaziergänge, Haushalt oder liebevolle Gesellschaft.
            </p>

            {/* PLZ-Suche */}
            <div className="p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 px-3 py-2.5 sm:py-0 flex-1">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Deine PLZ eingeben..." 
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>
              <Link 
                href={zipCode ? `/funnel?zip=${zipCode}` : '/funnel'}
                className="bg-[#1B4D3E] hover:bg-[#143a2e] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
              >
                <span>Helfer finden</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* USPs darunter */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Identität geprüft
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Keine Kündigungsfrist
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Unverbindliche Anfrage
              </span>
            </div>

          </div>
        </section>

        {/* Feature Section */}
        <section className="py-12 sm:py-16 bg-white border-y border-gray-200/80 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0A2E23]">Alltagshilfe nach deinen Bedürfnissen</h2>
              <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
                Keine medizinische Pflege – sondern echte Entlastung im täglichen Leben.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Einkauf & Haushalt</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unterstützung beim Tragen schwerer Taschen, Vorbereitung von Mahlzeiten und im Haushalt.
                </p>
              </div>

              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Gesellschaft & Freizeit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gemeinsame Spaziergänge an der frischen Luft, Gespräche oder Begleitung zu Terminen.
                </p>
              </div>

              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Verlässlich & Flexibel</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flexible Termine ohne Aboverpflichtung – genau dann, wenn Hilfe gebraucht wird.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A2E23] text-slate-300 pt-12 pb-8 px-4 sm:px-8 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-emerald-900/60 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1B4D3E] text-white flex items-center justify-center">
                <svg className="w-4 h-4 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
                </svg>
              </div>
              <span className="text-lg font-bold font-serif text-white">Helpify</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Deine Plattform für Alltagshilfe und Begleitung im Alter.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL-Verschlüsselt
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[#86EFAC] font-bold uppercase tracking-wider">Plattform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/funnel" className="hover:text-white transition">Helfer suchen</Link></li>
              <li><Link href="/register?role=caregiver" className="hover:text-white transition">Helfer werden</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Anmelden</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[#86EFAC] font-bold uppercase tracking-wider">Rechtliches</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/imprint" className="hover:text-white transition">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/AGB" className="hover:text-white transition">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition">
                  Datenschutz & DSGVO
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-[#86EFAC] font-bold uppercase tracking-wider">Kontakt</h4>
            <div className="text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> office@helpifyservices.at</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> +43 676 ...</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Helpify. Alle Rechte vorbehalten.</p>
        </div>
      </footer>

    </div>
  );
}