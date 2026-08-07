'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Send, Sparkles, ShieldCheck, MapPin, 
  Calendar, Phone, CheckCheck, HeartHandshake, Heart, Star,
  CheckCircle2, Clock, Check, AlertCircle, BadgeCheck, FileText,
  DollarSign, User, ShieldAlert, Info
} from 'lucide-react';

interface Message {
  id: string;
  request_id?: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_system_message?: boolean;
}

export default function DynamicChatPage() {
  const params = useParams();
  const requestId = (params?.requestId as string) || 'demo-req-101';
  const router = useRouter();

  // State Management
  const [currentUser, setCurrentUser] = useState<any>({ 
    id: 'demo-user-me', 
    email: 'helfer@carely.de',
    user_metadata: { full_name: 'Alex Care' }
  });
  
  const [partner, setPartner] = useState<any>({ 
    id: 'partner-123',
    full_name: 'Maria Schwabing', 
    age: 82,
    role: 'seeker', 
    bio: 'Suchst Unterstützung beim Einkauf & Spazierengehen • München Schwabing',
    avatar_url: null,
    rating: 4.9,
    reviews_count: 14
  });

  const [requestDetails, setRequestDetails] = useState<any>({ 
    id: requestId,
    status: 'pending', // 'pending' | 'accepted' | 'declined' | 'completed'
    title: 'Wocheneinkauf & Begleitung zum REWE', 
    description: 'Benötige Hilfe beim Tragen von zwei Einkaufstaschen und Begleitung für ca. 1.5 Stunden.',
    location_zip: '80801 München-Schwabing', 
    date: 'Morgen, 10:00 Uhr',
    duration: '2 Stunden',
    hourly_rate: 18,
    total_amount: 36
  });

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'msg-1', 
      sender_id: 'partner-123', 
      content: 'Hallo Alex! Vielen Dank für deine Zusage zu meiner Anfrage. Passt morgen um 10:00 Uhr bei dir?', 
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
    },
    { 
      id: 'msg-2', 
      sender_id: 'demo-user-me', 
      content: 'Hallo Frau Schwabing! Ja, 10:00 Uhr passt mir perfekt. Ich werde pünktlich vor Ort sein.', 
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() 
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll down on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load User, Request Details & Setup Realtime Listener
  useEffect(() => {
    let channel: any;

    const loadChatData = async () => {
      try {
        // 1. Fetch Auth User
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setCurrentUser(authUser);
        }

        // 2. Fetch Request Details from DB if exists
        const { data: reqData } = await supabase
          .from('care_requests')
          .select('*, seeker:seeker_id(*), helper:helper_id(*)')
          .eq('id', requestId)
          .single();

        if (reqData) {
          setRequestDetails(reqData);
          const dynamicPartner = reqData.seeker_id === authUser?.id ? reqData.helper : reqData.seeker;
          if (dynamicPartner) {
            setPartner(dynamicPartner);
          }
        }

        // 3. Fetch Existing Messages
        const { data: msgData } = await supabase
          .from('messages')
          .select('*')
          .eq('request_id', requestId)
          .order('created_at', { ascending: true });

        if (msgData && msgData.length > 0) {
          setMessages(msgData);
        }

        // 4. Supabase Realtime Subscription
        channel = supabase
          .channel(`chat_${requestId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `request_id=eq.${requestId}` },
            (payload) => {
              const newMsg = payload.new as Message;
              setMessages((prev) => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          )
          .subscribe();

      } catch (err) {
        console.log('Chat-Initialisierung im Demo-Modus gestartet:', err);
      }
    };

    loadChatData();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [requestId]);

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      request_id: requestId,
      sender_id: currentUser.id,
      content: messageText,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Send to Supabase if logged in
    if (currentUser.id !== 'demo-user-me') {
      try {
        await supabase.from('messages').insert({
          request_id: requestId,
          sender_id: currentUser.id,
          content: messageText
        });
      } catch (err) {
        console.error('Fehler beim Senden:', err);
      }
    }
  };

  // Update Request Status (Accept / Decline / Complete)
  const handleUpdateStatus = async (newStatus: 'accepted' | 'declined' | 'completed') => {
    setIsUpdatingStatus(true);

    let systemText = '';
    if (newStatus === 'accepted') systemText = '🎉 Die Anfrage wurde verbindlich angenommen.';
    if (newStatus === 'declined') systemText = '❌ Die Anfrage wurde abgelehnt.';
    if (newStatus === 'completed') systemText = '✅ Der Einsatz wurde als erfolgreich abgeschlossen markiert.';

    setRequestDetails((prev: any) => ({ ...prev, status: newStatus }));

    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      sender_id: 'system',
      content: systemText,
      created_at: new Date().toISOString(),
      is_system_message: true
    };

    setMessages((prev) => [...prev, systemMsg]);

    if (currentUser.id !== 'demo-user-me') {
      await supabase.from('care_requests').update({ status: newStatus }).eq('id', requestId);
    }

    setIsUpdatingStatus(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/50 via-gray-50/80 to-emerald-50/30 pt-28 sm:pt-32 pb-12 px-3 sm:px-6 relative overflow-hidden font-sans flex flex-col items-center">
      
      {/* Background Atmosphere Blur */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-200/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full flex-1 flex flex-col relative z-10">
        
        {/* Navigation & Trust Header */}
        <div className="mb-4 flex items-center justify-between px-1">
          <button 
            onClick={() => router.push('/caregiver')} 
            className="inline-flex items-center text-gray-700 hover:text-teal-900 text-xs font-black tracking-wide transition-all duration-200 group cursor-pointer bg-white/80 hover:bg-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/90 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-teal-600" />
            ZURÜCK ZU DEN ANFRAGEN
          </button>
          
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/90 text-teal-950 text-[11px] font-extrabold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            Ende-zu-Ende geschützter Dialog
          </div>
        </div>

        {/* Main 2-Column Grid Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          
          {/* LEFT COLUMN: Main Chat Engine (8 Cols) */}
          <div className="lg:col-span-8 backdrop-blur-3xl bg-white/90 border border-white/90 shadow-[0_20px_60px_rgba(13,148,136,0.06)] rounded-[2.2rem] flex flex-col h-[680px] overflow-hidden relative">
            
            {/* Header: Partner Info */}
            <div className="p-5 sm:p-6 border-b border-gray-100 bg-white/40 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-800 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
                      {partner.full_name.charAt(0)}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-base font-black text-gray-900">{partner.full_name}</h1>
                      <BadgeCheck className="w-4 h-4 text-teal-600 fill-teal-50" />
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold line-clamp-1">{partner.bio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`Telefonische Kontaktaufnahme wird gestartet...`)}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-800 transition-all cursor-pointer"
                    title="Anrufen"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Fast Ticket Summary */}
            <div className="px-5 py-3 bg-teal-50/40 border-b border-teal-100/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-teal-900 font-extrabold">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{requestDetails.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  requestDetails.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                  requestDetails.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {requestDetails.status === 'accepted' ? 'Bestätigt' : requestDetails.status === 'completed' ? 'Abgeschlossen' : 'Offen'}
                </span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent">
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUser.id;
                
                if (msg.is_system_message) {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <div className="px-4 py-2 rounded-2xl bg-teal-950 text-teal-50 text-xs font-black shadow-xs flex items-center gap-2 border border-teal-800">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-br-none font-medium' 
                        : 'bg-white border border-gray-200/80 text-gray-800 rounded-bl-none font-medium'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/90 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Schreibe eine Nachricht..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold focus:outline-none focus:border-teal-600 transition-all placeholder:text-gray-400"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white p-3.5 rounded-2xl shadow-md transition-all cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

          {/* RIGHT COLUMN: Job Details & Action Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Action Box */}
            <div className="backdrop-blur-3xl bg-white/90 border border-white/90 shadow-[0_20px_60px_rgba(13,148,136,0.06)] rounded-[2.2rem] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Auftragsstatus</h3>
                <span className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  ID: #{requestDetails.id.slice(0, 8)}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-black text-gray-900 leading-snug">{requestDetails.title}</h2>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{requestDetails.description}</p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3 text-xs text-gray-700 font-bold bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{requestDetails.date}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-700 font-bold bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Dauer: ca. {requestDetails.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-700 font-bold bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{requestDetails.location_zip}</span>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 to-teal-950 text-white space-y-2 shadow-md">
                <div className="flex justify-between items-center text-xs text-teal-200">
                  <span>Stundensatz:</span>
                  <span className="font-bold">{requestDetails.hourly_rate} € / Std.</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-white pt-1 border-t border-teal-800">
                  <span>Gesamtwert:</span>
                  <span className="text-teal-300 text-base">{requestDetails.total_amount} €</span>
                </div>
              </div>

              {/* Action Buttons depending on status */}
              <div className="space-y-2 pt-2">
                {requestDetails.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus('accepted')}
                      disabled={isUpdatingStatus}
                      className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Anfrage verbindlich annehmen
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('declined')}
                      disabled={isUpdatingStatus}
                      className="w-full bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Anfrage ablehnen
                    </button>
                  </>
                )}

                {requestDetails.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={isUpdatingStatus}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Als erledigt markieren & Abrechnen
                  </button>
                )}

                {requestDetails.status === 'completed' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Einsatz abgeschlossen
                  </div>
                )}
              </div>
            </div>

            {/* Safety Advice Box */}
            <div className="p-4 rounded-2xl bg-white/70 border border-white/90 text-gray-500 text-[11px] leading-relaxed flex items-start gap-2.5 shadow-xs">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Zu deiner Sicherheit empfehlen wir, Vereinbarungen stets über den Carely-Chat festzuhalten.
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}