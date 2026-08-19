'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CareSeekerApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [formData, setFormData] = useState({
    services: [] as string[],
    otherServiceText: '',
    district: '1. Innere Stadt',
    selectedPackage: 'Basis (2-5 Std./Woche)',
    targetGroup: 'Für mich selbst',
    fullName: '',
    email: '',
    phone: '',
    privacyAccepted: false,
    source: 'direct',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source') || params.get('ref');
    if (sourceParam) {
      setFormData(prev => ({ ...prev, source: sourceParam }));
    }
  }, []);

  const serviceOptions = [
    { id: 'Einkäufe & Besorgungen', icon: '🛒', title: 'Einkäufe & Besorgungen', desc: 'Unterstützung beim wöchentlichen Einkauf' },
    { id: 'Gesellschaft & Spaziergänge', icon: '☀️', title: 'Gesellschaft & Spaziergänge', desc: 'Gemeinsame Zeit & frische Luft' },
    { id: 'Leichte Haushaltshilfe', icon: '✨', title: 'Leichte Haushaltshilfe', desc: 'Hilfe im Haushalt & Ordnung halten' },
    { id: 'Terminbegleitung', icon: '🤝', title: 'Terminbegleitung', desc: 'Sicherer Begleitschutz zum Arzt oder Ämtern' }
  ];

  const districtOptions = [
    '1.', '2. ', '3. ', '4. ', '5. ',
    '6. ', '7. ', '8. ', '9. ', '10. ',
    '11. ', '12. ', '13. ', '14. ', '15. ',
    '16. ', '17. ', '18. ', '19. ', '20. ',
    '21. ', '22. ', '23. '
  ];

  const packageOptions = ['Basis (2-5 Std./Woche)', 'Komfort (5-10 Std./Woche)', 'Intensiv (10+ Std./Woche)'];
  const targetGroupOptions = ['Für mich selbst', 'Für meine Eltern / Angehörigen', 'Für Bekannte'];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId) ? prev.services.filter(s => s !== serviceId) : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!formData.privacyAccepted || !isValidEmail(formData.email)) return;
    setLoading(true);
    try {
      const finalServices = [...formData.services];
      if (formData.otherServiceText.trim()) {
        finalServices.push(`Sonstiges: ${formData.otherServiceText.trim()}`);
      }

      const { error } = await supabase.from('care_requests').insert([{
        role: 'care_seeker',
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: finalServices,
        district: formData.district,
        package: formData.selectedPackage,
        target_group: formData.targetGroup,
        source: formData.source,
        status: 'submitted'
      }]);

      if (error) throw error;

      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'care_seeker',
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          district: formData.district,
          services: finalServices,
          package: formData.selectedPackage,
          target_group: formData.targetGroup,
          source: formData.source,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Fehler beim Speichern der Pflege-Anfrage:', err);
      alert('Es gab ein Problem beim Absenden. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="max-w-lg w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1B4D3E] text-[#86EFAC] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(27,77,62,0.4)]">
            <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">Vielen Dank!</h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">Deine Anfrage ist bei uns eingegangen. Wir melden uns schnellstmöglich bei dir!</p>
          <div className="inline-block px-6 py-3 rounded-2xl bg-white/10 text-emerald-400 font-semibold text-sm border border-white/10">Du kannst dieses Fenster jetzt schließen.</div>
        </div>
      </main>
    );
  }

  const isOtherSelected = formData.services.includes('Sonstiges');
  const isEmailInvalid = emailTouched && formData.email.length > 0 && !isValidEmail(formData.email);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white py-6 sm:py-12 px-4 flex flex-col items-center selection:bg-emerald-200">
      <div className="max-w-xl w-full text-center mb-6 sm:mb-10">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <span className="text-3xl font-bold tracking-tight text-[#0A2E23] font-serif">Helpify</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Unterstützung im Alltag finden</h1>
        <p className="text-slate-600 text-base sm:text-xl">Erhalte persönliche Unterstützung für dich oder deine Angehörigen.</p>
      </div>

      <div className="max-w-xl w-full bg-white rounded-3xl p-5 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-6 sm:mb-8 mt-2">
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Schritt {step} von 3</span>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Wo benötigst du Hilfe?</h2>
            <div className="grid grid-cols-1 gap-3.5 mb-6">
              {serviceOptions.map(s => {
                const isSelected = formData.services.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`flex items-center p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                    <span className="text-2xl mr-4">{s.icon}</span>
                    <div>
                      <span className="block font-bold text-slate-800">{s.title}</span>
                      <span className="block text-xs text-slate-500">{s.desc}</span>
                    </div>
                  </button>
                );
              })}
              <button type="button" onClick={() => toggleService('Sonstiges')} className={`flex items-center p-4 rounded-2xl border-2 text-left transition-all ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                <span className="text-2xl mr-4">💡</span>
                <div>
                  <span className="block font-bold text-slate-800">Sonstiges</span>
                  <span className="block text-xs text-slate-500">Individuelle Wünsche</span>
                </div>
              </button>
            </div>

            {isOtherSelected && (
              <div className="mb-6">
                <input type="text" placeholder="Beschreibe kurz deine Wünsche..." value={formData.otherServiceText} onChange={e => setFormData({...formData, otherServiceText: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900" />
              </div>
            )}

            <button type="button" onClick={() => setStep(2)} disabled={formData.services.length === 0} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 disabled:opacity-40">Weiter →</button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Details & Ort</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Für wen suchst du?</label>
                <select value={formData.targetGroup} onChange={e => setFormData({...formData, targetGroup: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium">
                  {targetGroupOptions.map(tg => <option key={tg} value={tg}>{tg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">In welchem Bezirk?</label>
                <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium">
                  {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl">Zurück</button>
              <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600">Weiter →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in duration-500">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">Gewünschter Umfang</label>
                <div className="grid grid-cols-1 gap-2">
                  {packageOptions.map(pkg => (
                    <button key={pkg} type="button" onClick={() => setFormData({...formData, selectedPackage: pkg})} className={`p-3 rounded-xl border-2 font-semibold text-xs text-left ${formData.selectedPackage === pkg ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-600'}`}>{pkg}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                  <input required type="text" placeholder="Vor- & Nachname" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Mail</label>
                  <input required type="email" placeholder="name@beispiel.at" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} onBlur={() => setEmailTouched(true)} className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 ${isEmailInvalid ? 'border-red-400' : 'border-slate-200'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefonnummer</label>
                  <input required type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900" />
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <input required type="checkbox" id="privacy" checked={formData.privacyAccepted} onChange={e => setFormData({...formData, privacyAccepted: e.target.checked})} className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600" />
                  <label htmlFor="privacy" className="text-xs text-slate-600">Ich stimme den Datenschutzbestimmungen zu.</label>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 text-slate-600 font-bold py-4 rounded-2xl">Zurück</button>
                <button disabled={loading || !formData.privacyAccepted || !isValidEmail(formData.email)} type="submit" className="w-2/3 bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-500 disabled:opacity-70">{loading ? 'Wird gesendet...' : 'Abschicken 🚀'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}