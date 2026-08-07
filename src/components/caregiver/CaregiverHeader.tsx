'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Heart, LogOut, User, Settings, ChevronDown, ShieldCheck, Plus 
} from 'lucide-react';

export function CaregiverHeader() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
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
    console.log("CARE-GIVER LOGOUT WURDE AUSGEFÜHRT");
    setDropdownOpen(false);
    try {
      localStorage.removeItem('carely_bypass');
      localStorage.removeItem('carely_role');
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Fehler beim Logout:", err);
    }
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO & BRAND */}
        <Link href="/caregiver" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white/30" />
          </div>
          <div>
            <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">Carely</span>
            <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase">Caregiver OS</span>
          </div>
        </Link>

        {/* ACTIONS & PROFILE */}
        <div className="flex items-center gap-3">
          {/* Angebot erstellen Button */}
          <Link 
            href="/caregiver/create-offer" 
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-900 text-white text-xs font-bold shadow-md shadow-teal-900/20 hover:bg-teal-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Angebot erstellen</span>
          </Link>

          {/* USER PROFILE & DROPDOWN */}
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
                <div className="text-left leading-tight hidden sm:block">
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
                      onClick={handleLogout}
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

      </div>
    </header>
  );
}