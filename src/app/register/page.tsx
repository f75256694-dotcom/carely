'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, User, Mail, Lock, MapPin, 
  CheckCircle2, MessageSquareText 
} from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'seeker' | 'helper'>('seeker');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locationZip, setLocationZip] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          bio: bio,
          location_zip: locationZip,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (role === 'seeker') {
      router.push('/care-seeker');
    } else {
      router.push('/caregiver/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-teal-50/30 to-warm-100 py-12 px-4 sm:px-6 relative overflow-hidden font-sans flex items-center justify-center">
      
      {/* 2026 Unicorn Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-teal-700 mb-8 text-sm font-semibold transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Zur Startseite
        </Link>

        {/* Liquid Glass Karte */}
        <div className="backdrop-blur-3xl bg-white/90 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-8 sm:p-12">
          
          {/* Header Zone */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/90 border border-teal-100/80 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-4 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Schritt {step} von 2
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
              Konto <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">erstellen</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium">
              Erzähl uns kurz, wer du bist – für ein besseres Miteinander.
            </p>

            {/* Modern Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-600 to-teal-700 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-md text-red-600 text-sm font-medium rounded-2xl border border-red-100 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={step === 2 ? handleRegister : (e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
            
            {/* SCHRITT 1: Rolle, Name & Über mich */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-3 tracking-wide">Ich möchte...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('seeker')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-bold text-sm ${
                        role === 'seeker'
                          ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-lg shadow-teal-600/25 scale-[1.01]'
                          : 'backdrop-blur-md bg-white/70 text-gray-800 border-gray-200/90 hover:bg-white hover:border-teal-400'
                      }`}
                    >
                      <span className="block mb-1 text-base">❤️ Hilfe finden</span>
                      <span className={`text-xs font-medium ${role === 'seeker' ? 'text-teal-100' : 'text-gray-400'}`}>Für mich oder Angehörige</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('helper')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-bold text-sm ${
                        role === 'helper'
                          ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-lg shadow-teal-600/25 scale-[1.01]'
                          : 'backdrop-blur-md bg-white/70 text-gray-800 border-gray-200/90 hover:bg-white hover:border-teal-400'
                      }`}
                    >
                      <span className="block mb-1 text-base">🤝 Helfen</span>
                      <span className={`text-xs font-medium ${role === 'helper' ? 'text-teal-100' : 'text-gray-400'}`}>Nachbarschaftshilfe anbieten</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">Vollständiger Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Maria Mustermann"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">Über meine Situation / mich (optional)</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
                      <MessageSquareText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      rows={2}
                      placeholder={role === 'seeker' ? "z.B. Suche Unterstützung für meinen Vater (82) in Teilzeit..." : "z.B. Studentin mit Auto, helfe gerne beim Einkaufen..."}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-sm transition-all shadow-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SCHRITT 2: Zugangsdaten & Standort */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">E-Mail-Adresse</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@beispiel.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">Passwort</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 Zeichen"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">PLZ / Stadt (für das lokale Matching)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="z.B. 10115 Berlin"
                      value={locationZip}
                      onChange={(e) => setLocationZip(e.target.value)}
                      className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 backdrop-blur-md bg-white/80 hover:bg-white text-gray-700 font-extrabold text-sm py-4 rounded-2xl border border-gray-200 transition-all cursor-pointer"
                >
                  Zurück
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`${step > 1 ? 'w-2/3' : 'w-full'} bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-xl shadow-teal-600/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50`}
              >
                {step === 1 ? (
                  <>
                    Weiter <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-xs text-gray-500 font-medium">
              Schon ein Konto?{' '}
              <Link href="/login" className="text-teal-700 font-extrabold hover:underline">
                Hier anmelden
              </Link>
            </p>

            <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
              Durch die Anmeldung akzeptieren Sie unsere{' '}
              <Link href="/terms" className="underline hover:text-gray-600">Nutzungsbedingungen</Link> und{' '}
              <Link href="/privacy" className="underline hover:text-gray-600">Datenschutzbestimmungen</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}