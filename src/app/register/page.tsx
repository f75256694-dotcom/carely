'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Shield, Search, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState<'care_seeker' | 'care_giver'>('care_seeker');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      // 1. Supabase Auth Registrierung mit Übergabe der Rolle in user_metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      // 2. Sofortiges Rollenbasiertes Routing nach erfolgreichem Account-Create
      if (role === 'care_giver') {
        router.replace('/requests');
      } else {
        router.replace('/family');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Ein Fehler ist bei der Registrierung aufgetreten.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 selection:bg-teal-100 flex flex-col justify-center py-12 px-6 sm:px-12 relative overflow-hidden">
      {/* Hintergrund Glow-Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10 space-y-8">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/20">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-3xl font-black text-gray-900 tracking-tight font-serif">Carely</span>
          </Link>
          <h2 className="text-2xl font-black font-serif text-gray-900">Account erstellen</h2>
          <p className="text-gray-500 text-sm">Wähle dein Profil und starte in wenigen Sekunden.</p>
        </div>

        {/* Registrierungs-Card */}
        <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(13,148,136,0.08)] space-y-6">
          
          {/* Rollen-Auswahl (Toggle) */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
            <button
              type="button"
              onClick={() => setRole('care_seeker')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === 'care_seeker'
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${role === 'care_seeker' ? 'fill-current' : ''}`} />
              <span>Hilfe / Familie</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('care_giver')}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                role === 'care_giver'
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Als Helfer</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">Vollständiger Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Maria Schmidt"
                  className="w-full bg-gray-50/80 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@beispiel.de"
                  className="w-full bg-gray-50/80 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mindestens 6 Zeichen"
                  className="w-full bg-gray-50/80 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-base font-black shadow-lg shadow-teal-700/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Erstelle Account...' : 'Account erstellen & starten'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </form>

        </div>

        {/* Footer Link zum Login */}
        <p className="text-center text-sm text-gray-500 font-medium">
          Bereits einen Account?{' '}
          <Link href="/login" className="text-teal-700 font-bold hover:underline">
            Anmelden
          </Link>
        </p>

      </div>
    </div>
  );
}