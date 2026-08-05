"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { ROLES, cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, setActiveRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === "/";

  const handleRoleSwitch = (roleId: typeof activeRole) => {
    setActiveRole(roleId);
    const role = ROLES.find((r) => r.id === roleId);
    if (role) router.push(role.path);
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4", isLanding ? "bg-white/50 backdrop-blur-glass" : "glass-nav")}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Carely</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isLanding && (
            <div className="flex items-center gap-6 mr-2">
              <a href="#features" className="text-sm text-warm-500 hover:text-sage-600 transition-colors">Funktionen</a>
              <a href="#how-it-works" className="text-sm text-warm-500 hover:text-sage-600 transition-colors">So funktioniert&apos;s</a>
              <a href="#trust" className="text-sm text-warm-500 hover:text-sage-600 transition-colors">Vertrauen & Sicherheit</a>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-warm-100/80 rounded-2xl border border-warm-200">
            {ROLES.map((role) => (
              <button key={role.id} onClick={() => handleRoleSwitch(role.id)} className={cn("px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300", activeRole === role.id && pathname.startsWith(role.path) ? "bg-white text-sage-700 shadow-soft" : "text-warm-500 hover:text-sage-600")}>
                {role.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Anmelden</Link>
            <Link href="/register" className="bg-[#3d7066] hover:bg-[#2f5951] text-white font-medium rounded-full px-5 py-2.5 transition-all shadow-sm hover:shadow-md">Jetzt starten</Link>
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors" aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden mt-4 p-4 glass-nav rounded-2xl">
          {isLanding && (
            <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-warm-200">
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm py-2">Funktionen</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm py-2">So funktioniert&apos;s</a>
              <a href="#trust" onClick={() => setMobileOpen(false)} className="text-sm py-2">Vertrauen & Sicherheit</a>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-warm-500 uppercase tracking-wider mb-1">Ansicht wechseln</span>
            {ROLES.map((role) => (
              <button key={role.id} onClick={() => handleRoleSwitch(role.id)} className={cn("px-4 py-3 text-left rounded-xl transition-colors", activeRole === role.id ? "bg-sage-50 text-sage-700" : "hover:bg-warm-100")}>
                {role.label}
              </button>
            ))}

            <div className="mt-3 border-t border-warm-200 pt-3 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Anmelden</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="bg-[#3d7066] hover:bg-[#2f5951] text-white font-medium rounded-full px-5 py-2.5 transition-all shadow-sm hover:shadow-md text-center">Jetzt starten</Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
