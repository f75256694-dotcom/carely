'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  MapPin, Calendar, Clock, CheckCircle2, MessageSquare, 
  ArrowRight, ShieldCheck, Sparkles, Navigation, User, FileText, Check
} from 'lucide-react';

export default function HelperDashboardPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'my-jobs' | 'completed'>('feed');
  const [openRequests, setOpenRequests] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    fetchUserDataAndData();
  }, [activeTab]);

  const fetchUserDataAndData = async () => {
    setLoading(true);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push('/login');
      return;
    }
    setUser(authUser);

    if (activeTab === 'feed') {
      const { data } = await supabase.from('care_requests').select('*').eq('status', 'open').order('created_at', { ascending: false });
      setOpenRequests(data || []);
    } else if (activeTab === 'my-jobs') {
      const { data } = await supabase.from('care_requests').select('*').eq('helper_id', authUser.id).eq('status', 'assigned');
      setMyJobs(data || []);
    } else if (activeTab === 'completed') {
      const { data } = await supabase.from('care_requests').select('*').eq('helper_id', authUser.id).eq('status', 'completed');
      setMyJobs(data || []);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    setActionLoading(requestId);

    const { error } = await supabase.from('care_requests').update({ status: 'assigned', helper_id: user.id }).eq('id', requestId);

    if (!error) {
      setActiveTab('my-jobs');
    }
    setActionLoading(null);
  };

  const handleCompleteJob = async (requestId: string) => {
    setActionLoading(requestId);
    const { error } = await supabase.from('care_requests').update({ status: 'completed' }).eq('id', requestId);
    if (!error) {
      fetchUserDataAndData();
    }
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-teal-50/30 to-warm-100 py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Unicorn Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-400/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/90 border border-teal-100/80 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-3 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Carely Helper Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Einsätze & <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Matching</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 backdrop-blur-md bg-white/80 p-1.5 rounded-2xl border border-white/90 shadow-sm">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              Offene Anfragen (Feed)
            </button>
            <button
              onClick={() => setActiveTab('my-jobs')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'my-jobs'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              Aktive Einsätze
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              Abgeschlossen
            </button>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="backdrop-blur-3xl bg-white/90 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-6 sm:p-10">
          
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium animate-pulse">
              Lade passende Anfragen in deiner Umgebung...
            </div>
          ) : activeTab === 'feed' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Verfügbare Nachbarschaftshilfe</h2>
                <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl border border-teal-100">
                  {openRequests.length} Anfragen in deiner Nähe
                </span>
              </div>

              {openRequests.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                  <Sparkles className="h-10 w-10 text-teal-500 mx-auto mb-3 opacity-70" />
                  <p className="text-gray-600 font-bold text-base">Aktuell keine offenen Anfragen in deiner Region.</p>
                  <p className="text-gray-400 text-xs mt-1">Schau später noch einmal vorbei oder erweitere deinen Radius.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {openRequests.map((req) => (
                    <div 
                      key={req.id}
                      className="backdrop-blur-md bg-white/80 border border-gray-200/90 hover:border-teal-400/80 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-extrabold border border-teal-100">
                            {req.category}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-teal-600" /> {req.location_zip}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-black text-gray-900">{req.title}</h3>
                        
                        {req.description && (
                          <p className="text-sm text-gray-600 font-medium line-clamp-2">{req.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 pt-1">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/60">
                            <Calendar className="h-4 w-4 text-teal-600" /> {req.date}
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/60">
                            <Clock className="h-4 w-4 text-teal-600" /> {req.time}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        disabled={actionLoading === req.id}
                        className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {actionLoading === req.id ? 'Wird übernommen...' : 'Anfrage annehmen'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {activeTab === 'my-jobs' ? 'Deine aktiven Einsätze' : 'Abgeschlossene Einsätze & Schicht-Nachweise'}
                </h2>
                <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl border border-teal-100">
                  {myJobs.length} {activeTab === 'my-jobs' ? 'laufende Jobs' : 'Erfolgreich beendet'}
                </span>
              </div>

              {myJobs.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                  <FileText className="h-10 w-10 text-teal-500 mx-auto mb-3 opacity-70" />
                  <p className="text-gray-600 font-bold text-base">
                    {activeTab === 'my-jobs' ? 'Du hast aktuell keine aktiven Einsätze angenommen.' : 'Noch keine abgeschlossenen Einsätze vorhanden.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="backdrop-blur-md bg-white/80 border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-100">
                            {activeTab === 'my-jobs' ? 'Zugesagt & Bestätigt' : 'Abgeschlossen & Verifiziert'}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">PLZ: {job.location_zip}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900">{job.title}</h3>
                        <p className="text-xs text-gray-500 font-medium">Datum: {job.date} • Zeit: {job.time}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                          onClick={() => alert('Chat-Funktion öffnet sich mit dem Hilfesuchenden.')}
                          className="flex-1 sm:flex-none p-3.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-teal-100 cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4" /> Chat
                        </button>
                        
                        {activeTab === 'my-jobs' && (
                          <button
                            onClick={() => handleCompleteJob(job.id)}
                            disabled={actionLoading === job.id}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs py-3.5 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Check className="h-4 w-4" /> Einsatz abschließen
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}