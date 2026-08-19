"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export type Appointment = {
  id: string;
  title: string;
  client: string;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "requested" | "available";
  date: string;
};

const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const times = ["09:00", "11:00", "13:00", "15:00", "17:00"];

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" });
}

function isSameDate(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function InteractiveCalendar({ role, initialAppointments }: { role: "caregiver" | "family"; initialAppointments: Appointment[] }) {
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [modalOpen, setModalOpen] = useState(false);
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const days = useMemo(() => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const startIndex = (firstDay.getDay() + 6) % 7;
    return Array.from({ length: 35 }, (_, i) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i - startIndex + 1));
  }, [calendarMonth]);

  const selectedKey = formatDateKey(selectedDay);
  const selectedItems = appointments.filter((appointment) => appointment.date === selectedKey).sort((a, b) => a.time.localeCompare(b.time));
  const availableSlots = times.filter((time) => !appointments.some((item) => item.date === selectedKey && item.time === time));
  const upcoming = appointments
    .filter((appointment) => new Date(appointment.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const actionLabel = role === "caregiver" ? "Neuen Slot freigeben" : "Termin anfragen";
  const confirmLabel = role === "caregiver" ? "Slot freigeben" : "Anfrage senden";
  const modalDescription = role === "caregiver" ? "Neue Verfügbarkeit für diesen Tag hinzufügen." : "Wir senden eine Anfrage an Ihre Alltagshilfe.";

  function changeMonth(direction: 1 | -1) {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  function openModal() {
    setSelectedTime(times[0]);
    setNotes("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleConfirm() {
    const newAppointment: Appointment = {
      id: `${selectedKey}-${selectedTime}-${Math.random().toString(36).slice(2)}`,
      title: role === "caregiver" ? "Freier Slot" : "Angefragter Termin",
      client: role === "caregiver" ? "Offen" : "Oma Helga",
      time: selectedTime,
      location: role === "caregiver" ? "Flexible Verfügbarkeit" : "München, Schwabing",
      status: role === "caregiver" ? "available" : "requested",
      date: selectedKey,
    };

    setAppointments((prev) => [...prev, newAppointment]);
    setModalOpen(false);
    setToast(role === "caregiver" ? "Slot wurde zum Kalender hinzugefügt." : "Termin-Anfrage wurde versendet.");
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
      <section className="glass-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b] mb-2">Kalender</p>
            <h3 className="text-xl font-semibold text-[#141414]">{role === "caregiver" ? "Ihre Woche organisieren" : "Ihr Familienkalender"}</h3>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/90 border border-black/[0.05] p-1 shadow-sm">
            <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-medium text-[#4a4a4a]">{calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</span>
            <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.22em] text-[#6b6b6b] mb-3">
          {dayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayKey = formatDateKey(day);
            const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
            const isSelected = isSameDate(day, selectedDay);
            const isToday = isSameDate(day, today);
            const appointmentsCount = appointments.filter((appointment) => appointment.date === dayKey).length;

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  setDayDetailOpen(true);
                }}
                className={`group relative rounded-3xl border p-4 min-h-[96px] text-center transition-all ${isSelected ? "bg-[#1d1d1f] text-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]" : appointmentsCount > 0 ? "bg-emerald-100 text-emerald-800 font-semibold border-emerald-200" : "bg-white border-black/[0.06] text-[#141414] hover:border-[#3d7066] hover:bg-[#f7fbf8]"} ${!isCurrentMonth ? "opacity-40" : ""}`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className={`text-sm font-semibold ${isToday && !isSelected ? "ring-1 ring-black/10 rounded-full px-2 py-1" : ""}`}>{day.getDate()}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-black/[0.05] bg-white/95 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b] mb-2">Ausgewählt</p>
              <h4 className="text-lg font-semibold text-[#141414]">{formatDayLabel(selectedDay)}</h4>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f7f3] px-3 py-2 text-xs font-medium text-[#2f5951]">
              <CalendarDays className="w-4 h-4" />
              {availableSlots.length} freie Zeitfenster
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {selectedItems.length > 0 ? (
              selectedItems.map((appointment) => (
                <div key={appointment.id} className="rounded-3xl border border-black/[0.06] bg-[#fafbf9] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#141414]">{appointment.title}</p>
                      <p className="text-sm text-[#6b6b6b] mt-1">{appointment.client} · {appointment.time}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${appointment.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : appointment.status === "pending" ? "bg-amber-100 text-amber-700" : appointment.status === "requested" ? "bg-slate-100 text-slate-600" : "bg-sage-100 text-sage-700"}`}>
                      {appointment.status === "confirmed" ? "Bestätigt" : appointment.status === "pending" ? "Ausstehend" : appointment.status === "requested" ? "Angefragt" : "Frei"}
                    </span>
                  </div>
                  <p className="text-sm text-[#6b6b6b] mt-3">{appointment.location}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-black/[0.08] bg-[#fcfcfb] p-4 text-sm text-[#6b6b6b]">Keine Termine an diesem Tag. Klicken Sie auf <span className="font-semibold">{actionLabel}</span> und schaffen Sie einen neuen Eintrag.</div>
            )}
          </div>

          <button type="button" onClick={openModal} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-white font-semibold transition-all hover:bg-black shadow-sm">
            <Plus className="w-4 h-4" /> {actionLabel}
          </button>
        </div>
      </section>

      <aside className="space-y-5">
        <section className="glass-card rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Schnellzugriff</p>
              <h4 className="text-lg font-semibold text-[#141414] mt-2">Nächste Termine</h4>
            </div>
            <Sparkles className="w-5 h-5 text-[#3d7066]" />
          </div>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="rounded-3xl border border-black/[0.06] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#141414]">{appointment.time}</p>
                  <span className="text-xs text-[#6b6b6b]">{appointment.date.split("-").reverse().join(".")}</span>
                </div>
                <p className="text-sm text-[#6b6b6b] mt-2">{appointment.title} · {appointment.location}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-3xl p-5">
          <p className="text-sm text-[#6b6b6b]">Tipp</p>
          <p className="mt-3 text-sm leading-6 text-[#4a4a4a]">Wählen Sie einen Tag aus, um vorhandene Termine anzusehen oder schnell neue Zeiten freizugeben.</p>
        </section>
      </aside>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30 sm:items-center">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl border border-black/[0.05]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{role === "caregiver" ? "Neuer Slot" : "Termin anfragen"}</p>
                  <h3 className="text-xl font-semibold text-[#141414] mt-2">{formatDayLabel(selectedDay)}</h3>
                </div>
                <button type="button" onClick={closeModal} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Abbrechen</button>
              </div>

              <p className="text-sm text-[#6b6b6b] mb-5">{modalDescription}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {times.map((time) => {
                  const occupied = appointments.some((item) => item.date === selectedKey && item.time === time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${selectedTime === time ? "border-[#3d7066] bg-[#f1f8f3]" : "border-black/[0.08] bg-[#fafbfa] hover:border-[#3d7066]/60"} ${occupied ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={occupied}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141414]">{time}</span>
                        {occupied && <span className="text-xs text-slate-500">Belegt</span>}
                      </div>
                      <p className="text-xs text-[#6b6b6b] mt-2">{occupied ? "Bereits geplant" : "Verfügbar"}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label className="block text-sm text-[#6b6b6b] mb-2">Notiz</label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-3xl border border-black/[0.08] bg-[#fafbfa] px-4 py-3 text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#d9ede6]" placeholder="Optionaler Hinweis für diesen Termin" />
              </div>

              <button type="button" onClick={handleConfirm} className="mt-6 w-full rounded-full bg-[#1d1d1f] py-4 text-sm font-semibold text-white transition-all hover:bg-black">{confirmLabel}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {dayDetailOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl border border-black/[0.05]">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Tagesübersicht</p>
                  <h3 className="text-xl font-semibold text-[#141414] mt-2">{formatDayLabel(selectedDay)}</h3>
                </div>
                <button type="button" onClick={() => setDayDetailOpen(false)} className="text-sm font-semibold text-[#6b6b6b] hover:text-[#141414]">Schließen</button>
              </div>
              <div className="space-y-4">
                {selectedItems.length > 0 ? selectedItems.map((appointment) => (
                  <div key={appointment.id} className="relative rounded-3xl border border-black/[0.05] bg-[#f8faf8] p-4">
                    <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-emerald-500" />
                    <div className="ml-6 space-y-1">
                      <p className="font-semibold text-[#141414]">{appointment.time} · {appointment.client}</p>
                      <p className="text-sm text-[#6b6b6b]">{appointment.title}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-[#6b6b6b]">{appointment.status === "confirmed" ? "Bestätigt" : appointment.status === "pending" ? "Ausstehend" : appointment.status === "requested" ? "Angefragt" : "Frei"}</p>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-3xl border border-dashed border-black/[0.08] bg-[#fcfcfb] p-4 text-sm text-[#6b6b6b]">Keine Termine an diesem Tag.</div>
                )}
              </div>
              <button type="button" onClick={() => { setDayDetailOpen(false); openModal(); }} className="mt-6 w-full rounded-full bg-[#1d1d1f] py-4 text-sm font-semibold text-white transition-all hover:bg-black">Neuen Termin anfragen</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm text-white shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
