"use client";

import Link from "next/link";
import React from "react";
import { createClient } from '@/lib/supabase/client';

export default function AuthCard({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-[#3d7066] no-underline mb-8 block">Carely</Link>
        </div>

        {title && <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>}
        {subtitle && <p className="text-slate-500 mb-8 text-sm">{subtitle}</p>}

        <div>{children}</div>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>
            Durch die Anmeldung akzeptieren Sie unsere <Link href="/terms" className="text-[#3d7066] hover:underline font-medium cursor-pointer">Nutzungsbedingungen</Link> und <Link href="/privacy" className="text-[#3d7066] hover:underline font-medium cursor-pointer">Datenschutzbestimmungen</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
