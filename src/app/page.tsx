'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import LandingPage from '@/components/landing/LandingPage';
import HubTab from '@/components/tabs/HubTab';
import FinanzenTab from '@/components/tabs/FinanzenTab';
import RequestsTab from '@/components/tabs/RequestsTab';
import WeekTab from '@/components/tabs/WeekTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import BudgetModal from '@/components/modals/BudgetModal';
import RecipientDetailModal from '@/components/modals/RecipientDetailModal';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_REQUESTS, INITIAL_WEEK_APPOINTMENTS } from '@/data/mockData';
import { CareRecipient, CareRequest, WeekAppointment } from '@/types/care';

export default function CarelyDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasBypass, setHasBypass] = useState(false);

  const [activeTab, setActiveTab] = useState<'requests' | 'hub' | 'week' | 'finanzen' | 'messages'>('hub');
  const [recipients, setRecipients] = useState<CareRecipient[]>(INITIAL_RECIPIENTS);
  const [requests, setRequests] = useState<CareRequest[]>(INITIAL_REQUESTS);
  const [appointments, setAppointments] = useState<WeekAppointment[]>(INITIAL_WEEK_APPOINTMENTS);
  const [editingBudgetRecipient, setEditingBudgetRecipient] = useState<CareRecipient | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<CareRecipient | null>(null);

  useEffect(() => {
    // LocalStorage erst sicher im Browser (Client) auslesen
    const bypass = localStorage.getItem('carely_bypass');
    if (bypass) setHasBypass(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('carely_bypass');
    localStorage.removeItem('carely_role');
    setSession(null);
    setHasBypass(false);
    window.location.href = '/';
  };

  if (loading) return null;

  // Wenn weder eingeloggt noch ein Bypass vorliegt -> Landing Page anzeigen
  if (!session && !hasBypass) {
    return <LandingPage />;
  }

  // Ansonsten -> Das vollständige Dashboard anzeigen
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {activeTab === 'hub' && <HubTab recipients={recipients} onSelectRecipient={setSelectedRecipient} />}
        {activeTab === 'finanzen' && <FinanzenTab recipients={recipients} transactions={INITIAL_TRANSACTIONS} onEditBudget={setEditingBudgetRecipient} />}
        {activeTab === 'requests' && <RequestsTab requests={requests} onAccept={(id) => {
          const req = requests.find(r => r.id === id);
          if (!req) return;
          setRequests(prev => prev.filter(r => r.id !== id));
          setAppointments(prev => [{
            id: `app-${Date.now()}`,
            day: req.date,
            time: req.time.split(' - ')[0],
            title: req.title,
            helperName: req.helperName,
            recipientName: req.recipientName,
            status: 'Bestätigt'
          }, ...prev]);
          setActiveTab('week');
        }} onDecline={(id) => setRequests(prev => prev.filter(r => r.id !== id))} />}
        {activeTab === 'week' && <WeekTab appointments={appointments} />}
        {activeTab === 'messages' && <MessagesTab />}
      </main>

      <BudgetModal editingRecipient={editingBudgetRecipient} onClose={() => setEditingBudgetRecipient(null)} onSave={(newMax, id) => {
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, budgetMax: newMax } : r));
        setEditingBudgetRecipient(null);
      }} />
      <RecipientDetailModal recipient={selectedRecipient} onClose={() => setSelectedRecipient(null)} onSave={(updated) => {
        setRecipients(prev => prev.map(r => r.id === updated.id ? updated : r));
        setSelectedRecipient(null);
      }} onDelete={(id) => {
        setRecipients(prev => prev.filter(r => r.id !== id));
        setSelectedRecipient(null);
      }} />
    </div>
  );
}