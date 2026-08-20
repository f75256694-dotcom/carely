'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  UserCheck, 
  HeartHandshake, 
  Lock, 
  X, 
  Building2, 
  FileText, 
  Mail, 
  Phone,
  Search
} from 'lucide-react';

export default function HomePage() {
  const [zipCode, setZipCode] = useState('');
  const [showImpressum, setShowImpressum] = useState(false);
  const [showDatenschutz, setShowDatenschutz] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col selection:bg-emerald-200">
      
      {/* Header Navigation: Passt sich auf Mobile & Desktop an */}
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

        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/login" 
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#1B4D3E] transition px-2.5 py-2"
          >
            Anmelden
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-16 lg:py-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Linker Conversion-Bereich */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0FDF4] border border-emerald-200/60 text-[#1B4D3E] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                <span>Identitätsgeprüfte Helfer in deiner Nähe</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium text-[#1B4D3E] leading-[1.15] tracking-tight">
                Fürsorgliche Hilfe im Alltag. <br />
                <span className="italic font-normal text-emerald-800/80">Einfach & sicher.</span>
              </h1>

              {/* Subline */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                Wir vermitteln qualifizierte Alltagsbegleiter für Senioren – persönlich ausgewählt, zuverlässig und direkt in eurer Nachbarschaft.
              </p>

              {/* PLZ-Eingabe / Conversion Card */}
              <div className="p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 max-w-md mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 px-3 py-2 sm:py-0 flex-1">
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

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="User" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-xs text-slate-500">Über 500+ zufriedene Familien</p>
                </div>
              </div>

            </div>

            {/* Rechter Bild-Bereich */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="aspect-[4/4] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80" 
                    alt="Herzliche Betreuung" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Subtile Trust Badge Card */}
                <div className="absolute -bottom-4 left-4 right-4 sm:-left-6 sm:right-auto bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-[#F0FDF4] rounded-xl text-[#1B4D3E] shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Persönlich geprüft</p>
                    <p className="text-[11px] text-slate-500">Ausweis & Führungszeugnis</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Feature Section */}
        <section className="py-12 sm:py-16 bg-white border-y border-gray-200/80 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0A2E23]">Sicherheit & Qualität an erster Stelle</h2>
              <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
                Höchste Standards für das Wohl Deiner Angehörigen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Geprüfte Profile</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jeder Helfer durchläuft unseren Verifizierungsprozess inklusive Identitätsprüfung.
                </p>
              </div>

              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Haftpflichtgeschützt</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Alle über Helpify vermittelten Einsätze sind haftpflicht- und unfallversichert.
                </p>
              </div>

              <div className="bg-[#FAFAF7] p-5 sm:p-6 rounded-2xl border border-gray-200/70 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0A2E23]">Feste Ansprechpartner</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verlässliche Betreuung durch persönliche Bezugspersonen in eurer Umgebung.
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
              Deine vertrauensvolle Plattform für Alltagsbetreuung und Seniorenhilfe.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" /> 256-Bit SSL-Verschlüsselt
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider">Plattform</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/funnel" className="hover:text-white transition">Helfer suchen</Link></li>
              <li><Link href="/register?role=caregiver" className="hover:text-white transition">Helfer werden</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Anmelden</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider">Rechtliches</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setShowImpressum(true)} className="hover:text-white transition text-left cursor-pointer">
                  Impressum
                </button>
              </li>
              <li>
                <button onClick={() => setShowDatenschutz(true)} className="hover:text-white transition text-left cursor-pointer">
                  Datenschutz & DSGVO
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-white font-bold uppercase tracking-wider">Kontakt</h4>
            <div className="text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-400" /> support@helpify.de</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> +49 (0) 800 123 4567</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Helpify GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </footer>

      {/* Impressum Modal */}
      {showImpressum && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative border border-gray-200">
            <button 
              onClick={() => setShowImpressum(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Building2 className="w-5 h-5 text-[#1B4D3E]" />
              <h2 className="text-xl font-bold font-serif text-[#0A2E23]">Impressum</h2>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900">Angaben gemäß § 5 DDG</h3>
                <p>Helpify GmbH (i.G.)<br />Musterstraße 123, 80331 München</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Vertreten durch</h3>
                <p>Geschäftsführung: Max Mustermann</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Kontakt</h3>
                <p>E-Mail: support@helpify.de</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Datenschutz Modal */}
      {showDatenschutz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative border border-gray-200">
            <button 
              onClick={() => setShowDatenschutz(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-slate-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <FileText className="w-5 h-5 text-[#1B4D3E]" />
              <h2 className="text-xl font-bold font-serif text-[#0A2E23]">Datenschutz (DSGVO)</h2>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>Wir verarbeiten personenbezogene Daten streng gemäß den Bestimmungen der DSGVO.</p>
              <div>
                <h3 className="font-bold text-slate-900">Datenerhebung im Funnel</h3>
                <p>Daten zur Hilfeanfrage dienen ausschließlich der Vermittlung passender Alltagshelfer.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}