'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Plus, CheckCircle, Clock, User, Shield } from 'lucide-react';

export default function CareSeekerWeekPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

    const fetchAppointments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('appointments').select('*').eq('seeker_id', user.id);
    if (!error && data) {
      setAppointments(data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-black border border-teal-200">
            Wochenplanung
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-2">Meine Woche & Einsätze</h1>
          <p className="text-sm text-gray-500 mt-1">Übersicht aller gebuchten Termine und Helfer-Besuche für diese Woche.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">Lade Wochenplan...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-gray-900">Keine Einsätze für diese Woche geplant</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">Du hast aktuell noch keine Helfer für diese Woche eingeteilt. Erstelle eine offene Anfrage oder wähle passende Angebote aus.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{item.title || 'Unterstützung im Alltag'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.date} um {item.time} Uhr</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Bestätigt
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}