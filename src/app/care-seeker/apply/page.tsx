'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SeekerApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tasks: [] as string[],
    singleDistrict: '',
    targetGroup: 'Für mich selbst',
    fullName: '',
    email: '',
    phone: '',
  });

  const taskOptions = [
    { id: 'Einkaufen & Besorgungen', icon: '🛒', title: 'Einkäufe & Besorgungen', desc: 'Unterstützung beim wöchentlichen Einkauf' },
    { id: 'Gesellschaft & Spazierengehen', icon: '☀️', title: 'Gesellschaft & Spaziergänge', desc: 'Gemeinsame Zeit & frische Luft' },
    { id: 'Leichte Haushaltshilfe', icon: '✨', title: 'Leichte Haushaltshilfe', desc: 'Hilfe im Haushalt & Ordnung halten' },
    { id: 'Begleitung zu Terminen', icon: '🤝', title: 'Terminbegleitung', desc: 'Sicherer Begleitschutz zum Arzt oder Ämtern' }
  ];

  const districtOptions = [
    { id: '1', label: '1. Innere Stadt' }, { id: '2', label: '2. Leopoldstadt' }, { id: '3', label: '3. Landstraße' },
    { id: '10', label: '10. Favoriten' }, { id: '11', label: '11. Simmering' }, { id: '12', label: '12. Meidling' },
    { id: '13', label: '13. Hietzing' }, { id: '14', label: '14. Penzing' }, { id: '15', label: '15. Rudolfsheim-Fünfhaus' },
    { id: '16', label: '16. Ottakring' }, { id: '17', label: '17. Hernals' }, { id: '18', label: '18. Währing' },
    { id: '19', label: '19. Döbling' }, { id: '20', label: '20. Brigittenau' }, { id: '21', label: '21. Floridsdorf' },
    { id: '22', label: '22. Donaustadt' }, { id: '23', label: '23. Liesing' }
  ];

  const targetGroupOptions = ['Für mich selbst', 'Für meine Eltern', 'Für Angehörige'];

  const toggleTask = (taskId: string) => {
    setFormData(prev => ({ ...prev, tasks: prev.tasks.includes(taskId) ? prev.tasks.filter(t => t !== taskId) : [...prev.tasks, taskId] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('pilot_requests').insert([{
        role: 'seeker',
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: formData.tasks,
        district: formData.singleDistrict, // Einzelner Bezirk als String (z.B. "10. Favoriten" oder "1020")
        target_group: formData.targetGroup,
        hours_per_week: null,
        created_at: new Date().toISOString()
      }]);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-lg w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">🚀</div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Anfrage erhalten!</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">Deine Anfrage ist angekommen. Wir suchen die perfekte Unterstützung im Grätzel für dich und melden uns zeitnah!</p>
          <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 text-emerald-400 font-semibold text-sm border border-white/10">Du kannst dieses Fenster jetzt schließen.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white py-12 px-4 flex flex-col items-center selection:bg-emerald-200">
      <div className="max-w-2xl w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-sm mb-6 border border-emerald-200 shadow-sm">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
          Exklusive Unterstützung im Grätzel anfordern
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Verlässliche Hilfe direkt <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">in deiner Nachbarschaft.</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl">Finde geprüfte und herzliche Alltagsbegleiter für dich oder deine Angehörigen – unkompliziert, direkt im Bezirk.</p>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-8 mt-2">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Schritt {step} von 3</span>
          <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm">C</div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Für wen wird Unterstützung gesucht?</label>
              <div className="grid grid-cols-3 gap-2">
                {targetGroupOptions.map(tg => (
                  <button key={tg} type="button" onClick={() => setFormData({...formData, targetGroup: tg})} className={`py-3 px-2 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all text-center ${formData.targetGroup === tg ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                    {tg}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welche Unterstützung wird benötigt?</h2>
            <p className="text-slate-500 mb-8">Wähle alle Bereiche aus, die für dich relevant sind.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {taskOptions.map(t => {
                const isSelected = formData.tasks.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggleTask(t.id)} className={`relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}>
                    <span className="text-3xl mb-3 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{t.icon}</span>
                    <span className={`font-bold text-lg mb-1 ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>{t.title}</span>
                    <span className="text-sm text-slate-500">{t.desc}</span>
                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-slate-400 bg-white'}`}>
                      {isSelected ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <span className="text-xs font-bold leading-none">+</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <button disabled={formData.tasks.length === 0} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:transform-none disabled:hover:shadow-none disabled:hover:bg-slate-900">Weiter zum Einsatzgebiet →</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">In welchem Wiener Bezirk wird die Hilfe benötigt?</h2>
            <p className="text-slate-500 mb-8">Wähle den genauen Bezirk aus (Einzelauswahl).</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8 max-h-72 overflow-y-auto pr-1">
              {districtOptions.map(d => {
                const isSelected = formData.singleDistrict === d.label;
                return (
                  <button key={d.id} type="button" onClick={() => setFormData({...formData, singleDistrict: d.label})} className={`p-3 rounded-xl border-2 text-left transition-all text-xs font-bold ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-white'}`}>
                    {d.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/4 border-2 border-slate-100 text-slate-500 hover:bg-slate-50 font-bold py-4 rounded-2xl transition-colors">Zurück</button>
              <button disabled={!formData.singleDistrict} onClick={() => setStep(3)} className="w-3/4 bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:transform-none disabled:hover:shadow-none disabled:hover:bg-slate-900">Zu den Kontaktdaten →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Fast geschafft!</h2>
              <p className="text-slate-500 mb-6">Wohin dürfen wir dir Rückmeldungen senden?</p>
              <div className="space-y-4 mb-8">
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Vollständiger Name</label><input required type="text" placeholder="Maria Musterfrau" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-slate-900 font-medium outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">E-Mail-Adresse</label><input required type="email" placeholder="maria@beispiel.at" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-slate-900 font-medium outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Handynummer (für Rückfragen)</label><input required type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-slate-900 font-medium outline-none transition-all" /></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="w-1/4 border-2 border-slate-100 text-slate-500 hover:bg-slate-50 font-bold py-4 rounded-2xl transition-colors">Zurück</button>
                <button disabled={loading} type="submit" className="w-3/4 bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:transform-none flex items-center justify-center gap-2">
                  {loading ? 'Wird gesendet...' : 'Hilfe anfragen 🚀'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="max-w-2xl w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-10 text-slate-500 text-sm font-medium">
        <span className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">🛡️ Geprüfte Alltagshelden</span>
        <span className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">⚡ Schnelle Vermittlung</span>
        <span className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">📍 Einsätze direkt im Grätzel</span>
      </div>
    </main>
  );
}