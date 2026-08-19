'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ClientDashboardProps {
  user?: { id?: string; name: string; email: string; phone?: string };
}

export default function ClientDashboard({ user = { name: 'Max Mustermann', email: 'max@beispiel.at', phone: '+43 660 1234567' } }: ClientDashboardProps) {
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Echtes Guthaben aus der Datenbank
  const [hoursBalance, setHoursBalance] = useState({ total: 0, used: 0 });

  // Guthaben und Profildaten beim Laden der Komponente abrufen
  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('total_hours, used_hours')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setHoursBalance({
          total: data.total_hours || 0,
          used: data.used_hours || 0,
        });
      }
    }

    fetchUserData();
  }, [user?.id]);

  const [formData, setFormData] = useState({
    services: [] as string[],
    otherServiceText: '',
    district: '1. Innere Stadt',
    selectedPackage: 'Starter-Paket (4 Std. • 99 €)',
    targetGroup: 'Für mich selbst',
    source: 'dashboard',
  });

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
    { id: 'Starter', name: 'Starter-Paket', hours: '4 Stunden', price: '99 €', desc: 'Ideal für den Einstieg' },
    { id: 'Flex', name: 'Flex-Paket', hours: '10 Stunden', price: '239 €', desc: 'Der Bestseller für regelmäßige Hilfe' }
  ];

  const targetGroupOptions = ['Für mich selbst', 'Für meine Eltern / Angehörigen', 'Für Bekannte'];

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
    setLoading(true);
    try {
      const finalServices = [...formData.services];
      if (formData.otherServiceText.trim()) {
        finalServices.push(`Sonstiges: ${formData.otherServiceText.trim()}`);
      }

      const { error } = await supabase.from('care_requests').insert([{
        user_id: user.id || null,
        role: 'care_seeker',
        name: user.name,
        email: user.email,
        phone: user.phone || '',
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
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: formData.district,
          services: finalServices,
          package: formData.selectedPackage,
          target_group: formData.targetGroup,
          source: formData.source,
        }),
      });

      const stripeRes = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: formData.selectedPackage,
          email: user.email,
          name: user.name,
        }),
      });

      const responseText = await stripeRes.text();
      let stripeData;
      try {
        stripeData = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error('Server hat keine gültige JSON-Antwort geliefert.');
      }

      if (!stripeRes.ok) throw new Error(stripeData.error || 'Fehler beim Erstellen der Checkout-Session');

      if (stripeData.url) {
        window.location.href = stripeData.url;
      } else {
        throw new Error('Konnte keine Checkout-Session erstellen');
      }

    } catch (err: any) {
      console.error('Fehler beim Speichern:', err);
      alert(`Es gab ein Problem: ${err.message || 'Bitte versuche es erneut.'}`);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowWizard(false);
    setStep(1);
  };

  const isOtherSelected = formData.services.includes('Sonstiges');
  const remainingHours = Math.max(0, hoursBalance.total - hoursBalance.used);
  const percentageRemaining = hoursBalance.total > 0 ? Math.round((remainingHours / hoursBalance.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10 selection:bg-emerald-200">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Willkommen zurück, {user.name}! 👋</h1>
        <p className="text-slate-500">Hier behältst du den Überblick über dein verbleibendes Guthaben und deine Anfragen.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Dein Guthaben</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black text-emerald-950">{remainingHours} Std.</span>
              <span className="text-slate-500 text-xs font-medium">von {hoursBalance.total} Std.</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentageRemaining}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Flexibel nutzbar ohne Abonnement.</p>
        </div>

        <div className="col-span-1 md:col-span-2 bg-[#1B4D3E] p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50">
              Direkt buchen
            </span>
            <h2 className="text-2xl font-bold mt-3 mb-2">Neue Unterstützung anfordern</h2>
            <p className="text-emerald-100/90 text-sm mb-6">Wähle einfach deine gewünschten Leistungen und den Zeitraum aus.</p>
          </div>
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-white text-[#1B4D3E] px-6 py-3.5 rounded-2xl font-bold w-fit hover:bg-emerald-50 transition-colors shadow-md"
          >
            Fragebogen starten →
          </button>
        </div>
      </div>

      {showWizard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          onClick={handleClose}
        >
          <div 
            className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors z-10 font-bold"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-[#1B4D3E] text-[#86EFAC] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20">
                  ✓
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Vielen Dank, {user.name}!</h2>
                <p className="text-slate-600 text-sm mb-8">Deine Anfrage ist eingegangen. Wir leiten dich zur Buchung weiter...</p>
              </div>
            ) : (
              <>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-3xl overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>

                <div className="flex justify-between items-center mb-6 mt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hilfe-Anfrage</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-8">Schritt {step} von 3</span>
                </div>

                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Wo benötigst du Hilfe?</h2>
                    <p className="text-slate-500 text-xs mb-4">Wähle alle passenden Bereiche aus.</p>
                    
                    <div className="grid grid-cols-1 gap-2.5 mb-4">
                      {serviceOptions.map(s => {
                        const isSelected = formData.services.includes(s.id);
                        return (
                          <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`relative flex items-center p-3 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                            <span className="text-xl mr-3 bg-slate-50 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">{s.icon}</span>
                            <div className="flex-1 pr-6">
                              <span className="block font-bold text-sm text-slate-800">{s.title}</span>
                              <span className="block text-xs text-slate-500">{s.desc}</span>
                            </div>
                          </button>
                        );
                      })}

                      <button type="button" onClick={() => toggleService('Sonstiges')} className={`relative flex items-center p-3 rounded-2xl border-2 text-left transition-all ${isOtherSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                        <span className="text-xl mr-3 bg-slate-50 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">💡</span>
                        <div className="flex-1 pr-6">
                          <span className="block font-bold text-sm text-slate-800">Sonstiges</span>
                          <span className="block text-xs text-slate-500">Individuelle Wünsche & Anliegen</span>
                        </div>
                      </button>
                    </div>

                    {isOtherSelected && (
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Beschreibe deine Wünsche kurz:</label>
                        <textarea rows={2} placeholder="z. B. Begleitung zu einem bestimmten Ausflug..." value={formData.otherServiceText} onChange={e => setFormData({...formData, otherServiceText: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs outline-none focus:bg-white focus:border-emerald-500 resize-none" />
                      </div>
                    )}

                    <button type="button" onClick={() => { if (formData.services.length > 0) setStep(2); }} disabled={formData.services.length === 0} className="w-full bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl disabled:opacity-40">
                      Weiter →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Ort & Zielgruppe</h2>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Für wen?</label>
                        <div className="grid grid-cols-1 gap-2">
                          {targetGroupOptions.map(tg => (
                            <button key={tg} type="button" onClick={() => setFormData({...formData, targetGroup: tg})} className={`p-3 rounded-xl border-2 text-left text-xs font-semibold ${formData.targetGroup === tg ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}>
                              {tg}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative" ref={dropdownRef}>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Bezirk</label>
                        <button type="button" onClick={() => setIsDistrictOpen(!isDistrictOpen)} className="w-full flex justify-between px-4 py-3 bg-white border-2 border-emerald-500 rounded-xl text-xs font-bold">
                          <span>{formData.district}</span>
                          <span>▼</span>
                        </button>
                        {isDistrictOpen && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl max-h-40 overflow-y-auto p-1">
                            {districtOptions.map(d => (
                              <button key={d} type="button" onClick={() => { setFormData({...formData, district: d}); setIsDistrictOpen(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg">
                                {d}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 font-bold py-3.5 rounded-2xl text-sm">Zurück</button>
                      <button type="button" onClick={() => setStep(3)} className="w-2/3 bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl text-sm">Umfang wählen →</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-slate-900 mb-1">Paket wählen</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                        {packageOptions.map((pkg) => {
                          const isSelected = formData.selectedPackage.startsWith(pkg.name);
                          return (
                            <button key={pkg.id} type="button" onClick={() => setFormData({...formData, selectedPackage: `${pkg.name} (${pkg.hours} • ${pkg.price})`})} className={`p-3 rounded-2xl border-2 text-left ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}>
                              <span className="block font-bold text-sm">{pkg.name}</span>
                              <span className="block text-xs text-emerald-600 font-bold">{pkg.hours}</span>
                              <span className="block text-xs font-black mt-2">{pkg.price}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Eingeloggt als</span>
                        <p className="text-xs font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email} {user.phone && `• ${user.phone}`}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 font-bold py-3.5 rounded-2xl text-sm">Zurück</button>
                      <button disabled={loading} type="submit" className="w-2/3 bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-50">
                        {loading ? 'Wird geladen...' : 'Anfrage abschicken 🚀'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}