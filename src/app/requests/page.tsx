'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, MapPin, Clock, X, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function RequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: 'all', label: '✨ Alle Angebote' },
    { id: 'shopping', label: '🛒 Einkauf & Besorgungen' },
    { id: 'medical', label: '🏥 Arztbegleitung' },
    { id: 'garden', label: '🌿 Haushalt & Garten' },
    { id: 'social', label: '☕ Gesellschaft & Spazieren' },
  ];

  const requests = [
    {
      id: '1',
      title: 'Einkauf & Unterstützung beim Wochenmarkt',
      description: 'Ich suche eine liebevolle Unterstützung für den wöchentlichen Einkauf am Treptower Park. Tragetaschen sind etwas schwer geworden.',
      location: '10115 Berlin',
      distance: '1.2 km entfernt',
      time: 'Morgen, 10:00 Uhr',
      duration: 'ca. 2 Std.',
      rate: '18 €/Std.',
      seeker: 'Helga Meyer',
      rating: '4.9',
      initial: 'H'
    },
    {
      id: '2',
      title: 'Begleitung zum Facharzttermin & Nachbesprechung',
      description: 'Benötige ruhige Begleitung zum Kardiologen und eventuell kurzes Warten im Wartezimmer. Taxi wird übernommen.',
      location: '10117 Berlin',
      distance: '2.8 km entfernt',
      time: 'Übermorgen, 14:30 Uhr',
      duration: 'ca. 3 Std.',
      rate: '22 €/Std.',
      seeker: 'Karl-Heinz Becker',
      rating: '5.0',
      initial: 'K'
    },
    {
      id: '3',
      title: 'Gemeinsamer Spaziergang & Kaffee im Park',
      description: 'Meine Mutter freut sich über nette Gesellschaft für kleine Spaziergänge an der frischen Luft und nette Gespräche.',
      location: '10405 Berlin',
      distance: '4.1 km entfernt',
      time: 'Mittwoch, 15:00 Uhr',
      duration: 'ca. 1.5 Std.',
      rate: '17 €/Std.',
      seeker: 'Sabine L.',
      rating: '4.8',
      initial: 'S'
    },
    {
      id: '4',
      title: 'Hilfe bei leichter Gartenarbeit & Balkonpflanzen',
      description: 'Gießen, Umtopfen von Balkonkästen und kleine Aufräumarbeiten im Gemüsegarten vor dem Herbst.',
      location: '10247 Berlin',
      distance: '3.5 km entfernt',
      time: 'Donnerstag, 11:00 Uhr',
      duration: 'ca. 2.5 Std.',
      rate: '20 €/Std.',
      seeker: 'Werner & Gisela',
      rating: '4.9',
      initial: 'W'
    }
  ];

  const filteredRequests = requests.filter(req => req.title.toLowerCase().includes(searchTerm.toLowerCase()) || req.location.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSendRequest = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedRequest(null);
      setMessage('');
      router.push('/chats');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-32 pb-24 px-6 sm:px-12 font-sans selection:bg-teal-100">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-200/60 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-800/5 text-teal-900 text-xs font-bold tracking-wide border border-teal-800/10">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              Live Matching Feed
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight font-serif">
              Anfragen in deiner Nähe
            </h1>
            <p className="text-base text-gray-500 font-normal max-w-xl leading-relaxed">
              Finde Hilfegesuche aus deiner Nachbarschaft, unterstütze Senior:innen im Alltag und verdiene dir eine faire Aufwandsentschädigung.
            </p>
          </div>

          <div className="px-6 py-4 rounded-3xl bg-white border border-gray-200/60 shadow-xs flex items-center gap-4 shrink-0">
            <div>
              <span className="block text-2xl font-black text-gray-950">{requests.length}</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Offene Anfragen</span>
            </div>
          </div>
        </div>

        {/* LARGE FILTER BUTTONS & SEARCH */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nach Stichwort, PLZ oder Stadt suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200/80 rounded-2xl text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeCategory === cat.id
                    ? 'bg-teal-900 text-white shadow-md shadow-teal-900/10 scale-102'
                    : 'bg-white text-gray-700 border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* SINGLE COLUMN VERTICAL FEED */}
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="bg-white border border-gray-200/70 rounded-[2.5rem] p-8 sm:p-10 hover:border-teal-700/40 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
            >
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-900 font-black text-lg shrink-0">
                    {req.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{req.seeker}</span>
                      <span className="text-amber-500 text-xs font-bold">★ {req.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{req.location} • <strong className="text-teal-700 font-bold">{req.distance}</strong></span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-950 group-hover:text-teal-900 transition-colors tracking-tight font-serif">
                    {req.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                    {req.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs font-semibold text-gray-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    {req.time}
                  </span>
                  <span>•</span>
                  <span>{req.duration}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
                <span className="px-5 py-2.5 rounded-2xl bg-teal-50 text-teal-900 text-base font-black border border-teal-100/60">
                  {req.rate}
                </span>
                
                <div className="px-5 py-3 rounded-2xl bg-gray-50 group-hover:bg-teal-900 group-hover:text-white text-gray-700 text-xs font-bold transition-all flex items-center gap-2 shadow-xs">
                  <span>Details ansehen</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* EXPANDED LUXURY MODAL WITH LARGE TYPOGRAPHY */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-gray-950/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white border border-gray-200/80 rounded-[2.5rem] max-w-2xl w-full p-8 sm:p-12 shadow-2xl relative space-y-8 animate-scaleUp">
            
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-3xl font-black text-gray-950 font-serif">Anfrage erfolgreich gesendet!</h3>
                <p className="text-base text-gray-500">Du wirst direkt zum Chat weitergeleitet...</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    Einsatzdetails & Bewerbung
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight font-serif leading-tight">
                    {selectedRequest.title}
                  </h2>
                </div>

                <div className="bg-gray-50/90 border border-gray-200/70 rounded-3xl p-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5">Auftraggeber</span>
                    <span className="text-base font-extrabold text-gray-900">{selectedRequest.seeker} <span className="text-amber-500 font-bold">★ {selectedRequest.rating}</span></span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5">Ort & Distanz</span>
                    <span className="text-base font-extrabold text-teal-900">{selectedRequest.location} ({selectedRequest.distance})</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5">Zeitpunkt</span>
                    <span className="text-base font-extrabold text-gray-900">{selectedRequest.time} <span className="text-gray-400 font-medium">({selectedRequest.duration})</span></span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest block mb-1.5">Vergütung</span>
                    <span className="text-lg font-black text-teal-900">{selectedRequest.rate}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Beschreibung vom Gesuch</h4>
                  <p className="text-base text-gray-700 font-medium leading-relaxed bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs">
                    "{selectedRequest.description}"
                  </p>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-extrabold text-gray-800 uppercase tracking-widest block">
                    Kurze Nachricht an {selectedRequest.seeker} (optional):
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hallo! Ich helfe sehr gerne und wohne ganz in der Nähe..."
                    className="w-full p-4.5 bg-white border border-gray-200/80 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 transition-all resize-none shadow-2xs font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-6 py-4 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSendRequest}
                    className="px-8 py-4 rounded-2xl bg-teal-900 hover:bg-teal-800 text-white text-sm font-black shadow-lg shadow-teal-900/15 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Jetzt Anfrage senden</span>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}