'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Clock, 
  ShieldCheck, 
  Video, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  User, 
  FileCheck, 
  Heart,
  MessageSquare
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STEP_ORDER: Record<string, number> = {
  submitted: 1,
  interview_pending: 2,
  matching_active: 3,
  completed: 4,
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'family' | 'caregiver'>('family');
  const [careRequest, setCareRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Holt den neuesten Eintrag aus der Datenbank
      const { data } = await supabase
        .from('care_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setCareRequest(data);
      setLoading(false);
    }

    loadData();

    // Live-Updates aktivieren (WebSocket)
    const channel = supabase
      .channel('realtime_care_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'care_requests' },
        (payload) => {
          if (payload.new) {
            setCareRequest(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const currentStatus = careRequest?.status || 'submitted';
  const currentStepNum = STEP_ORDER[currentStatus] || 1;

  const familySteps = [
    { key: 'submitted', title: 'Anfrage eingegangen', desc: 'Deine Bedürfnisse wurden strukturiert erfasst' },
    { key: 'interview_pending', title: 'Persönliches Erstgespräch', desc: 'Kurzer Anruf unseres Teams zur Feinabstimmung' },
    { key: 'matching_active', title: 'Gezieltes Helfer-Matching', desc: 'Auswahl von 2–3 geprüften Profilen in deiner Nähe' },
    { key: 'completed', title: 'Ersttreffen & Start', desc: 'Unverbindliches Kennenlernen vor Ort' },
  ].map((step) => {
    const num = STEP_ORDER[step.key];
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (num < currentStepNum) status = 'completed';
    if (num === currentStepNum) status = 'current';
    return { ...step, status };
  });

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#0A2E23] antialiased font-sans pb-24">
      {/* Top Test-Mode Bar */}
      <header className="border-b border-[#0A2E23]/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A2E23] flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-[#86EFAC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0A2E23] font-serif">Helpify</span>
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#0A2E23]/5 text-[#0A2E23]/60 font-semibold border border-[#0A2E23]/10">
              Care OS 1.0 (Live SQL Data)
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#F4F7F5] p-1 rounded-xl border border-[#0A2E23]/10">
            <button
              onClick={() => setUserRole('family')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userRole === 'family' ? 'bg-white text-[#0A2E23] shadow-xs' : 'text-[#0A2E23]/60'
              }`}
            >
              Familie
            </button>
            <button
              onClick={() => setUserRole('caregiver')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userRole === 'caregiver' ? 'bg-white text-[#0A2E23] shadow-xs' : 'text-[#0A2E23]/60'
              }`}
            >
              Alltagshelfer
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
        
        {/* Banner */}
        <section className="bg-[#0A2E23] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#86EFAC] text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Lade Daten...' : 'Echtzeit-Verbindung aktiv'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-white leading-tight">
              {userRole === 'family' ? 'Wir organisieren den perfekten Beistand für deine Familie.' : 'Willkommen im Helpify Experten-Netzwerk.'}
            </h1>
            <p className="text-emerald-100/70 text-base leading-relaxed">
              {userRole === 'family' 
                ? 'Deine Anfrage für Wien ist bei unserem Care-Team eingegangen.'
                : 'Deine Angaben wurden erfasst. Wir prüfen deine Unterlagen.'}
            </p>
          </div>
        </section>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Pipeline */}
          <section className="lg:col-span-8 bg-white rounded-3xl p-8 border border-[#0A2E23]/10 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-[#0A2E23]/5 pb-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#0A2E23]">
                  Status deiner Care-Anfrage
                </h2>
                <p className="text-xs text-[#0A2E23]/60 mt-0.5">DB Status: <code className="bg-slate-100 px-1 rounded text-[#0A2E23] font-bold">{currentStatus}</code></p>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[#86EFAC]/20 text-[#0A2E23] border border-[#86EFAC]/40">
                Schritt {currentStepNum} von 4
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#0A2E23]/10">
              {familySteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all ${
                    step.status === 'completed' 
                      ? 'bg-[#0A2E23] text-[#86EFAC]' 
                      : step.status === 'current'
                      ? 'bg-[#86EFAC] text-[#0A2E23] ring-4 ring-[#86EFAC]/30 font-bold'
                      : 'bg-[#F4F7F5] text-[#0A2E23]/40 border border-[#0A2E23]/10'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                  </div>

                  <div className={`flex-1 p-4 rounded-2xl ${step.status === 'current' ? 'bg-[#F4F7F5] border border-[#0A2E23]/10' : ''}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-serif font-bold ${step.status === 'upcoming' ? 'text-[#0A2E23]/50' : 'text-[#0A2E23]'}`}>
                        {step.title}
                      </h3>
                      {step.status === 'current' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0A2E23] uppercase bg-white px-2.5 py-1 rounded-md border border-[#0A2E23]/10">
                          <span className="w-2 h-2 rounded-full bg-[#0A2E23] animate-pulse" />
                          Aktiv
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${step.status === 'upcoming' ? 'text-[#0A2E23]/40' : 'text-[#0A2E23]/70'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Echte DB Info-Box */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#0A2E23]/10 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A2E23]/60 border-b border-[#0A2E23]/5 pb-4">
                Echte Daten aus Supabase
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0A2E23]/60 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0A2E23]">Region</p>
                    <p className="text-[#0A2E23]/70">{careRequest?.region || 'Keine Region hinterlegt'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-[#0A2E23]/60 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0A2E23]">Gewünschte Hilfe</p>
                    <p className="text-[#0A2E23]/70">{careRequest?.service_types?.join(', ') || 'Keine Angaben'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#0A2E23]/60 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0A2E23]">Zeitplan</p>
                    <p className="text-[#0A2E23]/70">{careRequest?.schedule_info || 'Keine Angaben'}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}