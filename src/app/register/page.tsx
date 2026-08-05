"use client";

import React, { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Users, Handshake } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Supabase Client importiert

type Role = "family" | "caregiver" | "care-seeker" | null;

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // step 3 specifics
  const [forWhom, setForWhom] = useState("");
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState(10);
  const [needs, setNeeds] = useState<{ [k: string]: boolean }>({ einkauf: false, gesellschaft: false, haushalt: false });

  const [loading, setLoading] = useState(false);
  const [socialMessage, setSocialMessage] = useState<string | null>(null);

  function next() {
    setCurrentStep((s) => Math.min(3, s + 1));
  }

  function back() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  // Echtes Supabase-Submit
  async function submit() {
    if (!email || !password || !name) {
      alert("Bitte fülle alle Pflichtfelder (Name, E-Mail, Passwort) aus.");
      return;
    }

    setLoading(true);

    try {
      // 1. Account bei Supabase Auth erstellen
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: selectedRole,
          },
        },
      });

      if (authError) {
        alert("Fehler bei der Registrierung: " + authError.message);
        setLoading(false);
        return;
      }

      // 2. Profil in der Datenbanksammlung 'profiles' speichern
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: name,
            role: selectedRole,
            zip_code: zip || null,
          },
        ]);

        if (profileError) {
          console.error("Profil-Fehler:", profileError.message);
        }
      }

      setLoading(false);

      // 3. Weiterleitung je nach Rolle
      if (selectedRole === "caregiver") {
        router.push("/caregiver/onboarding");
      } else {
        router.push("/family");
      }
    } catch (err: any) {
      alert("Unerwarteter Fehler: " + err.message);
      setLoading(false);
    }
  }

  function toggleNeed(key: string) {
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <AuthCard title={"Registrieren"} subtitle={"Einfach starten — wir führen dich Schritt für Schritt."}>
      <div className="w-full">
        <div className="mb-4">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
          <div className="text-sm text-slate-500 mt-2">Schritt {currentStep} von 3</div>
        </div>

        <div className="relative min-h-[320px]">
          <AnimatePresence initial={false} mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex flex-col gap-4">
                  <RoleCard icon={<Heart className="w-5 h-5 text-emerald-600" />} title={"Ich brauche Hilfe"} desc={"Ich suche Unterstützung für mich selbst"} active={selectedRole === "care-seeker"} onClick={() => setSelectedRole("care-seeker")} />
                  <RoleCard icon={<Users className="w-5 h-5 text-emerald-600" />} title={"Familienangehörige"} desc={"Ich organisiere Betreuung für ein Familienmitglied"} active={selectedRole === "family"} onClick={() => setSelectedRole("family")} />
                  <RoleCard icon={<Handshake className="w-5 h-5 text-emerald-600" />} title={"Ich möchte helfen"} desc={"Ich biete Alltagshilfe an"} active={selectedRole === "caregiver"} onClick={() => setSelectedRole("caregiver")} />
                </div>

                <div className="mt-4">
                  <button disabled={!selectedRole} onClick={next} className="w-full bg-[#3d7066] hover:bg-[#2f5951] text-white font-semibold py-3.5 rounded-full transition-all shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Vollständiger Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">E-Mail</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Passwort</label>
                    <PasswordInput value={password} onChange={setPassword} placeholder={"Mindestens 8 Zeichen"} />
                    <PasswordStrength password={password} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setSocialMessage("Google-Anmeldung ausgewählt. Bitte warten...")} className="flex items-center gap-2 justify-center border border-slate-200 rounded-lg py-2 text-sm">Mit Google fortfahren</button>
                    <button type="button" onClick={() => setSocialMessage("Apple-Anmeldung ausgewählt. Wir öffnen den sicheren Anmelde-Fluss.")} className="flex items-center gap-2 justify-center border border-slate-200 rounded-lg py-2 text-sm">Mit Apple fortfahren</button>
                  </div>

                  {socialMessage && <p className="text-sm text-sage-700 mt-3">{socialMessage}</p>}

                  <div className="mt-4 flex flex-col gap-3">
                    <button onClick={back} className="py-2 px-4 rounded-lg border">Zurück</button>
                    <button disabled={!email || !password || !name} onClick={next} className="w-full bg-[#3d7066] hover:bg-[#2f5951] text-white font-semibold py-3.5 rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="space-y-3">
                  {selectedRole === "family" && (
                    <>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">Für wen suchst du Unterstützung?</label>
                        <input value={forWhom} onChange={(e) => setForWhom(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">PLZ / Wohnort</label>
                        <input value={zip} onChange={(e) => setZip(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                      </div>
                    </>
                  )}

                  {selectedRole === "caregiver" && (
                    <>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">PLZ</label>
                        <input value={zip} onChange={(e) => setZip(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">Entfernung (km)</label>
                        <input type="range" min={1} max={100} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
                        <div className="text-sm text-slate-500">{radius} km</div>
                      </div>
                    </>
                  )}

                  {selectedRole === "care-seeker" && (
                    <>
                      <div>
                        <label className="block text-sm text-slate-600 mb-1">Welche Hilfe wird benötigt?</label>
                        <div className="grid grid-cols-1 gap-2">
                          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={needs.einkauf} onChange={() => toggleNeed("einkauf")} />Einkauf</label>
                          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={needs.gesellschaft} onChange={() => toggleNeed("gesellschaft")} />Gesellschaft</label>
                          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={needs.haushalt} onChange={() => toggleNeed("haushalt")} />Haushalt</label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-4 flex flex-col gap-3">
                    <button onClick={back} className="py-2 px-4 rounded-lg border">Zurück</button>
                    <button disabled={loading} onClick={submit} className="w-full bg-[#3d7066] hover:bg-[#2f5951] text-white font-semibold py-3.5 rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Erstelle Konto…" : "Konto erstellen"}</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center text-sm text-slate-500">
          <p>
            Schon ein Konto? <Link href="/login" className="text-[#3d7066] hover:underline font-medium cursor-pointer">Hier anmelden</Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}

function RoleCard({ icon, title, desc, active, onClick }: { icon?: React.ReactNode; title: string; desc: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full p-4 mb-3 rounded-2xl border-2 text-left transition-all duration-200 ${active ? "border-[#3d7066] bg-[#3d7066]/10 ring-2 ring-[#3d7066]/20" : "border-slate-200 bg-white hover:border-[#3d7066] hover:bg-[#3d7066]/5"}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">{icon}</div>
          <div className="font-semibold text-slate-900">{title}</div>
        </div>
        <div className="text-sm text-slate-500 mt-3">{desc}</div>
      </div>
    </button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = password.length > 8 ? Math.min(3, Math.floor(password.length / 4)) : 0;
  const colors = ["bg-slate-200", "bg-yellow-300", "bg-amber-400", "bg-emerald-500"];
  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full ${colors[score]}`} style={{ width: `${(score / 3) * 100}%` }} />
      </div>
      <div className="text-xs text-slate-500 mt-1">Passwortstärke: {score === 0 ? "Sehr schwach" : score === 1 ? "Schwach" : score === 2 ? "Gut" : "Stark"}</div>
    </div>
  );
}