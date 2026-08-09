'use client';

import { useState } from 'react';
import { 
  UserPlus, ChevronRight, Heart, Sun, Sparkles, Coffee, MapPin, 
  ShieldCheck, Music, TrendingUp, TrendingDown, ArrowUpRight, 
  ArrowDownRight, Activity, Camera, Filter 
} from 'lucide-react';
import { CareRecipient } from '@/types/care';

interface HubTabProps {
  recipients: CareRecipient[];
  onSelectRecipient: (recipient: CareRecipient) => void;
}

export default function HubTab({ recipients, onSelectRecipient }: HubTabProps) {
  // State für die Graph-Auswahl
  const [selectedPersonId, setSelectedPersonId] = useState<string>(recipients[0]?.id || 'maria');

  // State für den Foto-Filter ('all' | 'maria' | 'heinrich')
  const [photoFilter, setPhotoFilter] = useState<string>('all');

  // Trend-Daten für den Graphen
  const isMaria = selectedPersonId === 'maria' || selectedPersonId === recipients[0]?.id;

  const trendData = isMaria ? {
    personName: "Maria Mustermann (Mama)",
    score: "+57%",
    statusText: "Stark ansteigendes Wohlbefinden",
    isPositive: true,
    colorTheme: {
      stroke: "#059669",
      gradientStart: "#10b981",
      bgLight: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-900",
      pillBg: "bg-emerald-100 text-emerald-800",
    },
    areaD: "M 50 140 C 120 130, 180 150, 250 100 C 320 50, 400 90, 480 50 C 550 10, 620 40, 680 20 L 680 180 L 50 180 Z",
    pathD: "M 50 140 C 120 130, 180 150, 250 100 C 320 50, 400 90, 480 50 C 550 10, 620 40, 680 20",
    points: [
      { x: 50, y: 140, val: "52%" },
      { x: 250, y: 100, val: "68%" },
      { x: 480, y: 50, val: "84%" },
      { x: 680, y: 20, val: "91%" },
    ]
  } : {
    personName: "Heinrich Mustermann (Papa)",
    score: "-14%",
    statusText: "Leichter Rückgang – Mehr Ruhe benötigt",
    isPositive: false,
    colorTheme: {
      stroke: "#e11d48",
      gradientStart: "#f43f5e",
      bgLight: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-900",
      pillBg: "bg-rose-100 text-rose-800",
    },
    areaD: "M 50 30 C 120 40, 180 30, 250 80 C 320 130, 400 90, 480 130 C 550 160, 620 140, 680 160 L 680 180 L 50 180 Z",
    pathD: "M 50 30 C 120 40, 180 30, 250 80 C 320 130, 400 90, 480 130 C 550 160, 620 140, 680 160",
    points: [
      { x: 50, y: 30, val: "88%" },
      { x: 250, y: 80, val: "72%" },
      { x: 480, y: 130, val: "61%" },
      { x: 680, y: 160, val: "58%" },
    ]
  };

  // Fotos-Datenbank mit eindeutiger Zuordnung
  const allPhotos = [
    {
      id: '1',
      recipientId: 'maria',
      recipientName: 'Maria (Mama)',
      helperName: 'Sarah M.',
      title: 'Spaziergang im Stadtpark bei Sonnenschein 🌸',
      time: 'Heute, 11:15 Uhr',
      imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e2729a?auto=format&fit=crop&q=80&w=600',
      tagBg: 'bg-emerald-600',
    },
    {
      id: '2',
      recipientId: 'heinrich',
      recipientName: 'Heinrich (Papa)',
      helperName: 'Michael W.',
      title: 'Gemeinsam frischen Apfelkuchen gebacken ☕',
      time: 'Gestern, 16:30 Uhr',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=600',
      tagBg: 'bg-blue-600',
    },
    {
      id: '3',
      recipientId: 'maria',
      recipientName: 'Maria (Mama)',
      helperName: 'Laura K.',
      title: 'Blumen umgetopft auf dem Balkon 🌿',
      time: '06. Aug, 14:00 Uhr',
      imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
      tagBg: 'bg-emerald-600',
    },
    {
      id: '4',
      recipientId: 'heinrich',
      recipientName: 'Heinrich (Papa)',
      helperName: 'Michael W.',
      title: 'Spaziergang im Rosengarten & Eis genossen 🍦',
      time: '05. Aug, 15:30 Uhr',
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600',
      tagBg: 'bg-blue-600',
    }
  ];

  // Gefilterte Fotos basierend auf der Auswahl
  const filteredPhotos = photoFilter === 'all' 
    ? allPhotos 
    : allPhotos.filter(p => p.recipientId === photoFilter || (photoFilter === 'maria' && p.recipientId === recipients[0]?.id));

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24 text-slate-900 font-sans">
      
      {/* 🌿 Top Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 bg-gradient-to-br from-[#122823] via-[#1b3d36] to-[#2a5248] text-white shadow-2xl border border-white/10">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/15 text-emerald-100 border border-white/20 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Transparente Übersicht & Seelenfrieden</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white leading-tight">
              Sicherheit, die von Herzen kommt.
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
              Hier siehst du genau, wer wann vor Ort war, wie sich das Wohlbefinden entwickelt und welche Momente geteilt wurden.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shrink-0">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-400/30 flex items-center justify-center animate-ping absolute" />
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Heart className="w-7 h-7" fill="white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-200">Gesamt-Harmonie</p>
              <p className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                Beide gut versorgt <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ☀️ Angehörigen Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {recipients.map((person) => (
          <div 
            key={person.id} 
            onClick={() => onSelectRecipient(person)}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-xs text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 group-hover:text-[#2a5248] transition-colors">{person.name}</h3>
                    <p className="text-sm font-semibold text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Berlin
                    </p>
                  </div>
                </div>

                <span className="bg-slate-100 text-slate-800 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
                  {person.relation}
                </span>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Entspannte & sonnige Tagesform</span>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3 mb-6">
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Letzter Glücksmoment
                  </span>
                  <span className="text-xs font-bold text-slate-500">Heute, 11:30</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/80 p-2 rounded-xl border border-amber-200/50 w-fit">
                  <span className="text-emerald-700 font-extrabold">Helferin Sarah M.</span>
                  <span>➔</span>
                  <span className="text-slate-900 font-extrabold">Für {person.name.split(' ')[0]}</span>
                </div>

                <p className="text-base sm:text-lg text-slate-800 font-medium italic leading-relaxed">
                  „Hat heute voller Freude Anekdoten aus dem alten Garten erzählt und den frischen Kuchen genossen.“
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-8">
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
                  <Coffee className="w-4 h-4 text-amber-700" /> Nachmittags-Kaffee
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
                  <Music className="w-4 h-4 text-emerald-700" /> Schlagermusik
                </span>
              </div>
            </div>

            <div className="w-full py-4 bg-[#2a5248] group-hover:bg-[#122823] text-white rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md">
              <span>Wohlfühl-Profil & Details öffnen</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* 📈 7-TAGE WOHLBEFINDENS-GRAPH (Gefiltert nach Person) */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-slate-500" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Wohlbefindens-Entwicklung</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">7-Tage Verlauf im Detail</h3>
          </div>

          {/* Graph Person-Switcher */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            {recipients.map((p) => {
              const active = selectedPersonId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonId(p.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Status Bar */}
        <div className={`p-5 rounded-2xl ${trendData.colorTheme.bgLight} ${trendData.colorTheme.border} border flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            {trendData.isPositive ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
                <TrendingDown className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className={`text-sm font-extrabold ${trendData.colorTheme.text}`}>
                {trendData.personName}: {trendData.statusText}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Basierend auf den täglichen Rückmeldungen der Alltagsbegleiter.
              </p>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-lg font-black shrink-0 ${trendData.colorTheme.pillBg} flex items-center gap-1.5`}>
            {trendData.isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>{trendData.score}</span>
          </div>
        </div>

        {/* Graph Render */}
        <div className="relative pt-4 pb-2">
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 730 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dynamicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trendData.colorTheme.gradientStart} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={trendData.colorTheme.gradientStart} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="40" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="40" y1="70" x2="700" y2="70" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="40" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="40" y1="170" x2="700" y2="170" stroke="#f1f5f9" strokeWidth="1.5" />

              <path d={trendData.areaD} fill="url(#dynamicGradient)" />
              <path d={trendData.pathD} fill="none" stroke={trendData.colorTheme.stroke} strokeWidth="5" strokeLinecap="round" />

              {trendData.points.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="8" fill={trendData.colorTheme.stroke} stroke="#ffffff" strokeWidth="3" />
                  <text x={pt.x} y={pt.y - 16} textAnchor="middle" className="text-[11px] font-black fill-slate-700">
                    {pt.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-xs sm:text-sm font-extrabold text-slate-400 mt-6 px-6 uppercase tracking-wider">
            <span>Montag</span>
            <span>Mittwoch</span>
            <span>Freitag</span>
            <span>Sonntag</span>
          </div>
        </div>
      </div>

      {/* 📸 ECHTZEIT FOTO-GALERIE (Mit eigenem Filter für absolute Klarheit) */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        
        {/* Header & Photo Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Echtzeit-Fotofeed</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Eindrücke aus den Einsätzen</h3>
          </div>

          {/* FOTO-FILTER FÜR PERSONEN */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setPhotoFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                photoFilter === 'all' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 Alle Fotos
            </button>
            <button
              onClick={() => setPhotoFilter('maria')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                photoFilter === 'maria' 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👵 Nur Maria
            </button>
            <button
              onClick={() => setPhotoFilter('heinrich')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                photoFilter === 'heinrich' 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👴 Nur Heinrich
            </button>
          </div>
        </div>

        {/* Gefiltertes Fotogrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-md border border-slate-200 cursor-pointer animate-in fade-in zoom-in-95 duration-300"
            >
              <img 
                src={photo.imageUrl} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent p-5 flex flex-col justify-end text-white">
                
                {/* WER ➔ FÜR WEN BADGE */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-[11px] font-extrabold ${photo.tagBg} text-white px-2.5 py-1 rounded-lg shadow-sm`}>
                    👩‍⚕️ {photo.helperName}
                  </span>
                  <span className="text-[11px] font-extrabold bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg border border-white/20">
                    ➔ Für {photo.recipientName}
                  </span>
                </div>

                <p className="text-sm font-bold leading-snug">{photo.title}</p>
                <span className="text-[11px] text-slate-300 font-medium mt-1">{photo.time}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-500">Keine weiteren Fotos für diese Person vorhanden.</p>
          </div>
        )}
      </div>

    </div>
  );
}