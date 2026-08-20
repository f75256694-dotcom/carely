'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, MapPin, Lock, Search, Heart, Handshake, ArrowLeft } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  // Wenn keine Rolle über URL vorgegeben ist, starten wir mit null, damit die 2 großen Karten gezeigt werden
  const [role, setRole] = useState<'seeker' | 'caregiver' | null>(
    initialRole === 'caregiver' ? 'caregiver' : initialRole ? 'seeker' : null
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            zip: zip,
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: fullName,
            role: role,
            zip: zip,
            hours_balance: role === 'seeker' ? 0 : undefined,
            total_earned: role === 'caregiver' ? 0 : undefined,
          },
        ]);

        if (profileError) throw profileError;

        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Registrierungsfehler:', err);
      setErrorMsg(err.message || JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // SCHRITT 1: Die 2 großen Auswahl-Karten, wenn noch keine Rolle gewählt wurde
  if (!role) {
    return (
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-black text-[#0A2E23]">Wie möchtest du Helpify nutzen?</h2>
          <p className="text-xs text-slate-500 font-medium">Wähle deinen Bereich aus, um fortzufahren.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className="p-8 bg-white border-2 border-emerald-950/10 hover:border-[#1B4D3E] rounded-[2rem] shadow-sm hover:shadow-md transition text-left space-y-4 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-[#1B4D3E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0A2E23]">Hilfe finden</h3>
              <p className="text-xs text-slate-500 mt-1">Ich suche Alltagsbegleitung für mich oder Angehörige.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className="p-8 bg-white border-2 border-emerald-950/10 hover:border-[#1B4D3E] rounded-[2rem] shadow-sm hover:shadow-md transition text-left space-y-4 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-[#1B4D3E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0A2E23]">Als selbständiger Alltagshelfer starten</h3>
              <p className="text-xs text-slate-500 mt-1">Bestimme deine Zeiten selbst – inkl. einfachem Start-Guide.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // SCHRITT 2: Das eigentliche Registrierungsformular nach Rollen-Auswahl
  return (
    <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-slate-100 space-y-6">
      
      {/* Zurück-Button zur Rollenauswahl */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRole(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1B4D3E] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bereich wechseln</span>
        </button>
        <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-[#1B4D3E] px-3 py-1 rounded-full">
          {role === 'seeker' ? 'Hilfe finden' : 'Selbstständiger Helfer'}
        </span>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold whitespace-pre-wrap">
          {errorMsg}
        </div>
      )}

      {/* Transparenz-Hinweis speziell für Helfer */}
      {role === 'caregiver' && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs space-y-1">
          <p className="font-bold text-[#0A2E23]">💡 Gut zu wissen:</p>
          <p className="text-slate-600">
            Als selbstständiger Helfer meldest du kurz ein freies Gewerbe an (Personenbetreuung). 
            Keine Sorge: Wir unterstützen dich direkt nach der Registrierung via WhatsApp Schritt für Schritt dabei!
          </p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Vollständiger Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Vollständiger Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={role === 'caregiver' ? 'Anna Huber' : 'Maria Schmidt'}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
            />
          </div>
        </div>

        {/* E-Mail */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">E-Mail-Adresse</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
            />
          </div>
        </div>

        {/* Postleitzahl */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Postleitzahl</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={5}
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="1170"
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
            />
          </div>
        </div>

        {/* Passwort */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Passwort</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 rounded-2xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-base shadow-lg transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Konto wird erstellt...' : role === 'caregiver' ? 'Als selbständiger Helfer starten' : 'Jetzt registrieren'}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-600 font-medium">
          Bereits ein Konto?{' '}
          <Link href="/login" className="text-[#1B4D3E] font-bold hover:underline">
            Hier anmelden
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6">
      
      <div className="flex flex-col items-center text-center mb-8 space-y-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-md shrink-0">
            <svg 
              className="w-6 h-6 text-[#86EFAC]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black tracking-tight text-[#0A2E23] font-serif leading-none">Helpify</span>
            <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">Senioren & Alltagshilfe</span>
          </div>
        </Link>

        <div className="pt-2">
          <h1 className="text-3xl font-serif font-black text-[#0A2E23] tracking-tight">Konto erstellen</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Anfrage speichern & passende Helfer direkt matchen.</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center p-8 text-slate-500 font-medium">Laden...</div>}>
        <RegisterForm />
      </Suspense>

    </div>
  );
}