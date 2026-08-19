'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ClientRegisterWizardProps {
  onClose?: () => void; // Optional gemacht, damit es ohne 'onClose' nicht crasht
}

export default function ClientRegisterWizard({ onClose }: ClientRegisterWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    services: [] as string[],
    otherServiceText: '',
    district: '1. Innere Stadt',
    selectedPackage: 'Basis (2–5 Std./Woche • 24 €/Std.)',
    targetGroup: 'Für mich selbst',
    fullName: '',
    email: '',
    phone: '',
    privacyAccepted: false,
    source: 'direct',
  });

  // Wiederherstellung des Formularzustands aus dem sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('care_seeker_wizard_state');
    if (savedState) {
      try {
        const { savedFormData, savedStep } = JSON.parse(savedState);
        if (savedFormData) setFormData(savedFormData);
        if (savedStep) setStep(savedStep);
      } catch (e) {
        console.error('Fehler beim Laden des gespeicherten Zustands', e);
      }
    }
  }, []);

  // Automatisches Speichern des Formularzustands bei Änderungen
  useEffect(() => {
    sessionStorage.setItem('care_seeker_wizard_state', JSON.stringify({ savedFormData: formData, savedStep: step }));
  }, [formData, step]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source') || params.get('ref');
    if (sourceParam) {
      setFormData(prev => ({ ...prev, source: sourceParam }));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDistrictOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const serviceOptions = [
    { id: 'Einkäufe & Besorgungen', icon: '🛒', title: 'Einkäufe & Besorgungen', desc: 'Unterstützung beim wöchentlichen Einkauf' },
    { id: 'Gesellschaft & Spaziergänge', icon: '☀️', title: 'Gesellschaft & Spaziergänge', desc: 'Gemeinsame Zeit & frische Luft' },
    { id: 'Leichte Haushaltshilfe', icon: '✨', title: 'Leichte Haushaltshilfe', desc: 'Hilfe im Haushalt & Ordnung halten' },
    { id: 'Terminbegleitung', icon: '🤝', title: 'Terminbegleitung', desc: 'Sicherer Begleitschutz zum Arzt oder Ämtern' }
  ];

  const districtOptions = [
    '1. Innere Stadt', '2. Leopoldstadt', '3. Landstraße', '4. Wieden', '5. Margareten',
    '6. Mariahilf', '7. Neubau', '8. Josefstadt', '9. Alsergrund', '10. Favoriten',
    '11. Simmering', '12. Meidling', '13. Hietzing', '14. Penzing', '15. Rudolfsheim-Fünfhaus',
    '16. Ottakring', '17. Hernals', '18. Währing', '19. Döbling', '20. Brigittenau',
    '21. Floridsdorf', '22. Donaustadt', '23. Liesing'
  ];

  const packageOptions = [
    { id: 'Basis', name: 'Basis', hours: '2–5 Std. / Woche', price: '24 € / Std.', desc: 'Verlässliche Alltagshilfe' },
    { id: 'Komfort', name: 'Komfort', hours: '5–10 Std. / Woche', price: '22 € / Std.', desc: 'Erweiterte Hilfe & Begleitung' },
    { id: 'Intensiv', name: 'Intensiv', hours: '10+ Std. / Woche', price: '20 € / Std.', desc: 'Umfassende Betreuung' }
  ];

  const targetGroupOptions = ['Für mich selbst', 'Für meine Eltern / Angehörigen', 'Für Bekannte'];

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
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

      sessionStorage.removeItem('care_seeker_wizard_state');
      setSubmitted(true);
      router.push('/dashboard/mvppage');
    } catch (err) {
      console.error('Fehler beim Speichern der Pflege-Anfrage:', err);
      alert('Es gab ein Problem beim Absenden. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  // ZENTRALE SCHLIESS-FUNKTION (Abgesichert)
  const handleClose = () => {
    sessionStorage.removeItem('care_seeker_wizard_state');
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const isOtherSelected = formData.services.includes('Sonstiges');
  const isEmailInvalid = emailTouched && formData.email.length > 0 && !isValidEmail(formData.email);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto selection:bg-emerald-200"
      onClick={handleClose}
    >
      <div 
        className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Schließen Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors z-10 font-bold"
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
              Deine Anfrage ist bei uns eingegangen. Wir melden uns schnellstmöglich bei dir!
            </p>
            <button
              onClick={handleClose}
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
                  C
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hilfe-Anfrage</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-8">Schritt {step} von 3</span>
            </div>

            {/* SCHRITT 1 */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Wo benötigst du Hilfe?</h2>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 w-fit">
                    ✨ Mehrfachauswahl möglich
                  </span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm mb-6">Wähle alle Bereiche aus, bei denen du Unterstützung suchst.</p>
                
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {serviceOptions.map(s => {
                    const isSelected = formData.services.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`relative flex items-center p-3.5 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                        <span className="text-2xl mr-3 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">{s.icon}</span>
                        <div className="flex-1 pr-6">
                          <span className={`block font-bold text-sm sm:text-base ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>{s.title}</span>
                          <span className="block text-xs text-slate-500 leading-snug">{s.desc}</span>
                        </div>
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                          {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </button>
                    );
                  })}

                  <button type="button" onClick={() => toggleService('Sonstiges')} className={`relative flex items-center p-3.5 rounded-2xl border-2 text-left transition-all ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                    <span className="text-2xl mr-3 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">💡</span>
                    <div className="flex-1 pr-6">
                      <span className={`block font-bold text-sm sm:text-base ${isOtherSelected ? 'text-emerald-950' : 'text-slate-800'}`}>Sonstiges</span>
                      <span className="block text-xs text-slate-500 leading-snug">Individuelle Wünsche & Anliegen</span>
                    </div>
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isOtherSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent'}`}>
                      {isOtherSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                </div>

                {isOtherSelected && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Beschreibe kurz deine Wünsche</label>
                    <input type="text" placeholder="z. B. Begleitung bei Ausflügen..." value={formData.otherServiceText} onChange={e => setFormData({...formData, otherServiceText: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={() => { if (formData.services.length > 0) setStep(2); }} 
                  disabled={formData.services.length === 0}
                  className="w-full bg-[#1B4D3E] text-white font-bold py-4 rounded-2xl hover:bg-[#143B2F] transition-colors disabled:opacity-40"
                >
                  Weiter →
                </button>
              </div>
            )}

            {/* SCHRITT 2 */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Ort & Zielgruppe</h2>
                <p className="text-slate-500 text-xs sm:text-sm mb-6">Gib an, für wen und wo die Unterstützung benötigt wird.</p>

                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Für wen suchst du?</label>
                    <div className="grid grid-cols-1 gap-2">
                      {targetGroupOptions.map(tg => (
                        <button key={tg} type="button" onClick={() => setFormData({...formData, targetGroup: tg})} className={`p-3 rounded-xl border-2 text-left text-xs sm:text-sm font-semibold transition-all ${formData.targetGroup === tg ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200'}`}>
                          {tg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold text-slate-700 mb-2">In welchem Bezirk?</label>
                    <button
                      type="button"
                      onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-emerald-500 rounded-xl text-left text-slate-900 font-bold text-xs sm:text-sm shadow-sm focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600">📍</span>
                        <span>{formData.district}</span>
                      </div>
                      <span className={`text-slate-400 text-xs transition-transform duration-200 ${isDistrictOpen ? 'rotate-180' : ''}`}>▲</span>
                    </button>

                    {isDistrictOpen && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-52 overflow-y-auto p-1.5 space-y-1">
                        {districtOptions.map(d => {
                          const isSelected = formData.district === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, district: d });
                                setIsDistrictOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                                isSelected ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{d}</span>
                              {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-4 rounded-2xl text-sm transition-colors">Zurück</button>
                  <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-[#1B4D3E] text-white font-bold text-sm py-4 rounded-2xl hover:bg-[#143B2F] transition-colors">Umfang wählen →</button>
                </div>
              </div>
            )}

            {/* SCHRITT 3 */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Gewünschter Umfang</h2>
                    <p className="text-slate-500 text-xs mb-3">Wähle das passendste Betreuungspaket.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {packageOptions.map((pkg) => {
                        const isSelected = formData.selectedPackage.startsWith(pkg.name);
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, selectedPackage: `${pkg.name} (${pkg.hours} • ${pkg.price})` })}
                            className={`relative p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                                : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div>
                              <span className="block font-bold text-slate-900 text-sm mb-0.5">{pkg.name}</span>
                              <span className="block text-[11px] font-bold text-emerald-600 mb-1">{pkg.hours}</span>
                              <p className="text-[11px] text-slate-500 leading-tight mb-3">{pkg.desc}</p>
                            </div>
                            <div className="pt-1.5 border-t border-slate-100">
                              <span className="text-xs font-black text-slate-900">{pkg.price}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-1">Kontaktdaten</h2>
                  <p className="text-slate-500 text-xs mb-4">Wohin dürfen wir dir Rückmeldung geben?</p>
                  
                  <div className="space-y-3.5 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vollständiger Name</label>
                      <input required type="text" placeholder="Vor- & Nachname" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-Mail-Adresse</label>
                      <input 
                        required 
                        type="email" 
                        placeholder="name@beispiel.at" 
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
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telefonnummer</label>
                      <input required type="tel" placeholder="+43 660 1234567" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-slate-900 text-sm outline-none" />
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <input required type="checkbox" id="privacy-client" checked={formData.privacyAccepted} onChange={e => setFormData({...formData, privacyAccepted: e.target.checked})} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                      <label htmlFor="privacy-client" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                        Ich stimme den{' '}
                        <a 
                          href="/datenschutz" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={e => e.stopPropagation()} 
                          className="text-emerald-700 underline font-semibold"
                        >
                          Datenschutzbestimmungen
                        </a>{' '}
                        zu.
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