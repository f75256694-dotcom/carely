"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LivenessMock({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const steps = [
    { id: 1, label: "Bitte drehen Sie Ihren Kopf nach links" },
    { id: 2, label: "Bitte lächeln Sie kurz" },
    { id: 3, label: "Bitte blinzeln Sie" },
  ];
  const [current, setCurrent] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(false);

  function performAction() {
    setCaptured(true);
    setTimeout(() => {
      setCaptured(false);
      setCurrent((c) => c + 1);
    }, 700);
  }

  async function handleComplete() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ verification_status: 'pending' }).eq('id', user.id);
      }
    } catch (err) {
      console.error("Fehler beim Speichern des Status:", err);
    } finally {
      setLoading(false);
      onSuccess();
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Lebenderkennung</h2>
      <p className="text-[#86868b] mb-8 text-sm">Wir führen eine kurze Übung durch, um die Person hinter dem Dokument zu bestätigen.</p>

      <div className="w-full rounded-[2rem] border border-black/[0.04] bg-white/95 p-8 flex flex-col items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <div className="w-40 h-40 rounded-full bg-[#f4f4f6] flex items-center justify-center text-4xl text-[#86868b]">📷</div>
        <div className="text-center max-w-xl">
          {current < steps.length ? (
            <>
              <div className="text-xl font-semibold text-[#1d1d1f] mb-3">{steps[current].label}</div>
              <div className="text-sm text-[#86868b] mb-6">Richten Sie Ihre Kamera aus und führen Sie die Aktion aus.</div>
              <button onClick={performAction} className="bg-[#1d1d1f] hover:bg-black text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-sm">{captured ? "Aufnahme…" : "Aktion ausführen"}</button>
            </>
          ) : (
            <>
              <div className="text-xl font-semibold text-[#1d1d1f] mb-3">Sitzung abgeschlossen</div>
              <div className="text-sm text-[#86868b] mb-6">Deine Daten wurden übermittelt. Wir schalten dein Profil nach manueller Prüfung frei.</div>
              <button onClick={handleComplete} disabled={loading} className="bg-[#1d1d1f] hover:bg-black text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-sm">{loading ? "Übermittle..." : "Zur Bestätigung"}</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="py-3 px-5 rounded-full border border-slate-300 text-sm text-[#1d1d1f]">Zurück</button>
      </div>
    </div>
  );
}