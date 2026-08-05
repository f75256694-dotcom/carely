import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-xl border border-slate-100">
        <Link href="/" className="text-[#3d7066] font-semibold hover:underline">Zurück zur Startseite</Link>
        <h1 className="mt-6 text-3xl font-bold text-[#141414]">Nutzungsbedingungen</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Hier findest du die grundlegenden Regeln für die Nutzung von Carely. Diese Seite dient als Platzhalter für die volle rechtliche Dokumentation.</p>
      </div>
    </div>
  );
}
