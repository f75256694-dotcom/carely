import { Smile, Meh, Frown } from 'lucide-react';

export default function MoodBadge({ mood }: { mood: 'happy' | 'neutral' | 'sad' }) {
  const config = {
    happy: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Smile, text: 'Ausgeglichen' },
    neutral: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Meh, text: 'Tagesform okay' },
    sad: { color: 'text-rose-600', bg: 'bg-rose-50', icon: Frown, text: 'Wenig Energie' },
  };
  const { color, bg, icon: Icon, text } = config[mood];
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg} ${color} font-bold text-xs shadow-sm border border-black/5`}>
      <Icon className="w-4 h-4" /> {text}
    </div>
  );
}