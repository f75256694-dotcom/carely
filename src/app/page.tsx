'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, Sparkles, ArrowRight, ShieldCheck, MapPin, 
  Users, Star, LogOut, Search, PlusCircle, Shield, Activity
} from 'lucide-react';

export default function CarelyLandingPage() {
  const [session, setSession] = useState<any>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDashboardPreview = params.get('preview') === 'dashboard';
    if (isDashboardPreview) {
      setIsPreview(true);
    }

    const handleRedirect = (userSession: any) => {
      // Wenn der User eingeloggt ist (und nicht im manuellen Vorschau-Modus), sofort weiterleiten
      if (userSession && !isDashboardPreview) {
        const role = userSession.user?.user_metadata?.role;
        if (role === 'care_giver') {
          router.replace('/requests');
        } else {
          router.replace('/family'); // Direkt zum vollwertigen Familien-Dashboard mit Graphen & Fotos
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => { 
      setSession(session);
      handleRedirect(session);
      setLoading(false); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
      setSession(session);
      handleRedirect(session);
    });
    
    return () => subscription.unsubscribe();
  }, [router]);

  // Ladebildschirm während der Weiterleitung oder Statusprüfung
  if (loading || (session && !isPreview)) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-teal-700 border-t-transparent animate-spin" />
        <p className="text-teal-900 font-bold text-sm tracking-wide">Lade dein Cockpit...</p>
      </div>
    );
  }

  // Vorschau-Modus (Nur aktiv, wenn explizit ?preview=dashboard in der URL aufgerufen wird)
  if (isPreview) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 selection:bg-teal-100 p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-8 pt-10 relative z-10">
          <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(13,148,136,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-extrabold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                Vorschau-Modus
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-gray-900">
                Willkommen bei <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Carely</span>
              </h1>
              <p className="text-gray-500 text-lg">Wähle deinen Bereich aus:</p>
            </div>
            
            <Link 
              href="/"
              className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-base font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3 shrink-0"
            >
              <span>Zurück zur Landing Page</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Link 
              href="/requests" 
              className="bg-white/90 backdrop-blur-3xl hover:border-teal-500 border border-white/90 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(13,148,136,0.08)] transition-all duration-300 hover:-translate-y-1.5 group space-y-5 block"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-all duration-300">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-gray-900">Offene Anfragen ansehen (Helfer)</h3>
              <p className="text-gray-500 text-base leading-relaxed">Entdecke Hilfegesuche in deiner unmittelbaren Nachbarschaft.</p>
            </Link>

            <Link 
              href="/family" 
              className="bg-gradient-to-br from-teal-700 to-teal-800 text-white hover:shadow-[0_25px_60px_rgba(13,148,136,0.25)] border border-teal-600 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(13,148,136,0.1)] transition-all duration-300 hover:-translate-y-1.5 group space-y-5 block"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-serif">Familien-Dashboard (Angehörige)</h3>
              <p className="text-teal-100 text-base leading-relaxed">Sieh den Status, Graphen und Fotos deiner Angehörigen in Echtzeit.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE (Vollständige 220+ Zeilen Ansicht für Besucher)
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 selection:bg-teal-100 overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-teal-500/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-3xl border-b border-gray-200/80 px-6 sm:px-12 py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/20 group-hover:scale-105 transition-all duration-300">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-3xl font-black text-gray-900 tracking-tight font-serif">Carely</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-base font-bold text-gray-600">
            <a href="#funktionen" className="hover:text-teal-700 transition-colors duration-200">Funktionen</a>
            <a href="#ablauf" className="hover:text-teal-700 transition-colors duration-200">So funktioniert's</a>
            <a href="#sicherheit" className="hover:text-teal-700 transition-colors duration-200">Vertrauen & Sicherheit</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-base font-bold text-gray-700 hover:text-teal-700 px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
            >
              Anmelden
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-base font-black shadow-lg shadow-teal-700/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-52 pb-36 px-6 sm:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-2xl border border-teal-100 text-teal-800 text-sm font-extrabold tracking-wider uppercase shadow-[0_10px_30px_rgba(13,148,136,0.06)]">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Nachbarschaftshilfe neu gedacht
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-serif leading-[1.1] text-gray-900">
            Nachbarschaftshilfe. <br />
            <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent italic font-normal">
              Hilfe von Mensch zu Mensch.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 font-normal max-w-2xl mx-auto leading-relaxed">
            Carely verbindet Hilfesuchende mit verifizierten Alltagshilfer:innen aus der Nachbarschaft. Sicher, menschlich und unkompliziert.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-lg font-black shadow-[0_20px_50px_rgba(13,148,136,0.25)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <span>Registrieren</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/90 hover:bg-white text-gray-800 text-lg font-bold border-2 border-gray-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 flex items-center justify-center"
            >
              <span>Anmelden</span>
            </Link>
          </div>

          <div className="pt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/90 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500 space-y-3">
              <ShieldCheck className="w-8 h-8 text-teal-700" />
              <h4 className="font-extrabold text-base text-gray-900">Geprüfte Identität</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Sicherheit und Vertrauen für ein gutes Gefühl im Alltag.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/90 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500 space-y-3">
              <MapPin className="w-8 h-8 text-teal-700" />
              <h4 className="font-extrabold text-base text-gray-900">Lokale Nähe</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Helfer direkt aus deiner direkten Nachbarschaft.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/90 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500 space-y-3">
              <Star className="w-8 h-8 text-teal-700 fill-teal-700" />
              <h4 className="font-extrabold text-base text-gray-900">Top-Bewertungen</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Echte Erfahrungen und transparente Rückmeldungen.</p>
            </div>
          </div>

        </div>
      </section>

      <section id="funktionen" className="py-32 px-6 sm:px-12 bg-white/70 backdrop-blur-3xl border-y border-gray-200/80 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-5 py-2.5 rounded-full border border-teal-100">
              Funktionen
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight font-serif leading-tight">
              Alles für ein <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">starkes Miteinander</span>
            </h2>
            <p className="text-gray-500 text-lg">Entwickelt für maximale Klarheit, Benutzerfreundlichkeit und Sicherheit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-teal-500 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-gray-900">Familienübersicht</h3>
              <p className="text-gray-500 text-base leading-relaxed">Bleibe jederzeit informiert, welche Termine und Besorgungen gerade anstehen.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-teal-500 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-gray-900">Sicher & Verifiziert</h3>
              <p className="text-gray-500 text-base leading-relaxed">Mehrstufige Prüfprozesse sorgen für geschützte Interaktionen ohne Kompromisse.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(13,148,136,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-teal-500 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-gray-900">Live-Updates</h3>
              <p className="text-gray-500 text-base leading-relaxed">Erhalte Echtzeit-Statusmeldungen für Einkäufe und Begleitungen direkt auf dein Gerät.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="ablauf" className="py-32 px-6 text-center space-y-10 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-3xl border border-white/90 rounded-[3rem] p-16 shadow-[0_25px_60px_rgba(13,148,136,0.08)] space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 font-serif">Bereit für ein neues Wir-Gefühl?</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Starte jetzt in wenigen Sekunden mit Carely – kostenlos und unverbindlich.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-lg font-black shadow-[0_20px_50px_rgba(13,148,136,0.25)] transition-all duration-300 hover:-translate-y-1"
            >
              Registrieren
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg font-bold transition-all duration-300 hover:-translate-y-1"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}