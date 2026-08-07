'use client';

import { Sparkles, Calendar as CalendarIcon, MapPin, ArrowRight } from 'lucide-react';

interface CaregiverFeedProps {
  onSelectChat: () => void;
}

export function CaregiverFeed({ onSelectChat }: CaregiverFeedProps) {
  const openRequests = [
    {
      id: 'req-1',
      category: 'Einkauf & Alltag',
      location_zip: '80801 Schwabing',
      title: 'Wocheneinkauf & Begleitung für Maria (82)',
      description: 'Suche eine freundliche Begleitung für meine Mutter zum REWE in der Leopoldstraße.',
      date: 'Morgen, 10:00 Uhr',
      status: 'open'
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-base font-black text-gray-900">Anfragen passend zu deinen Verfügbarkeiten</h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Das System filtert automatisch nach deinen eingestellten Zeiten und Umkreis.</p>
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
              onClick={onSelectChat}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              Details & Chat <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}