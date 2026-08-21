'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Heart, Clock, ShieldCheck, Lock, Sparkles, UserCheck, Euro, CheckCircle2 } from 'lucide-react';

type CareRequest = {
  id: string;
  zip_code?: string;
  district?: string;
  services: string[];
  name?: string;
  package?: string;
};

type CaregiverProfile = {
  id: string;
  first_name: string;
  zip_code: string;
  hourly_rate?: number;
  experience_years?: number;
};

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [request, setRequest] = useState<CareRequest | null>(null);
  const [helpers, setHelpers] = useState<CaregiverProfile[]>([]);
  const [availableJobs, setAvailableJobs] = useState<CareRequest[]>([]);
  const [hoursBalance, setHoursBalance] = useState<number>(0);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<CaregiverProfile | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'flex'>('starter');

  const STRIPE_STARTER_URL = 'https://buy.stripe.com/test_5kQdRcb2aeMd5ibaAm0gw01';
  const STRIPE_FLEX_URL = 'https://buy.stripe.com/test_3cIfZk3zIdI9h0TfUG0gw02';

  const supabase = createClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      alert('Vielen Dank! Deine Zahlung war erfolgreich und dein Guthaben wurde aufgeladen.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('hours_balance, role, total_earned').eq('id', user.id).single();
    if (profile) {
      setRole(profile.role);
      setHoursBalance(profile.hours_balance || 0);
      setTotalEarned(profile.total_earned || 0);
    }

    // Wenn Helfer: Lade offene Aufträge für das Helfer-Dashboard
    if (profile?.role === 'caregiver') {
      const { data: jobs } = await supabase
        .from('care_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobs) {
        setAvailableJobs(jobs);
      }
      setLoading(false);
      return;
    }

    // Wenn Kunde: Lade Suchauftrag und passende Helfer
    const { data: req } = await supabase.from('care_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();

    if (req) {
      setRequest(req);
      const { data: matchedHelpers } = await supabase.from('profiles').select('id, first_name, zip_code, hourly_rate, experience_years').eq('role', 'caregiver').eq('zip_code', req.zip_code).limit(4);
      if (matchedHelpers) setHelpers(matchedHelpers);
    }
    setLoading(false);
  }

  const handleBookHelper = async (helper: CaregiverProfile) => {
    setSelectedHelper(helper);

    if (hoursBalance <= 0) {
      setShowPaywall(true);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newBalance = hoursBalance - 1;
    const { error: updateError } = await supabase.from('profiles').update({ hours_balance: newBalance }).eq('id', user.id);

    if (updateError) {
      alert('Fehler beim Buchen. Bitte versuche es erneut.');
      return;
    }

    await supabase.from('bookings').insert({ family_id: user.id, caregiver_id: helper.id, status: 'pending' });

    setHoursBalance(newBalance);
    alert(`Anfrage für ${helper.first_name} wurde erfolgreich übermittelt! 1 Stunde wurde von deinem Guthaben abgezogen.`);
  };

  const handleBuy = () => {
    const targetUrl = selectedPackage === 'starter' ? STRIPE_STARTER_URL : STRIPE_FLEX_URL;
    window.location.href = targetUrl;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Dashboard wird geladen...</div>;
  }

  // --- HELFER DASHBOARD ---
  if (role === 'caregiver') {
    return (
      <div className="min-h-screen bg-[#FAFAF7] p-6 md:p-12 font-sans text-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#235347] text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl font-black font-serif">Helfer-Dashboard</h1>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
              <Euro className="w-4 h-4 text-[#235347]" />
              <span>Verdienst: <strong className="text-[#235347]">{totalEarned} €</strong></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2 md:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Offene Anfragen</span>
              <div className="text-3xl font-black text-[#235347]">{availableJobs.length}</div>
              <p className="text-xs text-gray-500">Verfügbare Einsätze in deiner Region</p>
            </div>
            <div className="bg-[#235347] text-white rounded-3xl p-6 shadow-sm space-y-2 md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Status</span>
                <h3 className="text-lg font-bold">Dein Profil ist aktiv & sichtbar</h3>
              </div>
              <p className="text-xs text-emerald-100">Sobald Kunden in deiner Nähe buchen oder anfragen, wirst du benachrichtigt.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#235347]" />
              Verfügbare Aufträge in deiner Umgebung
            </h2>

            {availableJobs.length > 0 ? (
              <div className="space-y-3">
                {availableJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base">{job.district || `PLZ ${job.zip_code}`}</span>
                        {job.package && <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">{job.package}</span>}
                      </div>
                      <p className="text-xs text-gray-500">
                        Leistungen: {Array.isArray(job.services) ? job.services.join(', ') : job.services}
                      </p>
                    </div>
                    <button
                      onClick={() => alert(`Du hast Interesse an dem Auftrag (${job.district || job.zip_code}) bekundet!`)}
                      className="w-full md:w-auto px-5 py-3 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-xs transition shadow-md cursor-pointer"
                    >
                      Auftrag anfragen
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-[#235347] rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base">Aktuell keine offenen Anfragen</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Wir informieren dich, sobald neue Unterstützungssuchende in deinem Gebiet einen Auftrag einstellen.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- KUNDEN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#FAFAF7] p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#235347] text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black font-serif">Mein Pflege-Dashboard</h1>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#235347]" />
            <span>Guthaben: <strong className="text-[#235347]">{hoursBalance} Std.</strong></span>
          </div>
        </div>

        {request && (
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#235347]">Suchauftrag</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Matching aktiv
              </span>
            </div>
            <h3 className="text-lg font-bold">Unterstützung in {request.district || `PLZ ${request.zip_code}`}</h3>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-black font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#235347]" />
            Verfügbare Helfer in deiner Nähe
          </h2>

          {helpers.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {helpers.map((helper) => (
                <div key={helper.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-base">{helper.first_name}</h4>
                      <p className="text-xs text-gray-500">PLZ {helper.zip_code}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {helper.hourly_rate ? `${helper.hourly_rate} €/Std.` : 'Verifizierter Helfer'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#235347]" />
                    <span>{helper.experience_years ? `${helper.experience_years} Jahre Erfahrung` : 'Geprüftes Profil'}</span>
                  </div>

                  <button
                    onClick={() => handleBookHelper(helper)}
                    className="w-full py-3 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Erstgespräch buchen</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto font-bold">
                🔎
              </div>
              <h3 className="font-extrabold text-base">Dein Concierge sucht gerade</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Wir prüfen aktuell manuell weitere Helfer-Aktivierungen für deine Region. In Kürze schalten wir dir Vorschläge frei.
              </p>
            </div>
          )}
        </div>

      </div>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 text-[#235347] rounded-2xl flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black font-serif">Guthaben aktivieren</h3>
              <p className="text-xs text-gray-500">
                Lade Guthaben auf, um {selectedHelper ? selectedHelper.first_name : 'Helfer'} direkt anzufragen.
              </p>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => setSelectedPackage('starter')}
                className={`border-2 rounded-2xl p-4 transition cursor-pointer flex justify-between items-center ${
                  selectedPackage === 'starter' ? 'border-[#235347] bg-emerald-50/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="font-extrabold text-sm text-gray-900">Starter-Paket (4 Std.)</div>
                  <div className="text-xs text-gray-500">Zum Kennenlernen</div>
                </div>
                <div className="font-black text-lg text-[#235347]">99 €</div>
              </div>

              <div 
                onClick={() => setSelectedPackage('flex')}
                className={`border-2 rounded-2xl p-4 transition cursor-pointer flex justify-between items-center relative ${
                  selectedPackage === 'flex' ? 'border-[#235347] bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-[#235347] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Bestseller
                </span>
                <div>
                  <div className="font-extrabold text-sm text-gray-900">Flex-Paket (10 Std.)</div>
                  <div className="text-xs text-gray-500">Regelmäßige Betreuung</div>
                </div>
                <div className="font-black text-lg text-[#235347]">239 €</div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleBuy}
                className="w-full py-4 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-sm transition shadow-lg cursor-pointer"
              >
                Guthaben kaufen
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-2 text-xs text-gray-400 font-bold hover:text-gray-600 transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}