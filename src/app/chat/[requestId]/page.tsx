'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Send, Sparkles, ShieldCheck, MapPin, 
  Calendar, Phone, CheckCheck, HeartHandshake, Heart, Star,
  CheckCircle2, XCircle, Clock, Check, AlertCircle, BadgeCheck
} from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const requestId = params?.requestId as string;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!requestId) return;
    initChat();
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initChat = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      router.push('/login');
      return;
    }
    setUser(authUser);

    const { data: reqData } = await supabase
      .from('care_requests')
      .select('*, seeker:seeker_id(full_name, bio, role, avatar_url), helper:helper_id(full_name, bio, role, avatar_url)')
      .eq('id', requestId)
      .single();
    
    if (reqData) {
      setRequestDetails(reqData);
      const isSeeker = authUser.id === reqData.seeker_id;
      const partnerData = isSeeker ? reqData.helper : reqData.seeker;
      setPartner(partnerData || { full_name: 'Anna Schmidt', role: isSeeker ? 'helper' : 'seeker', bio: 'Herzensmensch • Erfahrene Alltagshelferin' });
    } else {
      setPartner({ full_name: 'Anna Schmidt', role: 'helper', bio: 'Herzensmensch • Erfahrene Alltagshelferin' });
      setRequestDetails({ 
        id: requestId,
        status: 'pending',
        seeker_id: 'seeker-123',
        helper_id: authUser.id,
        title: 'Einkauf & Begleitung zum Arzt', 
        location_zip: '10115 Berlin', 
        date: 'Morgen, 14:00 Uhr',
        hourly_rate: '18 €/Std.'
      });
    }

    const { data: msgData } = await supabase.from('messages').select('*').eq('request_id', requestId).order('created_at', { ascending: true });
    setMessages(msgData || []);
    setLoading(false);

    const channelId = `room_${requestId}_${Date.now()}`;
    supabase.channel(channelId).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `request_id=eq.${requestId}` }, (payload) => { setMessages((prev) => [...prev, payload.new]); }).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'care_requests', filter: `id=eq.${requestId}` }, (payload) => { setRequestDetails((prev: any) => ({ ...prev, status: payload.new.status })); }).subscribe();
  };

  const handleUpdateStatus = async (newStatus: 'accepted' | 'declined' | 'completed') => {
    setUpdatingStatus(true);
    
    await supabase.from('care_requests').update({ status: newStatus }).eq('id', requestId);

    const statusText = newStatus === 'accepted' 
      ? '🎉 Die Buchungsanfrage wurde angenommen! Der Termin steht.' 
      : newStatus === 'declined'
      ? '❌ Die Buchungsanfrage wurde abgelehnt.'
      : '✅ Der Einsatz wurde als abgeschlossen markiert.';

    await supabase.from('messages').insert({
      request_id: requestId,
      sender_id: user.id,
      content: statusText,
      is_system_message: true
    });

    setRequestDetails((prev: any) => ({ ...prev, status: newStatus }));
    setUpdatingStatus(false);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || newMessage.trim();
    if (!textToSend || !user) return;

    if (!customText) setNewMessage('');

    await supabase.from('messages').insert({
      request_id: requestId,
      sender_id: user.id,
      content: textToSend,
    });
  };

  const isHelper = requestDetails?.helper_id === user?.id;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/50 via-gray-50/80 to-emerald-50/30 pt-20 pb-8 px-3 sm:px-6 relative overflow-hidden font-sans flex flex-col items-center">
      
      {/* Background Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-teal-200/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full flex-1 flex flex-col relative z-10">
        
        {/* Navigation & Trust Bar */}
        <div className="mb-3 flex items-center justify-between px-1">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center text-gray-600 hover:text-teal-900 text-xs font-black tracking-wide transition-all duration-200 group cursor-pointer bg-white/70 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-white shadow-2xs hover:shadow-xs active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 group-hover:-translate-x-1 text-teal-600" />
            ÜBERSICHT
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 text-teal-950 text-[11px] font-extrabold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            Geschützter Chatraum
          </div>
        </div>

        {/* Main Shell */}
        <div className="backdrop-blur-3xl bg-white/90 border border-white/90 shadow-[0_20px_60px_rgba(13,148,136,0.06)] rounded-[2.2rem] flex-1 flex flex-col overflow-hidden relative">
          
          {/* USER HEADER */}
          <div className="p-5 sm:p-6 border-b border-gray-100/80 bg-white/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-teal-700/15 border-2 border-white overflow-hidden">
                    {partner?.avatar_url ? (
                      <img src={partner.avatar_url} alt={partner.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{partner?.full_name ? partner.full_name.charAt(0) : 'A'}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                      {partner?.full_name || 'Anna Schmidt'}
                    </h1>
                    
                    <BadgeCheck className="w-5 h-5 text-teal-600 shrink-0 fill-teal-100" />

                    <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200/60 text-teal-800 text-[10px] font-black uppercase tracking-wider">
                      {partner?.role === 'helper' ? 'Verifizierte Helferin' : 'Hilfesuchende/r'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                    <span>•</span>
                    <span className="line-clamp-1">{partner?.bio || 'Herzensmensch • Erfahrene Alltagshelferin'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert('Anruffunktion wird gestartet...')}
                className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-teal-900 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2 group shrink-0"
              >
                <Phone className="h-3.5 w-3.5 text-teal-400 transition-transform group-hover:rotate-12" />
                <span>Anrufen</span>
              </button>

            </div>
          </div>

          {/* EINSATZ-TICKET (STATUS-CARD) */}
          {requestDetails && (
            <div className="p-3 sm:p-4 bg-gray-50/60 border-b border-gray-100">
              <div className="max-w-3xl mx-auto rounded-2xl bg-white border border-gray-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-all">
                
                {/* Upper Metadata Ribbon */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 font-black text-xs flex items-center gap-1.5 border border-teal-100">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      {requestDetails.title}
                    </span>
                    {requestDetails.hourly_rate && (
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-100/80">
                        {requestDetails.hourly_rate}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 font-semibold text-[11px]">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-600" /> {requestDetails.location_zip}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-600" /> {requestDetails.date}</span>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  {/* STATUS: PENDING */}
                  {requestDetails.status === 'pending' && (
                    <>
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 leading-none">Offene Buchungsanfrage</p>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {isHelper ? 'Möchtest du diesen Einsatz verbindlich annehmen?' : 'Wartet auf Bestätigung durch den Helfer.'}
                          </p>
                        </div>
                      </div>

                      {isHelper ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleUpdateStatus('declined')}
                            disabled={updatingStatus}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer border border-transparent hover:border-rose-200/60 active:scale-95"
                          >
                            Ablehnen
                          </button>
                          <button
                            onClick={() => handleUpdateStatus('accepted')}
                            disabled={updatingStatus}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-black text-xs transition-all cursor-pointer shadow-md shadow-teal-600/20 active:scale-95 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            Anfrage Annehmen
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-bold">
                          Ausstehend
                        </span>
                      )}
                    </>
                  )}

                  {/* STATUS: ACCEPTED */}
                  {requestDetails.status === 'accepted' && (
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className="p-1 rounded-md bg-emerald-100 text-emerald-700"><Check className="w-3.5 h-3.5" /></span>
                        <div>
                          <p className="text-xs font-black text-gray-900 leading-none">Einsatz bestätigt 🎉</p>
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Termin steht für {requestDetails.date}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUpdateStatus('completed')}
                        disabled={updatingStatus}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Einsatz beenden & Abrechnen
                      </button>
                    </>
                  )}

                  {/* STATUS: DECLINED */}
                  {requestDetails.status === 'declined' && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                        <AlertCircle className="w-4 h-4" />
                        <span>Diese Anfrage wurde abgelehnt.</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black uppercase">Storniert</span>
                    </div>
                  )}

                  {/* STATUS: COMPLETED */}
                  {requestDetails.status === 'completed' && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Einsatz erfolgreich abgeschlossen!</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase">Abgeschlossen</span>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* MESSAGES & WATERMARK CONTAINER */}
          <div className="flex-1 relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-transparent via-white/40 to-teal-50/10">
            
            {/* WATERMARK */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
              <div className="flex items-center gap-6 mb-8 transform -rotate-12 scale-125">
                <Heart className="w-32 h-32 text-teal-900 fill-teal-900" />
                <span className="text-8xl font-black text-teal-900 tracking-tighter">Carely</span>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 relative z-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm font-bold gap-3 animate-pulse">
                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100">
                    <HeartHandshake className="h-7 w-7 text-teal-600" />
                  </div>
                  <span>Sicherer Chat wird geladen...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="max-w-md mx-auto text-center py-8 px-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-600/20">
                    <Heart className="h-6 w-6 fill-white/20" />
                  </div>
                  <h2 className="text-base font-black text-gray-900 mb-1 tracking-tight">
                    Starte das Gespräch mit {partner?.full_name?.split(' ')[0]}!
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Stimmt offene Fragen oder Details zum Termin direkt hier ab.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  
                  if (msg.is_system_message) {
                    return (
                      <div key={msg.id} className="flex justify-center my-3">
                        <div className="px-3.5 py-1 rounded-full bg-teal-900/5 border border-teal-600/10 backdrop-blur-md text-teal-950 text-[11px] font-extrabold shadow-2xs">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white font-black text-xs flex items-center justify-center shrink-0 mb-1 shadow-2xs border border-white overflow-hidden">
                          {partner?.avatar_url ? (
                            <img src={partner.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            partner?.full_name ? partner.full_name.charAt(0) : 'P'
                          )}
                        </div>
                      )}
                      <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-2xs text-xs sm:text-sm font-semibold leading-relaxed transition-all ${
                        isMe 
                          ? 'bg-gradient-to-tr from-teal-700 to-teal-600 text-white rounded-br-xs shadow-teal-900/10' 
                          : 'bg-white/95 border border-gray-200/80 text-gray-800 rounded-bl-xs shadow-gray-900/5'
                      }`}>
                        <p>{msg.content}</p>
                        <div className={`flex items-center justify-end gap-1 text-[10px] font-bold mt-1 ${isMe ? 'text-teal-100' : 'text-gray-400'}`}>
                          <span>{new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <CheckCheck className="h-3.5 w-3.5 text-teal-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT FOOTER */}
            <form onSubmit={handleSendMessage} className="p-3.5 bg-white/90 border-t border-gray-100 backdrop-blur-2xl flex items-center gap-2.5 relative z-10">
              <input
                type="text"
                placeholder={`Nachricht an ${partner?.full_name ? partner.full_name.split(' ')[0] : 'Partner'} schreiben...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 backdrop-blur-md bg-gray-50/80 border border-gray-200/90 rounded-2xl py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/15 focus:border-teal-600 text-xs sm:text-sm font-semibold shadow-inner transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-30 text-white p-3 rounded-2xl shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}