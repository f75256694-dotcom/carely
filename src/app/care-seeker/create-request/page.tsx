'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, AlignLeft, ChevronDown, Check } from 'lucide-react';

const CATEGORIES = [
  'Alltagshilfe & Betreuung',
  'Wohnen gegen Hilfe',
  'Einkauf & Besorgungen',
  'Haushalt & Garten',
  'Gesellschaft & Freizeit',
  'Terminbegleitung',
  'Nachtwache',
  'Technik-Hilfe'
];

const TIME_SLOTS = ['Vormittags', 'Mittags', 'Nachmittags', 'Abends', 'Flexibel'];

export default function CreateRequestPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[0]);
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
      setError('Bitte logge dich ein, um fortzufahren.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('care_requests').insert([{ user_id: user.id, title, category, description, date, time, location_zip: locationZip, status: 'open' }]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/care-seeker');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA] flex flex-col items-center py-12 px-4 sm:px-6 font-sans selection:bg-teal-100">
      
      {/* Header */}
      <div className="w-full max-w-3xl mb-10 flex items-center justify-between">
        <Link href="/care-seeker" className="flex items-center text-gray-400 hover:text-gray-800 transition-colors text-sm font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Link>
        <div className="text-2xl font-black text-teal-700 tracking-tighter">
          Carely<span className="text-teal-400">.</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-3xl bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-visible">
        <div className="px-8 pt-10 pb-6 border-b border-gray-50">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Wobei brauchst du Unterstützung?</h1>
          <p className="text-gray-500 text-sm sm:text-base">Beschreibe kurz dein Anliegen, damit wir den passenden Helfer finden.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Titel */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Zusammenfassung (Titel)</label>
              <input
                type="text"
                required
                placeholder="z.B. Wöchentliche Unterstützung beim Einkauf"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-2xl border-0 py-4 px-5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-base transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Custom Kategorie Dropdown */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-900 mb-3">Art der Hilfe</label>
              <div 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="cursor-pointer flex items-center justify-between w-full rounded-2xl border-0 py-4 px-5 text-gray-900 ring-1 ring-inset ring-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all"
              >
                <span className="font-medium">{category}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                  <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="cursor-pointer px-5 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center justify-between transition-colors"
                      >
                        {cat}
                        {category === cat && <Check className="h-4 w-4 text-teal-600" />}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Datum */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Wann genau?</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full rounded-2xl border-0 py-4 pl-12 pr-5 text-gray-900 ring-1 ring-inset ring-gray-200 sm:text-base transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Ort */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Wo? (PLZ / Stadt)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="z.B. 10115 Berlin"
                    value={locationZip}
                    onChange={(e) => setLocationZip(e.target.value)}
                    className="block w-full rounded-2xl border-0 py-4 pl-12 pr-5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 sm:text-base transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Tageszeit (Pills statt Spinner) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Tageszeit</label>
              <div className="flex flex-wrap gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                      time === slot 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">Weitere Details</label>
              <div className="relative">
                <div className="absolute top-5 left-0 pl-5 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Gibt es bestimmte Dinge, die der Helfer wissen sollte?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-2xl border-0 py-4 pl-12 pr-5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 sm:text-base transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-teal-600 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none flex items-center justify-center"
              >
                {loading ? 'Wird verarbeitet...' : 'Anfrage jetzt veröffentlichen'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}