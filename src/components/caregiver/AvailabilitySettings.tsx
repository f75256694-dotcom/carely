'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Navigation, Sparkles, CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';

interface AvailabilitySettingsProps {
  onSuccess: () => void;
}

export function AvailabilitySettings({ onSuccess }: AvailabilitySettingsProps) {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const slots = ['Morgens (8-12)', 'Nachmittags (12-17)', 'Abends (17-21)'];

  // Matrix State: day-slot -> boolean
  const [schedule, setSchedule] = useState<Record<string, boolean>>({
    'Mo-Morgens (8-12)': true,
    'Mo-Nachmittags (12-17)': true,
    'Di-Morgens (8-12)': true,
    'Mi-Nachmittags (12-17)': true,
    'Do-Morgens (8-12)': true,
    'Fr-Abends (17-21)': true,
  });

  const [radius, setRadius] = useState<number>(12);

  const toggleSlot = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setSchedule(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const nearbyLocations = [
    { name: 'Schwabing', dist: 3, active: radius >= 3 },
    { name: 'Maxvorstadt', dist: 5, active: radius >= 5 },
    { name: 'Giesing', dist: 8, active: radius >= 8 },
    { name: 'Bogenhausen', dist: 11, active: radius >= 11 },
    { name: 'Pasing', dist: 16, active: radius >= 16 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* 1. CALENDAR MOCKUP GRID SECTION */}
      <div className="bg-white/90 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-[11px] font-black uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> Smart Weekly Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
              Interaktive Wochen-Verfügbarkeit
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Klicke auf die Zeitfenster, in denen du flexibel für Pflege- & Alltagseinsätze verfügbar bist.
            </p>
          </div>

          <button 
            onClick={() => {
              const allTrue: Record<string, boolean> = {};
              days.forEach(d => slots.forEach(s => allTrue[`${d}-${s}`] = true));
              setSchedule(allTrue);
            }}
            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-black rounded-xl border border-teal-200 transition-all cursor-pointer self-start md:self-auto"
          >
            Alle Zeiten aktivieren
          </button>
        </div>

        {/* Calendar Slot Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px] grid grid-cols-8 gap-3">
            {/* Column Headers */}
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-end pb-2">Zeiten</div>
            {days.map(d => (
              <div key={d} className="text-center py-2 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-sm">
                {d}
              </div>
            ))}

            {/* Row Content */}
            {slots.map(slot => (
              <React.Fragment key={slot}>
                <div className="flex items-center text-[11px] font-black text-slate-600 pr-2">
                  {slot}
                </div>
                {days.map(day => {
                  const key = `${day}-${slot}`;
                  const isActive = !!schedule[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSlot(day, slot)}
                      className={`h-16 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer group ${
                        isActive
                          ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white border-teal-500 shadow-lg shadow-teal-600/20 scale-[1.02]'
                          : 'bg-slate-50/80 hover:bg-teal-50/50 border-gray-200/80 text-slate-400 hover:border-teal-300'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-in zoom-in duration-200" />
                          <span className="text-[10px] font-black tracking-wider">Aktiv</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-extrabold group-hover:text-teal-700 opacity-60">+ Frei</span>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. RADAR MAP & RADIUS VISUALIZER */}
      <div className="bg-slate-950 text-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="lg:col-span-6 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-[11px] font-black uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Live Dynamic Radar
          </div>
          <div>
            <h3 className="text-3xl font-black font-serif tracking-tight text-white">Einsatzradius Festlegen</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Bestimme, wie weit du für passende Hilfeanfragen fahren möchtest. Das Matching erfolgt in Echtzeit.
            </p>
          </div>

          {/* Slider Control */}
          <div className="space-y-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Aktueller Radius</span>
              <span className="text-xl font-black text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-2xl border border-emerald-800/60">
                {radius} km
              </span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
              <span>1 km (Direkte Nachbarschaft)</span>
              <span>30 km (Gesamte Region)</span>
            </div>
          </div>

          <button 
            onClick={onSuccess}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Einstellungen Speichern
          </button>
        </div>

        {/* Radar Map Graphic Component */}
        <div className="lg:col-span-6 flex items-center justify-center relative py-6">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-teal-500/20 flex items-center justify-center bg-slate-900/50">
            {/* Dynamic Glowing Pulse Circles based on Radius */}
            <div 
              className="absolute rounded-full bg-teal-500/10 border border-teal-400/40 transition-all duration-500 flex items-center justify-center"
              style={{
                width: `${Math.min(100, (radius / 30) * 100)}%`,
                height: `${Math.min(100, (radius / 30) * 100)}%`
              }}
            >
              <div className="w-full h-full rounded-full animate-ping opacity-20 bg-teal-400" />
            </div>

            {/* Center Pin */}
            <div className="z-20 w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            {/* Neighborhood Indicators inside Radar */}
            {nearbyLocations.map((loc, idx) => (
              <div 
                key={loc.name}
                className={`absolute text-[10px] font-black px-2.5 py-1 rounded-xl transition-all duration-300 border ${
                  loc.active 
                    ? 'bg-teal-900/90 text-emerald-300 border-teal-500/50 shadow-md shadow-teal-500/20' 
                    : 'bg-slate-900/60 text-slate-600 border-slate-800'
                }`}
                style={{
                  top: `${20 + (idx * 15)}%`,
                  left: idx % 2 === 0 ? `${10 + (idx * 12)}%` : 'auto',
                  right: idx % 2 !== 0 ? `${10 + (idx * 10)}%` : 'auto',
                }}
              >
                {loc.name} ({loc.dist}km)
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}