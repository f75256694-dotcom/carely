'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send, Search, ShieldCheck } from 'lucide-react';

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    // Dummy / Supabase Abfrage für Chats
    setChats([
      { id: '1', name: 'Maria Schwabing (82)', role: 'Hilfesuchende', lastMessage: 'Können Sie morgen um 10:00 Uhr mit mir zum REWE kommen?', time: '11:42' },
      { id: '2', name: 'Herbert Becker', role: 'Helfer', lastMessage: 'Vielen Dank für Ihre Hilfe im Garten gestern!', time: 'Gestern' }
    ]);
    setActiveChat({ id: '1', name: 'Maria Schwabing (82)', role: 'Hilfesuchende' });
    setMessages([
      { id: '1', sender: 'other', text: 'Guten Tag! I habe Ihre Zusage für meinen Einkauf gesehen.', time: '11:40' },
      { id: '2', sender: 'other', text: 'Können Sie morgen um 10:00 Uhr mit mir zum REWE kommen?', time: '11:42' }
    ]);
    setLoading(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'me', text: newMessage, time: 'Gerade eben' }]);
    setNewMessage('');
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
        
        {/* CHAT CONTAINER - Füllt den gesamten Raum bis zum Boden */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 flex overflow-hidden">
          
          {/* Linke Sidebar: Chat-Liste */}
          <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                Nachrichten
              </h2>
              <span className="text-[10px] font-black bg-teal-50 text-teal-800 px-2 py-1 rounded-lg">Carely SafeChat</span>
            </div>

            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Chat durchsuchen..." 
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-xs focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {chats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-teal-50/60 border-l-4 border-teal-600' : 'hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-gray-900">{chat.name}</span>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Hauptansicht: Aktiver Chat */}
          <div className="flex-1 flex flex-col bg-white">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black flex items-center justify-center">
                      {activeChat.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-gray-900">{activeChat.name}</span>
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="text-[10px] text-gray-400">{activeChat.role}</span>
                    </div>
                  </div>
                </div>

                {/* Nachrichten-Verlauf */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-xs ${msg.sender === 'me' ? 'bg-teal-700 text-white' : 'bg-white border border-gray-100 text-gray-800'}`}>
                        <p>{msg.text}</p>
                        <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'me' ? 'text-teal-200' : 'text-gray-400'}`}>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Eingabefeld */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Schreibe eine geschützte Nachricht..." 
                    className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-teal-600"
                  />
                  <button type="submit" className="p-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-700/20 transition-all cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
                Wähle einen Chat aus der Liste aus.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}