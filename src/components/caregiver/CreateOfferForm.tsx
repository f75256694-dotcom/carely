'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Calendar as CalendarIcon, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Sunrise, Coffee, Sun, Clock, Sunset, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'alltag', label: 'Alltagshilfe & Betreuung', desc: 'Begleitung & Fürsorge', icon: '❤️' },
  { id: 'wohnen', label: 'Wohnen gegen Hilfe', desc: 'Bezahlbares Wohnen', icon: '🏡' },
  { id: 'einkauf', label: 'Einkauf & Besorgungen', desc: 'Supermarkt & Erledigungen', icon: '🛒' },
  { id: 'haushalt', label: 'Haushalt & Garten', desc: 'Sauberkeit & Grünanlagen', icon: '🧹' },
  { id: 'gesellschaft', label: 'Gesellschaft & Freizeit', desc: 'Spazieren & Unterhaltung', icon: '☕' },
  { id: 'termin', label: 'Terminbegleitung', desc: 'Ärzte & Behörden', icon: '🚶' },
  { id: 'nacht', label: 'Nachtwache', desc: 'Sicherheit in der Nacht', icon: '🌙' },
  { id: 'technik', label: 'Technik-Hilfe', desc: 'Smartphone, PC & TV', icon: '💻' }
];

const TIME_SLOTS = [
  { id: 'Morgens', label: 'Morgens', timeRange: '06:00 – 09:00 Uhr', icon: Sunrise },
  { id: 'Vormittags', label: 'Vormittags', timeRange: '09:00 – 12:00 Uhr', icon: Coffee },
  { id: 'Mittags', label: 'Mittags', timeRange: '12:00 – 14:00 Uhr', icon: Sun },
  { id: 'Nachmittags', label: 'Nachmittags', timeRange: '14:00 – 18:00 Uhr', icon: Clock },
  { id: 'Abends', label: 'Abends', timeRange: '18:00 – 22:00 Uhr', icon: Sunset },
  { id: 'Flexibel', label: 'Flexibel', timeRange: 'Nach Absprache', icon: Sparkles }
];

interface CreateOfferFormProps {
  onSuccess: () => void;
}

export function CreateOfferForm({ onSuccess }: CreateOfferFormProps) {
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [description, setDescription] = useState('');
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'weekend' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [displayDateText, setDisplayDateText] = useState('Heute');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [time, setTime] = useState('Vormittags');
  const [locationZip, setLocationZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFinalDateString = () => {
    const now = new Date();
    if (dateType === 'today') return now.toISOString().split('T')[0];
    if (dateType === 'tomorrow') {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      return t.toISOString().split('T')[0];
    }
    if (dateType === 'weekend') return 'Dieses Wochenende';
    return customDate;
  };

  const handlePublishOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Bitte logge dich ein, um fortzufahren.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('care_requests').insert([{
      user_id: user.id,
      title: `Angebot: ${category}`,
      category,
      description,
      date: getFinalDateString(),
      time,
      location_zip: locationZip,
      status: 'open_offer',
    }]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="backdrop-blur-3xl bg-white/95 border border-white/80 shadow-xl rounded-[2.5rem] p-8 sm:p-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dienstleistung anbieten</h2>
        <p className="text-gray-500 text-sm">Erstelle ein Hilfe-Angebot für die Nachbarschaft.</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl">{error}</div>}

      <form onSubmit={handlePublishOffer} className="space-y-6">
        <div>
          <label className="block text-xs font-black text-gray-900 mb-3 uppercase tracking-wider">Kategorie wählen</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.label)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  category === cat.label
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                }`}
              >
                <span className="text-xl mb-1">{cat.icon}</span>
                <span className="text-xs font-bold leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative" ref={calendarRef}>
            <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">Wann verfügbar?</label>
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-xs font-bold flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-teal-600" /> {getFinalDateString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">PLZ / Stadtteil</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="z.B. 80801 Schwabing"
                value={locationZip}
                onChange={(e) => setLocationZip(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-gray-900 outline-none focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-sm py-4 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          {loading ? 'Wird gespeichert...' : 'Angebot veröffentlichen'}
        </button>
      </form>
    </div>
  );
}