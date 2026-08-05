"use client";

import { Calendar, Camera, CheckCircle, Clock, MapPin, MessageCircle, Star, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { DashboardShell, DashboardViewContext } from "@/components/dashboard/DashboardShell";
import { InteractiveCalendar, type Appointment } from "@/components/dashboard/InteractiveCalendar";
import { useFamilyData } from "@/components/dashboard/FamilyDataContext";

function HealthRing({ label, value, accent }: { label: string; value: number; accent: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="rounded-3xl border border-black/[0.05] bg-white/95 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-[#141414]">{value}%</p>
        </div>
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 72 72" className="w-16 h-16">
            <circle cx="36" cy="36" r="28" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="36" cy="36" r="28" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 36 36)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">{value}%</div>
        </div>
      </div>
      <p className="text-sm text-[#6b6b6b]">Tageswert im Blick behalten</p>
    </div>
  );
}

function TrendGraph({ points }: { points: number[] }) {
  const max = Math.max(...points, 100);
  const path = points.map((value, index) => `${index === 0 ? "M" : "L"} ${18 + index * 28} ${98 - (value / max) * 78}`).join(" ");
  const labels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  return (
    <div className="rounded-3xl border border-black/[0.05] bg-white/95 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Wohlbefinden</p>
          <h3 className="mt-2 text-lg font-semibold text-[#141414]">Trend der letzten 7 Tage</h3>
        </div>
        <span className="text-sm font-semibold text-emerald-700">+{Math.round(((points[6] - points[0]) / points[0]) * 100 || 12)}%</span>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4">
        <div className="absolute inset-y-0 left-16 right-4 grid grid-rows-4 gap-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border-t border-slate-200/70" />
          ))}
        </div>
        <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between text-[11px] text-slate-400">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <svg viewBox="0 0 230 120" className="relative h-[220px] w-full overflow-visible">
          <defs>
            <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L198 108 L18 108 Z`} fill="url(#trendGrad)" opacity="0.9" />
          <path d={path} fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
          {points.map((value, index) => {
            const x = 18 + index * 28;
            const y = 98 - (value / max) * 78;
            return <circle key={index} cx={x} cy={y} r="4" fill="#0f766e" />;
          })}
        </svg>
        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.24em] text-slate-500">
          {labels.map((label) => (<div key={label}>{label}</div>))}
        </div>
      </div>
    </div>
  );
}

export default function FamilyPage() {
  const { activeView, setActiveView } = React.useContext(DashboardViewContext);
  const [showScheduleDetails, setShowScheduleDetails] = useState(false);
  const [showMomentsInfo, setShowMomentsInfo] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { health, photoMoments, trendHistory, mood } = useFamilyData();

  const initialAppointments: Appointment[] = [
    { id: "helga-10", title: "Morgenrunde", client: "Oma Helga", time: "10:00", location: "München, Schwabing", status: "confirmed", date: new Date().toISOString().split("T")[0] },
    { id: "helga-14", title: "Einkauf bei REWE", client: "Oma Helga", time: "14:00", location: "München, Schwabing", status: "pending", date: new Date().toISOString().split("T")[0] },
    { id: "helga-17", title: "Abendessen zubereiten", client: "Oma Helga", time: "17:00", location: "München, Schwabing", status: "pending", date: new Date().toISOString().split("T")[0] },
  ];

  const currentView = activeView || "Übersicht";

  return (
    <DashboardShell role="family" title="Familien-Übersicht" subtitle="Begleitung von Oma Helga">
      <div className="space-y-6">
        {currentView === "Übersicht" && (
          <>
            <section className="bg-sage-500 text-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <button className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">Live-Aktivität</span>
              </div>
              <p className="text-lg font-medium mb-1">Maria ist beim Einkauf bei REWE</p>
              <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> München, Schwabing</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Ankunft 14:30</span>
              </div>
            </section>

            <section className="glass-card p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Wohlbefinden</p>
                  <h2 className="text-2xl font-semibold text-[#141414] mt-3">Heute im Blick</h2>
                </div>
                <div className="text-sm text-[#4a4a4a] max-w-lg">Drei zentrale Werte zeigen, wie sich der Tag entwickelt: Ernährung, Aktivität und Stimmung.</div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <HealthRing label="Ernährung" value={health.ernahrung ? 92 : 68} accent="#10b981" />
                <HealthRing label="Aktivität" value={health.bewegung || 58} accent="#22c55e" />
                <HealthRing label="Stimmung" value={mood === "super" ? 90 : mood === "ruhig" ? 74 : mood === "auffaellig" ? 55 : 80} accent="#14b8a6" />
              </div>
              <div className="mt-6">
                <TrendGraph points={trendHistory} />
              </div>
            </section>

            <div className="grid lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 glass-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-[#141414]"><Calendar className="w-5 h-5 text-sage-500" />Tagesplan</div>
                    <p className="text-sm text-warm-500">Bestehende Termine prüfen und neue Anfragen absenden.</p>
                  </div>
                  <button onClick={() => setShowScheduleDetails((prev) => !prev)} className="text-sm text-sage-600 font-medium hover:underline">Alle anzeigen</button>
                </div>
                <AnimatePresence>
                  {showScheduleDetails && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-3xl border border-black/[0.05] bg-white/95 p-4 shadow-sm mb-6">
                      <p className="text-sm text-[#4a4a4a]">Wählen Sie einen Tag aus, um Termine zu prüfen oder direkt eine neue Anfrage zu senden.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <InteractiveCalendar role="family" initialAppointments={initialAppointments} />
              </section>

              <section className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-[#141414]">Profil der Helferin</h2>
                    <p className="text-sm text-[#6b6b6b] mt-2">Maria Schmidt — Verifizierte Alltagshilfe seit 2024</p>
                  </div>
                  <button onClick={() => setProfileModalOpen(true)} className="rounded-full bg-[#1d1d1f] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black">Profil ansehen</button>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-4">
                    <div className="text-sm text-[#4a4a4a]">Bewertung</div>
                    <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-[#141414]"><Star className="w-5 h-5 text-amber-500" />4.9 / 5</div>
                  </div>
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-4">
                    <div className="text-sm text-[#4a4a4a]">Sprachen</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Deutsch</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Englisch</span></div>
                  </div>
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-4">
                    <div className="text-sm text-[#4a4a4a]">Super-Helfer Skills</div>
                    <ul className="mt-3 space-y-2 text-sm text-[#141414]"><li>• Technik-Hilfe</li><li>• Erfahrung mit Demenz</li><li>• Einfühlsame Begleitung</li></ul>
                  </div>
                </div>
              </section>
            </div>

            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#141414]">Momente</h2>
                  <p className="text-sm text-[#6b6b6b] mt-2">Schöne Alltagsszenen, die den Tag lebendig machen.</p>
                </div>
                <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Neu</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {photoMoments.slice(0, 4).map((item) => (
                  <button key={item.id} type="button" onClick={() => setShowMomentsInfo(true)} className="group overflow-hidden rounded-3xl transition-all hover:scale-[1.02] focus:outline-none">
                    <div className="relative h-32 overflow-hidden rounded-3xl bg-slate-100">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute left-4 bottom-4 right-4 text-sm font-semibold text-white">{item.title}</div>
                    </div>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {showMomentsInfo && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="rounded-3xl border border-black/[0.05] bg-white/95 p-4 text-sm text-[#4a4a4a] shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <p>Tippe auf ein Momentbild, um es vollständig anzusehen oder ein Update zu kommentieren.</p>
                      <button onClick={() => setShowMomentsInfo(false)} className="text-sm font-semibold text-sage-600 hover:text-sage-700">Schließen</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </>
        )}

        {currentView === "Tagesplan" && (
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-[#141414]"><Calendar className="w-5 h-5 text-sage-500" />Tagesplan</div>
                <p className="text-sm text-warm-500">Nur Ihr Plan, klar strukturiert und sofort bearbeitbar.</p>
              </div>
            </div>
            <AnimatePresence>
              {showScheduleDetails && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-3xl border border-black/[0.05] bg-white/95 p-4 shadow-sm mb-6">
                  <p className="text-sm text-[#4a4a4a]">Wählen Sie einen Tag aus, um Termine zu prüfen oder direkt eine neue Anfrage zu senden.</p>
                </motion.div>
              )}
            </AnimatePresence>
            <InteractiveCalendar role="family" initialAppointments={initialAppointments} />
          </section>
        )}

        {currentView === "Momente" && (
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-[#141414]"><Camera className="w-5 h-5 text-sage-500" />Momente</div>
                <p className="text-sm text-warm-500">Einfühlsame Alltagsszenen und Erinnerungen.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {photoMoments.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => setShowMomentsInfo(true)} className="group overflow-hidden rounded-3xl transition-all hover:scale-[1.02] focus:outline-none">
                  <div className="relative h-36 overflow-hidden rounded-3xl bg-slate-100">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute left-4 bottom-4 text-sm font-semibold text-white">{item.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {currentView === "Nachrichten" && (
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-[#141414]"><MessageCircle className="w-5 h-5 text-sage-500" />Nachrichten</div>
                <p className="text-sm text-warm-500">Alle jüngsten Nachrichten und Updates zentral im Blick.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { author: "Maria", message: "Ich bin auf dem Weg zum Einkauf, melde mich gleich." },
                { author: "System", message: "Der Termin um 14:00 wurde bestätigt." },
              ].map((item, index) => (
                <div key={index} className="rounded-3xl border border-black/[0.05] bg-white/95 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#141414]">{item.author}</p>
                      <p className="text-sm text-[#6b6b6b] mt-1">{item.message}</p>
                    </div>
                    <span className="text-xs text-[#6b6b6b]">Jetzt</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentView === "Einstellungen" && (
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-lg font-semibold text-[#141414]">Einstellungen</div>
                <p className="text-sm text-warm-500">Persönliche Optionen für die Familien-Übersicht.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <button className="w-full rounded-3xl border border-black/[0.05] bg-white/95 p-4 text-left shadow-sm">Benachrichtigungen verwalten</button>
              <button className="w-full rounded-3xl border border-black/[0.05] bg-white/95 p-4 text-left shadow-sm">E-Mail-Adresse ändern</button>
              <button className="w-full rounded-3xl border border-black/[0.05] bg-white/95 p-4 text-left shadow-sm">Profilinformationen bearbeiten</button>
            </div>
          </section>
        )}

        <AnimatePresence>
          {profileModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
              <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl border border-black/[0.04]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" alt="Maria Schmidt" className="h-20 w-20 rounded-full object-cover" />
                      <span className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold">✓</span>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#141414]">Maria Schmidt</p>
                      <p className="text-sm text-[#6b6b6b]">Verifizierte Alltagshilfe</p>
                    </div>
                  </div>
                  <button onClick={() => setProfileModalOpen(false)} className="text-sm font-semibold text-[#6b6b6b] hover:text-[#141414]">Schließen</button>
                </div>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-5 text-center">
                    <p className="text-sm text-[#6b6b6b]">Bewertung</p>
                    <p className="mt-3 text-2xl font-semibold text-[#141414]">⭐ 4.9</p>
                    <p className="text-xs text-[#6b6b6b] mt-1">87 Einsätze</p>
                  </div>
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-5 text-center">
                    <p className="text-sm text-[#6b6b6b]">Verifiziert</p>
                    <p className="mt-3 text-2xl font-semibold text-[#141414]">🛡️</p>
                  </div>
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-5 text-center">
                    <p className="text-sm text-[#6b6b6b]">Seit</p>
                    <p className="mt-3 text-2xl font-semibold text-[#141414]">2024</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2 mb-6">
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-5">
                    <div className="text-sm font-semibold text-[#141414]">Sprachen</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Deutsch</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Englisch</span></div>
                  </div>
                  <div className="rounded-3xl border border-black/[0.05] bg-[#f9faf8] p-5">
                    <div className="text-sm font-semibold text-[#141414]">Skills</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Technik-Hilfe</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Demenz-Erfahrung</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Einfühlsame Begleitung</span></div>
                  </div>
                </div>
                <button onClick={() => setProfileModalOpen(false)} className="w-full rounded-full bg-[#1d1d1f] px-6 py-4 text-sm font-semibold text-white transition hover:bg-black">Direkt-Nachricht senden</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}
