'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LandingPage from '@/components/landing/LandingPage';

export default function CarelyDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasBypass, setHasBypass] = useState(false);

  useEffect(() => {
    const bypass = localStorage.getItem('carely_bypass'); 
    if (bypass) {
      setHasBypass(true);
      window.location.href = '/dashboard';
      return;
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => { 
      setSession(session); 
      setLoading(false); 
      if (session) {
        window.location.href = '/dashboard';
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
      setSession(session); 
      if (session) {
        window.location.href = '/dashboard';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!session && !hasBypass) {
    return <LandingPage />;
  }

  return null;
}