'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Sparkles, MapPin, Calendar, Clock, Euro, 
  Heart, ShieldCheck, CheckCircle2, AlertCircle, FileText, Tag
} from 'lucide-react';

const CATEGORIES = [
  { id: 'einkauf', label: '🛒 Einkauf & Besorgungen' },
  { id: 'arzt', label: '🏥 Arztbegleitung' },
  { id: 'haushalt', label: '🧹 Haushalt & Garten' },
  { id: 'gesellschaft', label: '☕ Gesellschaft & Spazieren' },
  { id: 'pflege', label: '❤️ Alltagsbetreuung' },
];

export default function CreateRequestPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('einkauf');
  const [description, setDescription] = useState('');
  const [locationZip, setLocationZip] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('ca. 2 Std.');
  const [hourlyRate, setHourlyRate] = useState('18');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        // Fallback or redirect if auth is strictly needed
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !locationZip.trim() || !date.trim()) {
      setErrorMsg('Bitte fülle alle Pflichtfelder (Titel, PLZ und Termin) aus.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('care_requests')
        .insert({
          seeker_id: user?.id || null, // Nutzt die User-ID falls eingeloggt
          title: title.trim(),
          category,
          description: description.trim(),
          location_zip: locationZip.trim(),
          date: date.trim(),
          duration: duration.trim(),
          hourly_rate: Number(hourlyRate) || 18,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/requests');
      }, 1500);

    } catch (err: any) {
      console.error('Fehler beim Erstellen:', err);
      setErrorMsg(err.message || 'Anfrage konnte nicht erstellt werden. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/60 via-gray-50 to-emerald-50/20 pt-20 pb-16 px-4 sm:px-6 font-sans flex justify-center">
      
      {/* Background Decor */}
      <div className="max-w-4xl mx-auto absolute top-12 left-1/2 -translate-x-1/2 w-full h-[300px] bg-teal-200/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Navigation */}
        <div className="mb-4">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center text-gray-600 hover:text-teal-900 text-xs font-black tracking-wide transition-all duration-200 group cursor-pointer bg-white/70 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-white shadow-2xs active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-teal-600" />
            ZURÜCK
          </button>
        </div>

        {/* Card Shell */}
        <div className="bg-white/95 backdrop-blur-3xl border border-white/90 shadow-[0_20px_60px_rgba(13,148,136,0.06)] rounded-[2.2rem] p-6 sm:p-8">
          
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 text-xs font-black uppercase tracking-wider mb-2 border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Unterstützung Anfordern
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Neue Anfrage erstellen
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Beschreibe kurz, worum es geht. Verifizierte Helfende aus deiner Umgebung können sich direkt darauf bewerben.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Anfrage erfolgreich veröffentlicht!</h3>
              <p className="text-xs text-gray-500 font-medium">Leite dich direkt zur Anfragen-Übersicht weiter...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Titel */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Titel der Anfrage *
                </label>
                <input
                  type="text"
                  required
                  placeholder="z. B. Einkauf & Begleitung zum Wochenmarkt"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Kategorie */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  Kategorie
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl text-xs font-extrabold border text-left transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-gray-50 border-gray-200/80 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ort (PLZ) & Termin Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    PLZ / Ort *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. 10115 Berlin"
                    value={locationZip}
                    onChange={(e) => setLocationZip(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Wann / Datum *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z. B. Morgen, 14:00 Uhr"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              {/* Stundensatz & Dauer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Euro className="w-3.5 h-3.5 text-teal-600" />
                    Aufwandsentschädigung (€/Std.)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Geschätzte Dauer
                  </label>
                  <input
                    type="text"
                    placeholder="z. B. ca. 2 Std."
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                  Beschreibung & Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Gibt es Besonderheiten? (z. B. Rollstuhl vorhanden, schwere Taschen tragen, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl bg-gray-50/80 border border-gray-200/90 p-3.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm shadow-md shadow-teal-700/20 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {loading ? 'Wird veröffentlicht...' : 'Anfrage jetzt veröffentlichen'}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}