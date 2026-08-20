'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, MapPin, Lock, Search, Heart, Handshake } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'seeker';

  const [role, setRole] = useState<'seeker' | 'relative' | 'caregiver'>(
    initialRole === 'caregiver' ? 'caregiver' : initialRole === 'relative' ? 'relative' : 'seeker'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Supabase Auth Registrierung
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
        // 2. Profil in der 'profiles' Tabelle anlegen
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: fullName,
            role: role,
            zip: zip,
          },
        ]);

        if (profileError) console.error('Profil-Erstellung Warnung:', profileError);

        // 3. Weiterleitung nach Registrierung
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Fehler bei der Registrierung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6">
      
      {/* Header / Logo Bereich */}
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

      {/* Card Container */}
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-slate-100 space-y-6">
        
        {/* Rollen-Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className={`py-3 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'seeker' 
                ? 'bg-[#1B4D3E] text-white shadow-sm' 
                : 'hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Suchend</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('relative')}
            className={`py-3 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'relative' 
                ? 'bg-[#1B4D3E] text-white shadow-sm' 
                : 'hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Angehörige</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className={`py-3 px-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'caregiver' 
                ? 'bg-[#1B4D3E] text-white shadow-sm' 
                : 'hover:text-slate-900'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Helfer</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMsg}
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
                placeholder="Maria Schmidt"
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
                placeholder="maria@beispiel.de"
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
            {loading ? 'Konto wird erstellt...' : 'Jetzt registrieren'}
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
    </div>
  );
}// TEST EDIT FOR GIT