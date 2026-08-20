'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake, ShoppingBag, Home, Sparkles } from 'lucide-react';

function FunnelContent() {
  const searchParams = useSearchParams();
  const zipFromUrl = searchParams.get('zip') || '';

  // Prüft, ob es eine valide PLZ ist (4 Stellen für AT oder 5 für DE)
  const isValidZip = (zip: string) => {
    const cleanZip = zip.trim();
    return cleanZip.length === 4 || cleanZip.length === 5;
  };

  // Startschritt: Direkt Schritt 2, falls PLZ übergeben wurde
  const [step, setStep] = useState(isValidZip(zipFromUrl) ? 2 : 1);
  const [zipCode, setZipCode] = useState(zipFromUrl);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (zipFromUrl) {
      setZipCode(zipFromUrl);
      if (isValidZip(zipFromUrl)) {
        setStep(2); // Direkt weiter zu Schritt 2 ohne erneutes Bestätigen
      }
    }
  }, [zipFromUrl]);

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-slate-800 flex flex-col justify-between p-4 sm:p-8">
      
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#1B4D3E] text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" /> Startseite
        </Link>
        <span className="text-xs font-bold text-slate-400">Schritt {step} von 3</span>
      </header>

      {/* Main Funnel Card */}
      <main className="max-w-xl w-full mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 my-auto">
        
        {/* SCHRITT 1: PLZ (nur sichtbar, wenn Landingpage OHNE PLZ aufgerufen wurde) */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-serif font-bold text-[#0A2E23]">Wo wird die Unterstützung benötigt?</h2>
            <p className="text-xs text-slate-500">Gib deine Postleitzahl ein, um Helfer in deiner Nähe zu finden.</p>
            
            <input 
              type="text"
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="PLZ eingeben (z. B. 1170)"
              className="w-full text-center text-xl font-bold py-3.5 px-4 rounded-xl border border-slate-300 focus:border-[#1B4D3E] focus:outline-none tracking-widest bg-slate-50"
            />

            <button
              disabled={!isValidZip(zipCode)}
              onClick={() => setStep(2)}
              className="w-full bg-[#1B4D3E] hover:bg-[#143a2e] disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCHRITT 2: Service-Auswahl */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#0A2E23]">Wobei wird Hilfe benötigt?</h2>
              <p className="text-xs text-slate-500">
                Für PLZ <span className="font-bold text-[#1B4D3E]">{zipCode}</span> (Mehrfachauswahl möglich)
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'einkauf', label: 'Einkaufen & Besorgungen', icon: ShoppingBag },
                { id: 'haushalt', label: 'Haushalt & Kochen', icon: Home },
                { id: 'gesellschaft', label: 'Spaziergänge & Gesellschaft', icon: HeartHandshake },
                { id: 'sonstiges', label: 'Sonstige Begleitung', icon: Sparkles }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedServices.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleServiceToggle(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left font-medium text-sm flex items-center justify-between transition cursor-pointer ${
                      isSelected 
                        ? 'border-[#1B4D3E] bg-[#F0FDF4] text-[#0A2E23] shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#1B4D3E]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#1B4D3E]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm py-3.5 rounded-xl transition cursor-pointer"
              >
                PLZ ändern
              </button>
              <button
                disabled={selectedServices.length === 0}
                onClick={() => setStep(3)}
                className="w-2/3 bg-[#1B4D3E] hover:bg-[#143a2e] disabled:opacity-40 text-white font-bold text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Weiter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCHRITT 3: Kontaktdaten */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#1B4D3E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#0A2E23]">Perfekt! Wir haben Helfer gefunden.</h2>
              <p className="text-xs text-slate-500">In {zipCode} stehen passende Alltagsbegleiter bereit.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-3">
              <input 
                type="text" 
                placeholder="Dein Name" 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4D3E]"
              />
              <input 
                type="email" 
                placeholder="Deine E-Mail-Adresse" 
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4D3E]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm py-3.5 rounded-xl transition cursor-pointer"
              >
                Zurück
              </button>
              <button
                onClick={() => alert('Anfrage erfolgreich abgesendet!')}
                className="w-2/3 bg-[#1B4D3E] hover:bg-[#143a2e] text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md cursor-pointer"
              >
                Kostenlos anfragen
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer minimal */}
      <footer className="text-center text-[11px] text-slate-400 py-4">
        © {new Date().getFullYear()} Helpify – Sichere Vermittlung von Alltagshilfe
      </footer>

    </div>
  );
}

export default function FunnelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Formular wird geladen...</div>}>
      <FunnelContent />
    </Suspense>
  );
}