'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function RequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Alle Angebote' },
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
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-32 pb-24 px-6 sm:px-12 font-sans selection:bg-teal-100">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HERO SECTION - MAXIMUM CLEANLINESS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-800/5 text-teal-900 text-xs font-bold tracking-wide border border-teal-800/10">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              Matching Feed für Helfende
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight font-serif">
              Anfragen in deiner Nähe
            </h1>
            <p className="text-base text-gray-500 font-normal leading-relaxed">
              Finde Hilfegesuche aus deiner Nachbarschaft, unterstütze Senior:innen im Alltag und verdiene dir eine faire Aufwandsentschädigung.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-gray-200/60 shadow-xs">
            <div>
              <span className="block text-2xl font-black text-gray-950">4</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Offene Anfragen</span>
            </div>
          </div>
        </div>

        {/* SEARCH & CATEGORY PILLS */}
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

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  activeCategory === cat.id
                    ? 'bg-teal-900 text-white shadow-md shadow-teal-900/10'
                    : 'bg-white text-gray-600 border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* REFINED CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => router.push(`/requests/${req.id}`)}
              className="bg-white border border-gray-200/70 rounded-[2.5rem] p-8 hover:border-teal-700/40 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-6">
                {/* TOP ROW: PROFILE & RATE */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-900 font-black text-lg">
                      {req.initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">{req.seeker}</span>
                        <span className="text-amber-500 text-xs font-bold">★ {req.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{req.location} • <strong className="text-teal-700 font-bold">{req.distance}</strong></span>
                    </div>
                  </div>

                  <span className="px-4 py-2 rounded-2xl bg-teal-50 text-teal-900 text-sm font-black border border-teal-100/60">
                    {req.rate}
                  </span>
                </div>

                {/* TITLE & DESCRIPTION */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-950 group-hover:text-teal-900 transition-colors tracking-tight font-serif">
                    {req.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                    {req.description}
                  </p>
                </div>
              </div>

              {/* BOTTOM ROW: TIME & ACTION */}
              <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {req.time}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{req.duration}</span>
                </div>
                
                <div className="px-5 py-3 rounded-2xl bg-gray-50 group-hover:bg-teal-900 group-hover:text-white text-gray-700 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs">
                  <span>Details & Helfen</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}