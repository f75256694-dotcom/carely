'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, MapPin, AlignLeft, Calendar as CalendarIcon, 
  Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Check,
  Sunrise, Coffee, Sun, Clock, Sunset
} from 'lucide-react';

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

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

export default function CreateRequestPage() {
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [description, setDescription] = useState('');
  
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'weekend' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [displayDateText, setDisplayDateText] = useState('Heute');
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  const [time, setTime] = useState('Vormittags');
  const [locationZip, setLocationZip] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const handleSelectDay = (dayNum: number) => {
    const selected = new Date(year, month, dayNum);
    const formattedDate = selected.toISOString().split('T')[0];
    setCustomDate(formattedDate);
    
    const formattedDisplay = `${dayNum < 10 ? '0' + dayNum : dayNum}.${(month + 1 < 10 ? '0' + (month + 1) : month + 1)}.${year}`;
    setDisplayDateText(formattedDisplay);
    setDateType('custom');
    setIsCalendarOpen(false);
  };

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

    const autoTitle = `${category} Unterstützung`;

    const { error: insertError } = await supabase.from('care_requests').insert([{
      user_id: user.id,
      title: autoTitle,
      category,
      description,
      date: getFinalDateString(),
      time,
      location_zip: locationZip,
      status: 'open',
    }]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/care-seeker');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-teal-50/30 to-warm-100 py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* 2026 Unicorn Glow Orbs */}
      <div className="absolute top-10 left-1/5 w-[500px] h-[500px] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/5 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        <Link href="/care-seeker" className="inline-flex items-center text-gray-500 hover:text-teal-700 mb-8 text-sm font-semibold transition-colors group">
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Zurück zur Übersicht
        </Link>

        {/* Liquid Glass Karte */}
        <div className="backdrop-blur-3xl bg-white/90 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-8 sm:p-12">
          
          {/* Header Zone with Green Question Mark */}
          <div className="mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/90 border border-teal-100/80 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-5 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Carely Concierge Engine v2.6
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4 leading-[1.1]">
              Wobei brauchst du <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Unterstützung?</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Wähle dein Anliegen. Unser intelligenter Algorithmus verbindet dich nahtlos mit geprüften und vertrauenswürdigen Nachbarn.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50/90 backdrop-blur-md text-red-600 text-sm font-medium rounded-2xl border border-red-100 shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-9">
            
            {/* Art der Hilfe */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-3.5 tracking-wide">1. Art der Hilfe wählen</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.label;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.label)}
                      className={`relative group cursor-pointer flex flex-col justify-between p-5 rounded-3xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl shadow-teal-600/30 scale-[1.02]'
                          : 'backdrop-blur-md bg-white/70 hover:bg-white text-gray-800 border-gray-200/90 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1 hover:border-teal-400/80'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-teal-700 flex items-center justify-center shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                      
                      <span className="text-3xl mb-3 block transform group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                      <div>
                        <span className="text-xs sm:text-sm font-bold leading-snug block mb-1">{cat.label}</span>
                        <span className={`text-[11px] block leading-tight ${isSelected ? 'text-teal-100' : 'text-gray-400 group-hover:text-gray-500'}`}>
                          {cat.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wann & Ort Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Wann genau (Clean typography, completely free of emojis and preset icons) */}
              <div className="relative" ref={calendarRef}>
                <label className="block text-sm font-extrabold text-gray-900 mb-2.5 tracking-wide">Wann genau?</label>
                
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  {[
                    { id: 'today', label: 'Heute' },
                    { id: 'tomorrow', label: 'Morgen' },
                    { id: 'weekend', label: 'Wochenende' },
                    { id: 'custom', label: 'Datum wählen' },
                  ].map((item) => {
                    const isSelected = dateType === item.id || (item.id === 'custom' && isCalendarOpen);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setDateType(item.id as any);
                          if (item.id === 'custom') {
                            setIsCalendarOpen(!isCalendarOpen);
                          } else {
                            setIsCalendarOpen(false);
                            if (item.id === 'today') setDisplayDateText('Heute');
                            if (item.id === 'tomorrow') setDisplayDateText('Morgen');
                            if (item.id === 'weekend') setDisplayDateText('Dieses Wochenende');
                          }
                        }}
                        className={`p-3.5 rounded-2xl text-xs font-bold transition-all duration-300 border cursor-pointer text-center flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-900 shadow-md scale-[1.02]'
                            : 'backdrop-blur-md bg-white/70 text-gray-700 border-gray-200/90 hover:bg-white hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Status-Anzeige / Trigger für Custom Kalender */}
                <div 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="cursor-pointer backdrop-blur-md bg-white/80 border border-gray-200/90 hover:border-teal-400 rounded-2xl py-3.5 px-4 text-sm text-gray-800 flex items-center justify-between shadow-sm transition-all"
                >
                  <span className="font-semibold flex items-center gap-2.5 text-gray-700">
                    <CalendarIcon className="h-4 w-4 text-teal-600" />
                    {dateType === 'custom' ? displayDateText : getFinalDateString()}
                  </span>
                  <span className="text-xs text-teal-700 font-extrabold bg-teal-50 px-3 py-1 rounded-xl border border-teal-100 shadow-xs">
                    {dateType === 'custom' ? 'Datum aktiv' : 'Preset aktiv'}
                  </span>
                </div>

                {/* Custom Kalender Dropdown Popover */}
                {isCalendarOpen && (
                  <div className="absolute left-0 right-0 mt-2 z-50 backdrop-blur-2xl bg-white/95 border border-gray-200/90 shadow-2xl rounded-3xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="font-extrabold text-gray-900 text-base">
                        {MONTH_NAMES[month]} {year}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                        <span key={d} className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">{d}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected = customDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleSelectDay(dayNum)}
                            className={`h-9 w-9 mx-auto rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                              isSelected
                                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                                : 'hover:bg-teal-50 hover:text-teal-700 text-gray-700'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Ort */}
              <div>
                <label className="block text-sm font-extrabold text-gray-900 mb-2.5 tracking-wide">Wo? (PLZ / Stadt)</label>
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
                    className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 sm:text-base transition-all shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* Tageszeit */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-3.5 tracking-wide">Tageszeit</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = time === slot.id;
                  const IconComponent = slot.icon;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTime(slot.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600 shadow-lg shadow-teal-600/25 scale-[1.01]'
                          : 'backdrop-blur-md bg-white/70 hover:bg-white text-gray-800 border-gray-200/90 shadow-sm hover:shadow-md hover:border-teal-400/80 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-extrabold block">{slot.label}</span>
                          <span className={`text-xs ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>{slot.timeRange}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white text-teal-700 flex items-center justify-center shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2.5 tracking-wide">Weitere Details (optional)</label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  rows={4}
                  placeholder="Gibt es bestimmte Dinge, die der Helfer wissen sollte? (z.B. Barrierefreiheit, Treppen, Haustiere...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full backdrop-blur-md bg-white/70 border border-gray-200/90 rounded-2xl py-4 pl-12 pr-5 text-gray-900 placeholder:text-gray-400 sm:text-base focus:outline-none focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 transition-all resize-none shadow-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-lg py-4 px-8 rounded-2xl shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:shadow-teal-600/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
              >
                <CheckCircle2 className="h-6 w-6" />
                {loading ? 'Wird veröffentlicht...' : 'Anfrage jetzt veröffentlichen'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}