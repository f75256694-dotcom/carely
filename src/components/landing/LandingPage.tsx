'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, Menu, X, ArrowRight, ShieldCheck, Activity, 
  Calendar, Camera, CheckCircle2, MapPin, Clock, Star, 
  UserCheck, CreditCard, Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'plan' | 'moments'>('live');

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans antialiased overflow-x-hidden">
      
      {/* Dynamic Glass Header */}
      <header className="sticky top-0 z-50 bg-[#FBFBF9]/80 backdrop-blur-2xl border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2d564f] via-[#3d7066] to-[#518f82] text-white flex items-center justify-center shadow-lg shadow-teal-900/15 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight font-display bg-gradient-to-r from-slate-900 via-[#2d564f] to-slate-800 bg-clip-text text-transparent">
              Carely
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#2d564f] transition-colors">So funktioniert's</a>
            <a href="#trust" className="hover:text-[#2d564f] transition-colors">Sicherheit & Prüfung</a>
            <a href="#features" className="hover:text-[#2d564f] transition-colors">Vorteile</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all hover:scale-105"
            >
              Anmelden
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#2d564f] to-[#3d7066] text-white shadow-lg shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/35 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
            >
              Registrieren
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-4 text-base font-bold text-slate-800">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>So funktioniert's</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)}>Sicherheit & Prüfung</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Vorteile</a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/login" className="w-full py-3 text-center rounded-xl font-bold border border-slate-200 text-slate-800">Anmelden</Link>
              <Link href="/register" className="w-full py-3 text-center rounded-xl font-bold bg-gradient-to-r from-[#2d564f] to-[#3d7066] text-white">Registrieren</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-emerald-200/50 via-teal-100/70 to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-300/25 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Nachbarschaftshilfe. <br />
            <span className="bg-gradient-to-r from-[#2d564f] via-[#3d7066] to-[#518f82] bg-clip-text text-transparent italic font-serif font-normal">
              Hilfe von Mensch zu Mensch.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Liebevolle Betreuung und verlässliche Unterstützung im Alltag. Finden Sie geprüfte Alltagshelfer in Ihrer Nähe oder verwalten Sie die Betreuung Ihrer Angehörigen transparent an einem Ort.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-4">
            <Link 
              href="/register?role=family" 
              className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#2d564f] via-[#3d7066] to-[#2d564f] text-white font-black rounded-full shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:shadow-teal-900/35 hover:scale-105 active:scale-95 transition-all duration-300 text-center text-lg flex items-center justify-center gap-3 group"
            >
              Betreuung finden
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <Link 
              href="/register?role=caregiver" 
              className="w-full sm:w-auto px-9 py-4 bg-white/90 backdrop-blur-md border border-slate-200/90 text-slate-800 font-black rounded-full hover:bg-white hover:border-[#3d7066] hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-center text-lg"
            >
              Alltagshelfer werden
            </Link>
          </div>

          <div className="pt-10 flex flex-wrap justify-center items-center gap-8 text-xs font-extrabold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Faire & transparente Konditionen</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Von uns streng geprüft</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ohne Papierkram</span>
          </div>
        </div>
      </section>

      {/* TRUST & VERIFICATION GRID */}
      <section id="trust" className="py-24 px-6 bg-gradient-to-b from-[#FBFBF9] via-white to-[#FBFBF9] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2d564f_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200/85 text-[#2d564f] text-xs font-black uppercase tracking-widest shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Geprüfte Sicherheit & Transparenz
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Warum Familien Carely vertrauen — <span className="bg-gradient-to-r from-[#2d564f] to-[#3d7066] bg-clip-text text-transparent">ohne Kompromisse.</span>
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Wenn es um Ihre Liebsten geht, gibt es keinen Platz für Zweifel. Deshalb gehen wir bei der Auswahl und Prüfung neue Maßstäbe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Identity & Police Clearance Check */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(45,86,79,0.08)] hover:shadow-[0_30px_70px_rgba(45,86,79,0.15)] hover:border-[#3d7066]/50 transition-all duration-300 space-y-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d564f] to-[#3d7066] text-white flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-slate-900">Wir prüfen Identität & Führungszeugnis</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  Wir überlassen nichts dem Zufall: Jede Alltagshelferin wird von uns persönlich validiert. Wir prüfen den Personalausweis und fordern das erweiterte polizeiliche Führungszeugnis aktiv an.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2d564f] relative z-10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Aktive Manöver-Prüfung durch Carely
              </div>
            </div>

            {/* Card 2: Fair Pricing & Simple Billing */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(45,86,79,0.08)] hover:shadow-[0_30px_70px_rgba(45,86,79,0.15)] hover:border-[#3d7066]/50 transition-all duration-300 space-y-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d564f] to-[#3d7066] text-white flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10">
                <CreditCard className="w-7 h-7" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-slate-900">Faire & Transparente Preise</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  Keine versteckten Kosten oder komplizierten Verträge. Sie vereinbaren faire Stundensätze direkt und flexibel mit Ihren Helfern – mit voller Kostenkontrolle über unsere Plattform.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2d564f] relative z-10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% transparent & ohne Risiko
              </div>
            </div>

            {/* Card 3: Live-Updates & Verbundenheit */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(45,86,79,0.08)] hover:shadow-[0_30px_70px_rgba(45,86,79,0.15)] hover:border-[#3d7066]/50 transition-all duration-300 space-y-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d564f] to-[#3d7066] text-white flex items-center justify-center shadow-lg shadow-teal-900/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10">
                <Activity className="w-7 h-7" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-slate-900">Live-Updates & Verbundenheit</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  Erleben Sie Live-Statusmeldungen, Spaziergang-Updates und schöne Foto-Momente direkt in Ihrer App. So bleiben Sie eng verbunden, egal wo Sie gerade sind.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2d564f] relative z-10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Volle Transparenz in Echtzeit
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SCROLL STORY SECTION WITH GLASSMOURPHISM DASHBOARD SHOWCASE */}
      <section id="how-it-works" className="relative py-28 px-6 bg-gradient-to-b from-[#FBFBF9] via-[#F2F6F4] to-[#FBFBF9] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/70 border border-emerald-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-xs font-black uppercase tracking-widest text-[#2d564f]">Der Carely Familien-Hub</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                Ein beruhigendes Gefühl <br />
                <span className="bg-gradient-to-r from-[#2d564f] via-[#3d7066] to-[#518f82] bg-clip-text text-transparent font-serif italic font-normal">
                  für die ganze Familie
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-xl">
                Erleben Sie Live-Updates, wenn Ihre Helferin unterstützt. Foto-Momente, Termine und Ihr Betreuungsplan — alles in einer modernen, leicht bedienbaren Ansicht.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { id: 'live', title: 'Live-Aktivitäten & Status', sub: 'Echtzeit-Updates bei Einkäufen, Terminen oder Spaziergängen.', icon: Activity },
                  { id: 'plan', title: 'Strukturierte Wochenplanung', sub: 'Termine mit Betreuer:innen transparent koordinieren.', icon: Calendar },
                  { id: 'moments', title: 'Geteilte Herzensmomente', sub: 'Fotos und liebevolle Nachrichten direkt auf Ihr Smartphone.', icon: Camera },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-start gap-4 border group hover:-translate-y-1 ${
                        isActive
                          ? 'bg-white border-[#3d7066] shadow-xl shadow-teal-950/10 translate-x-2'
                          : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`p-3.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-[#2d564f] to-[#3d7066] text-white shadow-md scale-105' : 'bg-slate-100 text-slate-600 group-hover:scale-105 group-hover:bg-emerald-50 group-hover:text-[#2d564f]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{tab.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{tab.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FLOATING GLASS HUB MOCKUP */}
            <div className="lg:col-span-6 flex justify-center z-10">
              <div className="relative w-full max-w-[460px]">
                
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/35 via-teal-300/30 to-emerald-200/40 rounded-[3rem] blur-3xl transform rotate-3 scale-110 pointer-events-none" />

                <div className="relative bg-white/85 backdrop-blur-3xl rounded-[2.5rem] p-7 shadow-[0_40px_100px_-20px_rgba(45,86,79,0.25)] border border-white space-y-6">
                  
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" 
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#3d7066]" 
                        alt="Helga Müller" 
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Betreuung von</p>
                        <h3 className="text-sm font-bold text-slate-900">Helga Müller</h3>
                      </div>
                    </div>
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs">
                      Aktiv & Verbunden
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-[#2d564f] via-[#3d7066] to-[#254841] rounded-2xl p-4 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden space-y-2 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Status
                      </span>
                      <span className="text-[10px] opacity-80 font-mono">14:20 Uhr</span>
                    </div>
                    <p className="text-sm font-bold">Begleitung durch Maria S.</p>
                    <p className="text-xs text-emerald-100/90 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" /> REWE Supermarkt, Schwabing
                    </p>
                  </div>

                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-black text-slate-900">
                      <span>Tagesplan Heute</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white shadow-xs border border-slate-100 hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Spaziergang & Tee</p>
                          <p className="text-[10px] text-slate-400">10:00 - 11:30 Uhr</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">Erledigt</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Gemeinsamer Einkauf</p>
                          <p className="text-[10px] text-emerald-800">14:00 - 15:30 Uhr</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#2d564f] bg-white px-2.5 py-1 rounded-md shadow-xs">Aktiv</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 space-y-2.5">
                    <p className="text-xs font-black text-slate-900">Heutige Momente</p>
                    <div className="grid grid-cols-3 gap-2">
                      <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200&q=80" className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform duration-300" alt="Kochen" />
                      <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80" className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform duration-300" alt="Park" />
                      <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80" className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform duration-300" alt="Tee" />
                    </div>
                  </div>

                </div>

                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-3 z-30 hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">4,9 / 5 Sterne</p>
                    <p className="text-[10px] font-medium text-slate-500">Über 1.200 glückliche Familien</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HIGH CONVERSION BOTTOM BANNER */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#2d564f] via-[#3d7066] to-[#1e3c37] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 text-emerald-100 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> Geprüfte Sicherheit & Direkte Vermittlung
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Entlastung in Ihrem Alltag. <br />
            <span className="text-emerald-300 italic font-serif font-normal">Ab heute.</span>
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Finden Sie qualifizierte und überprüfte Alltagshilfe in Ihrer Nachbarschaft — unkompliziert, sicher und passgenau.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link 
              href="/register?role=family" 
              className="w-full sm:w-auto px-9 py-4 bg-white text-[#2d564f] font-black rounded-full hover:bg-emerald-50 transition-all shadow-xl text-center text-lg hover:scale-105 active:scale-95 duration-300"
            >
              Hilfe für Angehörige finden
            </Link>
            <Link 
              href="/register?role=caregiver" 
              className="w-full sm:w-auto px-9 py-4 bg-white/10 text-white border border-white/20 font-black rounded-full hover:bg-white/20 hover:border-white/40 transition-all text-center text-lg backdrop-blur-md hover:scale-105 active:scale-95 duration-300"
            >
              Alltagshelfer werden
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2d564f] to-[#3d7066] text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-black text-white">Carely</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <Link href="/terms" className="hover:text-white transition-colors">AGB</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/imprint" className="hover:text-white transition-colors">Impressum</Link>
          </div>
          <p>© {new Date().getFullYear()} Carely GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </footer>

    </div>
  );
}