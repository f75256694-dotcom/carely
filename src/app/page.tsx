import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center items-center text-center p-6">
      <h1 className="text-4xl font-serif font-black text-gray-900 mb-4">
        Finde die passende Unterstützung für deine Liebsten
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        Beantworte 3 kurze Fragen und erhalte sofort passende Vorschläge in deiner Nähe.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link 
          href="/funnel" 
          className="w-full py-4 rounded-2xl bg-[#235347] text-white font-bold shadow-lg hover:bg-[#1b4238] transition text-center"
        >
          Unterstützung suchen
        </Link>

        <Link 
          href="/login" 
          className="w-full py-4 rounded-2xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition text-center"
        >
          Anmelden
        </Link>
      </div>
    </main>
  );
}