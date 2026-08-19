'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, HeartHandshake, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FunnelPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [zipCode, setZipCode] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string>('asap');

  const availableServices = [
    { id: 'companionship', label: 'Gesellschaft & Alltag' },
    { id: 'household', label: 'Haushalt & Einkaufen' },
    { id: 'mobility', label: 'Begleitung & Mobilisierung' },
    { id: 'dementia', label: 'Demenz-Betreuung' },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompleteFunnel = () => {
    // 1. Entwurf im localStorage speichern
    const draftData = {
      zip_code: zipCode,
      services: selectedServices,
      schedule: { timeframe: schedule },
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('care_request_draft', JSON.stringify(draftData));

    // 2. Direkt zur Registrierung leiten (Rolle als care_seeker vorausgewählt)
    router.push('/register?role=care_seeker');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 flex flex-col justify-center py-12 px-6 sm:px-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg w-full mx-auto relative z-10 space-y-6">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-teal-700 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(13,148,136,0.08)] space-y-6">
          
          {/* Schritt 1: Postleitzahl */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Schritt 1 von 3</span>
                <h2 className="text-2xl font-black font-serif text-gray-900">Wo suchst du Unterstützung?</h2>
                <p className="text-gray-500 text-sm">Gib deine Postleitzahl ein, um verfügbare Helfer in der Nähe zu prüfen.</p>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="z. B. 10115"
                  className="w-full bg-gray-50/80 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-base font-bold focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-center tracking-widest"
                />
              </div>

              <button
                type="button"
                disabled={zipCode.trim().length < 4}
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Weiter zur Auswahl</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Schritt 2: Benötigte Hilfe */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Schritt 2 von 3</span>
                <h2 className="text-2xl font-black font-serif text-gray-900">Welche Hilfe wird benötigt?</h2>
                <p className="text-gray-500 text-sm">Mehrfachauswahl möglich.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`py-4 px-5 rounded-2xl text-left text-sm font-bold border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'border-teal-700 bg-teal-50/50 text-teal-900 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span>{service.label}</span>
                      <HeartHandshake className={`w-5 h-5 ${isSelected ? 'text-teal-700' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-2xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={() => setStep(3)}
                  className="w-2/3 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Weiter</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Schritt 3: Zeitraum & Teaser-Abschluss */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Letzter Schritt</span>
                <h2 className="text-2xl font-black font-serif text-gray-900">Wann soll es losgehen?</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'asap', label: 'So schnell wie möglich' },
                  { id: 'next_weeks', label: 'In den nächsten 2–4 Wochen' },
                  { id: 'orienting', label: 'Erstmal nur informieren' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSchedule(item.id)}
                    className={`w-full py-4 px-5 rounded-2xl text-left text-sm font-bold border transition-all flex items-center justify-between cursor-pointer ${
                      schedule === item.id 
                        ? 'border-teal-700 bg-teal-50/50 text-teal-900 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <Calendar className={`w-5 h-5 ${schedule === item.id ? 'text-teal-700' : 'text-gray-400'}`} />
                  </button>
                ))}
              </div>

              {/* Concierge-Teaser Info Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900 text-xs font-medium space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   Concierge-Matching für PLZ {zipCode} bereit
                </div>
                <p>Wir durchsuchen unser lokales Netzwerk und schalten die passenden Helfer-Profile in deinem Dashboard frei.</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-4 rounded-2xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  onClick={handleCompleteFunnel}
                  className="w-2/3 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-700/20"
                >
                  <span>Ergebnis anzeigen</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}