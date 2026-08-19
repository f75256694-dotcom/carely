'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier kannst du deine Auth-Logik einbinden
  router.push('/dashboard/mvppage');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-left space-y-6">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center pt-2">
          <h3 className="text-2xl font-serif font-bold text-[#112a24]">Willkommen zurück!</h3>
          <p className="text-slate-600 text-sm">Melde dich an, um auf dein Dashboard zuzugreifen.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              E-Mail Adresse
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#2a524a] focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Passwort
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#2a524a] focus:ring-2 focus:ring-emerald-100 outline-none text-slate-800 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl font-bold bg-[#2a524a] text-white hover:bg-[#1f4239] transition-colors shadow-lg shadow-emerald-900/10 text-base"
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}