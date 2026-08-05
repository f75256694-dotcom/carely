"use client";

import React from "react";

export default function PendingVerificationBanner() {
  return (
    <div className="w-full bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-900 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏳</span>
        <div>
          <h4 className="font-semibold text-sm text-amber-950">Profil wird derzeit überprüft</h4>
          <p className="text-xs text-amber-800/90 mt-0.5">
            Deine Dokumente wurden erfolgreich hochgeladen. Du kannst dich bereits auf Carely umsehen, aber noch keine Aufträge annehmen oder erstellen.
          </p>
        </div>
      </div>
      <span className="text-xs font-medium bg-amber-200/60 text-amber-900 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-center">
        Prüfung ausstehend
      </span>
    </div>
  );
}