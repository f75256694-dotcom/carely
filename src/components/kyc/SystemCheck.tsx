"use client";

import React, { useEffect, useState } from "react";

const steps = [
  { id: "mrz", label: "MRZ-Scan" },
  { id: "tamper", label: "Manipulationsprüfung" },
  { id: "db", label: "Datenbank-Abgleich" },
  { id: "risk", label: "Risikoanalyse (IP/Standort)" },
];

type Props = { document: File | null; liveness: boolean; onComplete: (ok: boolean) => void; onBack: () => void };

export default function SystemCheck({ document, liveness, onComplete, onBack }: Props) {
  const [status, setStatus] = useState<Record<string, "idle" | "running" | "ok" | "error">>(() => {
    const s: any = {}; steps.forEach((st) => (s[st.id] = "idle")); return s;
  });

  useEffect(() => {
    let mounted = true;
    async function runChecks() {
      for (let i = 0; i < steps.length; i++) {
        const st = steps[i];
        if (!mounted) return;
        setStatus((s) => ({ ...s, [st.id]: "running" }));
        const wait = st.id === "db" || st.id === "risk" ? 1100 + Math.random() * 900 : 700 + Math.random() * 400;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, wait));
        if (!mounted) return;
        const fail = Math.random() < 0.02;
        setStatus((s) => ({ ...s, [st.id]: fail ? "error" : "ok" }));
        if (fail) { onComplete(false); return; }
      }
      await new Promise((res) => setTimeout(res, 600));
      if (!document || !liveness) { onComplete(false); return; }
      onComplete(true);
    }
    runChecks();
    return () => { mounted = false; };
  }, [document, liveness, onComplete]);

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-3">Systemprüfung läuft</h2>
      <p className="text-[#86868b] mb-8 text-sm">Wir führen jetzt einige automatische Prüfungen durch. Das dauert gewöhnlich weniger als eine Minute.</p>

      <div className="w-full rounded-[2rem] border border-black/[0.04] p-8 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4">
          {steps.map((st, i) => (
            <div key={st.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${status[st.id] === "ok" ? "bg-[#3d7066] text-white" : status[st.id] === "running" ? "bg-[#f5f5f7] text-[#1d1d1f]" : status[st.id] === "error" ? "bg-red-100 text-red-600" : "bg-[#f5f5f7] text-[#86868b]"}`}>
                  {status[st.id] === "ok" ? "✓" : status[st.id] === "running" ? "…" : status[st.id] === "error" ? "!" : i + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1d1d1f]">{st.label}</div>
                  <div className="text-xs text-[#86868b]">{status[st.id] === "running" ? "In Arbeit…" : status[st.id] === "ok" ? "Abgeschlossen" : status[st.id] === "error" ? "Probleme festgestellt" : "Wartend"}</div>
                </div>
              </div>
              <div className="text-xs text-[#86868b]">{status[st.id] === "running" ? "..." : status[st.id] === "ok" ? "OK" : status[st.id] === "error" ? "Fehler" : ""}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="py-3 px-5 rounded-full border border-slate-300 text-sm text-[#1d1d1f]">Zurück</button>
        <div className="text-sm text-[#86868b]">Bitte warten — Prüfungen laufen</div>
      </div>
    </div>
  );
}
