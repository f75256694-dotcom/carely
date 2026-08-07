'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, MessageSquare, Phone, 
  MapPin, Clock, CheckCircle2, ChevronRight, Send, 
  Plus, ShieldCheck, Heart, Image as ImageIcon, Sparkles, 
  Wallet, FileText, Download, AlertCircle, Check, Search
} from 'lucide-react';

export default function CarelyDashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'week' | 'messages' | 'request' | 'finances'>('home');
  const [messages, setMessages] = useState([
    { sender: 'helper', text: 'Hallo Frau Berger! Ich freue mich schon auf unseren Spaziergang um 10 Uhr.', time: '09:15' },
    { sender: 'user', text: 'Hallo liebe Maria! Das Wetter ist herrlich, bis gleich.', time: '09:20' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [callActive, setCallActive] = useState(false);

  const [reqCategory, setReqCategory] = useState('Spaziergang & Begleitung');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDate, setReqDate] = useState('Morgen, 10:00 Uhr');
  const [reqBudget, setReqBudget] = useState('22');
  const [reqSuccess, setReqSuccess] = useState(false);

  const [approvals, setApprovals] = useState([
    { id: 1, title: 'Wocheneinkauf REWE (Zusatztermin)', date: 'Freitag, 07. Aug • 14:00 Uhr', cost: '44,00 €', helper: 'Maria Schmidt' },
    { id: 2, title: 'Arztbegleitung Spezial', date: 'Montag, 10. Aug • 10:00 Uhr', cost: '66,00 €', helper: 'Maria Schmidt' },
  ]);

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: inputMsg, time: 'Gerade eben' }]);
    setInputMsg('');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqSuccess(true);
    setTimeout(() => {
      setReqSuccess(false);
      setActiveTab('home');
    }, 2500);
  };

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans text-slate-900 pb-24">
      
      {/* 100% Original Carely Header – Sauber, einstöckig, perfekt */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-[#0D5C55] text-white flex items-center justify-center shadow-sm">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 font-serif">Carely</span>
          </div>

          {/* Integrierte Menü-Tasten für die Hauptbereiche */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'week' ? 'bg-[#0D5C55] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              📅 Meine Woche
            </button>
            <button
              onClick={() => setActiveTab('finances')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'finances' ? 'bg-[#0D5C55] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              💳 Finanzen & Budget
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'messages' ? 'bg-[#0D5C55] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              💬 Nachrichten
            </button>
          </div>

          {/* Rechte Seite: Großer CTA Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('request')}
              className="bg-[#0D5C55] hover:bg-[#094842] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md shadow-[#0D5C55]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Unterstützung anfordern
            </button>
            <span className="text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900 hidden sm:inline">Anmelden</span>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-10">

        {activeTab === 'home' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Header / Grußformel im echten Carely Serif-Stil */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0D5C55] uppercase tracking-widest bg-[#0D5C55]/5 px-3.5 py-1.5 rounded-full border border-[#0D5C55]/10 inline-block">
                Sonntag, 2. August 2026
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif pt-2">
                Guten Tag, Helga 👋
              </h1>
              <p className="text-base text-slate-500 font-medium">
                Maria kommt heute um 10 Uhr für Ihren Spaziergang.
              </p>
            </div>

            {/* Aktiver Helfer Widget */}
            <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D5C55] text-white flex items-center justify-center font-black text-2xl shadow-md">
                    M
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Maria Schmidt</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Ihre Alltagshelferin • 4.9 ⭐ (42 Einsätze)</p>
                </div>
              </div>

              <button
                onClick={() => setCallActive(true)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Phone className="w-4 h-4 text-[#4ADE80]" /> Maria anrufen
              </button>
            </div>

            {/* Heutige Aufträge Sektion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Heutige Aufträge</h2>
                <span className="text-xs font-bold text-[#0D5C55] bg-[#0D5C55]/5 px-3 py-1 rounded-full">2 Einsätze heute</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:border-[#0D5C55] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xl font-bold">
                    ☀️
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">10:00 Uhr</span>
                    <h4 className="text-base font-bold text-slate-900 font-serif mt-0.5">Spaziergang im Englischen Garten</h4>
                    <p className="text-xs text-slate-500 font-medium">Mit Maria Schmidt</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl">Bevorstehend</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm hover:border-[#0D5C55] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D5C55]/10 text-[#0D5C55] flex items-center justify-center shrink-0 text-xl font-bold">
                    🛍️
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-[#0D5C55] uppercase tracking-wide">14:00 Uhr</span>
                    <h4 className="text-base font-bold text-slate-900 font-serif mt-0.5">Lebensmittel für die Woche einkaufen</h4>
                    <p className="text-xs text-slate-500 font-medium">REWE Markt Leopoldstraße</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-xl">Geplant</span>
                </div>
              </div>

              {/* Riesen-Anfrage Banner */}
              <div 
                onClick={() => setActiveTab('request')}
                className="bg-gradient-to-r from-[#0D5C55] via-[#094842] to-[#0D5C55] text-white rounded-[2.5rem] p-8 shadow-xl shadow-[#0D5C55]/20 cursor-pointer hover:scale-[1.01] transition-all flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="space-y-2 text-center sm:text-left relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3.5 py-1 rounded-full">Blitzvermittlung</span>
                  <h3 className="text-2xl font-black font-serif">Neuen Alltagshelfer anfordern</h3>
                  <p className="text-xs text-teal-100 font-medium">Egal ob Arztbesuch, Begleitung oder Haushalt – schnell & unkompliziert.</p>
                </div>
                <div className="bg-white text-[#0D5C55] px-6 py-4 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 shrink-0 relative z-10">
                  <Plus className="w-4 h-4" /> Jetzt anfragen
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'week' && (
          <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-10 space-y-6 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase text-[#0D5C55] bg-[#0D5C55]/5 px-3 py-1 rounded-full">August 2026</span>
                <h2 className="text-3xl font-black text-slate-900 font-serif mt-1">Wochenkalender</h2>
                <p className="text-xs text-slate-500 font-medium">Alle gebuchten Einsätze in der Übersicht.</p>
              </div>
              <button 
                onClick={() => setActiveTab('home')} 
                className="text-xs font-bold text-[#0D5C55] bg-[#0D5C55]/5 hover:bg-[#0D5C55]/10 px-4 py-2.5 rounded-xl w-fit transition-colors cursor-pointer"
              >
                Zur Startseite
              </button>
            </div>

            <div className="grid grid-cols-7 gap-3 text-center">
              {[
                { day: 'Mo', date: '03', active: false },
                { day: 'Di', date: '04', active: true, badge: 'Arzt' },
                { day: 'Mi', date: '05', active: false },
                { day: 'Do', date: '06', active: false, badge: 'Kaffee' },
                { day: 'Fr', date: '07', active: false },
                { day: 'Sa', date: '08', active: false, badge: 'Balkon' },
                { day: 'So', date: '02', active: false, today: true },
              ].map((d, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center ${d.active ? 'bg-[#0D5C55] text-white border-[#0D5C55] shadow-sm' : 'bg-slate-50/50 border-slate-200/80 text-slate-700 hover:bg-slate-100'}`}>
                  <span className={`text-[10px] font-bold ${d.active ? 'text-teal-200' : 'text-slate-400'}`}>{d.day}</span>
                  <span className="text-base font-black mt-0.5">{d.date}</span>
                  {d.today && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1"></span>}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Anstehende Einsätze diese Woche</h3>
              
              {[
                { day: 'Heute, So 02. Aug', time: '10:00 - 12:00', title: 'Spaziergang im Englischen Garten', helper: 'Maria Schmidt', status: 'Bestätigt' },
                { day: 'Heute, So 02. Aug', time: '14:00 - 15:30', title: 'Wocheneinkauf REWE', helper: 'Maria Schmidt', status: 'Bestätigt' },
                { day: 'Dienstag, 04. Aug', time: '09:30 - 11:30', title: 'Arztbegleitung Dr. Müller', helper: 'Maria Schmidt', status: 'Bestätigt' },
              ].map((slot, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#0D5C55] bg-[#0D5C55]/5 px-2.5 py-0.5 rounded-md">{slot.day}</span>
                    <h4 className="text-sm font-bold text-slate-900 font-serif mt-1">{slot.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Helfer: <strong className="text-slate-800">{slot.helper}</strong> ({slot.time})</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANZEN IM HELLEN, EDLEN CARELY-PREMIUM-LOOK */}
        {activeTab === 'finances' && (
          <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-10 shadow-sm animate-fadeIn space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase text-[#0D5C55] bg-[#0D5C55]/5 px-3 py-1 rounded-full">💳 Finanz- & Budgetzentrale</span>
                <h2 className="text-3xl font-black text-slate-900 font-serif mt-1">Pflegebudget & Ausgaben</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Monatliche Übersicht nach § 45b SGB XI (Entlastungsbetrag).</p>
              </div>
              <button 
                onClick={() => setActiveTab('home')} 
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors w-fit cursor-pointer"
              >
                Zurück
              </button>
            </div>

            {/* Helles Premium Finanz-Element (ersetzt das dunkle Design) */}
            <div className="bg-gradient-to-br from-white via-[#F4F9F8] to-[#EBF5F3] border border-[#0D5C55]/20 text-slate-900 rounded-[2.5rem] p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-xs font-bold text-[#0D5C55] uppercase tracking-widest bg-white px-3.5 py-1 rounded-full border border-[#0D5C55]/20 shadow-xs inline-block">
                  Entlastungsbetrag § 45b
                </span>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black font-serif text-slate-900">380,00 €</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">von 500,00 € monatlichem Budget genutzt</p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs text-[#0D5C55] font-bold justify-center sm:justify-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Noch 120,00 € für August verfügbar
                </div>
              </div>

              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="52" stroke="currentColor" strokeWidth="10" className="text-slate-200/60" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="52" 
                    stroke="currentColor" strokeWidth="10" 
                    className="text-[#0D5C55]" 
                    fill="transparent" 
                    strokeDasharray="326" 
                    strokeDashoffset="78" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900">76%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Verbraucht</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Anstehende Freigaben ({approvals.length})
              </h3>

              {approvals.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 font-bold">
                  Keine offenen Freigaben vorhanden.
                </div>
              ) : (
                <div className="space-y-3">
                  {approvals.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md">{item.date}</span>
                        <h4 className="text-sm font-bold text-slate-900 font-serif mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">Helfer: {item.helper} • Kosten: <strong>{item.cost}</strong></p>
                      </div>
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="bg-[#0D5C55] hover:bg-[#094842] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 w-fit"
                      >
                        <Check className="w-3.5 h-3.5" /> 1-Tap Freigabe
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0D5C55]/10 text-[#0D5C55] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">Sammelrechnung & Pflegekassen-Export</h4>
                  <p className="text-xs text-slate-500 font-medium">Offizielle Belege für Juli 2026 bereit für den Entlastungsbetrag.</p>
                </div>
              </div>
              <button 
                onClick={() => alert('PDF-Sammelrechnung wird heruntergeladen...')}
                className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all w-fit"
              >
                <Download className="w-4 h-4 text-[#4ADE80]" /> § 45b Beleg exportieren
              </button>
            </div>

          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white border border-slate-200/90 rounded-[2.5rem] h-[600px] flex flex-col shadow-sm overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D5C55] text-white font-bold flex items-center justify-center">M</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Maria Schmidt</h3>
                  <p className="text-[11px] text-emerald-600 font-bold">Online • Bereit für heute</p>
                </div>
              </div>
              <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-[#0D5C55] bg-[#0D5C55]/5 px-3 py-2 rounded-xl cursor-pointer">
                Zurück
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col max-w-[75%] ${m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`p-3.5 rounded-2xl text-xs font-medium ${m.sender === 'user' ? 'bg-[#0D5C55] text-white rounded-tr-xs' : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'}`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-bold">{m.time}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
              <input 
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nachricht an Maria schreiben..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-[#0D5C55] font-medium"
              />
              <button onClick={handleSendMessage} className="w-11 h-11 rounded-2xl bg-[#0D5C55] text-white flex items-center justify-center cursor-pointer shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-6 sm:p-10 shadow-sm animate-fadeIn space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase text-[#0D5C55] bg-[#0D5C55]/5 px-3 py-1 rounded-full">⚡ Blitzvermittlung</span>
                <h2 className="text-3xl font-black text-slate-900 font-serif mt-1">Unterstützung anfordern</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Geprüfte Alltagshelfer in Ihrer Nähe erhalten Ihre Anfrage sofort.</p>
              </div>
              <button 
                onClick={() => setActiveTab('home')} 
                className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
            </div>

            {reqSuccess ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black shadow-md">
                  ✓
                </div>
                <h3 className="text-2xl font-black font-serif text-slate-900">Anfrage erfolgreich versendet!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">3 verifizierte Helfer in Ihrer Umgebung wurden benachrichtigt.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">1. Art der Unterstützung wählen</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Spaziergang & Begleitung', icon: '🌳' },
                      { name: 'Einkauf & Besorgungen', icon: '🛍️' },
                      { name: 'Arztbegleitung', icon: '🩺' },
                    ].map((cat, i) => (
                      <div 
                        key={i}
                        onClick={() => setReqCategory(cat.name)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${reqCategory === cat.name ? 'border-[#0D5C55] bg-[#0D5C55]/5 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Titel der Anfrage *</label>
                    <input 
                      type="text" 
                      required
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      placeholder="z.B. Begleitung zum Wochenmarkt"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-[#0D5C55] font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Wunschtermin *</label>
                    <input 
                      type="text" 
                      required
                      value={reqDate}
                      onChange={(e) => setReqDate(e.target.value)}
                      placeholder="z.B. Morgen ab 14:00 Uhr"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-[#0D5C55] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Aufwandsentschädigung (€ / Std.)</label>
                    <input 
                      type="number" 
                      value={reqBudget}
                      onChange={(e) => setReqBudget(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-[#0D5C55] font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">PLZ / Einsatzort *</label>
                    <input 
                      type="text" 
                      defaultValue="80539 München"
                      required
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-[#0D5C55] font-medium"
                    />
                  </div>
                </div>

                <div className="bg-[#0D5C55]/5 border border-[#0D5C55]/10 rounded-2xl p-4 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#0D5C55] shrink-0" />
                  <p className="text-[11px] font-bold text-slate-800">
                    Sicherheitsgarantie: Alle Helfer sind polizeilich überprüft, ausgebildet und über Carely versichert.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0D5C55] hover:bg-[#094842] text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-[#0D5C55]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#4ADE80]" /> Anfrage jetzt verbindlich veröffentlichen
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Anruf-Modal */}
      {callActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-[#0D5C55]/10 text-[#0D5C55] rounded-full flex items-center justify-center mx-auto text-3xl font-bold animate-pulse">
              📞
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Verbindung zu Maria...</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Sicherer Carely-Anruf wird aufgebaut</p>
            </div>
            <button 
              onClick={() => setCallActive(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Auflegen
            </button>
          </div>
        </div>
      )}

      {/* Untere mobile Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-xl border border-slate-200/80 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 sm:gap-8 md:hidden">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'home' ? 'text-[#0D5C55] font-bold' : 'text-slate-400'}`}
        >
          <span className="text-base">🏠</span>
          <span className="text-[10px]">Start</span>
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'week' ? 'text-[#0D5C55] font-bold' : 'text-slate-400'}`}
        >
          <span className="text-base">📅</span>
          <span className="text-[10px]">Woche</span>
        </button>
        <button 
          onClick={() => setActiveTab('finances')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'finances' ? 'text-[#0D5C55] font-bold' : 'text-slate-400'}`}
        >
          <span className="text-base">💳</span>
          <span className="text-[10px]">Finanzen</span>
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'messages' ? 'text-[#0D5C55] font-bold' : 'text-slate-400'}`}
        >
          <span className="text-base">💬</span>
          <span className="text-[10px]">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('request')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'request' ? 'text-[#0D5C55] font-bold' : 'text-slate-400'}`}
        >
          <span className="text-base">✨</span>
          <span className="text-[10px]">Anfragen</span>
        </button>
      </nav>

    </div>
  );
}