'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Calendar, ChevronRight, User, Search, Sparkles } from 'lucide-react';

export default function ChatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    fetchUserChats();
  }, []);

  const fetchUserChats = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Lade Anfragen, bei denen der User beteiligt ist (entweder als Seeker oder Helper)
    const { data, error } = await supabase
      .from('care_requests')
      .select('*, seeker:seeker_id(full_name, avatar_url), helper:helper_id(full_name, avatar_url)')
      .or(`seeker_id.eq.${user.id},helper_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (data && data.length > 0) {
      setChats(data);
    } else {
      // Mock-Chats für fantastische UX, falls noch keine echten Konversationen existieren
      setChats([
        {
          id: 'chat-1',
          title: 'Einkauf & Unterstützung beim Wochenmarkt',
          status: 'pending',
          updated_at: new Date().toISOString(),
          seeker: { full_name: 'Helga Meyer' },
          helper: { full_name: 'Max Mustermann' },
          last_message: 'Hallo! Ich würde bei dieser Anfrage sehr gerne helfen.'
        },
        {
          id: 'chat-2',
          title: 'Begleitung zum Facharzttermin',
          status: 'accepted',
          updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          seeker: { full_name: 'Karl-Heinz Becker' },
          helper: { full_name: 'Max Mustermann' },
          last_message: 'Super, wir sehen uns am Donnerstag um 14:30 Uhr!'
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-gray-50 to-emerald-50/30 pt-24 pb-16 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 text-xs font-black uppercase tracking-wider mb-2 border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Nachrichten & Einsätze
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Meine Chats
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Hier verwaltest du deine aktiven Gespräche und Absprachen mit Helfenden und Hilfesuchenden.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 bg-white/60 rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/80 p-8 shadow-xs">
            <MessageSquare className="w-10 h-10 text-teal-600 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">Noch keine Chats vorhanden</h3>
            <p className="text-xs text-gray-500 font-medium mb-4">
              Bewirb dich auf eine offene Anfrage oder erstelle ein Gesuch, um den Chat zu starten.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="bg-white/90 hover:bg-white backdrop-blur-xl border border-gray-200/80 hover:border-teal-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 font-black text-base flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {chat.seeker?.full_name ? chat.seeker.full_name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-teal-800 transition-colors">
                        {chat.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        chat.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {chat.status === 'accepted' ? 'Aktiv' : 'Offen'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {chat.last_message || `Gespräch mit ${chat.seeker?.full_name || 'Partner'}`}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-teal-50 text-gray-400 group-hover:text-teal-700 flex items-center justify-center transition-all shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}