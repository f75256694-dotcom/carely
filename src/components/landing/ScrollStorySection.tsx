"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Camera, Clock, Heart, MapPin, User } from "lucide-react";

function MockFamilyDashboard({ progress }: { progress: ReturnType<typeof useTransform<number, number>> }) {
  const tickerY = useTransform(progress, [0, 0.3, 0.6, 1], [40, 0, 0, -20]);
  const tickerOpacity = useTransform(progress, [0, 1], [1, 1]);
  const scheduleY = useTransform(progress, [0, 0.4, 0.7, 1], [60, 60, 0, -10]);
  const scheduleOpacity = useTransform(progress, [0, 1], [1, 1]);
  const momentsY = useTransform(progress, [0, 0.5, 0.8, 1], [80, 80, 80, 0]);
  const momentsOpacity = useTransform(progress, [0, 1], [1, 1]);
  const headerY = useTransform(progress, [0, 0.25, 0.5, 1], [30, 30, 0, 0]);
  const headerOpacity = useTransform(progress, [0, 1], [1, 1]);

  return (
    <>
      <motion.div style={{ y: headerY, opacity: headerOpacity }} className="flex justify-between items-center px-1 pt-1">
        <div>
          <p className="text-[10px] text-warm-500">Familienübersicht</p>
          <p className="text-sm font-semibold">Begleitung von Helga</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
          <User className="w-4 h-4 text-sage-600" />
        </div>
      </motion.div>

      <motion.div style={{ y: tickerY, opacity: tickerOpacity }} className="w-full bg-[#3d7066] text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
          <span className="text-[11px] font-medium uppercase tracking-wider opacity-90">Live-Aktivität</span>
        </div>
        <p className="text-sm font-medium">Maria ist beim Einkauf bei REWE — Ankunft 14:30</p>
        <div className="flex items-center gap-1 mt-2 opacity-80">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[11px]">München, Schwabing</span>
        </div>
      </motion.div>

      <motion.div style={{ y: scheduleY, opacity: scheduleOpacity }} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-semibold">Tagesplan</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
            <Clock className="w-4 h-4 text-sage-600" />
            <div>
              <p className="text-sm font-medium">Morgenrunde — 10:00</p>
              <p className="text-[12px] text-warm-500">mit Maria</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-warm-100 rounded-xl">
            <Clock className="w-4 h-4 text-warm-500" />
            <div>
              <p className="text-sm font-medium">Einkauf bei REWE — 14:00</p>
              <p className="text-[12px] text-warm-500">in Arbeit</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div style={{ y: momentsY, opacity: momentsOpacity }} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-semibold">Momente</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
              <Heart className="w-4 h-4 text-sage-400" />
            </div>
          ))}
        </div>
        <p className="text-[12px] text-warm-500 mt-3">Maria hat heute 3 Momente geteilt</p>
      </motion.div>
    </>
  );
}

const STORY_ITEMS = [
{ label: "Live-Aktivitäten", desc: "Echtzeit-Updates, die Sicherheit geben" },
{ label: "Tagesplanung", desc: "Alles im Blick für ein ruhiges Miteinander" },
{ label: "Gemeinsame Momente", desc: "Besondere Augenblicke der Nähe teilen" },
];

export function ScrollStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 85%", "end 5%"] });
  const deviceScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const deviceY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20]);
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.05, 0.5], [0, 1, 1]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [180, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [10, 0]);
  const textX = useTransform(scrollYProgress, [0.1, 0.4], [-50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.8, 1], [0, 1, 1, 0.3]);
  const layerProgress = useTransform(scrollYProgress, [0.12, 0.6], [0, 1]);
  const item0Opacity = useTransform(layerProgress, [0.2, 0.35], [0.3, 1]);
  const item1Opacity = useTransform(layerProgress, [0.35, 0.5], [0.3, 1]);
  const item2Opacity = useTransform(layerProgress, [0.5, 0.65], [0.3, 1]);
  const itemOpacities = [item0Opacity, item1Opacity, item2Opacity];

  return (
    <section id="scroll-story" ref={containerRef} className="relative min-h-[100vh] bg-warm-50">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        {/* radial glow behind device to lift from light background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-emerald-100/30 filter blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 max-w-md ml-auto"
          >
            <p className="text-sm font-medium text-sage-600 uppercase tracking-wider mb-4">Familienübersicht</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-tight">
              Ein beruhigendes Gefühl<br />
              <span className="text-gradient-sage">für die ganze Familie</span>
            </h2>
            <p className="text-warm-500 text-lg leading-relaxed mb-8 max-w-md">
              Erleben Sie Live-Updates, während Ihre Helferin einkauft, kocht oder Zeit mit der Person verbringt, die Ihnen am Herzen liegt. Foto-Momente und Termine — alles in einem liebevollen Überblick.
            </p>
            <div className="space-y-4">
              {STORY_ITEMS.map((item, i) => (
                <motion.div key={item.label} style={{ opacity: itemOpacities[i] }} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sage-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-sm text-warm-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            {/* EBENE 1: Äußerer Rahmen (Titanium Case) */}
            <div className="w-[290px] h-[600px] sm:w-[310px] sm:h-[630px] shrink-0 bg-slate-900 rounded-[3rem] p-[10px] shadow-2xl shadow-emerald-900/20 relative">
              {/* EBENE 2: Das Display (100% Abdeckung) */}
              <div className="w-full h-full bg-slate-50 rounded-[2.3rem] overflow-hidden relative flex flex-col">
                {/* EBENE 3a: Dynamic Island (zentriert) */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-30" />

                {/* EBENE 3b: App-Content (edge-to-edge) */}
                <div className="w-full h-full pt-11 px-3 pb-4 overflow-y-auto no-scrollbar space-y-3">
                  <MockFamilyDashboard progress={layerProgress} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
