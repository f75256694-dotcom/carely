'use client';

import React, { useState } from 'react';
import { Heart, Euro, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CaregiverDashboard() {
  // Zustand für verfügbare Aufträge (verhindert den TS-Fehler)
  const [availableJobs] = useState<any[]>([]);
  const [totalEarned] = useState<number>(0);

  return (
    <div className="min-h-screen bg-[#FAFAF7] p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#235347] text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black font-serif">Helfer-Dashboard</h1>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Euro className="w-4 h-4 text-[#235347]" />
            <span>Verdienst: <strong className="text-[#235347]">{totalEarned} €</strong></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2 md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Offene Anfragen</span>
            <div className="text-3xl font-black text-[#235347]">{availableJobs.length}</div>
            <p className="text-xs text-gray-500">Verfügbare Einsätze in deiner Region</p>
          </div>
          <div className="bg-[#235347] text-white rounded-3xl p-6 shadow-sm space-y-2 md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Status</span>
              <h3 className="text-lg font-bold">Dein Profil ist aktiv & sichtbar</h3>
            </div>
            <p className="text-xs text-emerald-100">Sobald Kunden in deiner Nähe buchen oder anfragen, wirst du benachrichtigt.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#235347]" />
            Verfügbare Aufträge in deiner Umgebung
          </h2>

          {availableJobs.length > 0 ? (
            <div className="space-y-3">
              {availableJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base">{job.district || `PLZ ${job.zip_code}`}</span>
                      {job.package && <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">{job.package}</span>}
                    </div>
                    <p className="text-xs text-gray-500">
                      Leistungen: {Array.isArray(job.services) ? job.services.join(', ') : job.services}
                    </p>
                  </div>
                  <button
                    onClick={() => alert(`Du hast Interesse an dem Auftrag bekundet!`)}
                    className="w-full md:w-auto px-5 py-3 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-xs transition shadow-md cursor-pointer"
                  >
                    Auftrag anfragen
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-[#235347] rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base">Aktuell keine offenen Anfragen</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Wir informieren dich, sobald neue Unterstützungssuchende in deinem Gebiet einen Auftrag einstellen.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}