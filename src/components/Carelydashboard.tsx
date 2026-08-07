'use client';

import { useState, useMemo } from 'react';
import { 
  Heart, Calendar, MessageSquare, CreditCard, 
  PlusCircle, ShieldCheck, Download, Edit3, X, 
  Sparkles, CheckCircle2, Search, Users,
  UserCheck, Briefcase, Clock, Euro, FileText
} from 'lucide-react';

// --- TYPES ---
type UserRole = 'family' | 'helper';

interface CareRecipient {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  careLevel: string;
  budgetMax: number;
  budgetUsed: number;
}

interface Transaction {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  helperName: string;
  service: string;
  date: string;
  amount: number;
  status: 'Erstattet' | 'In Prüfung';
}

interface HelperEarning {
  id: string;
  familyTitle: string;
  clientAvatar: string;
  service: string;
  date: string;
  hours: number;
  amount: number;
  status: 'Ausbezahlt' | 'Bei Kasse eingereicht' | 'Offen';
}

// --- INITIAL DATA ---
const INITIAL_RECIPIENTS: CareRecipient[] = [
  { id: 'mom', name: 'Maria Mustermann', relation: 'Mama', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', careLevel: 'Pflegegrad 2', budgetMax: 125.00, budgetUsed: 45.00 },
  { id: 'dad', name: 'Heinrich Mustermann', relation: 'Papa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', careLevel: 'Pflegegrad 3', budgetMax: 125.00, budgetUsed: 90.00 }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-101', recipientId: 'mom', recipientName: 'Maria Mustermann', recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', helperName: 'Sarah M. (Du)', service: 'Alltagsbegleitung & Spaziergang (2 Std.)', date: '04.08.2026, 14:30 Uhr', amount: 30.00, status: 'Erstattet' },
  { id: 'tx-102', recipientId: 'mom', recipientName: 'Maria Mustermann', recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', helperName: 'Lukas K.', service: 'Einkaufsservice & Haushaltshilfe', date: '01.08.2026, 11:00 Uhr', amount: 15.00, status: 'Erstattet' },
  { id: 'tx-103', recipientId: 'dad', recipientName: 'Heinrich Mustermann', recipientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', helperName: 'Sarah M. (Du)', service: 'Begleitung zum Facharzt', date: '03.08.2026, 16:00 Uhr', amount: 50.00, status: 'In Prüfung' }
];

const HELPER_EARNINGS: HelperEarning[] = [
  { id: 'he-1', familyTitle: 'Familie Mustermann (Maria)', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', service: 'Alltagsbegleitung & Einkauf', date: '04.08.2026', hours: 2.0, amount: 30.00, status: 'Ausbezahlt' },
  { id: 'he-2', familyTitle: 'Familie Mustermann (Heinrich)', clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', service: 'Arztbegleitung & Unterstützung', date: '03.08.2026', hours: 2.5, amount: 50.00, status: 'Bei Kasse eingereicht' },
  { id: 'he-3', familyTitle: 'Familie Weber (Gisela)', clientAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=300&q=80', service: 'Gartenarbeit & Vorlesen', date: '29.07.2026', hours: 3.0, amount: 45.00, status: 'Ausbezahlt' }
];

export default function CarelyDashboard() {
  const [role, setRole] = useState<UserRole>('helper'); // Standardmäßig auf Helfer eingestellt
  const [recipients, setRecipients] = useState<CareRecipient[]>(INITIAL_RECIPIENTS);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all');
  const [editingRecipient, setEditingRecipient] = useState<CareRecipient | null>(null);
  const [newBudgetInput, setNewBudgetInput] = useState<string>('');

  // Calculations for Family Finance Tab
  const totalMaxBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetMax, 0), [recipients]);
  const totalUsedBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetUsed, 0), [recipients]);
  const totalRemainingBudget = Math.max(0, totalMaxBudget - totalUsedBudget);
  const remainingPercent = Math.min(100, Math.max(0, Math.round((totalRemainingBudget / totalMaxBudget) * 100)));

  // Calculations for Helper Control Panel
  const helperTotalEarned = useMemo(() => HELPER_EARNINGS.reduce((s, e) => s + e.amount, 0), []);
  const helperHoursTotal = useMemo(() => HELPER_EARNINGS.reduce((s, e) => s + e.hours, 0), []);

  const filteredTransactions = useMemo(() => selectedRecipientId === 'all' ? INITIAL_TRANSACTIONS : INITIAL_TRANSACTIONS.filter(t => t.recipientId === selectedRecipientId), [selectedRecipientId]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipient) return;
    const parsed = parseFloat(newBudgetInput);
    if (isNaN(parsed) || parsed < 0) return;
    setRecipients(prev => prev.map(r => r.id === editingRecipient.id ? { ...r, budgetMax: parsed } : r));
    setEditingRecipient(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* PERSPECTIVE / ROLE SWITCHER BANNER */}
      <div className="bg-[#04201C] text-white py-2 px-4 border-b border-teal-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Aktuelle Control Panel Perspektive:</span>
            <span className="font-bold text-teal-300">{role === 'helper' ? 'Helfer / Alltagsbegleiter' : 'Pflegender Angehöriger / Betreuer'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
            <button 
              onClick={() => setRole('helper')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${role === 'helper' ? 'bg-[#26A69A] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'}`}
            >
              Helfer-Sicht
            </button>
            <button 
              onClick={() => setRole('family')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-[11px] ${role === 'family' ? 'bg-[#26A69A] text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'}`}
            >
              Angehörigen-Sicht
            </button>
          </div>
        </div>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#063934] flex items-center justify-center text-emerald-400 shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="font-serif font-black text-2xl text-[#063934]">Carely</span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5">
            {role === 'family' ? (
              <>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Search className="w-4 h-4" /> Offene Anfragen
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" /> Familien-Hub
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Calendar className="w-4 h-4" /> Meine Woche
                </button>
                <button className="bg-[#063934] text-white shadow-xs px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" /> Budget & Kasse
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Briefcase className="w-4 h-4" /> Freie Aufträge
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" /> Meine Familien
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
                  <Calendar className="w-4 h-4" /> Einsätze & Kalender
                </button>
                <button className="bg-[#063934] text-white shadow-xs px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer">
                  <Euro className="w-4 h-4" /> Meine Honorare
                </button>
              </>
            )}
            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
              <MessageSquare className="w-4 h-4" /> Nachrichten
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline-block">
              {role === 'helper' ? 'Sarah M. (Helferin)' : 'Familie Mustermann'}
            </span>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <img src={role === 'helper' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* ================= VIEW 1: HELFER CONTROL PANEL ================= */}
        {role === 'helper' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* HELFER HERO BANNER */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-[#062925] text-white shadow-xl border border-teal-500/20">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Anerkannte Alltagsbegleitung nach Landesrecht §45a</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                    Helfer Control Panel & Honorare
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    Reiche deine geleisteten Stunden bei den Pflegekassen deiner betreuten Familien ein und verfolge deine Auszahlungen in Echtzeit.
                  </p>
                </div>
                <button className="px-5 py-3 rounded-2xl bg-[#26A69A] hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0">
                  <PlusCircle className="w-4 h-4" /> Einsatz nachweisen / Beleg erstellen
                </button>
              </div>
            </div>

            {/* HELFER KPI METRICS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Monats-Umsatz</span>
                  <div className="text-2xl font-serif font-black text-slate-900 mt-1">{helperTotalEarned.toFixed(2)} €</div>
                  <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">100% gesichert über Pflegekassen</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
                  <Euro className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Geleistete Zeit</span>
                  <div className="text-2xl font-serif font-black text-slate-900 mt-1">{helperHoursTotal.toFixed(1)} Std.</div>
                  <span className="text-xs text-teal-600 font-bold mt-1 inline-block">Ø 18,00 € / Std. Stundensatz</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Abrechnungs-Status</span>
                  <div className="text-2xl font-serif font-black text-slate-900 mt-1">Direct-Payout</div>
                  <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">Vollmacht bei Kasse aktiv</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* HELFER ABRECHNUNGSTABELLE */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">Eingereichte Einsätze & Honorare</h3>
                  <p className="text-xs text-slate-400">Übersicht aller Einsätze, die direkt über das Entlastungsbudget abgerechnet werden.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="pb-4 font-bold">BETREUTE FAMILIE</th>
                      <th className="pb-4 font-bold">LEISTUNG</th>
                      <th className="pb-4 font-bold">DATUM & DAUER</th>
                      <th className="pb-4 font-bold">HONORAR</th>
                      <th className="pb-4 font-bold">STATUS</th>
                      <th className="pb-4 font-bold text-right">NACHWEIS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {HELPER_EARNINGS.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <img src={item.clientAvatar} alt={item.familyTitle} className="w-8 h-8 rounded-full object-cover" />
                            <span>{item.familyTitle}</span>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-slate-800">{item.service}</td>
                        <td className="py-4 text-slate-600 font-medium">
                          <div>{item.date}</div>
                          <span className="text-[10px] text-slate-400 font-bold">{item.hours} Stunden</span>
                        </td>
                        <td className="py-4 font-black text-slate-900 text-sm">{item.amount.toFixed(2)} €</td>
                        <td className="py-4">
                          {item.status === 'Ausbezahlt' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ausbezahlt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Bei Kasse eingereicht
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <button className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition inline-flex items-center gap-1.5 ml-auto cursor-pointer">
                            <FileText className="w-3.5 h-3.5" /> Stundenzettel PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW 2: PFLEGENDER ANGEHÖRIGER (BUDGET & KASSE) ================= */}
        {role === 'family' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* DARK HERO BANNER */}
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
                  <PlusCircle className="w-4 h-4" /> Beleg für Angehörigen einreichen
                </button>
              </div>
            </div>

            {/* DYNAMIC CIRCULAR BUDGET GAUGE & PER-PERSON BREAKDOWN */}
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              
              {/* GESAMTKONTO - DONUT WIDGET */}
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
                      <path className="text-[#0D9488] transition-all duration-1000 stroke-round" strokeDasharray={`${remainingPercent}, 100`} strokeWidth="3.8" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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

              {/* AUFSCHLÜSSELUNG PRO PERSON */}
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
                              onClick={() => { setEditingRecipient(person); setNewBudgetInput(person.budgetMax.toString()); }}
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

            {/* ABRECHNUNGSPROTOKOLL TABLE */}
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
        )}

      </main>

      {/* MODAL: BUDGET HÖHE FESTLEGEN */}
      {editingRecipient && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            <button 
              onClick={() => setEditingRecipient(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 p-2 rounded-2xl hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <img src={editingRecipient.avatar} alt={editingRecipient.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-600" />
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">Budget festlegen</h3>
                <p className="text-xs text-slate-500">{editingRecipient.name} ({editingRecipient.relation})</p>
              </div>
            </div>
            <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Monatlicher Zielbetrag (€)</label>
                <div className="relative">
                  <input 
                    type="number" step="5" min="0" required value={newBudgetInput} onChange={(e) => setNewBudgetInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-600/10 focus:border-teal-600 text-slate-900 text-sm font-bold bg-slate-50 pr-8"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 font-bold">€</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingRecipient(null)} className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer">
                  Abbrechen
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-2xl bg-[#063934] hover:bg-teal-900 text-white font-bold text-xs shadow-md transition cursor-pointer">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}