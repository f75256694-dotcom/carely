"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MessageCircle, Phone, ShoppingBag, Sun, User } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const scheduleContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const scheduleItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function CareSeekerPage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [showWeekView, setShowWeekView] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  return (
    <DashboardShell role="care-seeker" title="Guten Tag, Helga" subtitle="Maria kommt heute um 10 Uhr">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-8">
        <motion.section variants={itemVariants} className="glass-senior p-7">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-sage-200/80 to-sage-300/60 flex items-center justify-center ring-2 ring-white/80 shadow-[0_4px_16px_rgba(74,124,111,0.15)]">
                <User className="w-9 h-9 text-sage-700" strokeWidth={1.75} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-[-0.02em] text-[#141414]">Maria Schmidt</p>
              <p className="text-lg text-[#6b6b6b] font-light mt-0.5">Ihre Alltagshilfe</p>
            </div>
          </div>
          <motion.button onClick={() => setContactOpen((prev) => !prev)} whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(74,124,111,0.25)" }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }} className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-sage-500 text-white text-xl font-semibold rounded-3xl min-h-[64px] shadow-[0_8px_28px_rgba(74,124,111,0.3)] hover:bg-sage-600">
            <Phone className="w-6 h-6" />
            Maria anrufen
          </motion.button>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-[1.65rem] font-semibold tracking-[-0.02em] text-[#141414] mb-5 px-1">Heute</h2>
          <motion.div variants={scheduleContainerVariants} initial="hidden" animate="visible" className="space-y-3">
            <motion.div variants={scheduleItemVariants} className="glass-senior-item flex items-center gap-5 p-5">
              <div className="w-[3.75rem] h-[3.75rem] rounded-2xl bg-gradient-to-br from-amber-100/90 to-amber-200/60 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <Sun className="w-7 h-7 text-amber-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-[-0.01em] text-[#141414]">10:00 — Spaziergang</p>
                <p className="text-lg text-[#6b6b6b] font-light mt-0.5">Mit Maria im Englischen Garten</p>
              </div>
            </motion.div>
            <motion.div variants={scheduleItemVariants} className="glass-senior-item flex items-center gap-5 p-5">
              <div className="w-[3.75rem] h-[3.75rem] rounded-2xl bg-gradient-to-br from-sage-100/90 to-sage-200/60 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <ShoppingBag className="w-7 h-7 text-sage-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-[-0.01em] text-[#141414]">14:00 — Einkaufen</p>
                <p className="text-lg text-[#6b6b6b] font-light mt-0.5">Lebensmittel für die Woche</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.button onClick={() => { setShowWeekView((prev) => !prev); setShowMessages(false); }} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="inline-flex flex-col items-center justify-center gap-2.5 px-6 py-7 bg-sage-500 text-white text-xl font-semibold rounded-3xl min-h-[64px] shadow-[0_8px_28px_rgba(74,124,111,0.28)] hover:bg-sage-600">
            <Calendar className="w-8 h-8" strokeWidth={1.75} />
            <span>Meine Woche</span>
          </motion.button>
          <motion.button onClick={() => { setShowMessages((prev) => !prev); setShowWeekView(false); }} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="inline-flex flex-col items-center justify-center gap-2.5 px-6 py-7 bg-white/50 backdrop-blur-xl text-sage-700 text-xl font-semibold rounded-3xl min-h-[64px] border border-white/70 shadow-[0_4px_20px_rgba(74,124,111,0.08)] hover:bg-white/70">
            <MessageCircle className="w-8 h-8" strokeWidth={1.75} />
            <span>Nachrichten</span>
          </motion.button>
        </motion.section>

        <AnimatePresence>
          {showWeekView && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-senior p-6 border border-black/[0.05]">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-[#141414]">Woche ansehen</p>
                  <p className="text-sm text-[#6b6b6b]">Übersicht über Ihre wichtigsten Termine in dieser Woche.</p>
                </div>
                <button onClick={() => setShowWeekView(false)} className="text-sm font-semibold text-sage-600 hover:text-sage-700">Schließen</button>
              </div>
              <div className="space-y-3 text-sm text-[#4a4a4a]">
                <p>Die Woche ist hier als schnelles Dashboard verfügbar: Ihre nächsten Termine und offene Aufgaben.</p>
                <button className="w-full rounded-full bg-sage-500 py-3 text-white font-semibold hover:bg-sage-600 transition-all">Woche anzeigen</button>
              </div>
            </motion.section>
          )}
          {contactOpen && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-senior p-6 border border-black/[0.05]">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-[#141414]">Kontakt starten</p>
                  <p className="text-sm text-[#6b6b6b]">Maria anrufen oder eine Kurznachricht senden.</p>
                </div>
                <button onClick={() => setContactOpen(false)} className="text-sm font-semibold text-sage-600 hover:text-sage-700">Schließen</button>
              </div>
              <div className="space-y-3 text-sm text-[#4a4a4a]">
                <p>Telefonate führen Sie hier noch nicht live, aber der Status zeigt, dass Maria vorbereitet ist.</p>
                <button className="w-full rounded-full bg-[#1d1d1f] py-3 text-white font-semibold hover:bg-black transition-all">Anruf vorbereiten</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showMessages && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-senior p-6 border border-black/[0.05]">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-[#141414]">Nachrichten anzeigen</p>
                  <p className="text-sm text-[#6b6b6b]">Bleiben Sie im Austausch mit Maria.</p>
                </div>
                <button onClick={() => setShowMessages(false)} className="text-sm font-semibold text-sage-600 hover:text-sage-700">Schließen</button>
              </div>
              <div className="space-y-3 text-sm text-[#4a4a4a]">
                <p>Sie haben 2 neue Nachrichten: Eine Erinnerungsnachricht an Maria und eine kurze Rückmeldung zur Tagesplanung.</p>
                <button className="w-full rounded-full bg-sage-500 py-3 text-white font-semibold hover:bg-sage-600 transition-all">Nachrichten lesen</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <motion.section variants={itemVariants} className="glass-senior p-8 text-center border-dashed border-sage-200/40">
          <p className="text-lg text-[#6b6b6b] font-light">Photo moments from Maria will appear here</p>
        </motion.section>
      </motion.div>
    </DashboardShell>
  );
}
