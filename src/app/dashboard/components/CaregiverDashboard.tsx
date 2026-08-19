'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CaregiverDashboardProps {
  user?: { id?: string; name?: string; email?: string; district?: string };
}

export default function CaregiverDashboard({ user }: CaregiverDashboardProps) {
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      // Offene Anfragen aus allen Bezirken laden (in einem MVP vollkommen ausreichend)
      const { data, error } = await supabase
        .from('care_requests')
        .select('*')
        .eq('status', 'pending_matching')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setAvailableJobs(data);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto mb-8">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Helfer-Portal
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
          Hallo{user?.name ? `, ${user.name}` : ''}! 🤝
        </h1>
        <p className="text-slate-500">Hier findest du verfügbare Pflege- und Unterstützungsanfragen.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Offene Anfragen</h3>
          <span className="text-4xl font-black text-slate-900">{availableJobs.length}</span>
          <p className="text-xs text-slate-400 mt-2">In Wien & Umgebung</p>
        </div>

        <div className="bg-emerald-950 p-6 rounded-3xl text-white shadow-sm col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Stundensatz</h3>
            <span className="text-2xl font-bold">Fester Satz je Einsatz</span>
          </div>
          <p className="text-xs text-emerald-200/80 mt-4">Auszahlungen erfolgen nach Bestätigung des abgeschlossenen Termins.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Verfügbare Aufträge</h2>

        {loading ? (
          <p className="text-slate-500 text-sm">Aufträge werden geladen...</p>
        ) : availableJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <p className="text-slate-500 text-sm">Aktuell gibt es keine offenen Anfragen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{job.district}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">{job.package}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    Leistungen: {Array.isArray(job.services) ? job.services.join(', ') : job.services}
                  </p>
                  <span className="text-[11px] text-slate-400">Anfrage von: {job.name}</span>
                </div>

                <button 
                  onClick={() => alert(`Du hast Interesse an der Anfrage in ${job.district} bekundet! Wir kontaktieren dich.`)}
                  className="bg-[#1B4D3E] text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-emerald-900 transition-colors w-full sm:w-auto"
                >
                  Auftrag anfragen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}