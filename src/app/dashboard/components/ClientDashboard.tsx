'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ClientDashboardProps {
  user?: { id?: string; name?: string; email?: string; phone?: string };
}

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [hoursBalance, setHoursBalance] = useState({ total: 0, used: 0 });
  const [myRequests, setMyRequests] = useState<any[]>([]);

  // Formular-State inklusive Registrierungsdaten
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    services: [] as string[],
    otherServiceText: '',
    district: '1. Innere Stadt',
    selectedPackage: 'Starter-Paket (4 Std. • 99 €)',
    targetGroup: 'Für mich selbst',
    source: 'dashboard',
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;

      // 1. Guthaben holen[cite: 5]
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_hours, used_hours')
        .eq('id', user.id)
        .single();

      if (profile) {
        setHoursBalance({
          total: profile.total_hours || 0,
          used: profile.used_hours || 0,
        });
      }

      // 2. Offene Anfragen holen[cite: 5]
      const { data: requests } = await supabase
        .from('care_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requests) setMyRequests(requests);
    }

    fetchUserData();
  }, [user?.id]);

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
    { id: 'Starter', name: 'Starter-Paket', hours: '4 Stunden', price: '99 €' },
    { id: 'Flex', name: 'Flex-Paket', hours: '10 Stunden', price: '239 €' }
  ];

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
      let currentUserId = user?.id;
      let currentUserEmail = user?.email || formData.email;
      let currentUserName = user?.name || formData.name;

      // Falls uneingeloggt -> Bei Supabase registrieren (Triggert profiles-Eintrag)[cite: 5]
      if (!currentUserId) {
        if (!formData.password) throw new Error('Bitte gib ein Passwort für deinen Account an.');
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: currentUserEmail,
          password: formData.password,
          options: {
            data: {
              full_name: currentUserName,
              phone: formData.phone,
            }
          }
        });

        if (authError) throw new Error(`Registrierung fehlgeschlagen: ${authError.message}`);
        currentUserId = authData.user?.id;
      }

      const finalServices = [...formData.services];
      if (formData.otherServiceText.trim()) {
        finalServices.push(`Sonstiges: ${formData.otherServiceText.trim()}`);
      }

      // Anfrage speichern mit status pending_matching[cite: 5]
      const { error: dbError } = await supabase.from('care_requests').insert([{
        user_id: currentUserId,
        role: 'care_seeker',
        name: currentUserName,
        email: currentUserEmail,
        phone: formData.phone,
        services: finalServices,
        district: formData.district,
        package: formData.selectedPackage,
        target_group: formData.targetGroup,
        source: formData.source,
        status: 'pending_matching'
      }]);

      if (dbError) throw dbError;

      // Admin-Benachrichtigung[cite: 5]
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'care_seeker',
          name: currentUserName,
          email: currentUserEmail,
          phone: formData.phone,
          district: formData.district,
          services: finalServices,
          package: formData.selectedPackage,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      alert(`Fehler: ${err.message || 'Etwas ist schiefgelaufen.'}`);
      setLoading(false);
    }
  };

  const remainingHours = Math.max(0, hoursBalance.total - hoursBalance.used);
  const percentageRemaining = hoursBalance.total > 0 ? Math.round((remainingHours / hoursBalance.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-3">
          {/* Logo: Hände, die ein Herz formen */}
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-6 h-6 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Klienten-Portal
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Willkommen zurück{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-slate-500">Hier behältst du den Überblick über dein Guthaben und deine Anfragen.</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Guthaben-Karte */}
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

        {/* Direkt Buchen Banner */}
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

      {/* Liste der bisherigen Anfragen */}
      {myRequests.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-10">
          <h3 className="text-slate-900 font-bold text-lg mb-4">Deine Anfragen</h3>
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">{req.district}</span>
                  <span className="text-xs text-slate-500">{Array.isArray(req.services) ? req.services.join(', ') : req.services}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  req.status === 'pending_matching' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {req.status === 'pending_matching' ? 'In Prüfung / Helfer-Suche' : 'Aktiv'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTIONNAIRE WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowWizard(false)}>
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowWizard(false)} className="absolute top-5 right-5 w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold">✕</button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#1B4D3E] text-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Anfrage erhalten!</h2>
                <p className="text-slate-600 text-sm">Wir prüfen deine Anfrage für deinen Bezirk und melden uns in Kürze im Dashboard.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase">Schritt {step} von 3</span>
                </div>

                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Wo benötigst du Hilfe?</h2>
                    <div className="grid grid-cols-1 gap-2.5 my-4">
                      {serviceOptions.map(s => (
                        <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={`flex items-center p-3 rounded-2xl border-2 text-left ${formData.services.includes(s.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                          <span className="text-xl mr-3">{s.icon}</span>
                          <div>
                            <span className="block font-bold text-sm">{s.title}</span>
                            <span className="block text-xs text-slate-500">{s.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStep(2)} disabled={formData.services.length === 0} className="w-full bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl disabled:opacity-40">Weiter →</button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Ort & Bezirk</h2>
                    <div className="mb-6 relative" ref={dropdownRef}>
                      <button type="button" onClick={() => setIsDistrictOpen(!isDistrictOpen)} className="w-full flex justify-between px-4 py-3 bg-white border-2 border-emerald-500 rounded-xl text-xs font-bold">
                        <span>{formData.district}</span>
                        <span>▼</span>
                      </button>
                      {isDistrictOpen && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-xl max-h-40 overflow-y-auto p-1">
                          {districtOptions.map(d => (
                            <button key={d} type="button" onClick={() => { setFormData({...formData, district: d}); setIsDistrictOpen(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded-lg">{d}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="w-1/3 border-2 border-slate-200 font-bold py-3.5 rounded-2xl text-sm">Zurück</button>
                      <button onClick={() => setStep(3)} className="w-2/3 bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl text-sm">Umfang wählen →</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">Paket & Registrierung</h2>
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {packageOptions.map(pkg => (
                        <button key={pkg.id} type="button" onClick={() => setFormData({...formData, selectedPackage: `${pkg.name} (${pkg.hours} • ${pkg.price})`})} className={`p-3 rounded-2xl border-2 text-left ${formData.selectedPackage.startsWith(pkg.name) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                          <span className="block font-bold text-sm">{pkg.name}</span>
                          <span className="block text-xs text-emerald-600 font-bold">{pkg.hours}</span>
                        </button>
                      ))}
                    </div>

                    {/* Falls nicht eingeloggt -> Konto-Daten abfragen */}
                    {!user?.id && (
                      <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                        <span className="block text-xs font-bold text-slate-700">Account erstellen:</span>
                        <input type="text" placeholder="Vollständiger Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                        <input type="email" placeholder="E-Mail Adresse" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                        <input type="password" placeholder="Passwort wählen (mind. 6 Zeichen)" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="w-1/3 border-2 border-slate-200 font-bold py-3.5 rounded-2xl text-sm">Zurück</button>
                      <button disabled={loading} type="submit" className="w-2/3 bg-[#1B4D3E] text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-50">
                        {loading ? 'Senden...' : 'Anfrage abschicken 🚀'}
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