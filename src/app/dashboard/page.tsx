'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ClientDashboard from './components/ClientDashboard';
import CaregiverDashboard from './components/CaregiverDashboard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function DashboardRouter() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function checkUserRole() {
      // 1. Session holen
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      // 2. Profil und Rolle aus der DB abfragen
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUserRole(profile?.role || 'care_seeker');
      setUserData({
        id: session.user.id,
        name: profile?.full_name || session.user.email,
        email: session.user.email,
        phone: profile?.phone || '',
      });
      setLoading(false);
    }

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold">Dashboard wird geladen...</p>
      </div>
    );
  }

  // 3. Routing basierend auf der Rolle
  if (userRole === 'caregiver') {
    return <CaregiverDashboard user={userData} />;
  }

  return <ClientDashboard user={userData} />;
}