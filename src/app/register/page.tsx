'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Shield, Search, ArrowRight, Lock, Mail, User as UserIcon, Users, MapPin } from 'lucide-react';

type UserRole = 'care_seeker' | 'family' | 'caregiver';

function RegisterForm() {
  const searchParams = useSearchParams();
  const rawRole = searchParams.get('role');
  
  const initialRole: UserRole = 
    rawRole === 'family' || rawRole === 'caregiver' || rawRole === 'care_seeker' 
      ? rawRole 
      : 'care_seeker';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // PLZ aus dem Fragebogen-Entwurf vorbefüllen (falls vorhanden)
  useEffect(() => {
    const draftData = localStorage.getItem('care_request_draft');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        if (parsed.zip_code) {
          setZipCode(parsed.zip_code);
        }
      } catch (e) {
        console.error('Fehler beim Lesen des Entwurfs', e);
      }
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      
      // 1. Auth SignUp
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            zip_code: zipCode,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        const userId = authData.user.id;

        // 2. Profil anlegen / aktualisieren
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: userId,
            full_name: fullName,
            role: role,
            zip_code: zipCode,
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;

        // 3. Entwurf aus localStorage in care_requests übertragen
        const draftData = localStorage.getItem('care_request_draft');
        let requestPayload = {
          user_id: userId,
          zip_code: zipCode,
          services: [],
          status: 'matching',
        };

        if (draftData) {
          try {
            const parsedDraft = JSON.parse(draftData);
            requestPayload = {
              ...requestPayload,
              ...parsedDraft,
              user_id: userId, // ID überschreiben für Sicherheit
            };
          } catch (e) {
            console.error('Fehler beim Verarbeiten des Entwurfs:', e);
          }
        }

        // Automatischen Care Request in DB schreiben
        const { error: requestError } = await supabase
          .from('care_requests')
          .insert([requestPayload]);

        if (requestError) {
          console.error('Fehler beim Erstellen der Pflegeanfrage:', requestError);
        } else {
          // Entwurf löschen nach erfolgreicher Erstellung
          localStorage.removeItem('care_request_draft');
        }
      }

      // 4. Weiterleitung ins Dashboard
      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.';
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 selection:bg-teal-100 flex flex-col justify-center py-12 px-6 sm:px-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/20">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-3xl font-black text-gray-900 tracking-tight font-serif">Carely</span>
          </Link>
          <h2 className="text-2xl font-black font-serif text-gray-900">Konto erstellen</h2>
          <p className="text-gray-500 text-sm">Speichere deine Anfrage & starte das Matching.</p>
        </div>

        <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(13,148,136,0.08)] space-y-6">
          
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60">
            <button
              type="button"
              onClick={() => setRole('care_seeker')}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'care_seeker' ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="truncate">Suchend</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('family')}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'family' ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="truncate">Angehörige</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                role === 'caregiver' ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="truncate">Helfer</span>
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
              <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">Postleitzahl</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10115"
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
              <span>{loading ? 'Erstelle Account...' : 'Konto erstellen & Anfrage starten'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laden...</div>}>
      <RegisterForm />
    </Suspense>
  );
}