'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabase, isValidEmail, isValidPhone, logSubmitError, notifyTeam, submitErrorMessage } from '@/lib/supabase';

export default function CaregiverApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    tasks: [] as string[],
    otherTaskText: '',
    districts: [] as string[],
    hoursPerWeek: '2-5 Std./Woche',
    fullName: '',
    email: '',
    phone: '',
    privacyAccepted: false,
    selfEmployedConfirmed: false,
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
    { id: 'Terminbegleitung', icon: '🤝', title: 'Terminbegleitung', desc: 'Begleitung zu Arztterminen, Behörden & Ämtern' }
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

  const hoursOptions = ['2-5 Std./Woche', '5-10 Std./Woche', '10-20 Std./Woche', 'Mehr als 20 Std./Woche'];

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
  setPhoneTouched(true);
  setSubmitError('');
  if (!canSubmit) return;
  setLoading(true);
  try {
    const finalTasks = [...formData.tasks];
    if (formData.otherTaskText.trim()) {
      finalTasks.push(`Sonstiges: ${formData.otherTaskText.trim()}`);
    }

    const { error } = await getSupabase().from('care_requests').insert([{
      role: 'caregiver',
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      services: finalTasks,
      district: formData.districts.join(', '),
      hours_per_week: formData.hoursPerWeek,
      status: 'submitted'
    }]);

    if (error) throw error;

    // 📩 E-Mail-Benachrichtigung im Hintergrund – die Registrierung ist bereits gespeichert,
    // ein Mailfehler darf daher keine Fehlermeldung (und doppelte Einträge) auslösen.
    notifyTeam({
      role: 'caregiver',
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      district: formData.districts.join(', '),
      services: finalTasks,
      hours_per_week: formData.hoursPerWeek,
      source: formData.source,
      self_employed_confirmed: formData.selfEmployedConfirmed,
    });

    setSubmitted(true);
  } catch (err) {
    logSubmitError('Fehler beim Speichern der Helfer-Registrierung', err);
    setSubmitError(submitErrorMessage(err));
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
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">Vielen Dank!</h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">Deine Registrierung als selbständige:r Alltagshelfer:in ist sicher eingegangen. Wir melden uns in Kürze für ein Kennenlerngespräch und die nächsten Schritte (Nachweise, Gewerbeberechtigung) bei dir!</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-400 font-semibold text-sm border border-white/10 transition">Zurück zur Startseite</Link>
        </div>
      </main>
    );
  }

  const isOtherSelected = formData.tasks.includes('Sonstiges');
  const isEmailInvalid = emailTouched && formData.email.length > 0 && !isValidEmail(formData.email);
  const isPhoneInvalid = phoneTouched && formData.phone.length > 0 && !isValidPhone(formData.phone);
  const canSubmit =
    formData.fullName.trim().length > 1 &&
    isValidEmail(formData.email) &&
    isValidPhone(formData.phone) &&
    formData.privacyAccepted &&
    formData.selfEmployedConfirmed;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white py-6 sm:py-12 px-4 flex flex-col items-center selection:bg-emerald-200">
      
      {/* Header Bereich mit Helpify Logo */}
      <div className="max-w-xl w-full text-center mb-6 sm:mb-10">
        <Link href="/" aria-label="Zur Startseite" className="flex items-center justify-center gap-2.5 mb-6 w-fit mx-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <span className="text-3xl font-bold tracking-tight text-[#0A2E23] font-serif">Helpify</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm mb-4 border border-emerald-200 shadow-sm">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span>
          Exklusiver Pilotbetrieb für Alltagshelden
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Sinn stiften. Selbständig helfen. <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Als Alltagshelfer:in in Wien.</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-xl">Unterstütze ältere Menschen in deiner Nachbarschaft – als selbständige:r Personenbetreuer:in mit eigenen Zeiten und eigenen Preisen. <strong>Keine Provision:</strong> Dein Honorar gehört dir.</p>
      </div>

      {/* Formular Box */}
      <div className="max-w-xl w-full bg-white rounded-3xl p-5 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-6 sm:mb-8 mt-2">
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Schritt {step} von 3</span>
          <div className="w-9 h-9 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
        </div>

        {/* SCHRITT 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="flex flex-col gap-1 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Wie möchtest du helfen?</h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">✨ Mehrfachauswahl möglich</span>
            </div>
            <p className="text-slate-500 text-sm sm:text-base mb-6">Wähle alle Tätigkeiten aus, die zu dir passen.</p>
            
            <div className="grid grid-cols-1 gap-3.5 mb-6">
              {taskOptions.map(t => {
                const isSelected = formData.tasks.includes(t.id);
                return (
                  <button key={t.id} type="button" onClick={() => toggleTask(t.id)} className={`relative flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                    <span className="text-2xl sm:text-3xl mr-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">{t.icon}</span>
                    <div className="flex-1 pr-6">
                      <span className={`block font-bold text-base sm:text-lg mb-0.5 ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{t.title}</span>
                      <span className="block text-xs sm:text-sm text-slate-500 leading-snug">{t.desc}</span>
                    </div>
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                      {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                );
              })}

              <button type="button" onClick={() => toggleTask('Sonstiges')} className={`relative flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
                <span className="text-2xl sm:text-3xl mr-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">💡</span>
                <div className="flex-1 pr-6">
                  <span className={`block font-bold text-base sm:text-lg mb-0.5 ${isOtherSelected ? 'text-emerald-900' : 'text-slate-800'}`}>Sonstiges</span>
                  <span className="block text-xs sm:text-sm text-slate-500 leading-snug">Eigene Fähigkeiten oder Wünsche angeben</span>
                </div>
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isOtherSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                  {isOtherSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            </div>

            {isOtherSelected && (
              <div className="mb-6 animate-fade-in">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Was möchtest du noch anbieten?</label>
                <input type="text" placeholder="z. B. Gartenarbeit, Technik-Hilfe..." value={formData.otherTaskText} onChange={e => setFormData({...formData, otherTaskText: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-slate-900 font-medium outline-none text-base" />
              </div>
            )}

            <button 
              type="button" 
              onClick={() => { if (formData.tasks.length > 0) setStep(2); }} 
              disabled={formData.tasks.length === 0}
              className="w-full bg-slate-900 text-white font-bold text-base sm:text-lg py-4 rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-40 shadow-md"
            >
              Weiter zum Einsatzgebiet →
            </button>
          </div>
        )}

        {/* SCHRITT 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">In welchen Bezirken?</h2>
            <p className="text-slate-500 text-sm sm:text-base mb-6">Wähle deine bevorzugten Wiener Bezirke aus.</p>
            
            <div className="grid grid-cols-2 gap-2.5 mb-6 max-h-[300px] overflow-y-auto pr-1">
              {districtOptions.map(d => {
                const isSelected = formData.districts.includes(d.label);
                return (
                  <button key={d.id} type="button" onClick={() => toggleDistrict(d.label)} className={`p-3.5 rounded-xl border-2 text-left transition-all text-xs sm:text-sm font-bold ${isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 text-slate-700 bg-white'}`}>
                    {d.label}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm sm:text-base transition-colors">Zurück</button>
              <button type="button" disabled={formData.districts.length === 0} onClick={() => setStep(3)} className="w-2/3 bg-slate-900 text-white font-bold text-sm sm:text-base py-4 rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-40 shadow-md">Zeitrahmen →</button>
            </div>
          </div>
        )}

        {/* SCHRITT 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Deine Verfügbarkeit</h2>
                <p className="text-slate-500 text-sm sm:text-base mb-4">Wie viel Zeit kannst du ungefähr anbieten? Du entscheidest jederzeit selbst, welche Aufträge du annimmst.</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {hoursOptions.map(opt => (
                    <button key={opt} type="button" onClick={() => setFormData({...formData, hoursPerWeek: opt})} className={`p-3.5 rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all text-center ${formData.hoursPerWeek === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-100 text-slate-600 bg-white'}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Fast geschafft!</h2>
              <p className="text-slate-500 text-sm sm:text-base mb-4">Wohin dürfen wir dir Infos senden?</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Vollständiger Name</label>
                  <input id="fullName" required autoComplete="name" type="text" placeholder="Maria Musterfrau" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 font-medium outline-none text-base" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">E-Mail-Adresse</label>
                  <input
                    id="email"
                    autoComplete="email"
                    required
                    type="email" 
                    placeholder="maria@beispiel.at" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    onBlur={() => setEmailTouched(true)}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 font-medium outline-none text-base focus:bg-white transition-colors ${
                      isEmailInvalid 
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                        : 'border-slate-200 focus:border-emerald-500'
                    }`} 
                  />
                  {isEmailInvalid && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium animate-fade-in">
                      Bitte gib eine gültige E-Mail-Adresse ein (z. B. name@domain.at).
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Handynummer</label>
                  <input id="phone" required autoComplete="tel" type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} onBlur={() => setPhoneTouched(true)} className={`w-full px-4 py-3.5 bg-slate-50 border focus:bg-white rounded-2xl text-slate-900 font-medium outline-none text-base ${isPhoneInvalid ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`} />
                  {isPhoneInvalid && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">Bitte gib eine gültige Telefonnummer ein (z. B. +43 660 1234567).</p>
                  )}
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1.5">
                  <p className="font-bold text-emerald-900">Gut zu wissen</p>
                  <p>Helpify ist reiner Vermittler. Du wirst nicht bei Helpify angestellt, sondern arbeitest als selbständige:r Personenbetreuer:in mit eigener Gewerbeberechtigung (§ 159 GewO) und eigener Sozialversicherung (SVS). Zeiten, Honorar und die Annahme von Aufträgen bestimmst du selbst; den Vertrag schließt du direkt mit deinen Kund:innen.</p>
                  <p>Vermittelt wird ausschließlich nicht-medizinische Alltagshilfe – keine pflegerischen Tätigkeiten nach dem GuKG (z. B. Medikamentengabe, Wundversorgung).</p>
                  <p>Noch keine Gewerbeberechtigung? Kein Problem – wir erklären dir im Erstgespräch, wie du sie anmeldest.</p>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input required type="checkbox" id="selfEmployed" checked={formData.selfEmployedConfirmed} onChange={e => setFormData({...formData, selfEmployedConfirmed: e.target.checked})} className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0" />
                  <label htmlFor="selfEmployed" className="text-xs sm:text-sm text-slate-600 leading-relaxed cursor-pointer">
                    Mir ist bewusst, dass ich über Helpify als <strong>selbständige:r Unternehmer:in</strong> tätig werde (kein Dienstverhältnis mit Helpify) und keine pflegerischen oder medizinischen Tätigkeiten übernehme.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input required type="checkbox" id="privacy" checked={formData.privacyAccepted} onChange={e => setFormData({...formData, privacyAccepted: e.target.checked})} className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0" />
                  <label htmlFor="privacy" className="text-xs sm:text-sm text-slate-600 leading-relaxed cursor-pointer">
                    Ich stimme zu, dass meine Angaben zur Vermittlung gemäß der <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">Datenschutzerklärung</a> verarbeitet werden.
                  </label>
                </div>
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">{submitError}</p>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm sm:text-base transition-colors">Zurück</button>
                <button 
                  disabled={loading || !canSubmit}
                  type="submit"
                  className="w-2/3 bg-emerald-600 text-white font-bold text-sm sm:text-base py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? 'Wird gesendet...' : 'Registrierung absenden 🚀'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Badges */}
      <div className="max-w-xl w-full flex flex-wrap justify-center items-center gap-3 mt-8 text-slate-500 text-xs sm:text-sm font-medium">
        <span className="flex items-center gap-1.5 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">🛡️ Keine Vermittlungsprovision</span>
        <span className="flex items-center gap-1.5 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">⚡ Selbstbestimmte Zeiten</span>
      </div>
    </main>
  );
}