import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-xl border border-slate-100">
        <Link href="/" className="text-[#3d7066] font-semibold hover:underline">Zurück zur Startseite</Link>
        <h1 className="mt-6 text-3xl font-bold text-[#141414]">Datenschutzbestimmungen</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Hier findest du unsere Datenschutz-Hinweise. Dieser Platzhalter stellt sicher, dass die Links aus dem Auth-Layout sinnvolle Ziele haben.</p>
      </div>
    </div>
  );
}
