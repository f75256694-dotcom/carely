'use client';

import { useState } from 'react';
import { ShieldCheck, Star, Sparkles, User, Calendar, Wallet } from 'lucide-react';
import { CaregiverHeader } from '@/components/caregiver/CaregiverHeader';
import { CaregiverFeed } from '@/components/caregiver/CaregiverFeed';
import { CreateOfferForm } from '@/components/caregiver/CreateOfferForm';
import { SafeChatSection } from '@/components/caregiver/SafeChatSection';
import { AvailabilitySettings } from '@/components/caregiver/AvailabilitySettings';
import { CaregiverFinances } from '@/components/caregiver/CaregiverFinances';
import { CaregiverProfile } from '@/components/caregiver/CaregiverProfile';

export type TabType = 'feed' | 'chats' | 'my-jobs' | 'finances' | 'availability' | 'profile' | 'create-offer';

export default function HelperDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [myJobs, setMyJobs] = useState<any[]>([]);

  const triggerSuccessNotification = () => {
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 3000);
  };

  const handleJobAccepted = (newJob: any) => {
    setMyJobs((prev) => [newJob, ...prev]);
    triggerSuccessNotification();
    setActiveTab('my-jobs');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/70 via-slate-50 to-emerald-50/40 font-sans pb-24">
      <CaregiverHeader 
        onNavigate={setActiveTab} 
        showSuccessBanner={showSuccessBanner} 
      />

      <main className="max-w-7xl mx-auto pt-28 sm:pt-32 px-4 sm:px-6 space-y-8">
        
        {/* Unicorn Hero Title Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-[11px] font-black uppercase tracking-wider shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> Verifizierter Helfer-Account
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-serif">
              Dein Helfer-<span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 bg-clip-text text-transparent">Cockpit</span>
            </h1>
          </div>

          {/* Quick Floating Stat Pill */}
          <div className="flex items-center gap-2 sm:gap-4 bg-white/90 backdrop-blur-2xl p-2.5 rounded-3xl border border-gray-200/80 shadow-xl">
            <div className="px-4 py-1.5 text-center border-r border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Guthaben</span>
              <span className="text-base font-black text-emerald-600">160,00 €</span>
            </div>
            <div className="px-4 py-1.5 text-center border-r border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Rating</span>
              <span className="text-base font-black text-slate-900 flex items-center justify-center gap-1">
                4.9 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </span>
            </div>
            <div className="px-4 py-1.5 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Stunden</span>
              <span className="text-base font-black text-teal-700">19,5h</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap bg-white/90 backdrop-blur-2xl p-2 rounded-2xl border border-gray-200/80 shadow-xs w-fit gap-1.5">
          {[
            { id: 'feed', label: 'Offener Feed' },
            { id: 'chats', label: 'Chats & Anfragen' },
            { id: 'my-jobs', label: `Meine Einsätze (${myJobs.length})` },
            { id: 'finances', label: 'Finanzen & Auszahlungen' },
            { id: 'availability', label: 'Verfügbarkeit & Radius' },
            { id: 'profile', label: 'Profil & Angaben' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20 scale-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Views */}
        {activeTab === 'feed' && <CaregiverFeed onSelectChat={() => setActiveTab('chats')} />}
        {activeTab === 'create-offer' && (
          <CreateOfferForm onSuccess={() => { triggerSuccessNotification(); setActiveTab('feed'); }} />
        )}
        {activeTab === 'chats' && <SafeChatSection onAcceptJob={handleJobAccepted} />}
        {activeTab === 'finances' && <CaregiverFinances />}
        {activeTab === 'availability' && <AvailabilitySettings onSuccess={triggerSuccessNotification} />}
        {activeTab === 'profile' && <CaregiverProfile />}
        {activeTab === 'my-jobs' && (
          <div className="bg-white/95 p-8 rounded-[2.5rem] border border-gray-200 shadow-xl space-y-4">
            <h2 className="text-xl font-black text-slate-900 font-serif">Gebuchte & Bestätigte Einsätze</h2>
            {myJobs.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">Noch keine aktiven Einsätze gebucht.</p>
            ) : (
              myJobs.map((job) => (
                <div key={job.id} className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 flex justify-between items-center shadow-xs">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{job.date} • {job.location_zip}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-4 py-1.5 rounded-xl border border-emerald-200">
                    Aktiv & Bestätigt
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}