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
            <span className="font-serif font-bold text-lg text-[#112a24]">Helpify</span>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-emerald-900/10 shadow-sm space-y-8">
          <div className="space-y-3 border-b border-emerald-900/10 pb-6">
            <h1 className="text-4xl font-serif font-bold text-[#112a24]">Allgemeine Geschäftsbedingungen (AGB)</h1>
            <p className="text-sm text-slate-500">Stand: September 2026 – Anwendbares Recht: Österreich</p>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">1. Geltungsbereich und Vertragsgegenstand</h2>
              <p>
                (1) Helpify (Inhaber: Florian Touraj Saubiez, nachfolgend „Helpify“ oder „wir“) betreibt eine Vermittlungs- und Organisationsplattform, die Hilfesuchende und Familien (nachfolgend „Kunden“) mit selbstständigen oder eigenverantwortlichen Alltagshelferinnen und Alltagshelfern (nachfolgend „Helfer“) für nicht-medizinische Unterstützungsleistungen im Alltag (z. B. Begleitung, Einkäufe, Haushaltsunterstützung, Gesellschaft) zusammenbringt.
              </p>
              <p>
                (2) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform sowie für alle über Helpify angebahnten Vermittlungsleistungen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">2. Rolle von Helpify (Vermittlung & Abgrenzung)</h2>
              <p>
                (1) <strong>Vermittlungsmodell:</strong> Helpify agiert ausschließlich als Vermittler und Organisator von Alltagsunterstützung. Der Vertrag über die eigentliche Dienstleistung kommt direkt zwischen dem Kunden und dem ausgewählten Helfer zustande, sofern nicht ausdrücklich anders vereinbart. Helpify wird selbst nicht Partei des Dienstleistungsvertrags vor Ort.
              </p>
              <p>
                (2) <strong>Keine medizinische Pflege (GuKG):</strong> Die vermittelten Tätigkeiten umfassen ausdrücklich keine medizinischen, hauswertigen Pflege- oder Krankenpflegedienstleistungen im Sinne des österreichischen Gesundheits- und Krankenpflegegesetzes (GuKG).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">3. Anfragen und Verifizierung</h2>
              <p>
                (1) Anfragen über das Online-Formular stellen ein unverbindliches Angebot zur Vermittlung eines passenden Helfers dar.
              </p>
              <p>
                (2) Helpify führt bei den registrierten Helfern eine sorgfältige Überprüfung durch (u. a. Identitätsprüfung sowie Einsicht in eine aktuelle Strafregisterbescheinigung). Eine Garantie für das Verhalten der Helfer im Einzelfall kann Helpify als Vermittler nicht übernehmen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">4. Preise und Abrechnung</h2>
              <p>
                (1) Die auf der Plattform angegebenen Preise verstehen sich als Endpreise. Gemäß § 6 Abs. 1 Z 27 UStG (Kleinunternehmerregelung) wird keine Umsatzsteuer ausgewiesen.
              </p>
              <p>
                (2) Die Vergütung setzt sich aus dem Honorar des Helfers und der Vermittlungs- bzw. Servicegebühr von Helpify zusammen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">5. Haftungsbeschränkung</h2>
              <p>
                (1) Helpify haftet für Schäden aus der Vermittlungstätigkeit nur bei Vorsatz oder grober Fahrlässigkeit. Für leicht fahrlässige Pflichtverletzungen ist die Haftung ausgeschlossen, soweit keine wesentlichen Vertragspflichten oder Personenschäden betroffen sind.
              </p>
              <p>
                (2) Für die ordnungsgemäße Durchführung der vermittelten Alltagshilfe vor Ort haftet der jeweilige Helfer als selbstständiger Vertragspartner des Kunden.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-[#112a24]">6. Anwendbares Recht und Gerichtsstand</h2>
              <p>
                (1) Es gilt ausschließlich österreichisches Recht unter Ausschluss des UN-Kaufrechts.
              </p>
              <p>
                (2) Erfüllungsort und Gerichtsstand für alle Streitigkeiten ist Wien, Österreich, soweit dem keine zwingenden verbraucherschutzrechtlichen Bestimmungen entgegenstehen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}