"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Camera, CheckCircle2, HeartPulse, Smile, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useFamilyData } from "@/components/dashboard/FamilyDataContext";

export default function ShiftSummaryPage() {
  const { setMood, updateHealth, addPhotoMoment, addTrendPoint } = useFamilyData();
  const [mood, setLocalMood] = useState<"super" | "ruhig" | "auffaellig" | "">("");
  const [ernahrung, setErnahrung] = useState(false);
  const [bewegung, setBewegung] = useState(30);
  const [medikamente, setMedikamente] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [showThanks, setShowThanks] = useState(false);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhotoName(file.name);
  }

  function finishShift() {
    if (!mood) return;
    setMood(mood);
    updateHealth({ ernahrung, bewegung, medikamente });
    addTrendPoint(60 + bewegung / 2 + (mood === "super" ? 10 : mood === "auffaellig" ? -10 : 0));
    addPhotoMoment({ id: `moment-${Date.now()}`, title: "Besuchs-Moment", image: photoPreview || "https://images.unsplash.com/photo-1516910817561-52f4dd742864?auto=format&fit=crop&w=900&q=80", caption: "Ein kurzer Einblick in den Besuch.", date: new Date().toISOString().split("T")[0] });
    setShowThanks(true);
    window.setTimeout(() => setShowThanks(false), 2600);
  }

  return (
    <DashboardShell role="caregiver" title="Einsatz Check-in" subtitle="Schnell erfassen, wie der Besuch war">
      <div className="space-y-6 max-w-xl mx-auto px-4">
        <section className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] border border-black/[0.04]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Nach dem Einsatz</p>
              <h1 className="mt-3 text-2xl font-semibold text-[#141414]">Quick-Check-in</h1>
            </div>
            <Link href="/caregiver" className="text-sm font-medium text-emerald-700 hover:underline">Zurück zum Dashboard</Link>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-3">Wie ist der Einsatz verlaufen?</p>
              <div className="grid gap-3">
                <button type="button" onClick={() => setLocalMood("super")} className={`w-full rounded-3xl border px-4 py-5 text-left transition ${mood === "super" ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                  <div className="flex items-center gap-3"><Smile className="w-6 h-6 text-emerald-600" /><div><div className="font-semibold text-[#141414]">Super gelaufen</div><div className="text-sm text-slate-500 mt-1">Alles lief harmonisch und sicher.</div></div></div>
                </button>
                <button type="button" onClick={() => setLocalMood("ruhig")} className={`w-full rounded-3xl border px-4 py-5 text-left transition ${mood === "ruhig" ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                  <div className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-emerald-600" /><div><div className="font-semibold text-[#141414]">Ruhiger Tag</div><div className="text-sm text-slate-500 mt-1">Alles lief entspannt und stabil.</div></div></div>
                </button>
                <button type="button" onClick={() => setLocalMood("auffaellig")} className={`w-full rounded-3xl border px-4 py-5 text-left transition ${mood === "auffaellig" ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                  <div className="flex items-center gap-3"><HeartPulse className="w-6 h-6 text-emerald-600" /><div><div className="font-semibold text-[#141414]">Auffälligkeiten</div><div className="text-sm text-slate-500 mt-1">Es gab Besonderheiten, bitte kurz notieren.</div></div></div>
                </button>
              </div>
            </div>

            <section className="space-y-4 rounded-[2rem] bg-[#f7faf8] p-5 border border-black/[0.04]">
              <div className="flex items-center justify-between text-sm font-semibold text-[#141414]">Health-Check der Familie</div>
              <button type="button" onClick={() => setErnahrung((current) => !current)} className={`w-full rounded-3xl border px-4 py-4 text-left transition ${ernahrung ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span className="font-medium">Ernährung geprüft</span></div>
              </button>
              <div className="space-y-3">
                <div className="text-sm font-medium text-[#141414]">Bewegung</div>
                <div className="flex gap-3">
                  {[15, 30, 60].map((minutes) => (
                    <button key={minutes} type="button" onClick={() => setBewegung(minutes)} className={`min-w-[90px] rounded-3xl border px-4 py-3 text-sm font-semibold transition ${bewegung === minutes ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                      {minutes} Min
                    </button>
                  ))}
                </div>
              </div>
              <label className={`flex items-center justify-between gap-3 rounded-3xl border px-4 py-4 text-sm transition ${medikamente ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-emerald-200"}`}>
                <span>Medikamente / Alltag erledigt</span>
                <input type="checkbox" checked={medikamente} onChange={(event) => setMedikamente(event.target.checked)} className="h-5 w-5 rounded-md border-slate-300 text-emerald-600" />
              </label>
            </section>

            <div className="space-y-3 rounded-[2rem] border border-black/[0.04] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#141414]"><Camera className="w-5 h-5 text-emerald-600" />Moment teilen</div>
              <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-[#4a4a4a] transition hover:border-emerald-300">
                <span>{photoName || "Foto hochladen oder machen"}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-700">Upload</span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {photoPreview && <img src={photoPreview} alt="Besuchsfoto" className="w-full rounded-3xl object-cover h-52" />}
            </div>

            <button type="button" onClick={finishShift} disabled={!mood} className="w-full rounded-full bg-[#1d1d1f] px-6 py-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">Einsatz beenden</button>
          </div>
        </section>

        {showThanks && (
          <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }} className="rounded-[2rem] bg-slate-950/95 p-6 text-center text-white shadow-2xl backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300 mb-3">Danke für deinen Einsatz</p>
            <h2 className="text-2xl font-semibold">Du hast der Familie heute sehr geholfen.</h2>
          </motion.div>
        )}
      </div>
    </DashboardShell>
  );
}
