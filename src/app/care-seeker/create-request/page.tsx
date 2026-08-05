'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  AlignLeft, 
  Tag, 
  LayoutList 
} from 'lucide-react';

export default function CreateRequestPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alltagspflege');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationZip, setLocationZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Du musst eingeloggt sein, um eine Anfrage zu erstellen.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('care_requests').insert([
      {
        user_id: user.id,
        title,
        category,
        description,
        date,
        time,
        location_zip: locationZip,
        status: 'open',
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/care-seeker');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header & Logo Bereich */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <Link 
          href="/care-seeker" 
          className="flex items-center text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Zurück zur Übersicht</span>
        </Link>
        <div className="text-3xl font-extrabold text-teal-600 tracking-tight">
          Carely<span className="text-teal-300">.</span>
        </div>
      </div>

      {/* Formular Karte */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-teal-600 px-8 py-10 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Wie können wir helfen?</h1>
          <p className="text-teal-100 text-lg">Erstelle eine neue Hilfsanfrage in wenigen Sekunden.</p>
        </div>

        <div className="p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Titel */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titel der Anfrage</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="z.B. Tägliche Unterstützung gesucht"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Kategorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategorie</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LayoutList className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all appearance-none"
                >
                  <option value="Alltagspflege">Alltagspflege & Betreuung</option>
                  <option value="Wohnen gegen Pflege">Wohnen gegen Pflege</option>
                  <option value="Einkauf">Einkauf & Besorgungen</option>
                  <option value="Haushalt">Haushalt & Garten</option>
                  <option value="Gesellschaft">Gesellschaft & Freizeit</option>
                  <option value="Begleitung">Arzt- & Terminbegleitung</option>
                  <option value="Nachtpflege">Nachtwache / Nachtpflege</option>
                  <option value="Behörden">Papierkram & Behörden</option>
                  <option value="Technik">Technik-Hilfe</option>
                </select>
              </div>
            </div>

            {/* Datum & Uhrzeit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Datum / Startdatum</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Uhrzeit / Zeitfenster</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Vormittags oder 14-16 Uhr"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Postleitzahl / Ort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Einsatzort (PLZ / Stadt)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="z.B. 10115 Berlin"
                  value={locationZip}
                  onChange={(e) => setLocationZip(e.target.value)}
                  className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Details zur Anfrage</label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Was genau wird benötigt? Gibt es Besonderheiten oder Vorlieben?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-12 block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-800 shadow-sm focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Absenden Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                {loading ? 'Wird veröffentlicht...' : 'Hilfsanfrage jetzt veröffentlichen'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}