'use client';

import { Calendar as CalendarIcon, Clock, User, CheckCircle2, Sparkles } from 'lucide-react';
import { WeekAppointment } from '@/types/care';

interface WeekTabProps {
  appointments: WeekAppointment[];
}

export default function WeekTab({ appointments }: WeekTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-[#062925] text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wochenübersicht & Betreuungstermine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Meine Woche
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Alle bestätigten Termine und Einsätze deiner Helfer übersichtlich im Wochenverlauf geplant.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <p className="text-sm font-bold text-slate-500">Keine Termine in dieser Woche eingetragen.</p>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex flex-col items-center justify-center shrink-0 border border-teal-100 font-bold">
                  <CalendarIcon className="w-5 h-5 text-teal-600 mb-0.5" />
                  <span className="text-[10px] uppercase tracking-wider">{app.day.split(',')[0]}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-100">
                      Für: {app.recipientName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {app.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">{app.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Helfer: <strong className="text-slate-800">{app.helperName}</strong>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-teal-600" /> {app.day}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-600" /> {app.time} Uhr</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-200">
                  Termin fixiert
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}