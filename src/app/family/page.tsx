'use client';

import { useState, useMemo } from 'react';
import { 
  Heart, Calendar, MessageSquare, CreditCard, 
  PlusCircle, ShieldCheck, Download, Edit3, X, 
  Sparkles, CheckCircle2, Search, Users,
  Smile, Activity, ChevronRight, UserPlus, HeartPulse
} from 'lucide-react';

// --- TYPES ---
interface CareRecipient {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  careLevel: string;
  budgetMax: number;
  budgetUsed: number;
  moodScore: number; 
  activityScore: number; 
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

// --- INITIAL DATA ---
const INITIAL_RECIPIENTS: CareRecipient[] = [
  {
    id: 'mom',
    name: 'Maria Mustermann',
    relation: 'Mama',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    careLevel: 'Pflegegrad 2',
    budgetMax: 125.00,
    budgetUsed: 45.00,
    moodScore: 88,
    activityScore: 72,
  },
  {
    id: 'dad',
    name: 'Heinrich Mustermann',
    relation: 'Papa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    careLevel: 'Pflegegrad 3',
    budgetMax: 125.00,
    budgetUsed: 90.00,
    moodScore: 65,
    activityScore: 50,
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101', recipientId: 'mom', recipientName: 'Maria Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    helperName: 'Sarah M.', service: 'Alltagsbegleitung & Spaziergang (2 Std.)',
    date: '04.08.2026, 14:30 Uhr', amount: 30.00, status: 'Erstattet'
  },
  {
    id: 'tx-102', recipientId: 'mom', recipientName: 'Maria Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    helperName: 'Lukas K.', service: 'Einkaufsservice & Haushaltshilfe',
    date: '01.08.2026, 11:00 Uhr', amount: 15.00, status: 'Erstattet'
  },
  {
    id: 'tx-103', recipientId: 'dad', recipientName: 'Heinrich Mustermann',
    recipientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    helperName: 'Jan W.', service: 'Begleitung zum Facharzt',
    date: '03.08.2026, 16:00 Uhr', amount: 50.00, status: 'In Prüfung'
  }
];

const MOOD_HISTORY = [
  { day: 'Mo', score: 60, label: 'Zufrieden' },
  { day: 'Di', score: 75, label: 'Sehr gut' },
  { day: 'Mi', score: 70, label: 'Gut' },
  { day: 'Do', score: 85, label: 'Ausgezeichnet' },
  { day: 'Fr', score: 90, label: 'Sehr glücklich' },
  { day: 'Sa', score: 82, label: 'Entspannt' },
  { day: 'So', score: 88, label: 'Sehr gut' }
];

export default function CarelyDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'hub' | 'week' | 'finanzen' | 'messages'>('hub');
  const [recipients, setRecipients] = useState<CareRecipient[]>(INITIAL_RECIPIENTS);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all');
  
  // Budget Modal State
  const [editingRecipient, setEditingRecipient] = useState<CareRecipient | null>(null);
  const [newBudgetInput, setNewBudgetInput] = useState<string>('');

  // Calculations for Finance Tab
  const totalMaxBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetMax, 0), [recipients]);
  const totalUsedBudget = useMemo(() => recipients.reduce((s, r) => s + r.budgetUsed, 0), [recipients]);
  const totalRemainingBudget = Math.max(0, totalMaxBudget - totalUsedBudget);
  const remainingPercent = Math.min(100, Math.max(0, Math.round((totalRemainingBudget / totalMaxBudget) * 100)));

  const filteredTransactions = useMemo(() => {
    if (selectedRecipientId === 'all') return INITIAL_TRANSACTIONS;
    return INITIAL_TRANSACTIONS.filter(t => t.recipientId === selectedRecipientId);
  }, [selectedRecipientId]);

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
            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
              <Search className="w-4 h-4" /> Offene Anfragen
            </button>
            <button 
              onClick={() => setActiveTab('hub')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === 'hub' ? 'bg-[#063934] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <Users className="w-4 h-4" /> Familien-Hub
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
              <Calendar className="w-4 h-4" /> Meine Woche
            </button>
            <button 
              onClick={() => setActiveTab('finanzen')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === 'finanzen' ? 'bg-[#063934] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80'}`}
            >
              <CreditCard className="w-4 h-4" /> Finanzen & Budget
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition flex items-center gap-2 cursor-pointer">
              <MessageSquare className="w-4 h-4" /> Nachrichten
            </button>
          </nav>

          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">

        {/* ================= REITER 1: FAMILIEN-HUB (WOHLBEFINDEN & FALL-MANAGEMENT) ================= */}
        {activeTab === 'hub' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* HUB HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-100">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600" /> Vitalitäts-Zentrale
                </div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Familien-Hub</h1>
                <p className="text-sm text-slate-500 mt-1">Verwalte deine Angehörigen und behalte ihr Wohlbefinden im Blick.</p>
              </div>
            </div>

            {/* ANGEHÖRIGEN MANAGEMENT (FÄLLE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipients.map((person) => (
                <div key={person.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500" />
                  <div className="flex items-start justify-between mb-4">
                    <img src={person.avatar} alt={person.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {person.careLevel}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">{person.name}</h3>
                  <p className="text-xs text-slate-500 mb-6">{person.relation}</p>
                  
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Stimmung</p>
                      <p className="text-sm font-black text-emerald-600">{person.moodScore}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Aktivität</p>
                      <p className="text-sm font-black text-teal-600">{person.activityScore}%</p>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2.5 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-100 hover:border-teal-100">
                    Akte öffnen <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* NEUEN FALL HINZUFÜGEN */}
              <button className="bg-slate-50/50 border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all group cursor-pointer min-h-[280px]">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Angehörigen hinzufügen</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Neuen Betreuungsfall anlegen und Pflegekasse verknüpfen.</p>
              </button>
            </div>

            {/* STIMMUNGSGRAPH CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 block">Gemeinsamer Wochenverlauf</span>
                  <h3 className="text-xl font-serif font-bold text-slate-900">Stimmungs- & Wohlbefindens-Graph</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Smile className="w-3.5 h-3.5" /> Positiver Trend (+18%)
                  </span>
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="relative pt-6 pb-2">
                <div className="h-56 w-full flex items-end justify-between relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                  </div>
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 50 120 Q 150 50, 250 80 T 450 30 T 650 40 L 650 200 L 50 200 Z" fill="url(#moodGradient)" />
                    <path d="M 50 120 Q 150 50, 250 80 T 450 30 T 650 40" fill="none" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  {MOOD_HISTORY.map((item, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                      <div className="group relative flex flex-col items-center mb-2">
                        <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-8 px-2 py-1 bg-slate-900 text-white text-[10px] rounded font-bold whitespace-nowrap">
                          {item.label} ({item.score}%)
                        </div>
                        <div className="w-4 h-4 rounded-full bg-white border-3 border-teal-600 shadow-md transition transform group-hover:scale-125 cursor-pointer" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-2">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VITALITÄTS-KREISDIAGRAMME */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Durchschnitt</span>
                  <h4 className="text-base font-bold text-slate-900">Wohlbefinden</h4>
                  <p className="text-xs text-emerald-600 font-semibold">Sehr gut eingestellt</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-teal-600" strokeDasharray="85, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-sm font-black text-slate-900">85%</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Wochen-Aktivitäten</span>
                  <h4 className="text-base font-bold text-slate-900">Termine Erfüllt</h4>
                  <p className="text-xs text-teal-600 font-semibold">10 von 15 absolviert</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="67, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-sm font-black text-slate-900">67%</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pflegekasse</span>
                  <h4 className="text-base font-bold text-slate-900">Gesamt-Budget</h4>
                  <p className="text-xs text-amber-600 font-semibold">Gute Auslastung</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-amber-500" strokeDasharray="46, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-sm font-black text-slate-900">46%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= REITER 2: FINANZEN & BUDGET ================= */}
        {activeTab === 'finanzen' && (
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
                  <PlusCircle className="w-4 h-4" /> Beleg einreichen
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

        {/* BUDGET EDIT MODAL */}
        {editingRecipient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-lg">Budget anpassen</h3>
                <button onClick={() => setEditingRecipient(null)} className="text-slate-400 hover:text-slate-900">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveBudget}>
                <label className="block text-xs font-bold text-slate-500 mb-2">Maximales Budget (€)</label>
                <input
                  type="number"
                  value={newBudgetInput}
                  onChange={(e) => setNewBudgetInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none mb-6"
                />
                <button type="submit" className="w-full py-3 bg-[#063934] text-white rounded-xl font-bold hover:bg-[#084d46] transition">
                  Speichern
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}