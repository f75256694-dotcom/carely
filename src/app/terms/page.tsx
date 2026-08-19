import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F0F6F4] text-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[#2a524a] hover:underline font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2a524a] text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif font-bold text-lg text-[#112a24]">Carely</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-emerald-900/10 shadow-sm space-y-8">
          <div className="space-y-3 border-b border-emerald-900/10 pb-6">
            <h1 className="text-4xl font-serif font-bold text-[#112a24]">Allgemeine Geschäftsbedingungen (AGB)</h1>
            <p className="text-sm text-slate-500">Stand: August 2026</p>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">1. Geltungsbereich und Vertragsgegenstand</h2>
              <p>
                (1) Die Carely GmbH (nachfolgend „Carely“ oder „wir“) betreibt eine Online-Plattform, die Familien und Hilfesuchende (nachfolgend „Familien“) mit verifizierten Alltagshelferinnen und Alltagshelfern (nachfolgend „Helfer“) für nicht-medizinische Dienstleistungen im Alltag (z. B. Begleitung, Einkäufe, Haushaltsunterstützung, Gesellschaft) zusammenbringt.
              </p>
              <p>
                (2) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für sämtliche Nutzungen der Website, der App sowie für alle über die Plattform angebahnten und geschlossenen Vereinbarungen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">2. Rolle von Carely und Leistungsbeschreibung</h2>
              <p>
                (1) Carely agiert ausschließlich als Vermittler von Alltagsunterstützung. Carely wird selbst nicht Vertragspartner für die Dienstleistungsverträge zwischen Familien und Helfern.
              </p>
              <p>
                (2) Die vermittelten Tätigkeiten umfassen ausdrücklich keine medizinische Pflege, Behandlungspflege oder pflegerische Leistungen im Sinne des SGB XI. Es handelt sich rein um nicht-medizinische Alltagshilfe und Betreuung.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">3. Registrierung und Nutzerkonto</h2>
              <p>
                (1) Die Nutzung der Plattform erfordert eine Registrierung. Nutzer sind verpflichtet, wahrheitsgemäße Angaben zu machen und ihre Zugangsdaten geheim zu halten.
              </p>
              <p>
                (2) Helfer unterliegen einem strengen Verifizierungsprozess (Identitätsprüfung und Vorlage eines erweiterten polizeilichen Führungszeugnisses). Eine absolute Garantie für die Richtigkeit externer Dokumente kann jedoch seitens Carely nicht übernommen werden.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">4. Versicherungsschutz und Haftung</h2>
              <p>
                (1) Einsätze, die über die Carely-Plattform gebucht und abgewickelt werden, unterliegen einem automatischen Haftpflicht- und Unfallschutz im Rahmen unserer Partner-Versicherungen.
              </p>
              <p>
                (2) Für Schäden, die außerhalb der Plattformvereinbarungen oder grob fahrlässig / vorsätzlich entstehen, ist die Haftung von Carely im gesetzlich zulässigen Rahmen beschränkt.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">5. Schlussbestimmungen</h2>
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleiben die übrigen Bestimmungen davon unberührt.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}