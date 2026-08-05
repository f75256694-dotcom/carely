"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Calendar, Camera, Heart, Home, MessageCircle, Settings, User } from "lucide-react";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import PendingVerificationBanner from "@/components/dashboard/PendingVerificationBanner";

interface DashboardShellProps {
  role: "care-seeker" | "family" | "caregiver";
  title: string;
  subtitle?: string;
  verificationStatus?: string;
  children: React.ReactNode;
}

const NAV_ITEMS = {
  "care-seeker": [
    { icon: Home, label: "Start", href: "/care-seeker" },
    { icon: Calendar, label: "Meine Woche", href: "/care-seeker#schedule" },
    { icon: MessageCircle, label: "Nachrichten", href: "/care-seeker#messages" },
    { icon: User, label: "Meine Helferin", href: "/care-seeker#helper" },
  ],
  family: [
    { icon: Home, label: "Übersicht", href: "/family" },
    { icon: Calendar, label: "Tagesplan", href: "/family#schedule" },
    { icon: Camera, label: "Momente", href: "/family#moments" },
    { icon: MessageCircle, label: "Nachrichten", href: "/family#messages" },
    { icon: Settings, label: "Einstellungen", href: "/family#settings" },
  ],
  caregiver: [
    { icon: Home, label: "Übersicht", href: "/caregiver" },
    { icon: Calendar, label: "Termine", href: "/caregiver#bookings" },
    { icon: User, label: "Klienten", href: "/caregiver#clients" },
    { icon: Settings, label: "Einnahmen", href: "/caregiver#earnings" },
  ],
};

export const DashboardViewContext = React.createContext({ activeView: "", setActiveView: (v: string) => {} });

function SeniorMeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#FAFAF8]" />
      <div className="absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] max-w-[560px] max-h-[560px] rounded-full opacity-60 blur-[90px]" style={{ background: "radial-gradient(circle, rgba(184,209,201,0.7) 0%, rgba(184,209,201,0) 70%)", animation: "mesh-drift-1 18s ease-in-out infinite" }} />
      <div className="absolute top-[30%] -right-[20%] w-[65vw] h-[65vw] max-w-[520px] max-h-[520px] rounded-full opacity-50 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(143,181,169,0.55) 0%, rgba(143,181,169,0) 70%)", animation: "mesh-drift-2 22s ease-in-out infinite" }} />
      <div className="absolute -bottom-[10%] left-[10%] w-[55vw] h-[55vw] max-w-[440px] max-h-[440px] rounded-full opacity-45 blur-[80px]" style={{ background: "radial-gradient(circle, rgba(245,244,240,0.9) 0%, rgba(220,232,228,0.4) 50%, rgba(220,232,228,0) 70%)", animation: "mesh-drift-3 16s ease-in-out infinite" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAF8]/40" />
    </div>
  );
}

function SeniorBottomNav({ navItems, pathname }: { navItems: typeof NAV_ITEMS["care-seeker"]; pathname: string }) {
  const activeIndex = navItems.findIndex((item) => pathname === item.href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-5 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="relative flex items-center justify-between px-2 py-2 bg-white/55 backdrop-blur-2xl rounded-full border border-white/70 shadow-[0_8px_40px_rgba(74,124,111,0.12),0_2px_12px_rgba(0,0,0,0.06)]">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index || (activeIndex === -1 && index === 0);
            return (
              <Link key={item.label} href={item.href} className="relative flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-full min-w-0">
                {isActive && (
                  <motion.div layoutId="senior-nav-pill" className="absolute inset-0 bg-sage-500/12 border border-sage-300/30 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <motion.div animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <item.icon className={cn("w-6 h-6 relative z-10 transition-colors duration-300", isActive ? "text-sage-600" : "text-warm-400")} strokeWidth={isActive ? 2.25 : 1.75} />
                </motion.div>
                <span className={cn("text-[11px] font-semibold relative z-10 transition-colors duration-300 tracking-tight", isActive ? "text-sage-700" : "text-warm-400")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function DashboardShell({ role, title, subtitle, verificationStatus, children }: DashboardShellProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];
  const isSenior = role === "care-seeker";

  const [activeView, setActiveView] = useState(navItems[0]?.label || "");

  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const favorites = useMemo(
    () => [
      { id: "maria", name: "Maria Schmidt" },
      { id: "helga", name: "Helga Müller" },
      { id: "klaus", name: "Klaus Weber" },
    ],
    []
  );

  const notifications = useMemo(
    () => [
      { id: "n1", text: "Maria hat den Termin um 14:00 bestätigt." },
      { id: "n2", text: "Neue Live-Aktivität: Einkauf gestartet." },
    ],
    []
  );

  function toggleNotifications() {
    setNotificationsOpen((current) => {
      if (!current) setFavoritesOpen(false);
      return !current;
    });
    setChatOpen(false);
  }

  function toggleFavorites() {
    setFavoritesOpen((current) => {
      if (!current) setNotificationsOpen(false);
      return !current;
    });
    setChatOpen(false);
  }

  function startChatWith(id: string) {
    setSelectedFavorite(id);
    setChatOpen(true);
    setFavoritesOpen(false);
    setNotificationsOpen(false);
  }

  function sendChat() {
    setChatOpen(false);
    setToast("Chat gestartet. Viel Erfolg!");
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <DashboardViewContext.Provider value={{ activeView, setActiveView }}>
      <div className={cn("min-h-screen relative", isSenior ? "mesh-gradient-senior" : "bg-warm-50")}>
        {isSenior && <SeniorMeshBackground />}

        <div className="flex relative">
          {!isSenior && (
            <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-warm-200 p-6 fixed left-0 top-[73px] bottom-0">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button key={item.label} onClick={() => setActiveView(item.label)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left w-full", activeView === item.label ? "bg-sage-50 text-sage-700" : "text-warm-500 hover:bg-warm-100 hover:text-sage-600")}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          )}

          <main className={cn("flex-1 pt-24", !isSenior && "lg:ml-64 pb-12", isSenior && "pb-32")}>
            <div className={cn("mx-auto px-6", isSenior ? "max-w-2xl" : "max-w-7xl")}>
              {isSenior ? (
                <motion.header initial="hidden" animate="visible" variants={headerVariants} className="text-center mb-14">
                  <p className="text-sm font-medium tracking-[0.2em] uppercase text-sage-500/80 mb-3">Sonntag, 2. August</p>
                  <h1 className="font-display text-[2.75rem] md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-[#141414] mb-4">{title}</h1>
                  {subtitle && <p className="text-xl md:text-2xl text-[#5a5a5a] font-light tracking-[-0.01em] leading-snug max-w-sm mx-auto">{subtitle}</p>}
                </motion.header>
              ) : (
                <header className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
                      {subtitle && <p className="text-warm-500 mt-2 text-base">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-3 relative">
                      <div className="relative">
                        <button onClick={toggleNotifications} className="relative p-2.5 rounded-xl hover:bg-warm-100 transition-colors" aria-label="Notifications">
                          <Bell className="w-5 h-5 text-warm-500" />
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
                        </button>

                        {notificationsOpen && (
                          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/[0.04] p-3 z-50">
                            <div className="text-sm font-semibold text-[#141414] mb-2">Benachrichtigungen</div>
                            <div className="space-y-2">
                              {notifications.map((n) => (
                                <div key={n.id} className="text-sm text-[#4a4a4a] p-2 rounded-xl hover:bg-warm-100 cursor-pointer">{n.text}</div>
                              ))}
                              <div className="mt-2 text-center">
                                <button onClick={() => { setNotificationsOpen(false); setToast('Alle Benachrichtigungen gelesen'); setTimeout(()=>setToast(null),2000); }} className="text-sm text-sage-600">Als gelesen markieren</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="relative">
                        <button onClick={toggleFavorites} className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-sage-600" />
                        </button>

                        {favoritesOpen && (
                          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-black/[0.04] p-3 z-50">
                            <div className="text-sm font-semibold text-[#141414] mb-2">Favoriten-Helfer</div>
                            <div className="space-y-2">
                              {favorites.map((f) => (
                                <div key={f.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-warm-100">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center text-sage-700">{f.name.split(' ')[0][0]}</div>
                                    <div>
                                      <div className="text-sm font-medium">{f.name}</div>
                                      <div className="text-xs text-[#6b6b6b]">Verifizierte Alltagshilfe</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => startChatWith(f.id)} className="text-sm text-sage-600">Chat</button>
                                    <button onClick={() => { setToast('Anfrage gesendet'); setFavoritesOpen(false); setTimeout(()=>setToast(null),1800); }} className="text-sm text-[#1d1d1f] font-semibold">Anfragen</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </header>
              )}

              {verificationStatus === 'pending' && (
                <PendingVerificationBanner />
              )}

              {children}
            </div>
          </main>
        </div>

        {isSenior && <SeniorBottomNav navItems={NAV_ITEMS["care-seeker"]} pathname={pathname} />}

        {chatOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-black/[0.04]">
              <h3 className="text-lg font-semibold">Chat mit {selectedFavorite}</h3>
              <p className="text-sm text-[#6b6b6b] mt-2">Kurz begrüßen und loslegen.</p>
              <div className="mt-4 flex gap-3">
                <button onClick={sendChat} className="bg-[#1d1d1f] text-white rounded-full px-5 py-2">Starten</button>
                <button onClick={() => setChatOpen(false)} className="text-sm text-[#6b6b6b]">Abbrechen</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {toast && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm text-white shadow-2xl">{toast}</div>}
      </div>
    </DashboardViewContext.Provider>
  );
}