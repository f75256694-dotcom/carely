"use client";

import React, { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Apple } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialMessage, setSocialMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Rolle aus der profiles-Tabelle holen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setError("Profil konnte nicht geladen werden.");
      return;
    }

    // Je nach Rolle unterschiedlich weiterleiten
    if (profile.role === 'caregiver') {
      router.push('/caregiver');
    } else {
      router.push('/family');
    }
  }

  return (
    <AuthCard title={"Willkommen zurück"} subtitle={"Melde dich bei Carely an — herzlich, sicher, lokal."}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">E-Mail</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">Passwort</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="Dein Passwort" />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button type="submit" className="w-full bg-[#3d7066] hover:bg-[#2f5951] text-white font-semibold py-3.5 rounded-full transition-all shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Anmelden…" : "Anmelden"}</button>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setSocialMessage("Google-Anmeldung ausgewählt. Wir leiten Sie gleich weiter.")} className="flex items-center gap-2 justify-center border border-slate-200 rounded-lg py-2 text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.6 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.53c-.24 1.3-.98 2.4-2.09 3.14v2.6h3.37c1.97-1.82 3.09-4.48 3.09-7.74z" fill="#4285F4"/>
              <path d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.37-2.6c-.94.63-2.14 1.01-3.26 1.01-2.5 0-4.61-1.68-5.36-3.94H2.99v2.48C4.64 19.9 8 22 12 22z" fill="#34A853"/>
              <path d="M6.64 13.03a5.98 5.98 0 010-2.06V8.49H2.99a9.99 9.99 0 000 7.02l3.65-2.98z" fill="#FBBC05"/>
              <path d="M12 6.5c1.47 0 2.8.5 3.85 1.47l2.89-2.89C16.96 3.6 14.7 2.5 12 2.5 8 2.5 4.64 4.6 2.99 7.59l3.65 2.49C7.39 8.18 9.5 6.5 12 6.5z" fill="#EA4335"/>
            </svg>
            Mit Google anmelden
          </button>
          <button type="button" onClick={() => setSocialMessage("Apple-Anmeldung ausgewählt. Bitte warten.")} className="flex items-center gap-2 justify-center border border-slate-200 rounded-lg py-2 text-sm">
            <Apple className="w-4 h-4" /> Mit Apple anmelden
          </button>
        </div>

        {socialMessage && <p className="text-sm text-sage-700 mt-3">{socialMessage}</p>}

        <div className="text-center text-sm text-slate-500">
          <p>
            Noch kein Konto? <Link href="/register" className="text-[#3d7066] hover:underline font-medium cursor-pointer">Hier registrieren</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}