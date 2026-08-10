'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CareSeekerApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    services: [] as string[],
    otherServiceText: '',
    district: '',
    targetGroup: 'Für meine Eltern',
    fullName: '',
    email: '',
    phone: '',
  });

  const serviceOptions = [
    { id: 'Einkäufe & Besorgungen', icon: '🛒', title: 'Einkäufe & Besorgungen', desc: 'Wöchentliche Erledigungen & frische Lebensmittel' },
    { id: 'Spaziergänge & Begleitung', icon: '☀️', title: 'Spaziergänge & Begleitung', desc: 'Gemeinsam an der frischen Luft & zum Arzt' },
    { id: 'Gesellschaft & Alltag', icon: '🤝', title: 'Gesellschaft & Alltag', desc: 'Jemanden zum Reden, Vorlesen & Zuhören' },
    { id: 'Leichte Haushaltshilfe', icon: '✨', title: 'Leichte Haushaltshilfe', desc: 'Ordnung halten & kleine Handgriffe im Haushalt' }
  ];

  const districtOptions = [
    { id: '1', label: '1. Innere Stadt' }, { id: '2', label: '2. Leopoldstadt' }, { id: '3', label: '3. Landstraße' },
    { id: '10', label: '10. Favoriten' }, { id: '11', label: '11. Simmering' }, { id: '12', label: '12. Meidling' },
    { id: '13', label: '13. Hietzing' }, { id: '14', label: '14. Penzing' }, { id: '15', label: '15. Rudolfsheim-Fünfhaus' },
    { id: '16', label: '16. Ottakring' }, { id: '17', label: '17. Hernals' }, { id: '18', label: '18. Währing' },
    { id: '19', label: '19. Döbling' }, { id: '20', label: '20. Brigittenau' }, { id: '21', label: '21. Floridsdorf' },
    { id: '22', label: '22. Donaustadt' }, { id: '23', label: '23. Liesing' }
  ];

  const targetGroupOptions = [
    'Für meine Eltern',
    'Für mich selbst',
    'Für einen Angehörigen / Verwandten',
    'Sonstiges'
  ];

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      services: prev.services.includes(serviceId) ? prev.services.filter(s => s !== serviceId) : [...prev.services, serviceId] 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalServices = [...formData.services];
      if (formData.otherServiceText.trim()) {
        finalServices.push(`Sonstiges: ${formData.otherServiceText.trim()}`);
      }

      await supabase.from('pilot_requests').insert([{
        role: 'care_seeker',
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: finalServices,
        district: formData.district,
        hours_per_week: null,
        target_group: formData.targetGroup,
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
        <div className="max-w-lg w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl sm:text-5xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">✨</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">Anfrage erhalten!</h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">Wir prüfen passende, persönlich geprüfte Alltagsbegleiter in deinem Wiener Grätzel und melden uns in Kürze bei dir.</p>
          <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 text-emerald-400 font-semibold text-sm border border-white/10">Du kannst dieses Fenster jetzt schließen.</div>
        </div>
      </main>
    );
  }

  const isOtherSelected = formData.services.includes('Sonstiges');

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white py-6 sm:py-12 px-4 flex flex-col items-center selection:bg-emerald-200">
      
      {/* Header Bereich */}
      <div className="max-w-xl w-full text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm mb-4 border border-emerald-200 shadow-sm">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
          Exklusiver Pioneer-Kreis · Wien
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Liebevolle Alltagshilfe <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">für Ihre Eltern in Wien.</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-xl">Persönlich interviewte & überprüfte Alltagsbegleiter aus der Nachbarschaft – für echte Entlastung, die ankommt.</p>
      </div>

      {/* Formular Box */}
      <div className="max-w-xl w-full bg-white rounded-3xl p-5 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-6 sm:mb-8 mt-2">
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Schritt {step} von 3</span>
          {/* Helpify Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#2a524a] text-white flex items-center justify-center shadow-md p-1.5">
            <svg className="w-full h-full text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
              <path d="m18 15-2-2"/>
              <path d="m15 18-2-2"/>
            </svg>
          </div>
        </div>

        {/* SCHRITT 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-1 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Welche Unterstützung wird gesucht?</h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">✨ Mehrfachauswahl möglich</span>
            </div>
            <p className="text-slate-500 text-sm sm:text-base mb-6">Wähle aus, was deine Eltern oder du im Alltag brauchen.</p>
            
            <div className="grid grid-cols-1 gap-3.5 mb-6">
              {serviceOptions.map(s => {
                const isSelected = formData.services.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`relative flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                    <span className="text-2xl sm:text-3xl mr-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">{s.icon}</span>
                    <div className="flex-1 pr-6">
                      <span className={`block font-bold text-base sm:text-lg mb-0.5 ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{s.title}</span>
                      <span className="block text-xs sm:text-sm text-slate-500 leading-snug">{s.desc}</span>
                    </div>
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                      {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                );
              })}

              {/* Sonstiges Option */}
              <button type="button" onClick={() => toggleService('Sonstiges')} className={`relative flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                <span className="text-2xl sm:text-3xl mr-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">💡</span>
                <div className="flex-1 pr-6">
                  <span className={`block font-bold text-base sm:text-lg mb-0.5 ${isOtherSelected ? 'text-emerald-900' : 'text-slate-800'}`}>Sonstiges</span>
                  <span className="block text-xs sm:text-sm text-slate-500 leading-snug">Individuelle Wünsche oder Anforderungen</span>
                </div>
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isOtherSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                  {isOtherSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            </div>

            {isOtherSelected && (
              <div className="mb-6 animate-in fade-in duration-300">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Was wird konkret benötigt?</label>
                <input type="text" placeholder="z. B. Begleitung zum Hobby, Kochen..." value={formData.otherServiceText} onChange={e => setFormData({...formData, otherServiceText: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-slate-900 font-medium outline-none text-base" />
              </div>
            )}

            <button disabled={formData.services.length === 0} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-bold text-base sm:text-lg py-4 rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-40 shadow-md">Weiter zum Bezirk →</button>
          </div>
        )}

        {/* SCHRITT 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">In welchem Wiener Bezirk?</h2>
            <p className="text-slate-500 text-sm sm:text-base mb-6">Wähle den Einsatzort aus.</p>
            
            <div className="grid grid-cols-2 gap-2.5 mb-6 max-h-[350px] overflow-y-auto pr-1">
              {districtOptions.map(d => {
                const isSelected = formData.district === d.label;
                return (
                  <button key={d.id} type="button" onClick={() => setFormData({...formData, district: d.label})} className={`p-3.5 rounded-xl border-2 text-left transition-all text-xs sm:text-sm font-bold ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 text-slate-700 bg-white'}`}>
                    {d.label}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm sm:text-base transition-colors">Zurück</button>
              <button disabled={!formData.district} onClick={() => setStep(3)} className="w-2/3 bg-slate-900 text-white font-bold text-sm sm:text-base py-4 rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-40 shadow-md">Kontaktdaten →</button>
            </div>
          </div>
        )}

        {/* SCHRITT 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Für wen wird gesucht?</h2>
                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  {targetGroupOptions.map(opt => (
                    <button key={opt} type="button" onClick={() => setFormData({...formData, targetGroup: opt})} className={`p-3.5 rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all text-center ${formData.targetGroup === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 text-slate-600 bg-white'}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Fast geschafft!</h2>
              <p className="text-slate-500 text-sm sm:text-base mb-4">Wohin dürfen wir dir passende Profile senden?</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Dein vollständiger Name</label>
                  <input required type="text" placeholder="Anna Huber" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 font-medium outline-none text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">E-Mail-Adresse</label>
                  <input required type="email" placeholder="anna@beispiel.at" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 font-medium outline-none text-base" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Handynummer</label>
                  <input required type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 font-medium outline-none text-base" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm sm:text-base transition-colors">Zurück</button>
                <button disabled={loading} type="submit" className="w-2/3 bg-emerald-600 text-white font-bold text-sm sm:text-base py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? 'Wird gesendet...' : 'Profile anfordern 🚀'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Badges */}
      <div className="max-w-xl w-full flex flex-wrap justify-center items-center gap-3 mt-8 text-slate-500 text-xs sm:text-sm font-medium">
        <span className="flex items-center gap-1.5 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">🛡️ 3-Stufen-Sicherheits-Check</span>
        <span className="flex items-center gap-1.5 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">⚡ Kostenfreie Pilot-Phase</span>
      </div>
    </main>
  );
}