import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Fehler 404</p>
        <h1 className="text-3xl font-serif font-medium text-[#1B4D3E]">Diese Seite gibt es leider nicht.</h1>
        <p className="text-slate-600 text-sm">Vielleicht hilft dir einer dieser Links weiter:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-sm px-5 py-3 rounded-xl transition">Zur Startseite</Link>
          <Link href="/care-seeker/apply" className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl transition">Hilfe finden</Link>
          <Link href="/caregiver/apply" className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl transition">Helfer werden</Link>
        </div>
      </div>
    </main>
  );
}
