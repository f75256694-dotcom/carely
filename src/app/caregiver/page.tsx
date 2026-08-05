"use client";

import Link from "next/link";
import { BadgeCheck, Calendar, Clock, Euro, MapPin, Star, TrendingUp, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { InteractiveCalendar } from "@/components/dashboard/InteractiveCalendar";

export default function CaregiverPage() {
  const [showScheduleHelp, setShowScheduleHelp] = useState(false);
  const [showEarningsDetails, setShowEarningsDetails] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const bookings = [
    { id: "helga-14", client: "Helga M.", task: "Einkauf bei REWE", time: "14:00 – 16:00", location: "Schwabing, München", status: "confirmed" },
    { id: "klaus-17", client: "Klaus W.", task: "Technik & Begleitung", time: "17:30 – 19:00", location: "Maxvorstadt, München", status: "confirmed" },
    { id: "ingrid-11", client: "Ingrid S.", task: "Kochen & Mahlzeiten", time: "Morgen 11:00", location: "Bogenhausen, München", status: "pending" },
  ];

  return (
    <DashboardShell role="caregiver" title="Helfer-Dashboard" subtitle="Willkommen zurück, Maria">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-sage-50 rounded-2xl border border-sage-200">
          <BadgeCheck className="w-7 h-7 text-sage-600" />
          <div>
            <p className="font-semibold text-sage-800">Verifizierte Alltagshilfe</p>
            <p className="text-sm text-sage-600">Alle Prüfungen bestanden · Premium-Auszeichnung aktiv</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Heutige Termine", value: "3", icon: Calendar, change: "+1 im Vergleich zu gestern" },
            { label: "Diese Woche", value: "€420", icon: Euro, change: "12 Stunden erfasst" },
            { label: "Aktive Klienten", value: "5", icon: Users, change: "2 neue in diesem Monat" },
            { label: "Bewertung", value: "4.9", icon: Star, change: "48 Bewertungen" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-sage-500" />
                <TrendingUp className="w-4 h-4 text-sage-400" />
              </div>
              <p className="text-2xl font-semibold mb-1">{stat.value}</p>
              <p className="text-sm text-warm-500">{stat.label}</p>
              <p className="text-xs text-sage-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section id="bookings" className="lg:col-span-2 glass-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg">Anstehende Termine</h2>
                <p className="text-sm text-warm-500">Schnelle Übersicht und neue Zeitfenster freigeben</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowScheduleHelp((prev) => !prev)} className="text-sm text-sage-600 font-medium hover:underline">Zeitplan verwalten</button>
                <Link href="/caregiver/shift-summary" className="rounded-full bg-[#1d1d1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">Einsatz beenden</Link>
              </div>
            </div>
            {showScheduleHelp && (
              <div className="mb-6 rounded-3xl border border-black/[0.05] bg-white/95 p-4 shadow-sm">
                <p className="text-sm text-[#4a4a4a]">Der Kalender ist jetzt in der Bearbeitung. Klicken Sie auf einen Tag, um Sprechzeiten zu prüfen oder freie Slots direkt zu definieren.</p>
              </div>
            )}
            <InteractiveCalendar
              role="caregiver"
              initialAppointments={bookings.map((booking) => ({
                id: booking.id,
                title: booking.task,
                client: booking.client,
                time: booking.time.split(" – ")[0],
                location: booking.location,
                status: booking.status as "confirmed" | "pending",
                date:
                  booking.time.includes("Morgen") ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              }))}
            />
          </section>
 
          <section id="earnings" className="glass-card p-6">
            <h2 className="font-semibold text-lg mb-6">Einnahmen-Übersicht</h2>
            <div className="space-y-4">
              <div className="p-4 bg-sage-50 rounded-xl">
                <p className="text-sm text-warm-500 mb-1">Dieser Monat</p>
                <p className="text-3xl font-semibold text-sage-700">€1.680</p>
              </div>
              <div className="rounded-3xl border border-black/[0.05] bg-white/90 p-4 h-32 flex items-center justify-center">
                <p className="text-sm text-warm-500">Ihr Finanzüberblick bleibt hier stets übersichtlich.</p>
              </div>
              <button onClick={() => setShowEarningsDetails((prev) => !prev)} className="btn-primary w-full text-sm">Auszahlungsdetails anzeigen</button>
              <AnimatePresence>
                {showEarningsDetails && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-3xl border border-black/[0.05] bg-white/95 p-4 shadow-sm">
                    <div className="grid gap-3 text-sm text-[#4a4a4a]">
                      <div className="flex items-center justify-between">
                        <span>Letzte Auszahlung</span>
                        <span className="font-semibold">€420</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Ausstehende Zahlung</span>
                        <span className="font-semibold">€180</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gebühren</span>
                        <span className="font-semibold">€24</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
 
        <section id="clients" className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Klientenverwaltung</h3>
              <p className="text-sm text-warm-500">Profile, Besuchshistorie und Notizen bleiben in Reichweite.</p>
            </div>
            <button onClick={() => setShowClientDetails((prev) => !prev)} className="text-sm text-sage-600 font-medium hover:underline">Details {showClientDetails ? "verbergen" : "anzeigen"}</button>
          </div>
          <AnimatePresence>
            {showClientDetails && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="space-y-4 pt-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-3xl border border-black/[0.05] bg-white/95 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#141414]">{booking.client}</p>
                        <p className="text-sm text-[#6b6b6b]">{booking.task}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{booking.status === "confirmed" ? "Bestätigt" : "Ausstehend"}</span>
                    </div>
                    <p className="text-sm text-[#6b6b6b] mt-3">{booking.time} · {booking.location}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </DashboardShell>
  );
}
