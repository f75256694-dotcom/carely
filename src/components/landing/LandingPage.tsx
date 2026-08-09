'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, Menu, X, ArrowRight, ShieldCheck, Activity, 
  CheckCircle2, UserCheck, Sparkles, Users, Shield, Check,
  Search, Calendar, Smile
} from 'lucide-react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trustPillars = [
    {
      icon: UserCheck,
      badge: "Geprüfte Qualität",
      title: "100% Verifizierte Helfer",
      description: "Jede Alltagsbegleitung durchläuft einen strengen 3-Stufen-Check: Personalausweisprüfung, persönliches Aufnahmegespräch und verpflichtendes erweitertes polizeiliches Führungszeugnis.",
      feature: "Erweitertes Führungszeugnis"
    },
    {
      icon: Shield,
      badge: "Inklusive Schutz",
      title: "Haftpflicht- & Unfallschutz",
      description: "Kein Risiko im Alltag: Alle gebuchten Einsätze über die Carely-Plattform sind automatisch haftpflicht- und unfallversichert. Volle Absicherung im Schadensfall.",
      feature: "Automatisch versichert"
    },
    {
      icon: Activity,
      badge: "Live-Einblick",
      title: "Digitaler Familien-Hub",
      description: "Volle Beruhigung für Angehörige — auch aus der Ferne. Erhalten Sie Check-in-Meldungen, erledigte Aufgaben und kurze Foto-Updates direkt auf Ihr Smartphone.",
      feature: "Echtzeit-Statusupdates"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Profil erstellen & Bedarf definieren",
      description: "Egal ob Sie Unterstützung für Ihre Familie suchen oder als Helfer aktiv werden möchten — in wenigen Klicks ist Ihr Profil eingerichtet."
    },
    {
      number: "02",
      icon: Calendar,
      title: "Kennenlernen & abstimmen",
      description: "Finden Sie passende Profile in Ihrer direkten Nachbarschaft. Besprechen Sie alle Details ganz unkompliziert persönlich."
    },
    {
      number: "03",
      icon: Smile,
      title: "Sicher starten & entspannen",
      description: "Dank automatischer Absicherung, digitalem Wochenplan und Live-Updates läuft jeder Einsatz absolut transparent und sorgenfrei."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F6F4] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans antialiased overflow-x-hidden pb-20 md:pb-0">
      
      {/* HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-emerald-900/5 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2a524a] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#112a24] font-serif">
              Carely
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-[#2a524a]">
            <a href="#how-it-works" className="hover:text-[#112a24] hover:underline underline-offset-4 decoration-emerald-300 transition-all">So funktioniert's</a>
            <a href="#marketplace" className="hover:text-[#112a24] hover:underline underline-offset-4 decoration-emerald-300 transition-all">Für Helfer & Familien</a>
            <a href="#trust" className="hover:text-[#112a24] hover:underline underline-offset-4 decoration-emerald-300 transition-all">Sicherheit & Prüfung</a>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-[#2a524a] hover:text-[#112a24] transition-colors">
              Anmelden
            </Link>
            <Link href="/register?role=family" className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#2a524a] text-white shadow-lg shadow-emerald-900/10 hover:bg-[#1f4239] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 group">
              Mitmachen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#2a524a]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-emerald-100 p-6 flex flex-col gap-6 shadow-2xl">
            <nav className="flex flex-col gap-4 text-lg font-medium text-[#2a524a]">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>So funktioniert's</a>
              <a href="#marketplace" onClick={() => setMobileMenuOpen(false)}>Für Helfer & Familien</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)}>Sicherheit & Prüfung</a>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-emerald-50">
              <Link href="/login" className="w-full py-3 text-center rounded-xl font-medium text-[#2a524a] bg-emerald-50">Anmelden</Link>
              <Link href="/register" className="w-full py-3 text-center rounded-xl font-semibold bg-[#2a524a] text-white">Mitmachen</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/50 via-teal-100/30 to-transparent blur-[90px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto w-full text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-emerald-200/60 text-[#2a524a] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-4 h-4" /> 100% Alltagshilfe — Ohne medizinische Pflege-Vorkenntnisse
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-bold text-[#112a24] tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Nachbarschaftshilfe <br className="hidden sm:block" />
            neu gedacht. <br />
            <span className="text-[#3b7364] italic font-light">Hilfe finden oder Gutes tun.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto font-light leading-relaxed">
            Carely verbindet Familien auf der Suche nach verlässlicher Unterstützung direkt mit geprüften Alltagshelfern in ihrer Nachbarschaft. Transparent, sicher und unkompliziert.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-8 text-left">
            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(42,82,74,0.1)] hover:-translate-y-1 transition-all duration-400 group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#2a524a] flex items-center justify-center mb-8">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#112a24] mb-4">Ich suche Alltagsbegleitung</h3>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed min-h-[80px]">
                Finden Sie liebevolle Unterstützung für Einkäufe, Spaziergänge oder Gesellschaft im Alltag — inklusive Live-Statusupdates.
              </p>
              <Link href="/register?role=family" className="inline-flex items-center justify-center w-full py-4 rounded-2xl font-bold bg-[#2a524a] text-white hover:bg-[#1f4239] transition-colors group-hover:shadow-lg gap-3 text-lg">
                Betreuung finden <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2.5rem] border border-emerald-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(42,82,74,0.1)] hover:-translate-y-1 transition-all duration-400 group">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-[#2a524a] flex items-center justify-center mb-8">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#112a24] mb-4">Ich möchte Helfer werden</h3>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed min-h-[80px]">
                Arbeiten Sie flexibel in Ihrer Nachbarschaft. Perfekt für Studierende, Rentner & Quereinsteiger. Keine Vorkenntnisse nötig!
              </p>
              <Link href="/register?role=caregiver" className="inline-flex items-center justify-center w-full py-4 rounded-2xl font-bold bg-[#e8f1ef] text-[#2a524a] hover:bg-[#dce9e6] transition-colors group-hover:shadow-md gap-3 text-lg">
                Alltagshelfer werden <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / PROCESS SECTION */}
      <section id="how-it-works" className="py-24 px-6 bg-[#E9F0EE] relative overflow-hidden border-t border-emerald-900/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center px-4.5 py-1.5 rounded-full bg-emerald-200/60 border border-emerald-300/50 text-[#2a524a] text-xs font-bold uppercase tracking-widest shadow-xs">
              Einfach & Transparent
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#112a24] leading-[1.15] tracking-tight">
              In 3 Schritten zur <br className="hidden sm:block" />
              <span className="text-[#3b7364] italic font-light">passenden Begleitung.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white p-10 rounded-[2.2rem] border border-emerald-900/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-[#2a524a] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-serif font-bold text-emerald-900/20">
                        {step.number}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold text-[#112a24]">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST SECTION (Optimiert: Features integriert) */}
      <section id="trust" className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#112a24] leading-[1.15] tracking-tight">
              Sicherheit & Transparenz — <br className="hidden sm:block" />
              <span className="text-[#3b7364] italic font-light">von Grund auf eingebaut.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="group relative bg-white p-9 rounded-[2.2rem] border border-emerald-900/10 shadow-[0_10px_30px_rgba(42,82,74,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#2a524a] flex items-center justify-center">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif font-bold text-[#112a24]">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-emerald-50 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#2a524a] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#2a524a] tracking-tight">
                      {pillar.feature}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="bg-[#2a524a] text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20">
            <ShieldCheck className="w-4 h-4" /> Starten Sie in unter 2 Minuten
          </div>
          
          <h2 className="text-5xl sm:text-7xl font-serif font-bold text-white leading-tight">
            Werden auch Sie Teil von Carely. <br />
            <span className="text-[#a8dac9] italic font-light">Als Helfer oder Suchender.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
            <Link href="/register?role=family" className="w-full sm:w-auto px-10 py-4 bg-white text-[#2a524a] font-bold rounded-full hover:bg-slate-50 transition-all shadow-xl text-lg hover:scale-105 active:scale-95 duration-300">
              Hilfe für Angehörige finden
            </Link>
            <Link href="/register?role=caregiver" className="w-full sm:w-auto px-10 py-4 bg-transparent text-white border border-white/40 font-bold rounded-full hover:bg-white/10 transition-all text-lg hover:scale-105 active:scale-95 duration-300">
              Alltagshelfer werden
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1715] text-slate-400 py-12 px-6 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xl font-serif font-bold text-white">Carely</span>
          </div>
          
          <div className="flex gap-8 font-medium">
            <Link href="/terms" className="hover:text-white transition-colors">AGB</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/imprint" className="hover:text-white transition-colors">Impressum</Link>
          </div>
          
          <p>© {new Date().getFullYear()} Carely GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </footer>

      {/* MOBILE FIXED ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md p-4 border-t border-emerald-900/10 z-40 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <Link href="/register?role=family" className="flex-1 py-3 px-3 rounded-xl font-bold text-xs bg-[#2a524a] text-white text-center shadow-md">
          Hilfe finden
        </Link>
        <Link href="/register?role=caregiver" className="flex-1 py-3 px-3 rounded-xl font-bold text-xs bg-[#e8f1ef] text-[#2a524a] text-center">
          Helfer werden
        </Link>
      </div>

    </div>
  );
}