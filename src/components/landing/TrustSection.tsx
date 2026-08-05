"use client";

import { motion } from "framer-motion";
import { BadgeCheck, FileSearch, Fingerprint, ScanFace, ShieldCheck } from "lucide-react";

const STEPS = [
  { step: "01", title: "Passende Helfer:in finden", description: "Entdecken Sie geprüfte Profile, die zu Ihren Bedürfnissen passen." },
  { step: "02", title: "Mit Vertrauen buchen", description: "Vereinbaren Sie Besuche mit klarer Transparenz für alle Angehörigen." },
  { step: "03", title: "Verbunden bleiben", description: "Live-Updates, Foto-Momente und Ablaufübersicht — jederzeit." },
];

const TRUST_ITEMS = [
  { icon: FileSearch, label: "ID-Verifikation", desc: "Dokumente sicher geprüft" },
  { icon: ScanFace, label: "Liveness-Check", desc: "Echtheit der Person bestätigt" },
  { icon: Fingerprint, label: "Hintergrundprüfung", desc: "Sorgfältige Prüfung der Vertrauenswürdigkeit" },
  { icon: BadgeCheck, label: "Verifizierter Status", desc: "Ein sichtbares Zeichen des Vertrauens" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding gradient-warm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-sage-600 uppercase tracking-wider mb-4">Einfacher Ablauf</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Drei Schritte zu mehr Sicherheit
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <span className="font-display text-6xl font-bold text-sage-100 absolute -top-4 left-1/2 -translate-x-1/2 select-none">{item.step}</span>
              <div className="relative pt-8">
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-warm-500">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section id="trust" className="section-padding bg-sage-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sage-700 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sage-600 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Vertrauen & Sicherheit</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-tight">
              Jede Helfer:in ist<br />liebevoll geprüft
            </h2>
            <p className="text-sage-200 text-lg leading-relaxed mb-8">
              Unser mehrstufiger Verifizierungsprozess sorgt dafür, dass jede Person auf Carely höchsten Sicherheits- und Vertrauensstandards entspricht.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 rounded-2xl border border-white/20">
              <BadgeCheck className="w-8 h-8 text-sage-300" />
              <div>
                <p className="font-semibold">Verifiziertes Teammitglied</p>
                <p className="text-sm text-sage-300">Ein Zeichen fürs gute Gefühl</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-8 h-8 text-sage-300 mb-4" />
                <p className="font-semibold mb-1">{item.label}</p>
                <p className="text-sm text-sage-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
