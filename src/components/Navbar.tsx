'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Heart, PlusCircle, Search, MessageSquare, User, 
  LogOut, ShieldCheck, Sparkles, Menu, X 
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();

    // Listener für Auth-Änderungen (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);

    if (authUser) {
      // Profil inkl. Rolle ('helper' oder 'seeker') laden
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  const isHelper = profile?.role === 'helper';
  const isSeeker = profile?.role === 'seeker';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/30" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Carely</span>
        </Link>

        {/* DESKTOP NAVIGATION (DYNAMISCH JE NACH ROLLE) */}
        <nav className="hidden md:flex items-center gap-1">
          
          {/* Anfragen-Feed: Vor allem für Helfende, aber auch für Hilfesuchende sichtbar */}
          <Link 
            href="/requests" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/requests' 
                ? 'bg-teal-50 text-teal-800 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4 text-teal-600" />
            <span>Offene Anfragen</span>
          </Link>

          {/* Chat-Übersicht */}
          {user && (
            <Link 
              href="/chats" 
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/chat') 
                  ? 'bg-teal-50 text-teal-800 font-black' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Meine Chats</span>
            </Link>
          )}

        </nav>

        {/* DYNAMISCHE ACTIONS & PROFILE BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* AKTION 1: "Anfrage Erstellen" Button (Besonders prominent für Hilfesuchende) */}
          {(!user || isSeeker || !profile) && (
            <Link
              href="/requests/create"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-xs shadow-md shadow-teal-700/15 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Unterstützung anfordern</span>
            </Link>
          )}

          {/* AKTION 2: Badge für Helfende */}
          {isHelper && (
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verifizierte/r Helfer/in
            </span>
          )}

          {/* USER PROFILE & LOGOUT */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center border border-teal-200">
                  {profile?.full_name ? profile.full_name.charAt(0) : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-xs font-black text-gray-900">
                    {profile?.full_name || 'Mein Konto'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium capitalize">
                    {profile?.role === 'helper' ? 'Helfer/in' : 'Hilfesuchende/r'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ml-1"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all"
              >
                Anmelden
              </Link>
            </div>
          )}

        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3">
          <Link
            href="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-700"
          >
            🔍 Offene Anfragen
          </Link>
          <Link
            href="/requests/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-teal-700"
          >
            ➕ Unterstützung anfordern
          </Link>
          {user && (
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-bold text-rose-600"
            >
              🚪 Abmelden
            </button>
          )}
        </div>
      )}
    </header>
  );
}