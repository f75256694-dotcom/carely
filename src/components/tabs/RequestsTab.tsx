'use client';

import { Calendar, Clock, CheckCircle2, XCircle, User, Sparkles } from 'lucide-react';
import { CareRequest } from '@/types/care';

interface RequestsTabProps {
  requests: CareRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function RequestsTab({ requests, onAccept, onDecline }: RequestsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-[#062925] text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live-Anfragen Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Offene Anfragen & Angebote
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Prüfe und verwalte eingehende Betreuungsangebote von qualifizierten Helfern für deine Angehörigen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <p className="text-sm font-bold text-slate-500">Aktuell keine offenen Anfragen vorhanden.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <img src={req.helperAvatar} alt={req.helperName} className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shadow-sm shrink-0" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-100">
                      Für: {req.recipientName}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-100">
                      {req.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">{req.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Helfer: <strong className="text-slate-800">{req.helperName}</strong>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-600" /> {req.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-600" /> {req.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <button
                  onClick={() => onDecline(req.id)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-200 hover:border-rose-200"
                >
                  <XCircle className="w-4 h-4" /> Ablehnen
                </button>
                <button
                  onClick={() => onAccept(req.id)}
                  className="px-6 py-2.5 rounded-xl bg-[#063934] hover:bg-[#084d46] text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-400" /> Annehmen & In "Meine Woche" übernehmen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}