'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, ShieldCheck, UserCheck, Loader2 } from 'lucide-react';

export default function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const requestId = resolvedParams.id;

  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data, error } = await supabase
          .from('care_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (error || !data) {
          setError('Anfrage wurde nicht gefunden oder ist ungültig.');
        } else {
          setRequestData(data);
          if (data.status === 'confirmed') {
            setConfirmed(true);
          }
        }
      } catch (err) {
        setError('Ein Fehler ist aufgetreten.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [requestId, supabase]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1. Status der care_request auf 'confirmed' setzen
      const { error: updateError } = await supabase
        .from('care_requests')
        .update({ status: 'confirmed' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // 2. Im Hintergrund in 'profiles' sichern (falls noch nicht vorhanden)
      if (requestData?.email) {
        await supabase
          .from('profiles')
          .upsert([
            {
              email: requestData.email,
              full_name: requestData.name,
              phone: requestData.phone,
              region: requestData.region,
              role: 'client'
            }
          ], { onConflict: 'email' });
      }

      setConfirmed(true);
    } catch (err) {
      console.error('Fehler beim Bestätigen:', err);
      setError('Die Buchung konnte nicht bestätigt werden.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B4D3E]" />
        <p className="text-xs text-slate-500 mt-2">Termindetails werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-center space-y-3 max-w-sm">
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
        
        {confirmed ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#1B4D3E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#0A2E23]">Termin bestätigt!</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vielen Dank, <span className="font-bold">{requestData?.name}</span>. Deine Buchung ist verbindlich reserviert. Du erhältst alle Details in Kürze auch per E-Mail/WhatsApp.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4D3E] bg-[#E6F4EA] px-2.5 py-1 rounded-full">
                Match gefunden
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#0A2E23]">Alltagshilfe bestätigen</h1>
              <p className="text-xs text-slate-500">
                Für PLZ <span className="font-bold text-[#1B4D3E]">{requestData?.region}</span>
              </p>
            </div>

            {/* HELFER DETAILS */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Verifizierter Helfer zugeordnet</h3>
                  <p className="text-[11px] text-slate-500">Qualifizierte Alltagsbegleitung</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Abrechnungssatz:</span>
                  <span className="font-bold text-slate-800">24,90 € / Std.</span>
                </div>
                <div className="flex justify-between">
                  <span>Zahlungsart:</span>
                  <span className="font-bold text-slate-800">Auf Rechnung (nach dem Termin)</span>
                </div>
              </div>
            </div>

            {/* RECHTLICHER HINWEIS */}
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B4D3E]" />
                <span>Geschützt & Versichert</span>
              </div>
              <p>
                Mit Klick auf "Buchung bestätigen" akzeptierst du die AGB von Helpify sowie den Servicevertrag direkt mit der zugeordneten Alltagsbegleitung.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-[#1B4D3E] hover:bg-[#143a2e] text-white font-bold text-sm py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buchung verbindlich bestätigen</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}