'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      localStorage.removeItem('helpify_bypass');
      localStorage.removeItem('helpify_role');

      // 1. Supabase Auth Anmeldeversuch
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setErrorMsg('E-Mail oder Passwort ist ungültig.');
        } else if (authError.message.includes('Email not confirmed')) {
          setErrorMsg('Bitte bestätige zuerst deine E-Mail-Adresse.');
        } else {
          setErrorMsg(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // 2. Profil abfragen
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).maybeSingle();

        // 3. Falls die Profilzeile fehlt, Rolle übernehmen
        if (!profile) {
          const metaRole = authData.user.user_metadata?.role;
          const metaName = authData.user.user_metadata?.full_name || authData.user.email;

          await supabase.from('profiles').upsert([
            {
              id: authData.user.id,
              full_name: metaName,
              role: metaRole,
            }
          ]);
        }

        // 4. Weiterleitung direkt auf das Dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-slate-100 space-y-6 z-10">
        
        {/* Richtiges Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-3">
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
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0A2E23] tracking-tight">Willkommen zurück</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Melde dich bei Helpify an — herzlich, sicher, lokal.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">E-Mail-Adresse</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine.email@beispiel.de"
              className="w-full px-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-base shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="text-center pt-2 space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-[#1B4D3E] font-bold hover:underline">
              Hier registrieren
            </Link>
          </p>

          <p className="text-[11px] text-slate-400 leading-relaxed px-4">
            Durch die Anmeldung akzeptieren Sie unsere{' '}
            <a href="#" className="underline">Nutzungsbedingungen</a> und{' '}
            <a href="#" className="underline">Datenschutzbestimmungen</a>.
          </p>
        </div>
      </div>
    </div>
  );
}