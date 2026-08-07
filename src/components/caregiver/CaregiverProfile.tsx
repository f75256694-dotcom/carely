'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, ShieldCheck, Star, Award, CheckCircle2, Sparkles, 
  Euro, Briefcase, FileText, Heart, Shield, Camera, Save, ChevronDown, Plus, Minus 
} from 'lucide-react';

export function CaregiverProfile() {
  const [hourlyRate, setHourlyRate] = useState(22);
  const [experience, setExperience] = useState('Mehrere Jahre Praktische Erfahrung');
  const [bio, setBio] = useState('Empathische und zuverlässige Alltagshelferin mit 3+ Jahren Erfahrung in der Seniorenbetreuung und Haushaltsunterstützung.');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    'Erste-Hilfe Schein', 'Führerschein Klasse B', 'Demenz-Schulung', 'Nichtraucher'
  ]);
  const [isSaved, setIsSaved] = useState(false);

  // Custom Dropdown State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const experienceOptions = [
    'Einsteiger mit Herz',
    'Mehrere Jahre Praktische Erfahrung',
    'Examen / Fachkraft'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableBadges = [
    { name: 'Erste-Hilfe Schein', icon: Heart },
    { name: 'Führerschein Klasse B', icon: Shield },
    { name: 'Demenz-Schulung', icon: Award },
    { name: 'Nichtraucher', icon: Sparkles },
    { name: 'Tierliebhaber', icon: Heart },
    { name: 'Pflegeerfahrung', icon: ShieldCheck },
  ];

  const toggleBadge = (name: string) => {
    setSelectedBadges(prev => 
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* 1. LIQUID GLASS AVATAR & BADGE HEADER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/90 to-white/40 backdrop-blur-2xl border border-white/60 p-8 sm:p-10 shadow-2xl shadow-teal-900/5">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            {/* Äußeres Glow-Element */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[2.2rem] overflow-hidden p-1 bg-gradient-to-br from-teal-400 via-emerald-400 to-teal-700 shadow-xl shadow-teal-600/20 group-hover:scale-[1.02] transition-all duration-300">
              {/* Innerer Container mit exakt identischem Radius, damit keine Ecken rausschauen */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
                  alt="Sarah Meyer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-slate-900 hover:bg-teal-600 text-white rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:scale-110 cursor-pointer">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Identität & Führungszeugnis Verifiziert
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
              Sarah Meyer
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500">
              <span>Mitglied seit Mai 2024</span>
              <span>•</span>
              <span>München Schwabing</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-900 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> 4.9 (28 Bewertungen)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FORM SECTION */}
      <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-900/5 space-y-8">
        
        <div className="border-b border-gray-100 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">
              Persönliche Angaben & Angebot
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Diese Daten entscheiden über deinen Erfolg bei der Vermittlung von Pflege- & Alltagseinsätzen.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
            <Sparkles className="w-4 h-4 text-teal-600" /> Premium Profil
          </div>
        </div>

        {/* Grid Inputs: Stundensatz & Erfahrung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LIQUID GLASS DREHKREUZ FÜR STUNDENSATZ */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Euro className="w-3.5 h-3.5 text-teal-600" /> Wunsch-Stundensatz (€ / Std.)
            </label>
            <div className="flex items-center justify-between bg-slate-50/80 border border-slate-200 focus-within:border-teal-500 rounded-2xl px-4 py-2.5 shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-slate-900 font-serif">{hourlyRate}</span>
                <span className="text-xs font-bold text-slate-400">€ / Std.</span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => setHourlyRate(prev => Math.max(10, prev - 1))}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center font-black transition-all cursor-pointer shadow-sm"
                  title="Minus 1€"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setHourlyRate(prev => prev + 1)}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 flex items-center justify-center font-black transition-all cursor-pointer shadow-sm"
                  title="Plus 1€"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* LIQUID GLASS CUSTOM DROPDOWN FÜR ERFAHRUNG */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" /> Erfahrungsstufe
            </label>
            
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-slate-50/80 hover:bg-white border border-slate-200 focus:border-teal-500 rounded-2xl px-4 py-3.5 text-slate-900 font-bold text-base flex items-center justify-between shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>{experience}</span>
              <ChevronDown className={`w-5 h-5 text-teal-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-1">
                {experienceOptions.map((opt) => {
                  const isSelected = experience === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setExperience(opt);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                          : 'text-slate-700 hover:bg-teal-50/80 hover:text-teal-900'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Bio Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Über mich & meine Motivation
          </label>
          <textarea 
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-2xl p-4 text-slate-800 font-medium text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all duration-200 resize-none"
            placeholder="Beschreibe kurz deine Motivation und Erfahrung..."
          />
        </div>

        {/* Qualifications / Badges Selector */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-teal-600" /> Qualifikationen & Badges (Zum Auswählen anklicken)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {availableBadges.map(({ name, icon: Icon }) => {
              const active = selectedBadges.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleBadge(name)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500 shadow-md shadow-teal-600/20 scale-[1.02]'
                      : 'bg-slate-50/80 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-200' : 'text-slate-400'}`} />
                  {name}
                  {active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Action Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-medium text-slate-400">
            * Änderungen werden sofort in Echtzeit für Suchende sichtbar.
          </div>

          <button
            type="submit"
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              isSaved 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-slate-900 hover:bg-teal-700 text-white shadow-slate-900/20 hover:scale-[1.02]'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" /> Profil Erfolgreich Aktualisiert!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-emerald-400" /> Profil Speichern
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}