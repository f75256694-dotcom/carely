'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Smile, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ChatsView() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Hallo! Passt morgen um 10:00 Uhr bei Ihnen?', time: '13:20' },
    { id: 2, sender: 'me', text: 'Hallo! Ja, das passt perfekt.', time: '13:35' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. HAUPT-CHAT BEREICH (2 Spalten) */}
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] shadow-2xl shadow-slate-900/5 flex flex-col h-[650px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-gray-100/80 bg-white/50 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-teal-600/20">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Maria Schwabing (82)</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-black uppercase">
                  Verifiziert
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Wocheneinkauf & Begleitung</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-black shadow-xs">
            Offen
          </span>
        </div>

        {/* Nachrichten Verlauf (Scrollbar & aufgeräumt) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-transparent">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-br-xs shadow-teal-700/20' 
                    : 'bg-white text-slate-800 border border-gray-200/80 rounded-bl-xs'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 px-1 font-semibold">{msg.time}</span>
              </div>
            );
          })}
        </div>

        {/* Schönes, kompaktes Eingabefeld */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400 pl-2">
            <button type="button" className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Datei anhängen">
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer" title="Emoji einfügen">
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Schreibe eine Nachricht..."
            className="flex-1 bg-slate-50 border border-gray-200 focus:border-teal-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
          />

          <button 
            type="submit"
            className="p-3.5 bg-slate-900 hover:bg-teal-700 text-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center"
            title="Senden"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. EINSATZ-DETAILS SEITENBEREICH */}
      <div className="bg-white/80 backdrop-blur-3xl border border-gray-200/80 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-slate-900/5 space-y-6 h-fit">
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider font-serif border-b border-gray-100 pb-3">
            Einsatz-Details
          </h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Datum & Uhrzeit</span>
              <span className="text-xs font-black text-slate-900">Morgen, 10:00 Uhr</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Dauer</span>
              <span className="text-xs font-black text-slate-900">ca. 2 Stunden</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Standort</span>
              <span className="text-xs font-black text-slate-900">80801 Schwabing</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sicherer Chat via Carely End-to-End Verschlüsselung.</span>
          </div>
        </div>
      </div>

    </div>
  );
}