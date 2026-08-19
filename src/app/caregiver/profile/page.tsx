'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Check, Clock, Briefcase } from 'lucide-react';

const AVAILABLE_SERVICES = [
  'Alltagsbegleitung',
  'Haushalt & Einkauf',
  'Grundpflege',
  'Demenzbetreuung',
  'Fahrtdienste',
];

const AVAILABILITY_OPTIONS = [
  'Vormittags',
  'Nachmittags',
  'Abends',
  'Wochenende',
];

export default function CaregiverProfilePage() {
  const [experienceYears, setExperienceYears] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { error } = await supabase
        .from('profiles')
        .update({
          experience_years: Number(experienceYears),
          services: selectedServices,
          availability: selectedAvailability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Speichern';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 flex items-center justify-center p-6 selection:bg-teal-100">
      <div className="max-w-md w-full bg-white border border-gray-200/80 rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-teal-900/5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-serif text-gray-900">Helfer-Profil vervollständigen</h2>
          <p className="text-xs text-gray-500 font-medium">
            Gib deine Erfahrung und Schwerpunkte an, um direkt mit Kunden in deiner Nähe gematcht zu werden.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Erfahrung */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Erfahrung in der Betreuung (Jahre)
            </label>
            <input
              type="number"
              required
              min={0}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="z. B. 3"
              className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
          </div>

          {/* Dienstleistungen */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1">
              Deine Angebote
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AVAILABLE_SERVICES.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleItem(selectedServices, setSelectedServices, service)}
                    className={`w-full p-3.5 rounded-2xl border text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20'
                        : 'bg-gray-50/80 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{service}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verfügbarkeit */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-gray-500 px-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Wann bist du meistens verfügbar?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABILITY_OPTIONS.map((slot) => {
                const isSelected = selectedAvailability.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleItem(selectedAvailability, setSelectedAvailability, slot)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all duration-200 text-center cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20'
                        : 'bg-gray-50/80 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white text-sm font-black rounded-2xl shadow-lg shadow-teal-700/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Speichere Profile...' : 'Profil aktivieren & Matching starten'}
          </button>
        </form>
      </div>
    </div>
  );
}