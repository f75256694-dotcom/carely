'use client';

import { useState, useMemo } from 'react';
import { Sparkles, PlusCircle, ShieldCheck, Edit3, CheckCircle2, Download } from 'lucide-react';
import { CareRecipient, Transaction } from '@/types/care';

interface FinanzenTabProps {
  recipients: CareRecipient[];
  transactions: Transaction[];
  onEditBudget: (recipient: CareRecipient) => void;
}

export default function FinanzenTab({ recipients, transactions, onEditBudget }: FinanzenTabProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all');

  const totalMaxBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetMax, 0), [recipients]);
  const totalUsedBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetUsed, 0), [recipients]);
  const totalRemainingBudget = Math.max(0, totalMaxBudget - totalUsedBudget);
  const remainingPercent = Math.min(100, Math.max(0, Math.round((totalRemainingBudget / totalMaxBudget) * 100)));

  const filteredTransactions = useMemo(() => {
    if (selectedRecipientId === 'all') return transactions;
    return transactions.filter(t => t.recipientId === selectedRecipientId);
  }, [selectedRecipientId, transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-[#062925] text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Angehörigen-Management • Directly Linked §45b SGB XI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Finanzen & Pflegekasse (Stellvertretend)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Verwalte das Entlastungsbudget deiner Angehörigen mit verbleibendem Kreisdiagramm-Guthaben und detaillierter Abrechnung pro Person.
            </p>
          </div>
          <button className="px-5 py-3 rounded-2xl bg-[#26A69A] hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0">
            <PlusCircle className="w-4 h-4" /> Beleg einreichen
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Gesamtkonto</span>
              <h3 className="text-xl font-serif font-bold text-slate-900">Verbleibender Monats-Etat</h3>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Kasse Verifiziert
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#0D9488] transition-all duration-1000" strokeDasharray={`${remainingPercent}, 100`} strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">VERFÜGBAR</span>
                <span className="text-3xl font-serif font-black text-slate-900 tracking-tight mt-0.5">
                  {totalRemainingBudget.toFixed(2)} €
                </span>
                <span className="text-[11px] font-bold text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded-full mt-1 border border-teal-100">
                  {remainingPercent}% verbleibend
                </span>
              </div>
            </div>

            <div className="space-y-4 w-full sm:w-auto flex-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Gesamt-Budget:</span>
                  <span className="text-slate-900 font-extrabold">{totalMaxBudget.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0D9488] h-full transition-all duration-500" style={{ width: `${100 - remainingPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                  <span>Verbraucht: {totalUsedBudget.toFixed(2)} €</span>
                  <span>{100 - remainingPercent}% genutzt</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-900 leading-tight font-medium">
                  Abrechnung erfolgt direkt mit den Pflegekassen der Betreuten.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Aufschlüsselung</span>
              <h3 className="text-xl font-serif font-bold text-slate-900">Wer hat wie viel verbraucht?</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">{recipients.length} Betreute</span>
          </div>

          <div className="space-y-4">
            {recipients.map((person) => {
              const spent = person.budgetUsed;
              const max = person.budgetMax;
              const free = Math.max(0, max - spent);
              const percLeft = Math.round((free / max) * 100);

              return (
                <div key={person.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-white shadow-2xs" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{person.name} ({person.relation})</h4>
                        <span className="text-[10px] text-slate-400">{person.careLevel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onEditBudget(person)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-white transition cursor-pointer"
                        title="Budget anpassen"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 block">{spent.toFixed(2)} € verbraucht</span>
                        <span className="text-[10px] text-teal-600 font-bold">{free.toFixed(2)} € rest</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0D9488] h-full transition-all duration-500" style={{ width: `${100 - percLeft}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Limit: {max.toFixed(2)} €</span>
                      <span>Rest: {percLeft}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Abrechnungsprotokoll</h3>
            <p className="text-xs text-slate-400">Wer hat wann wie viel gekostet?</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedRecipientId('all')} className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer border ${selectedRecipientId === 'all' ? 'bg-[#062925] text-white border-[#062925]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'}`}>
              Alle
            </button>
            {recipients.map((rec) => (
              <button key={rec.id} onClick={() => setSelectedRecipientId(rec.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer border ${selectedRecipientId === rec.id ? 'bg-[#062925] text-white border-[#062925]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'}`}>
                <img src={rec.avatar} alt={rec.name} className="w-5 h-5 rounded-full object-cover" />
                <span>{rec.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="pb-4 font-bold">ANGEHÖRIGE/R</th>
                <th className="pb-4 font-bold">LEISTUNG & HELFER</th>
                <th className="pb-4 font-bold">DATUM</th>
                <th className="pb-4 font-bold">BETRAG</th>
                <th className="pb-4 font-bold">STATUS</th>
                <th className="pb-4 font-bold text-right">BELEG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <img src={tx.recipientAvatar} alt={tx.recipientName} className="w-8 h-8 rounded-full object-cover" />
                      <span>{tx.recipientName}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-bold text-slate-900 text-xs">{tx.service}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Helfer: {tx.helperName}</div>
                  </td>
                  <td className="py-4 text-slate-600 font-medium text-xs">{tx.date}</td>
                  <td className="py-4 font-black text-slate-900 text-xs">{tx.amount.toFixed(2)} €</td>
                  <td className="py-4">
                    {tx.status === 'Erstattet' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Erstattet
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        In Prüfung
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition inline-flex items-center gap-1.5 ml-auto cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}