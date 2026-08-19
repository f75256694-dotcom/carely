'use client';

import { useState, useEffect } from 'react';
import CaregiverRegisterWizard from './CaregiverRegisterWizard';
import ClientRegisterWizard from './ClientRegisterWizard';
import { Users, Heart, X } from 'lucide-react';

interface RegisterWizardProps {
  role: 'helper' | 'care_seeker' | 'select' | null;
  onClose: () => void;
}

export default function RegisterWizard({ role, onClose }: RegisterWizardProps) {
  const [selectedRole, setSelectedRole] = useState<'helper' | 'care_seeker' | null>(
    role === 'select' ? null : role
  );

  useEffect(() => {
    setSelectedRole(role === 'select' ? null : role);
  }, [role]);

  if (!role) return null;

  // Rollen-Auswahl anzeigen, wenn "Anmelden" / "Mitmachen" im Header geklickt wurde
  if (!selectedRole) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pt-2">
            <h3 className="text-2xl font-serif font-bold text-[#112a24]">Wie möchtest du Helpify nutzen?</h3>
            <p className="text-slate-600 text-sm">Wähle deine Rolle aus, um mit der Registrierung zu starten.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setSelectedRole('care_seeker')}
              className="p-6 rounded-2xl border-2 border-slate-100 hover:border-[#2a524a] bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all group flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#2a524a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#112a24]">Hilfe suchen</h4>
                <p className="text-xs text-slate-500 mt-1">Unterstützung & Alltagsbegleitung für Angehörige finden.</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('helper')}
              className="p-6 rounded-2xl border-2 border-slate-100 hover:border-[#2a524a] bg-[#F0F6F4] hover:bg-teal-50 text-left transition-all group flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#2a524a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#112a24]">Helfer werden</h4>
                <p className="text-xs text-slate-500 mt-1">Flexibel Nachbarn im Alltag unterstützen & Geld verdienen.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedRole === 'helper') {
    return <CaregiverRegisterWizard onClose={onClose} />;
  }

  if (selectedRole === 'care_seeker') {
    return <ClientRegisterWizard onClose={onClose} />;
  }

  return null;
}