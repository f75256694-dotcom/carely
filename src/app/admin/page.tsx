'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type CareRequest = {
  id: string;
  created_at: string;
  role: 'care_seeker' | 'caregiver';
  name: string;
  email: string;
  phone: string;
  services: string[];
  district: string;
  package?: string;
  hours_per_week?: string;
  target_group?: string;
  status: string;
};

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'care_seeker' | 'caregiver'>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('care_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Fehler beim Laden:', error);
    else setRequests(data || []);
    setLoading(false);
  };

  const filteredRequests = requests.filter(r => filter === 'all' || r.role === filter);

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Helpify Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Übersicht aller eingegangenen Anfragen & Bewerbungen</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Alle ({requests.length})
            </button>
            <button 
              onClick={() => setFilter('care_seeker')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'care_seeker' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Suchende ({requests.filter(r => r.role === 'care_seeker').length})
            </button>
            <button 
              onClick={() => setFilter('caregiver')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'caregiver' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Helfer ({requests.filter(r => r.role === 'caregiver').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Lade Daten aus Supabase...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-800">Keine Einträge gefunden.</div>
        ) : (
          <div className="overflow-x-auto bg-slate-800/60 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Datum</th>
                  <th className="p-4">Typ</th>
                  <th className="p-4">Name & Kontakt</th>
                  <th className="p-4">Bezirk</th>
                  <th className="p-4">Services</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {filteredRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-400 text-xs">
                      {new Date(item.created_at).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        item.role === 'caregiver' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.role === 'caregiver' ? '🛠️ Helfer' : '🤝 Suchender'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-100">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.email}</div>
                      <div className="text-xs text-slate-400">{item.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-300 max-w-[150px] truncate">{item.district || '-'}</td>
                    <td className="p-4 max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
{(() => {
  const serviceList = Array.isArray(item.services) 
    ? item.services 
    : typeof item.services === 'string' 
      ? item.services.split(',') 
      : [];

  return serviceList.map((service, idx) => (
    <span key={idx} className="bg-slate-700 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-600">
      {service.trim()}
    </span>
  ));
})()}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-400 space-y-1">
                      {item.package && <div><span className="text-slate-500">Paket:</span> {item.package}</div>}
                      {item.hours_per_week && <div><span className="text-slate-500">Zeit:</span> {item.hours_per_week}</div>}
                      {item.target_group && <div><span className="text-slate-500">Ziel:</span> {item.target_group}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}