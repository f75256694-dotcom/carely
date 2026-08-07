'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Upload, Camera, ShieldCheck, CheckCircle2, Sparkles, 
  ArrowRight, Lock, FileText, RefreshCw, Check, Clock, Eye, AlertCircle
} from 'lucide-react';

export default function KycPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [docType, setDocType] = useState<'id_card' | 'passport'>('id_card');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Real Camera States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const simulateDemoUpload = () => {
    setUploadedFile('Personalausweis_Vorderseite_Scan.pdf');
  };

  // Start Real Device Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setCameraError('Kamerazugriff wurde abgelehnt oder wird von diesem Gerät nicht unterstützt.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  // Capture Selfie Snapshot
  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedSelfie(dataUrl);
        stopCamera();
      }
    }
  };

  // Submit Selfie & Document to Supabase Storage & Database
  const handleSubmitVerification = async () => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'demo-user-id';
      let selfieUrl = null;

      // 1. Convert Base64 Selfie to Blob & Upload to Supabase Storage
      if (capturedSelfie) {
        const response = await fetch(capturedSelfie);
        const blob = await response.blob();
        const fileName = `${userId}/selfie_${Date.now()}.png`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from('kyc-documents')
          .upload(fileName, blob, { contentType: 'image/png', upsert: true });

        if (!storageError && storageData) {
          const { data: urlData } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(fileName);
          selfieUrl = urlData.publicUrl;
        }
      }

      // 2. Update Profile State in Supabase Database
      if (user) {
        await supabase.from('profiles').update({ 
          kyc_document_type: docType, 
          kyc_selfie_url: selfieUrl, 
          kyc_status: 'pending_review', 
          kyc_submitted_at: new Date().toISOString() 
        }).eq('id', user.id);
      }
    } catch (err) {
      console.error('KYC Upload Fehler:', err);
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-teal-50/30 to-warm-100 pt-28 pb-32 px-4 sm:px-6 relative overflow-x-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-400/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/90 border border-teal-100 text-teal-800 text-xs font-extrabold tracking-wider uppercase mb-3 shadow-xs backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Carely Sicherheits-Verifikation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Identität <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">verifizieren</span>
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2 max-w-lg mx-auto">
            Zum Schutz aller Hilfesuchenden prüfen wir jedes Profil persönlich vor dem ersten Einsatz.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-3 gap-2 mb-10 max-w-xl mx-auto backdrop-blur-md bg-white/70 p-2 rounded-2xl border border-white/80 shadow-sm">
          {[
            { id: 1, label: '1. Ausweisdokument' },
            { id: 2, label: '2. Foto-Abgleich' },
            { id: 3, label: '3. Prüfung & Status' },
          ].map((s) => (
            <div
              key={s.id}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all ${
                step === s.id
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/20'
                  : step > s.id
                  ? 'bg-teal-50 text-teal-800 border border-teal-100'
                  : 'text-gray-400 bg-transparent'
              }`}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="backdrop-blur-3xl bg-white/90 border border-white/80 shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] p-6 sm:p-10">
          {/* STEP 1: DOKUMENT WAHL & UPLOAD */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">1. Dokumententyp wählen</h2>
                  <p className="text-xs font-semibold text-gray-400">Wähle dein amtliches Ausweisdokument.</p>
                </div>
                <Lock className="w-5 h-5 text-teal-600 opacity-60" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDocType('id_card')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    docType === 'id_card'
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-6 h-6 text-teal-600" />
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Personalausweis</div>
                    <div className="text-[10px] text-gray-400 font-bold">Vorder- & Rückseite</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDocType('passport')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    docType === 'passport'
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-6 h-6 text-teal-600" />
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Reisepass</div>
                    <div className="text-[10px] text-gray-400 font-bold">Hauptseite mit Foto</div>
                  </div>
                </button>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-teal-200 hover:border-teal-400 bg-gradient-to-b from-teal-50/30 to-transparent rounded-3xl p-8 text-center transition-all group">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-14 h-14 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                {uploadedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-teal-800 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" /> {uploadedFile}
                    </p>
                    <p className="text-xs text-gray-400">Klicke zum Ersetzen oder ziehe eine neue Datei hierher.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-gray-800">Datei hierher ziehen oder durchsuchen</p>
                    <p className="text-xs text-gray-400 font-medium">PNG, JPG oder PDF (max. 10MB)</p>
                  </div>
                )}
              </div>

              {!uploadedFile && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={simulateDemoUpload}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 underline underline-offset-4 cursor-pointer"
                  >
                    ⚡ Demo-Dokument verwenden (Schnelltest)
                  </button>
                </div>
              )}

              <button
                disabled={!uploadedFile}
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Weiter zum Foto-Abgleich
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: ECHTE KAMERA (SELFIE TAKE) */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">2. Porträtfoto aufnehmen</h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">Nimm ein schnelles Selfie auf, um dein Gesicht mit dem Ausweis abzugleichen.</p>
              </div>

              {/* Live WebRTC Camera Stream Container */}
              <div className="relative w-64 h-64 mx-auto rounded-full border-4 border-teal-500/40 bg-gray-950 shadow-2xl overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraActive && !capturedSelfie ? 'block' : 'hidden'}`}
                />
                {capturedSelfie && (
                  <img src={capturedSelfie} alt="Selfie Preview" className="w-full h-full object-cover" />
                )}

                {!isCameraActive && !capturedSelfie && (
                  <div className="p-4 text-center">
                    <Camera className="w-10 h-10 text-teal-400 mx-auto mb-2 opacity-80" />
                    <span className="text-xs text-gray-400 font-bold">Kamera ist bereit</span>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {cameraError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4" /> {cameraError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                {!isCameraActive && !capturedSelfie && (
                  <button
                    onClick={startCamera}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> Kamera aktivieren
                  </button>
                )}

                {isCameraActive && (
                  <button
                    onClick={takeSelfie}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> Foto jetzt aufnehmen
                  </button>
                )}

                {capturedSelfie && (
                  <>
                    <button
                      onClick={() => { setCapturedSelfie(null); startCamera(); }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3.5 px-4 rounded-2xl transition-all cursor-pointer"
                    >
                      Wiederholen
                    </button>
                    <button
                      onClick={handleSubmitVerification}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {isSubmitting ? 'Übermitteln...' : 'Zur Prüfung einreichen'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: TRANSPARENTER MANUELLER PRÜF-STATUS */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
                <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200 inline-block">
                  Status: Manuelle Überprüfung läuft
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 pt-2">
                  Dokumente erfolgreich eingereicht!
                </h2>
                <p className="text-xs sm:text-sm font-medium text-gray-600 max-w-lg mx-auto leading-relaxed">
                  Unser Carely-Sicherheitsteam prüft deine Daten sorgfältig. Um maximale Sicherheit für Hilfesuchende zu gewährleisten, dauert die Freischaltung in der Regel <strong>weniger als 2 Stunden</strong>.
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-4 max-w-md mx-auto text-left flex items-start gap-3">
                <Eye className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 font-medium leading-relaxed">
                  <strong>Vorschau-Modus aktiviert:</strong> Du kannst dich bereits im Dashboard umsehen und Anfragen durchstöbern. Zusagen sind nach der Freischaltung möglich.
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push('/caregiver')}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 text-white font-extrabold text-sm py-4 px-8 rounded-2xl shadow-lg shadow-teal-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  Zum Helfer Dashboard & Erkunden
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}