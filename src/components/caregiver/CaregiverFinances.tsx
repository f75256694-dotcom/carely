'use client';

import { useState } from 'react';
import { Wallet, ArrowUpRight, TrendingUp, Download, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export function CaregiverFinances() {
  const [payoutRequested, setPayoutRequested] = useState(false);

  const transactions = [
    { id: 'tx-1', client: 'Maria Schwabing', service: 'Wocheneinkauf & Begleitung', date: '16. Aug 2026', amount: '45,00 €', status: 'ausgezahlt' },
    { id: 'tx-2', client: 'Familie Weber', service: 'Haushalt & Garten', date: '12. Aug 2026', amount: '80,00 €', status: 'ausgezahlt' },
    { id: 'tx-3', client: 'Dr. Krüger', service: 'Technik-Hilfe & Einrichtung', date: '08. Aug 2026', amount: '35,00 €', status: 'ausgezahlt' },
  ];

  return (
    <div className="space-y-8">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">Verfügbares Guthaben</span>
              <Wallet className="w-5 h-5 text-teal-300" />
            </div>
            <div className="text-4xl font-black tracking-tight">160,00 €</div>
          </div>
          <button
            onClick={() => setPayoutRequested(true)}
            disabled={payoutRequested}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-black text-xs py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {payoutRequested ? <CheckCircle2 className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            {payoutRequested ? 'Auszahlung veranlasst' : 'Auf Bankkonto auszahlen'}
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between h-56">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Einnahmen diesen Monat</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">380,00 €</div>
            <p className="text-xs text-emerald-600 font-extrabold mt-2 flex items-center gap-1">
              +24% im Vergleich zum Vormonat
            </p>
          </div>
          <div className="text-[11px] text-gray-400 font-medium border-t border-gray-100 pt-3">
            Nächste automatische Abrechnung: 31. August
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between h-56">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Geleistete Stunden</span>
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">19,5 Std.</div>
            <p className="text-xs text-gray-500 font-bold mt-2">Durchschnittlicher Stundensatz: 19,50 €</p>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-black text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Haftpflichtversichert über Carely
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/95 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Transaktionshistorie & Nachweise</h3>
            <p className="text-xs text-gray-500 font-medium">Automatisch erstellte Gutschriften für deine Steuerunterlagen.</p>
          </div>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" /> CSV Export
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-4 flex justify-between items-center hover:bg-gray-50/50 px-2 rounded-2xl transition-all">
              <div>
                <h4 className="text-sm font-black text-gray-900">{tx.client}</h4>
                <p className="text-xs text-gray-500 font-medium">{tx.service} • {tx.date}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-600 block">+{tx.amount}</span>
                <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}