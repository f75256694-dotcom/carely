'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Calendar, 
  Camera, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Clock, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export function ScrollStorySection() {
  const [activeTab, setActiveTab] = useState<'live' | 'plan' | 'moments'>('live');

  return (
    <section className="relative py-28 px-6 bg-gradient-to-b from-[#FAFAF8] via-[#F3F7F5] to-[#FAFAF8] overflow-hidden">
      {/* Soft Ambient Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Conversion Copywriting */}
          <div className="lg:col-span-6 space-y-8 z-10">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-xs backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#2f5951]">Familien-Hub Live Demo</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08] font-display">
              Ein beruhigendes Gefühl <br />
              <span className="bg-gradient-to-r from-[#2f5951] via-[#3d7066] to-[#5b9a8b] bg-clip-text text-transparent font-serif italic font-normal">
                für die ganze Familie
              </span>
            </h2>

            {/* Subline */}
            <p className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-xl">
              Erleben Sie Echtzeit-Updates, wenn Ihre Helferin unterstützt. Foto-Momente, Aufgaben und Entlastungsbudget — transparent vereint in einer liebevollen Übersicht.
            </p>

            {/* Interactive Feature Trigger Buttons */}
            <div className="space-y-4 pt-2">
              <button
                onClick={() => setActiveTab('live')}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-4 border ${
                  activeTab === 'live'
                    ? 'bg-white border-[#3d7066] shadow-xl shadow-teal-900/5 translate-x-2'
                    : 'bg-white/50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === 'live' ? 'bg-[#3d7066] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Live-Aktivitäten & Status</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Echtzeit-Transparenz bei Einkäufen, Arztbesuchen oder Grundpflege.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('plan')}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-4 border ${
                  activeTab === 'plan'
                    ? 'bg-white border-[#3d7066] shadow-xl shadow-teal-900/5 translate-x-2'
                    : 'bg-white/50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === 'plan' ? 'bg-[#3d7066] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Strukturierte Wochenplanung</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Termine mit Betreuer:innen nahtlos abstimmen und im Blick behalten.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('moments')}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-4 border ${
                  activeTab === 'moments'
                    ? 'bg-white border-[#3d7066] shadow-xl shadow-teal-900/5 translate-x-2'
                    : 'bg-white/50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === 'moments' ? 'bg-[#3d7066] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Geteilte Herzensmomente</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Fotos und persönliche Nachrichten für Familie & Angehörige.</p>
                </div>
              </button>
            </div>

            {/* Direct Trust Proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> 100% SGB XI Abrechenbar
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" /> DSGVO Konform
              </span>
            </div>

          </div>

          {/* Right Side: High-End Phone Frame App Simulation */}
          <div className="lg:col-span-6 flex justify-center z-10">
            <div className="relative w-full max-w-[370px] sm:max-w-[400px]">
              
              {/* Outer Phone Frame */}
              <div className="relative bg-slate-950 rounded-[50px] p-4 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] border-4 border-slate-800/80">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Inner Screen */}
                <div className="bg-[#FAFAF8] rounded-[38px] overflow-hidden pt-8 pb-6 px-4 border border-slate-100 min-h-[620px] flex flex-col justify-between relative">
                  
                  {/* App Header */}
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" 
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3d7066]" 
                          alt="Helga Müller" 
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Betreuung von</p>
                        <h3 className="text-sm font-bold text-slate-900">Helga Müller</h3>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      Pflegegrad 3
                    </span>
                  </div>

                  {/* App Body - Dynamic Tabs */}
                  <div className="py-4 space-y-4 flex-1">
                    
                    {/* Active Live Status Widget */}
                    <div className="bg-gradient-to-br from-[#2f5951] to-[#3d7066] rounded-2xl p-4 text-white shadow-lg shadow-teal-900/15 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Status
                        </span>
                        <span className="text-[10px] opacity-80">14:20 Uhr</span>
                      </div>
                      <p className="text-sm font-semibold">Begleitung durch Maria S.</p>
                      <p className="text-xs text-emerald-100/90 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> REWE Supermarkt, Schwabing
                      </p>
                    </div>

                    {/* Schedule / Tasks Block */}
                    <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                        <span>Tagesplan Heute</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Spaziergang im Park</p>
                            <p className="text-[10px] text-slate-400">10:00 - 11:30 · Erledigt</p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">Gemeinsamer Einkauf</p>
                            <p className="text-[10px] text-emerald-800">14:00 - 15:30 · Aktiv</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#3d7066]">In Arbeit</span>
                      </div>
                    </div>

                    {/* Moments Preview Block */}
                    <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-2.5">
                        <span>Fotos & Momente</span>
                        <span className="text-[10px] text-[#3d7066] font-semibold">Alle (12)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200&q=80" 
                          className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform" 
                          alt="Kochmoment" 
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=200&q=80" 
                          className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform" 
                          alt="Spaziergang" 
                        />
                        <img 
                          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80" 
                          className="w-full h-16 rounded-xl object-cover shadow-xs hover:scale-105 transition-transform" 
                          alt="Spielen" 
                        />
                      </div>
                    </div>

                  </div>

                  {/* App Bottom Navigation Bar Mock */}
                  <div className="pt-2 border-t border-slate-100 flex justify-around items-center text-slate-400">
                    <div className="flex flex-col items-center gap-0.5 text-[#3d7066]">
                      <Activity className="w-4 h-4" />
                      <span className="text-[9px] font-bold">Hub</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[9px] font-medium">Woche</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-slate-600">
                      <Camera className="w-4 h-4" />
                      <span className="text-[9px] font-medium">Fotos</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Badge (Conversion Social Proof) */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-3.5 shadow-2xl border border-slate-100 flex items-center gap-3 z-30">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-current text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">4,9/5 Sterne Bewertung</p>
                  <p className="text-[10px] text-slate-500">Von über 1.200 Familien vertraut</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}