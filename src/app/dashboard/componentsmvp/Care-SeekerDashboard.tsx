'use client';

import React, { useState } from 'react';
import { Clock, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

export default function CareSeekerDashboard() {
  const [hoursBalance] = useState<number>(0);
  const [request] = useState<any>(null);
  const [helpers] = useState<any[]>([]);

  const handleBookHelper = (helper: any) => {
    alert(`Erstgespräch mit ${helper.first_name || 'Helfer'} angefragt!`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-md shrink-0">
              <svg 
                className="w-5 h-5 text-[#86EFAC]" 
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
            <h1 className="text-2xl font-black font-serif text-[#0A2E23]">Mein Pflege-Dashboard</h1>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1B4D3E]" />
            <span>Guthaben: <strong className="text-[#1B4D3E]">{hoursBalance} Std.</strong></span>
          </div>
        </div>

        {request && (
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B4D3E]">Suchauftrag</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Matching aktiv
              </span>
            </div>
            <h3 className="text-lg font-bold">Unterstützung in {request.district || `PLZ ${request.zip_code}`}</h3>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-black font-serif flex items-center gap-2 text-[#0A2E23]">
            <Sparkles className="w-5 h-5 text-[#1B4D3E]" />
            Verfügbare Helfer in deiner Nähe
          </h2>

          {helpers.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {helpers.map((helper) => (
                <div key={helper.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-base">{helper.first_name}</h4>
                      <p className="text-xs text-gray-500">PLZ {helper.zip_code}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {helper.hourly_rate ? `${helper.hourly_rate} €/Std.` : 'Verifizierter Helfer'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1B4D3E]" />
                    <span>{helper.experience_years ? `${helper.experience_years} Jahre Erfahrung` : 'Geprüftes Profil'}</span>
                  </div>

                  <button
                    onClick={() => handleBookHelper(helper)}
                    className="w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Erstgespräch buchen</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto font-bold">
                🔎
              </div>
              <h3 className="font-extrabold text-base">Dein Concierge sucht gerade</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Wir prüfen aktuell manuell weitere Helfer-Aktivierungen für deine Region. In Kürze schalten wir dir Vorschläge frei.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}