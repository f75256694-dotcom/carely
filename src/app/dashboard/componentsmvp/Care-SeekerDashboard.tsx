'use client';

import React, { useState } from 'react';
import { Heart, Clock, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

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
            <div className="w-10 h-10 rounded-xl bg-[#235347] text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black font-serif">Mein Pflege-Dashboard</h1>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#235347]" />
            <span>Guthaben: <strong className="text-[#235347]">{hoursBalance} Std.</strong></span>
          </div>
        </div>

        {request && (
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#235347]">Suchauftrag</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Matching aktiv
              </span>
            </div>
            <h3 className="text-lg font-bold">Unterstützung in {request.district || `PLZ ${request.zip_code}`}</h3>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-black font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#235347]" />
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
                    <ShieldCheck className="w-4 h-4 text-[#235347]" />
                    <span>{helper.experience_years ? `${helper.experience_years} Jahre Erfahrung` : 'Geprüftes Profil'}</span>
                  </div>

                  <button
                    onClick={() => handleBookHelper(helper)}
                    className="w-full py-3 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
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