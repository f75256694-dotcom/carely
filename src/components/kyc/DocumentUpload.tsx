"use client";

import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

export default function DocumentUpload({ file, onFile, onNext }: { file: File | null; onFile: (f: File | null) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(file ? URL.createObjectURL(file) : null);

  const handleFiles = useCallback((files: FileList | null) => {
    const f = files && files[0] ? files[0] : null;
    onFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }, [onFile]);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-3">Dokument hochladen</h2>
      <p className="text-[#86868b] mb-8 text-sm">Bitte laden Sie ein gültiges Ausweisdokument (Personalausweis oder Reisepass) hoch.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`w-full rounded-[2rem] border-2 ${dragOver ? "border-[#3d7066] bg-[#e9f5f1]" : "border-black/[0.08] bg-white/90"} p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)]`}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {!preview ? (
          <>
            <div className="text-3xl mb-4 text-[#86868b]">📄</div>
            <div className="text-base text-[#1d1d1f] mb-2">Ziehen Sie Ihr Dokument hierher oder klicken Sie zum Auswählen</div>
            <div className="text-sm text-[#86868b]">PNG, JPG oder PDF (max. 10MB)</div>
          </>
        ) : (
          <div className="w-full flex flex-col items-start gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-semibold text-[#1d1d1f]">Vorschau</div>
              <button onClick={(e) => { e.stopPropagation(); onFile(null); setPreview(null); }} className="text-sm text-[#86868b]">Entfernen</button>
            </div>
            {file?.type === "application/pdf" ? (
              <div className="w-full h-52 bg-[#f5f5f7] rounded-[1.5rem] flex items-center justify-center text-[#86868b]">PDF Vorschau</div>
            ) : (
              <Image src={preview ?? ""} alt="preview" className="w-full rounded-[1.5rem] object-cover max-h-72" width={800} height={600} unoptimized />
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => onFile(null)} className="py-3 px-5 rounded-full border border-slate-300 text-sm text-[#1d1d1f]">Abbrechen</button>
        <button disabled={!file} onClick={onNext} className="w-44 bg-[#1d1d1f] hover:bg-black text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Weiter</button>
      </div>
    </div>
  );
}
