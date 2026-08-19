'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CaregiverRegisterWizardProps {
  onClose: () => void;
}

export default function CaregiverRegisterWizard({ onClose }: CaregiverRegisterWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [formData, setFormData] = useState({
    tasks: [] as string[],
    otherTaskText: '',
    districts: [] as string[],
    hoursPerWeek: '2-5 Std./Woche',
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

  const taskOptions = [
    { id: 'Einkäufe & Besorgungen', icon: '🛒', title: 'Einkäufe & Besorgungen', desc: 'Unterstützung beim wöchentlichen Einkauf' },
    { id: 'Gesellschaft & Spaziergänge', icon: '☀️', title: 'Gesellschaft & Spaziergänge', desc: 'Gemeinsame Zeit & frische Luft' },
    { id: 'Leichte Haushaltshilfe', icon: '✨', title: 'Leichte Haushaltshilfe', desc: 'Hilfe im Haushalt & Ordnung halten' },
    { id: 'Terminbegleitung', icon: '🤝', title: 'Terminbegleitung', desc: 'Sicherer Begleitschutz zum Arzt oder Ämtern' }
  ];

  const districtOptions = [
    { id: '1', label: '1. Innere Stadt' }, { id: '2', label: '2. Leopoldstadt' }, { id: '3', label: '3. Landstraße' },
    { id: '4', label: '4. Wieden' }, { id: '5', label: '5. Margareten' }, { id: '6', label: '6. Mariahilf' },
    { id: '7', label: '7. Neubau' }, { id: '8', label: '8. Josefstadt' }, { id: '9', label: '9. Alsergrund' },
    { id: '10', label: '10. Favoriten' }, { id: '11', label: '11. Simmering' }, { id: '12', label: '12. Meidling' },
    { id: '13', label: '13. Hietzing' }, { id: '14', label: '14. Penzing' }, { id: '15', label: '15. Rudolfsheim-Fünfhaus' },
    { id: '16', label: '16. Ottakring' }, { id: '17', label: '17. Hernals' }, { id: '18', label: '18. Währing' },
    { id: '19', label: '19. Döbling' }, { id: '20', label: '20. Brigittenau' }, { id: '21', label: '21. Floridsdorf' },
    { id: '22', label: '22. Donaustadt' }, { id: '23', label: '23. Liesing' }
  ];

  const hoursOptions = ['2-5 Std./Woche', '5-10 Std./Woche', '10-20 Std./Woche', 'Vollzeit / Flexibel'];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const toggleTask = (taskId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tasks: prev.tasks.includes(taskId) ? prev.tasks.filter(t => t !== taskId) : [...prev.tasks, taskId] 
    }));
  };

  const toggleDistrict = (districtLabel: string) => {
    setFormData(prev => ({ 
      ...prev, 
      districts: prev.districts.includes(districtLabel) ? prev.districts.filter(d => d !== districtLabel) : [...prev.districts, districtLabel] 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!formData.privacyAccepted || !isValidEmail(formData.email)) return;
    setLoading(true);
    try {
      const finalTasks = [...formData.tasks];
      if (formData.otherTaskText.trim()) {
        finalTasks.push(`Sonstiges: ${formData.otherTaskText.trim()}`);
      }

      const { error } = await supabase.from('care_requests').insert([{
        role: 'caregiver',
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        services: finalTasks,
        district: formData.districts.join(', '),
        hours_per_week: formData.hoursPerWeek,
        source: formData.source,
        status: 'submitted'
      }]);

      if (error) throw error;

      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'caregiver',
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          district: formData.districts.join(', '),
          services: finalTasks,
          hours_per_week: formData.hoursPerWeek,
          source: formData.source,
        }),
      });

      setSubmitted(true);
      router.push('/dashboard/mvppage');
    } catch (err) {
      console.error('Fehler beim Speichern der Helfer-Bewerbung:', err);
      alert('Es gab ein Problem beim Absenden. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const isOtherSelected = formData.tasks.includes('Sonstiges');
  const isEmailInvalid = emailTouched && formData.email.length > 0 && !isValidEmail(formData.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto selection:bg-emerald-200">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Schließen Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Schließen"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-[#1B4D3E] text-[#86EFAC] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Vielen Dank!</h2>
            <p className="text-slate-600 text-sm sm:text-base mb-8 leading-relaxed">
              Deine Bewerbung als Alltagsheld ist sicher eingegangen. Wir melden uns in Kürze bei dir!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-bold py-4 rounded-2xl transition-colors"
            >
              Fenster schließen
            </button>
          </div>
        ) : (
          <>
            {/* Ladebalken */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-3xl overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#1B4D3E] text-[#86EFAC] flex items-center justify-center font-bold text-xs">
                  H
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Helfer-Bewerbung</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-8">Schritt {step} von 3</span>
            </div>

            {/* SCHRITT 1 */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Wie möchtest du helfen?</h2>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">
                    ✨ Mehrfachauswahl möglich
                  </span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm mb-6">Wähle alle Tätigkeiten aus, die zu dir passen.</p>
                
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {taskOptions.map(t => {
                    const isSelected = formData.tasks.includes(t.id);
                    return (
                      <button key={t.id} type="button" onClick={() => toggleTask(t.id)} className={`relative flex items-center p-3.5 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                        <span className="text-2xl mr-3 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">{t.icon}</span>
                        <div className="flex-1 pr-6">
                          <span className={`block font-bold text-sm sm:text-base ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>{t.title}</span>
                          <span className="block text-xs text-slate-500 leading-snug">{t.desc}</span>
                        </div>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                          {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </button>
                    );
                  })}

                  <button type="button" onClick={() => toggleTask('Sonstiges')} className={`relative flex items-center p-3.5 rounded-2xl border-2 text-left transition-all ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                    <span className="text-2xl mr-3 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">💡</span>
                    <div className="flex-1 pr-6">
                      <span className={`block font-bold text-sm sm:text-base ${isOtherSelected ? 'text-emerald-950' : 'text-slate-800'}`}>Sonstiges</span>
                      <span className="block text-xs text-slate-500 leading-snug">Eigene Fähigkeiten oder Wünsche angeben</span>
                    </div>
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isOtherSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                      {isOtherSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                </div>

                {isOtherSelected && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Was möchtest du noch anbieten?</label>
                    <input type="text" placeholder="z. B. Gartenarbeit, Technik-Hilfe..." value={formData.otherTaskText} onChange={e => setFormData({...formData, otherTaskText: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={() => { if (formData.tasks.length > 0) setStep(2); }} 
                  disabled={formData.tasks.length === 0}
                  className="w-full bg-[#1B4D3E] text-white font-bold py-4 rounded-2xl hover:bg-[#143B2F] transition-colors disabled:opacity-40"
                >
                  Weiter zum Einsatzgebiet →
                </button>
              </div>
            )}

            {/* SCHRITT 2 */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">In welchen Bezirken?</h2>
                <p className="text-slate-500 text-xs sm:text-sm mb-6">Wähle deine bevorzugten Wiener Bezirke aus.</p>
                
                <div className="grid grid-cols-2 gap-2 mb-6 max-h-[260px] overflow-y-auto pr-1">
                  {districtOptions.map(d => {
                    const isSelected = formData.districts.includes(d.label);
                    return (
                      <button key={d.id} type="button" onClick={() => toggleDistrict(d.label)} className={`p-3 rounded-xl border-2 text-left transition-all text-xs font-bold ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-slate-100 text-slate-700 bg-white hover:border-slate-200'}`}>
                        {d.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm transition-colors">Zurück</button>
                  <button type="button" disabled={formData.districts.length === 0} onClick={() => setStep(3)} className="w-2/3 bg-[#1B4D3E] text-white font-bold text-sm py-4 rounded-2xl hover:bg-[#143B2F] transition-colors disabled:opacity-40">Zeitrahmen →</button>
                </div>
              </div>
            )}

            {/* SCHRITT 3 */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Zeitinvestment</h2>
                    <p className="text-slate-500 text-xs mb-3">Wie viel Zeit möchtest du investieren?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {hoursOptions.map(opt => (
                        <button key={opt} type="button" onClick={() => setFormData({...formData, hoursPerWeek: opt})} className={`p-3 rounded-xl border-2 font-semibold text-xs transition-all text-center ${formData.hoursPerWeek === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-slate-100 text-slate-600 bg-white hover:border-slate-200'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-1">Kontaktdaten</h2>
                  <p className="text-slate-500 text-xs mb-4">Wohin dürfen wir dir Infos senden?</p>
                  
                  <div className="space-y-3.5 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vollständiger Name</label>
                      <input required type="text" placeholder="Maria Musterfrau" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-Mail-Adresse</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="maria@beispiel.at" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        onBlur={() => setEmailTouched(true)}
                        className={`w-full px-4 py-3 bg-slate-50/50 border rounded-2xl text-slate-900 text-sm outline-none transition-colors ${
                          isEmailInvalid 
                            ? 'border-red-400 focus:border-red-500' 
                            : 'border-slate-200 focus:border-emerald-500'
                        }`} 
                      />
                      {isEmailInvalid && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          Bitte gib eine gültige E-Mail-Adresse ein.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Handynummer</label>
                      <input required type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <input required type="checkbox" id="privacy-caregiver" checked={formData.privacyAccepted} onChange={e => setFormData({...formData, privacyAccepted: e.target.checked})} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                      <label htmlFor="privacy-caregiver" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                        Ich stimme den <a href="/datenschutz" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-emerald-700 underline font-semibold">Datenschutzbestimmungen</a> zu.
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm transition-colors">Zurück</button>
                    <button 
                      disabled={loading || !formData.privacyAccepted || !isValidEmail(formData.email)} 
                      type="submit" 
                      className="w-2/3 bg-[#1B4D3E] text-white font-bold text-sm py-4 rounded-2xl hover:bg-[#143B2F] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Wird gesendet...' : 'Abschicken 🚀'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}