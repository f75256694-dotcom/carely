'use client';

import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { 
  User, LogOut, Settings, ChevronDown, ShieldCheck, HeartHandshake,
  LayoutDashboard, Wallet, Calendar, MessageSquare, Inbox
} from 'lucide-react';

export type TabType = "week" | "messages" | "requests" | "hub" | "finanzen";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: 'family' | 'caregiver';
  avatarUrl?: string;
}

interface HeaderProps {
  user?: UserProfile | null;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  activeTab?: TabType;
  setActiveTab?: Dispatch<SetStateAction<TabType>> | ((tab: TabType) => void);
}

const DEFAULT_USER: UserProfile = {
  id: 'default',
  name: 'Familie Mustermann',
  role: 'family',
};

export default function Header({ 
  user, 
  onLogout, 
  onOpenSettings,
  activeTab,
  setActiveTab 
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = user || DEFAULT_USER;
  const isCaregiver = currentUser.role === 'caregiver';
  const roleLabel = isCaregiver ? 'Alltagsbegleiter/in' : 'Angehörige/r';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/'; // Leitet zur Landing Page weiter
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'hub', label: 'Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'week', label: 'Wochenplan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'requests', label: 'Anfragen', icon: <Inbox className="w-4 h-4" /> },
    { id: 'finanzen', label: 'Finanzen', icon: <Wallet className="w-4 h-4" /> },
    { id: 'messages', label: 'Nachrichten', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* App-Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-colors ${
            isCaregiver ? 'bg-blue-600' : 'bg-emerald-700'
          }`}>
            C
          </div>
          <div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight block leading-none">Carely</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isCaregiver ? 'Helfer-Portal' : 'Familien-Hub'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {setActiveTab && (
          <nav className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* User Profile Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all focus:outline-none cursor-pointer"
            aria-expanded={isOpen}
          >
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm ${
                  isCaregiver ? 'border-blue-500' : 'border-emerald-500'
                }`} 
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${
                isCaregiver 
                  ? 'bg-blue-50 text-blue-700 border-blue-500' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-500'
              }`}>
                <User className="w-5 h-5" />
              </div>
            )}
            
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 font-medium">{roleLabel}</p>
            </div>

            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl flex items-center gap-3">
                <div className={`p-2 rounded-xl text-xs font-bold ${
                  isCaregiver ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isCaregiver ? <HeartHandshake className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-500 font-medium">Konto</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                  {currentUser.email && <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>}
                </div>
              </div>

              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSettings?.();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Kontoinformationen & Einstellungen</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Abmelden</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}