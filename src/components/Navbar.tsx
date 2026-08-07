'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Heart, Search, MessageSquare, 
  LogOut, Menu, X, Calendar, Wallet, Users, 
  User, Settings, ChevronDown, ShieldCheck 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { checkUser(); });
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    setUser(authUser);

    if (authUser) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      setProfile(profileData);
    }
  };

  const handleLogout = async () => {
    console.log("LOGOUT WURDE AUSGEFÜHRT");
    setDropdownOpen(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Fehler beim Logout:", err);
    }
    window.location.href = '/';
  };

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 h-16" />
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/30" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Carely</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link 
            href="/requests" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/requests' 
                ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Search className={`w-4 h-4 ${pathname === '/requests' ? 'text-teal-300' : 'text-teal-600'}`} />
            <span>Offene Anfragen</span>
          </Link>

          <Link 
            href="/family" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/dashboard/family' 
                ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className={`w-4 h-4 ${pathname === '/dashboard/family' ? 'text-teal-300' : 'text-teal-600'}`} />
            <span>Familien-Hub</span>
          </Link>

          <Link 
            href="/care-seeker/week" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/care-seeker/week' 
                ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar className={`w-4 h-4 ${pathname === '/care-seeker/week' ? 'text-teal-300' : 'text-teal-600'}`} />
            <span>Meine Woche</span>
          </Link>

          <Link 
            href="/finances" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname === '/care-seeker/finances' || pathname === '/finances'
                ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Wallet className={`w-4 h-4 ${pathname === '/care-seeker/finances' || pathname === '/finances' ? 'text-teal-300' : 'text-emerald-600'}`} />
            <span>Finanzen & Budget</span>
          </Link>

          <Link 
            href="/chats" 
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/chat') || pathname.startsWith('/chats') 
                ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 font-black' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${pathname.startsWith('/chat') || pathname.startsWith('/chats') ? 'text-teal-300' : 'text-teal-600'}`} />
            <span>Nachrichten</span>
          </Link>
        </nav>

        {/* USER PROFILE & STATE DROPDOWN */}
        <div className="hidden md:flex items-center gap-3 relative">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-2xl border border-gray-200/80 hover:border-teal-300 bg-white shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center border border-teal-200">
                  {profile?.full_name ? profile.full_name.charAt(0) : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-xs font-black text-gray-900">
                    {profile?.full_name || 'Mein Konto'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verifiziert
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN POPUP */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 z-[99999] bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 pointer-events-auto">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-900">{profile?.full_name || 'Sarah Meyer'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/caregiver/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-teal-600" /> Profil & Angaben bearbeiten
                    </Link>
                    <Link
                      href="/caregiver/availability"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-900 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-teal-600" /> Verfügbarkeit & Radius
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("BUTTON DIREKT GEKLICKT");
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left pointer-events-auto"
                    >
                      <LogOut className="w-4 h-4" /> Abmelden
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3 shadow-lg pointer-events-auto">
          <Link href="/requests" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-700">
            🔍 Offene Anfragen
          </Link>
          <Link href="/family" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-700">
            👥 Familien-Hub
          </Link>
          <Link href="/care-seeker/week" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-700">
            📅 Meine Woche
          </Link>
          <Link href="/finances" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-700">
            💳 Finanzen & Budget
          </Link>
          <Link href="/chats" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-gray-700">
            💬 Nachrichten
          </Link>
          <div className="border-t border-gray-100 pt-2 space-y-2">
            <Link href="/caregiver/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-teal-800">
              👤 Profil & Angaben
            </Link>
            <Link href="/caregiver/availability" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-bold text-teal-800">
              ⚙️ Verfügbarkeit & Radius
            </Link>
          </div>
          {user && (
            <button 
              type="button"
              onClick={handleLogout} 
              className="block w-full text-left py-2 text-sm font-bold text-rose-600 cursor-pointer"
            >
              🚪 Abmelden
            </button>
          )}
        </div>
      )}
    </header>
  );
}