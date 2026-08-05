'use client';
import { useRef, useState } from 'react';

export default function VideoScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // 1. Kamera starten
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // 2. 3-Sekunden-Video aufnehmen
  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;
    setIsRecording(true);
    
    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoBlob(blob);
      setIsRecording(false);
    };

    mediaRecorder.start();
    // Nach 3 Sekunden automatisch stoppen
    setTimeout(() => mediaRecorder.stop(), 3000);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-sm rounded-full" />
      <button onClick={startCamera}>Kamera aktivieren</button>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Nimmt auf (3s)...' : 'Face Scan starten'}
      </button>
    </div>
  );
}