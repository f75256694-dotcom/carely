"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const subtextY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const badgeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen gradient-hero overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-sage-200/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-sage-100/40 blur-3xl" />
      </div>

      <div className="relative section-padding pt-32 md:pt-40 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div style={{ scale: badgeScale }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-sage-200/50 mb-8">
            <Sparkles className="w-4 h-4 text-sage-500" />
            <span className="text-sm font-medium text-sage-700">Herzliche Hilfe, die gut tut</span>
          </motion.div>

          <motion.h1 style={{ y: headlineY, opacity: headlineOpacity }} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-[#141414]">
            Nachbarschaftshilfe.
          </motion.h1>
          <motion.h2 style={{ y: headlineY, opacity: headlineOpacity }} className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 text-[#3d7066] italic">
            Hilfe von Mensch zu Mensch.
          </motion.h2>

          <motion.p style={{ y: subtextY, opacity: headlineOpacity }} className="text-base md:text-lg text-warm-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Carely verbindet Hilfesuchende mit verifizierten Alltagshelfer:innen aus der Nachbarschaft. Ob gemeinsame Einkäufe, technische Unterstützung, ein offenes Ohr oder Hilfe im Haushalt – wir bringen menschliche Unterstützung in den Alltag.
          </motion.p>

          <motion.div style={{ opacity: headlineOpacity }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-[#3d7066] hover:bg-[#2f5951] text-white font-semibold rounded-full px-8 py-3.5 transition-all hover:scale-[102%] shadow-lg">Jetzt starten <ArrowRight className="w-5 h-5 inline-block ml-2" /></Link>
            <a href="#scroll-story" className="btn-secondary text-base !px-8 !py-4">So funktioniert&apos;s</a>
          </motion.div>

          <motion.div style={{ opacity: headlineOpacity }} className="mt-16 flex items-center justify-center gap-6 text-sm text-warm-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sage-500" />
              <span>ID-geprüfte Helfer:innen</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-warm-300" />
            <span>Nur nicht-medizinische Unterstützung</span>
            <div className="w-1 h-1 rounded-full bg-warm-300" />
            <span>Echte Familien-Transparenz</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
