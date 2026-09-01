import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ImprintPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </Link>

        <div className="bg-white shadow-sm rounded-2xl p-8 sm:p-12 border border-slate-100 space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Impressum</h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Informationen über den Diensteanbieter</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">Helpify</p>
              <p>Florian Touraj Saubiez</p>
              <p>Kulmgasse 44, 1170 Wien, Österreich</p>
              <p className="pt-2"><strong>Tel.:</strong> +49 176 32089328</p>
              <p><strong>E-Mail:</strong> <a href="mailto:office@helpifyservices.at" className="text-indigo-600 hover:underline">office@helpifyservices.at</a></p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Unternehmensdetails</h2>
            <ul className="space-y-2 text-slate-600">
              <li><strong>Unternehmensgegenstand:</strong> Erbringung von Dienstleistungen im Bereich Alltagshilfe und Betreuung</li>
              <li><strong>Mitglied bei:</strong> Wirtschaftskammer Wien</li>
              <li><strong>Berufsrecht:</strong> Gewerbeordnung (GewO): <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.ris.bka.gv.at</a></li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Aufsichtsbehörde</h2>
            <div className="text-slate-600 space-y-1">
              <p>Magistratisches Bezirksamt für den 9./17. Bezirk</p>
              <p>Elterleinplatz 14, 1170 Wien, Österreich</p>
              <p><strong>Webseite:</strong> <a href="https://www.wien.gv.at" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.wien.gv.at</a></p>
              <p className="pt-2"><strong>Berufsbezeichnung:</strong> Dienstleister im Bereich Alltagshilfe</p>
              <p><strong>Verleihungsstaat:</strong> Österreich</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Datenschutz Verantwortlicher</h2>
            <div className="text-slate-600 space-y-1">
              <p className="font-medium text-slate-800">Florian Touraj Saubiez</p>
              <p>Kulmgasse 44, 1170 Wien, Österreich</p>
              <p><strong>E-Mail:</strong> <a href="mailto:office@helpifyservices.at" className="text-indigo-600 hover:underline">office@helpifyservices.at</a></p>
              <p><strong>Tel.:</strong> +49 176 32089328</p>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-1">
            <p>Alle Texte sind urheberrechtlich geschützt.</p>
            <p>Quelle: Erstellt mit dem Impressum Generator von AdSimple</p>
          </div>

        </div>
      </div>
    </main>
  );
}