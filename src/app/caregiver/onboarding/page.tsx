"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KycStepper from "@/components/kyc/KycStepper";
import DocumentUpload from "@/components/kyc/DocumentUpload";
import LivenessMock from "@/components/kyc/LivenessMock";
import SystemCheck from "@/components/kyc/SystemCheck";
import VerifiedProfile from "@/components/kyc/VerifiedProfile";
import { supabase } from "@/lib/supabase";

export default function CaregiverOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [livenessOk, setLivenessOk] = useState(false);
  const [checksPassed, setChecksPassed] = useState(false);
  const [uploading, setUploading] = useState(false);

  function back() { setStep((s) => Math.max(1, s - 1)); }

  // Dokument sicher in Supabase Storage hochladen und Status auf pending setzen
  async function handleDocumentUploadAndNext() {
    if (!documentFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Nicht eingeloggt. Bitte melde dich erneut an.");
        setUploading(false);
        return;
      }

      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      // 1. Datei in den privaten Bucket hochladen
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, documentFile);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Pfad und Status in der 'profiles'-Tabelle hinterlegen
      const { error: updateError } = await supabase.from('profiles').update({ kyc_document_path: filePath, verification_status: 'pending' }).eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setUploading(false);
      setStep(2);
    } catch (error: any) {
      alert("Fehler beim Hochladen: " + error.message);
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-6 font-sans text-slate-900">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-black/[0.04] rounded-[2.5rem] p-10">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="text-2xl font-semibold text-[#1d1d1f] no-underline mb-1 block">Carely</Link>
            <p className="text-[#86868b] text-sm">Onboarding für Helfende — Identität verifizieren</p>
          </div>
          <div className="text-sm text-[#86868b]">Sicher & vertraulich</div>
        </header>

        <KycStepper step={step} />

        <div className="mt-8">
          {step === 1 && (
            <div>
              <DocumentUpload file={documentFile} onFile={setDocumentFile} onNext={handleDocumentUploadAndNext} />
              {uploading && <p className="text-sm text-emerald-600 mt-2 text-center">Lade Dokument sicher hoch...</p>}
            </div>
          )}

          {step === 2 && (
            <LivenessMock onSuccess={() => { setLivenessOk(true); setStep(3); }} onBack={back} />
          )}

          {step === 3 && (
            <SystemCheck document={documentFile} liveness={livenessOk} onComplete={(ok) => { setChecksPassed(ok); if (ok) setStep(4); }} onBack={back} />
          )}

          {step === 4 && <VerifiedProfile onFinish={() => router.push('/caregiver')} />}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/caregiver" className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors">Zurück zum Dashboard</Link>
          <div className="text-xs text-[#86868b]">Schritt {Math.min(step,4)} von 4</div>
        </div>
      </div>
    </div>
  );
}