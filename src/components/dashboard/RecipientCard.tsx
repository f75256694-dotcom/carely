import { TrendingUp, ChevronRight } from 'lucide-react';
import MoodBadge from '../shared/MoodBadge';

export default function RecipientCard({ person }: { person: any }) {
  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={person.avatar} className="w-16 h-16 rounded-full ring-4 ring-slate-50 object-cover" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{person.name}</h2>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Pflegegrad {person.careLevel}</p>
          </div>
        </div>
        <MoodBadge mood={person.mood || 'happy'} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Wochen-Trend</p>
          <div className="flex items-center gap-1 text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-4 h-4" /> +12% Wohlbefinden
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Letzter Besuch</p>
          <p className="font-bold text-slate-800 mt-1">Heute, 14:00</p>
        </div>
      </div>

      <button className="w-full py-4 bg-slate-900 hover:bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg shadow-slate-900/20">
        Status & Journal öffnen <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}