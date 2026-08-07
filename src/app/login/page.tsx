'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Heart, Eye, EyeOff } from 'lucide-react';

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
      localStorage.removeItem('carely_bypass');
      localStorage.removeItem('carely_role');

      // 1. Supabase Auth Anmeldeversuch
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
        // 2. Profil abfragen, aber ohne Absturz falls die Zeile in der DB fehlt (.maybeSingle statt .single)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        // 3. Falls die Profilzeile in der Datenbank fehlt, automatisch nacherstellen
        if (!profile) {
          const metaRole = authData.user.user_metadata?.role || 'helper';
          const metaName = authData.user.user_metadata?.full_name || authData.user.email;

          await supabase.from('profiles').upsert([
            {
              id: authData.user.id,
              full_name: metaName,
              role: metaRole,
            }
          ]);
        }

        // 4. Weiterleitung zur Hauptseite mit funktionierendem Cockpit
        window.location.href = '/';
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 flex flex-col justify-center items-center p-6 relative">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 space-y-8 z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#235347] flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif font-black text-2xl text-[#235347]">Carely</span>
          </div>

          <div>
            <h1 className="text-3xl font-black font-serif text-gray-900 tracking-tight">
              Willkommen zurück
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Melde dich bei Carely an — herzlich, sicher, lokal.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine.email@beispiel.de"
              className="w-full px-5 py-4 rounded-2xl bg-[#FEFDE8] border border-amber-200/60 focus:bg-white focus:ring-2 focus:ring-[#235347] text-gray-900 text-sm font-medium outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-gray-700">Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl bg-[#FEFDE8] border border-amber-200/60 focus:bg-white focus:ring-2 focus:ring-[#235347] text-gray-900 text-sm font-medium outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#235347] hover:bg-[#1b4238] text-white font-bold text-base shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition">
            <span>Mit Google anmelden</span>
          </button>
          <button className="py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition">
            <span>Mit Apple anmelden</span>
          </button>
        </div>

        <div className="text-center pt-2 space-y-3">
          <p className="text-xs text-gray-600 font-medium">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-[#235347] font-bold hover:underline">
              Hier registrieren
            </Link>
          </p>

          <p className="text-[11px] text-gray-400 leading-relaxed px-4">
            Durch die Anmeldung akzeptieren Sie unsere{' '}
            <a href="#" className="underline">Nutzungsbedingungen</a> und{' '}
            <a href="#" className="underline">Datenschutzbestimmungen</a>.
          </p>
        </div>
      </div>

    </div>
  );
}