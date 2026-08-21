'use client';

import React, { useState } from 'react';
import { Euro, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CaregiverDashboard() {
  const [availableJobs] = useState<any[]>([]);
  const [totalEarned] = useState<number>(0);

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
            <h1 className="text-2xl font-black font-serif text-[#0A2E23]">Helfer-Dashboard</h1>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Euro className="w-4 h-4 text-[#1B4D3E]" />
            <span>Verdienst: <strong className="text-[#1B4D3E]">{totalEarned} €</strong></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2 md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Offene Anfragen</span>
            <div className="text-3xl font-black text-[#1B4D3E]">{availableJobs.length}</div>
            <p className="text-xs text-gray-500">Verfügbare Einsätze in deiner Region</p>
          </div>
          <div className="bg-[#1B4D3E] text-white rounded-3xl p-6 shadow-sm space-y-2 md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Status</span>
              <h3 className="text-lg font-bold">Dein Profil ist aktiv & sichtbar</h3>
            </div>
            <p className="text-xs text-emerald-100">Sobald Kunden in deiner Nähe buchen oder anfragen, wirst du benachrichtigt.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black font-serif flex items-center gap-2 text-[#0A2E23]">
            <Sparkles className="w-5 h-5 text-[#1B4D3E]" />
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
                    className="w-full md:w-auto px-5 py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-xs transition shadow-md cursor-pointer"
                  >
                    Auftrag anfragen
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-[#1B4D3E] rounded-2xl flex items-center justify-center mx-auto">
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