'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MapPin, Calendar as CalendarIcon, Clock, CheckCircle2, MessageSquare, 
  Sparkles, Send, Check, Download, ArrowRight, 
  Sunrise, Coffee, Sun, Sunset, AlignLeft, ChevronLeft, ChevronRight, PlusCircle, User, ShieldCheck, Navigation
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

export default function HelperDashboardPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'chats' | 'my-jobs' | 'create-offer' | 'availability'>('feed');
  
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

  const [availabilities, setAvailabilities] = useState({
    weekdayMorning: true,
    weekdayAfternoon: true,
    weekend: false,
    maxDistanceKm: 10
  });

  const [openRequests, setOpenRequests] = useState([
    {
      id: 'req-1',
      category: 'Einkauf & Alltag',
      location_zip: '80801 Schwabing',
      title: 'Wocheneinkauf & Begleitung für Maria (82)',
      description: 'Suche eine freundliche Begleitung für meine Mutter zum REWE in der Leopoldstraße.',
      date: 'Morgen, 10:00 Uhr',
      status: 'open'
    }
  ]);

  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>('maria');
  const [messages, setMessages] = useState<any[]>([
    { sender: 'incoming', text: 'Hallo! Vielen Dank für Ihre Zusage. Passt morgen um 10:00 Uhr bei Ihnen?', time: '13:20' },
    { sender: 'outgoing', text: 'Hallo Frau Schwabing! Ja, 10:00 Uhr passt perfekt.', time: '13:35' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

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

    const autoTitle = `Angebot: ${category} durch Helfer`;

    const { error: insertError } = await supabase.from('care_requests').insert([{
      user_id: user.id,
      title: autoTitle,
      category,
      description,
      date: getFinalDateString(),
      time,
      location_zip: locationZip,
      status: 'open_offer',
    }]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      setShowSuccessBanner(true);
      setLoading(false);
      setTimeout(() => {
        setShowSuccessBanner(false);
        setActiveTab('feed');
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages(prev => [...prev, { sender: 'outgoing', text: inputMessage, time: 'Gerade eben' }]);
    setInputMessage('');
  };

  const handleAcceptBooking = (reqTitle: string) => {
    setBookingConfirmed(true);
    setShowSuccessBanner(true);
    const acceptedJob = {
      id: 'job-' + Date.now(),
      title: reqTitle,
      date: 'Morgen, 10:00 Uhr',
      location_zip: '80801 München-Schwabing',
      status: 'confirmed'
    };
    setMyJobs(prev => [acceptedJob, ...prev]);
    setTimeout(() => {
      setShowSuccessBanner(false);
      setActiveTab('my-jobs');
    }, 2000);
  };

  const downloadCalendarFile = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Carely Nachbarschaftseinsatz\nDESCRIPTION:Einsatz über Carely vermittelt\nDTSTART:20260319T100000Z\nDTEND:20260319T120000Z\nLOCATION:München Schwabing\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'carely-einsatz.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-gray-50/90 to-emerald-50/40 relative overflow-hidden font-sans">
      
      {/* Absolute Header Navigation - Korrigiert (Kein "Anmelden", Kein "Unterstützung anfordern") */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 font-black">
              ❤️
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Carely</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('create-offer')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-teal-600/25 cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Unterstützung anbieten
            </button>

            <div className="hidden sm:flex items-center gap-3 bg-teal-50 border border-teal-100 px-4 py-2 rounded-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-extrabold text-teal-900">Helfer-Konto Aktiv</span>
            </div>
          </div>
        </div>
      </header>

      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-black text-sm">Erfolgreich gespeichert & aktualisiert!</p>
            <p className="text-xs text-emerald-100">Deine Änderungen wurden übernommen.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto pt-28 sm:pt-32 pb-20 px-4 sm:px-6 relative z-10 space-y-6">
        
        {/* Sub Header & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-900 text-xs font-black tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Verifizierter Helfer
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Einsätze, Matching & <span className="bg-gradient-to-r from-teal-600 to-emerald-800 bg-clip-text text-transparent">SafeChat</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200/80 shadow-xs w-fit gap-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'feed' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Offener Marktplatz-Feed ({openRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'chats' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chats & Anfragen
          </button>
          <button
            onClick={() => setActiveTab('my-jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'my-jobs' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Meine Einsätze ({myJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'availability' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Verfügbarkeiten
          </button>
        </div>

        {/* TAB 1: OPEN FEED */}
        {activeTab === 'feed' && (
          <div className="bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Anfragen passend zu deinen Verfügbarkeiten</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Das System filtert automatisch nach deinen eingestellten Zeiten und Umkreis ({availabilities.maxDistanceKm} km).</p>
              </div>
              <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-black rounded-xl border border-teal-100">
                {openRequests.length} Treffer
              </span>
            </div>

            <div className="space-y-4">
              {openRequests.map((req) => (
                <div key={req.id} className="p-6 rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white to-teal-50/10 hover:border-teal-400 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-900 font-black text-xs inline-flex items-center gap-1.5 border border-teal-100">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" /> {req.category}
                    </span>
                    <h3 className="text-base font-black text-gray-900">{req.title}</h3>
                    <p className="text-xs text-gray-600 font-medium max-w-xl">{req.description}</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 pt-1">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 text-teal-600" /> {req.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-600" /> {req.location_zip}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('chats')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    Details & Chat <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE OFFER */}
        {activeTab === 'create-offer' && (
          <div className="backdrop-blur-3xl bg-white/95 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-8 sm:p-12 max-w-3xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                Carely Helfer-Netzwerk
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
                Welche Unterstützung <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">bietest du an?</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-medium">
                Erstelle ein Dienstleistungs-Angebot, damit Hilfesuchende in deiner Nähe dich direkt finden können.
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handlePublishOffer} className="space-y-8">
              <div>
                <label className="block text-sm font-extrabold text-gray-900 mb-3 tracking-wide">1. Dienstleistung wählen</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.label;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setCategory(cat.label)}
                        className={`relative group cursor-pointer flex flex-col justify-between p-4 rounded-3xl border transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl shadow-teal-600/30 scale-[1.02]'
                            : 'bg-white/70 hover:bg-white text-gray-800 border-gray-200/90 shadow-xs hover:shadow-md'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white text-teal-700 flex items-center justify-center shadow-md">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-2xl mb-2">{cat.icon}</span>
                        <div>
                          <span className="text-xs font-bold leading-snug block mb-0.5">{cat.label}</span>
                          <span className={`text-[10px] block ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>{cat.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative" ref={calendarRef}>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2.5 tracking-wide">Verfügbar ab / Wann?</label>
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
                            if (item.id === 'custom') setIsCalendarOpen(!isCalendarOpen);
                            else {
                              setIsCalendarOpen(false);
                              if (item.id === 'today') setDisplayDateText('Heute');
                              if (item.id === 'tomorrow') setDisplayDateText('Morgen');
                              if (item.id === 'weekend') setDisplayDateText('Dieses Wochenende');
                            }
                          }}
                          className={`p-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer text-center ${
                            isSelected ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white/70 text-gray-700 border-gray-200 hover:bg-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  <div 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="cursor-pointer bg-white/80 border border-gray-200 hover:border-teal-400 rounded-2xl py-3.5 px-4 text-xs font-bold text-gray-800 flex items-center justify-between shadow-xs"
                  >
                    <span className="flex items-center gap-2 text-gray-700">
                      <CalendarIcon className="h-4 w-4 text-teal-600" />
                      {dateType === 'custom' ? displayDateText : getFinalDateString()}
                    </span>
                    <span className="text-[10px] text-teal-700 font-extrabold bg-teal-50 px-2.5 py-1 rounded-xl">Ändern</span>
                  </div>

                  {isCalendarOpen && (
                    <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-gray-200 shadow-2xl rounded-3xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-extrabold text-gray-900 text-sm">{MONTH_NAMES[month]} {year}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-xl"><ChevronLeft className="h-4 w-4" /></button>
                          <button type="button" onClick={() => setCalendarMonth(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-xl"><ChevronRight className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => <span key={d} className="text-[10px] font-extrabold text-gray-400">{d}</span>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => handleSelectDay(dayNum)}
                              className="h-8 w-8 mx-auto rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-700 text-gray-700 flex items-center justify-center cursor-pointer"
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-gray-900 mb-2.5 tracking-wide">Dein Einsatzort (PLZ / Stadt)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="z.B. 80801 München"
                      value={locationZip}
                      onChange={(e) => setLocationZip(e.target.value)}
                      className="w-full bg-white/70 border border-gray-200 rounded-2xl py-4 pl-11 pr-4 text-xs font-bold text-gray-900 outline-none focus:border-teal-600 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-900 mb-3 tracking-wide">Bevorzugte Tageszeit</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = time === slot.id;
                    const IconComponent = slot.icon;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTime(slot.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white/70 hover:bg-white text-gray-800 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-extrabold block">{slot.label}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>{slot.timeRange}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-900 mb-2 tracking-wide">Über dich & dein Angebot (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Erzähle kurz, wie du helfen kannst oder welche Vorerfahrung du mitbringst..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/70 border border-gray-200 rounded-2xl p-4 text-xs font-medium text-gray-900 outline-none focus:border-teal-600 shadow-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-sm py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                {loading ? 'Wird veröffentlicht...' : 'Unterstützung auf Marktplatz veröffentlichen'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CHATS & ANFRAGEN */}
        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-xl rounded-[2.5rem] h-[calc(100vh-210px)] min-h-[560px] overflow-hidden">
            <div className="border-r border-gray-200/80 flex flex-col bg-gray-50/50">
              <div className="p-5 border-b border-gray-200/80">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" /> SafeChat & Anfragen
                </h2>
              </div>
              <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                <div className="p-4 bg-teal-50 border-l-4 border-teal-600 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-gray-900">Maria Schwabing (82)</span>
                    <span className="text-[10px] text-gray-400 font-bold">11:42</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium">Können Sie morgen um 10:00 Uhr...</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] h-full bg-white">
              <div className="flex flex-col h-full border-r border-gray-200/80">
                <div className="px-6 py-4 border-b border-gray-200/80 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">Maria Schwabing (82)</h3>
                    <p className="text-[11px] text-gray-500 font-semibold">Wocheneinkauf & Begleitung zum REWE</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${bookingConfirmed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                    {bookingConfirmed ? 'Verbucht & Bestätigt' : 'Offen / Zu bestätigen'}
                  </span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[75%] ${msg.sender === 'outgoing' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className={`p-3.5 rounded-2xl text-xs font-medium ${msg.sender === 'outgoing' ? 'bg-teal-600 text-white rounded-tr-xs' : 'bg-white text-gray-900 border border-gray-200 rounded-tl-xs'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 font-bold">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200/80 bg-white flex items-center gap-3">
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Schreibe eine geschützte Nachricht..." 
                    className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs outline-none focus:border-teal-500 font-medium"
                  />
                  <button onClick={handleSendMessage} className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center cursor-pointer shadow-md">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50/50 p-5 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-4 shadow-xs">
                  <h4 className="text-sm font-black text-gray-900">Wocheneinkauf & Begleitung</h4>
                  <div className="space-y-2 text-xs font-bold text-gray-700">
                    <div className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl"><CalendarIcon className="w-3.5 h-3.5 text-teal-600" /> Morgen, 10:00 Uhr</div>
                    <div className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl"><Clock className="w-3.5 h-3.5 text-teal-600" /> ca. 2 Stunden</div>
                    <div className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl"><MapPin className="w-3.5 h-3.5 text-teal-600" /> 80801 Schwabing</div>
                  </div>

                  <button 
                    onClick={() => handleAcceptBooking('Wocheneinkauf & Begleitung für Maria (82)')}
                    disabled={bookingConfirmed}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> {bookingConfirmed ? 'Verbucht!' : 'Anfrage verbindlich annehmen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MY JOBS */}
        {activeTab === 'my-jobs' && (
          <div className="bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-black text-gray-900">Deine bestätigten Einsätze & Kalender</h2>
            {myJobs.length === 0 ? (
              <p className="text-xs text-gray-500 font-medium py-10 text-center">Noch keine aktiven Einsätze. Nimm Anfragen aus dem Feed an!</p>
            ) : (
              <div className="space-y-4">
                {myJobs.map(job => (
                  <div key={job.id} className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/30 flex justify-between items-center">
                    <div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">Verbucht & Im Kalender</span>
                      <h3 className="text-base font-black text-gray-900 mt-2">{job.title}</h3>
                      <p className="text-xs text-gray-600 font-medium">{job.date} • {job.location_zip}</p>
                    </div>
                    <button onClick={downloadCalendarFile} className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-teal-600" /> .ics herunterladen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AVAILABILITY MANAGER (Ultra-Polished Designer Version) */}
        {activeTab === 'availability' && (
          <div className="backdrop-blur-3xl bg-white/95 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-8 sm:p-12 space-y-8 max-w-3xl mx-auto">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Intelligentes Matching
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Deine Verfügbarkeiten & Filter</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Aktiviere deine bevorzugten Zeitfenster. Unser Matching-Algorithmus blendet dir im Feed nur passende Anfragen ein.
              </p>
            </div>

            {/* Interactive Availability Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Card 1 */}
              <div 
                onClick={() => setAvailabilities({...availabilities, weekdayMorning: !availabilities.weekdayMorning})}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between ${
                  availabilities.weekdayMorning 
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl shadow-teal-600/25 scale-[1.01]' 
                    : 'bg-white/80 hover:bg-white text-gray-800 border-gray-200/90 shadow-sm hover:border-teal-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${availabilities.weekdayMorning ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black">Unter der Woche Vormittags</h3>
                    <p className={`text-xs mt-0.5 ${availabilities.weekdayMorning ? 'text-teal-100' : 'text-gray-500'}`}>
                      08:00 – 12:00 Uhr • Ideal für Arztbesuche & Einkäufe
                    </p>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  availabilities.weekdayMorning ? 'bg-white text-teal-700 shadow-md' : 'border-2 border-gray-300'
                }`}>
                  {availabilities.weekdayMorning && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Card 2 */}
              <div 
                onClick={() => setAvailabilities({...availabilities, weekdayAfternoon: !availabilities.weekdayAfternoon})}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between ${
                  availabilities.weekdayAfternoon 
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl shadow-teal-600/25 scale-[1.01]' 
                    : 'bg-white/80 hover:bg-white text-gray-800 border-gray-200/90 shadow-sm hover:border-teal-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${availabilities.weekdayAfternoon ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black">Unter der Woche Nachmittags</h3>
                    <p className={`text-xs mt-0.5 ${availabilities.weekdayAfternoon ? 'text-teal-100' : 'text-gray-500'}`}>
                      12:00 – 18:00 Uhr • Kaffee, Spaziergänge & Botengänge
                    </p>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  availabilities.weekdayAfternoon ? 'bg-white text-teal-700 shadow-md' : 'border-2 border-gray-300'
                }`}>
                  {availabilities.weekdayAfternoon && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Card 3 */}
              <div 
                onClick={() => setAvailabilities({...availabilities, weekend: !availabilities.weekend})}
                className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between ${
                  availabilities.weekend 
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl shadow-teal-600/25 scale-[1.01]' 
                    : 'bg-white/80 hover:bg-white text-gray-800 border-gray-200/90 shadow-sm hover:border-teal-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${availabilities.weekend ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'}`}>
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black">Wochenenden</h3>
                    <p className={`text-xs mt-0.5 ${availabilities.weekend ? 'text-teal-100' : 'text-gray-500'}`}>
                      Samstag & Sonntag • Nach Absprache
                    </p>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  availabilities.weekend ? 'bg-white text-teal-700 shadow-md' : 'border-2 border-gray-300'
                }`}>
                  {availabilities.weekend && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

            </div>

            {/* Radius Slider Section */}
            <div className="bg-teal-50/60 border border-teal-100/80 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-teal-600" /> Max. Einsatz-Umkreis
                </span>
                <span className="text-xs font-black bg-teal-600 text-white px-3 py-1 rounded-xl">
                  {availabilities.maxDistanceKm} km Radius
                </span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="50" 
                value={availabilities.maxDistanceKm}
                onChange={(e) => setAvailabilities({...availabilities, maxDistanceKm: Number(e.target.value)})}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>2 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={() => { 
                setShowSuccessBanner(true); 
                setTimeout(() => setShowSuccessBanner(false), 2000); 
                setActiveTab('feed'); 
              }}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-teal-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Verfügbarkeiten speichern & Feed aktualisieren
            </button>
          </div>
        )}

      </div>
    </div>
  );
}