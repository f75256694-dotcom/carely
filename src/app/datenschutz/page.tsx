import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </Link>

        <div className="bg-white shadow-sm rounded-2xl p-8 sm:p-12 border border-slate-100 space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Datenschutzerklärung</h1>
            <p className="text-sm text-slate-500 mt-2">Stand: Oktober 2026</p>
          </div>

          {/* 1. Einleitung */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">1. Einleitung und Überblick</h2>
            <p className="text-slate-600 leading-relaxed">
              Wir haben diese Datenschutzerklärung verfasst, um Ihnen gemäß den Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 (DSGVO) und des österreichischen Datenschutzgesetzes (DSG) zu erklären, welche personenbezogenen Daten wir verarbeiten, zu welchen Zwecken dies geschieht und welche Rechte Ihnen zustehen.
            </p>
            <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-slate-700 text-sm font-medium">
              Kurz gesagt: Wir verarbeiten Daten streng vertraulich, zweckgebunden und ausschließlich zur Vermittlung selbständiger Alltagshelfer.
            </div>
          </section>

          {/* 2. Verantwortlicher */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">2. Kontaktdaten des Verantwortlichen</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">Helpify</p>
              <p>Inhaber: Florian Touraj Saubiez</p>
              <p>Kulmgasse 44, 1170 Wien, Österreich</p>
              <p>E-Mail: <a href="mailto:office@helpifyservices.at" className="text-emerald-700 hover:underline font-medium">office@helpifyservices.at</a></p>
              <p>Telefon: +49 176 32089328</p>
              <p>Website: <Link href="/" className="text-emerald-700 hover:underline font-medium">www.helpifyservices.at</Link></p>
            </div>
          </section>

          {/* 3. Verarbeitung Kunden/Anfragen */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">3. Datenverarbeitung für Kunden & Hilfesuchende</h2>
            <p className="text-slate-600 leading-relaxed">
              Helpify betreibt eine Vermittlungsplattform zur Anbahnung von Dienstleistungsverträgen zwischen Kunden und selbständigen Alltagshelfern.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Erhebung von Anfragedaten:</strong> Beim Ausfüllen unseres Anfrageformulars verarbeiten wir Name, Kontaktdaten (E-Mail, Telefonnummer), den Bezirk (z. B. 1190 Wien), die gewählten Service-Kategorien sowie sonstige freiwillige Anmerkungen.</li>
              <li><strong>Zweck & Rechtsgrundlage:</strong> Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen sowie zur Erfüllung des Vermittlungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).</li>
              <li><strong>Hinweis zu Gesundheitsdaten (Art. 9 DSGVO):</strong> Wir verlangen und verarbeiten im Rahmen der Vermittlung nicht-medizinischer Alltagshilfe grundsätzlich keine Gesundheitsdaten. Sollten Sie uns im Freitextfeld freiwillig Angaben zu gesundheitlichen Einschränkungen mitteilen, erfolgt die Verarbeitung ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO).</li>
              <li><strong>Weitergabe an Helfer:</strong> Zur Durchführung der Vermittlung übermitteln wir Kontaktdaten und Anfragedetails in dem für die Anbahnung erforderlichen Ausmaß an passende selbständige Helfer.</li>
            </ul>
          </section>

          {/* 4. Neu: Verarbeitung Helfer-Daten & Strafregister */}
          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">4. Datenverarbeitung für selbständige Alltagshelfer</h2>
            <p className="text-slate-600 leading-relaxed">
              Wenn Sie sich bei Helpify als selbständiger Alltagshelfer bewerben oder registrieren, verarbeiten wir personenbezogene Daten zur Überprüfung Ihrer Eignung und zur Bereitstellung von Vermittlungsaufträgen.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Stammdaten & Nachweise:</strong> Wir verarbeiten Name, Adresse, Kontaktdaten, Geburtsdatum, Identitätsnachweise (Lichtbildausweis), Gewerbeberechtigung (z. B. freies Gewerbe Personenbetreuung nach § 159 GewO) sowie Bankverbindungen.</li>
              <li><strong>Überprüfung der Strafregisterbescheinigung (Art. 10 DSGVO i.V.m. § 7 DSG):</strong> Zur Sicherstellung der Zuverlässigkeit und zum Schutz unserer Kunden (insbesondere älterer oder unterstützungsbedürftiger Personen) verlangen wir vor Aufnahmen in den Vermittlungspool die Vorlage einer aktuellen Strafregisterbescheinigung. 
              <br />
              <em>Verarbeitungsmodus:</em> Die Einsichtnahme dient ausschließlich der Prüfung auf gerichtliche Verurteilungen im Rahmen des Berechtigungsprozesses. Strafregisterdaten werden nicht dauerhaft gespeichert oder veröffentlicht, sondern nach der erfolgreichen oder abgelehnten Registrierungsprüfung unverzüglich gelöscht, sofern keine rechtlichen Nachweispflichten entgegenstehen.</li>
              <li><strong>Rechtsgrundlage:</strong> Die Verarbeitung basiert auf der Anbahnung und Durchführung des Vermittlungsrahmenvertrags mit dem Helfer (Art. 6 Abs. 1 lit. b DSGVO) sowie unseren berechtigten Interessen an der Qualitätssicherung und Selektion vertrauenswürdiger Dienstleister (Art. 6 Abs. 1 lit. f DSGVO i.V.m. § 7 DSG).</li>
            </ul>
          </section>

          {/* 5. Technische Dienstleister */}
          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">5. Hosting & Technische Auftragsverarbeiter</h2>
            <p className="text-slate-600 leading-relaxed">
              Für den Betrieb und die Sicherheit unserer Webanwendung nutzen wir externe Dienstleister im Wege der Auftragsverarbeitung (Art. 28 DSGVO):
            </p>
            <ul className="space-y-3 text-slate-600">
              <li>
                <strong>Hetzner Online GmbH:</strong> Webhosting und Serverinfrastruktur (Industriestr. 25, 91710 Gunzenhausen, Deutschland). Sämtliche Serverstandorte befinden sich in der Europäischen Union (Deutschland/Finnland).
              </li>
              <li>
                <strong>Supabase Inc.:</strong> Datenbankinfrastruktur zur Verwahrung der Anfrage- und Kontrollvermerke. Die Datenbankinstanz ist in einer EU-Region gehostet. Sollten administrative Zugriffe durch die Muttergesellschaft (Supabase Inc., USA) erforderlich sein, erfolgt die Übermittlung auf Grundlage von Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).
              </li>
              <li>
                <strong>Resend Inc.:</strong> E-Mail-Infrastruktur zum Versand von automatisierten Benachrichtigungen. Die Übermittlung erfolgt abgesichert auf Basis von Standardvertragsklauseln (Art. 46 DSGVO).
              </li>
            </ul>
          </section>

          {/* 6. Speicherdauer & Pflichten */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">6. Speicherdauer & Bereitstellung</h2>
            <p className="text-slate-600 leading-relaxed">
              Wir speichern Ihre Daten nur solange, wie es für die Erfüllung des Vermittlungszwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen (z. B. 7-jährige Aufbewahrungspflicht nach § 212 UGB / § 132 BAO für Buchhaltungsunterlagen) dies vorschreiben.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Die Bereitstellung Ihrer personenbezogenen Daten erfolgt freiwillig. Ohne die Bereitstellung der erforderlichen Kontaktdaten bzw. Qualifikationsnachweise kann eine Vermittlung über Helpify jedoch nicht durchgeführt werden.
            </p>
          </section>

          {/* 7. Rechte & Beschwerderecht */}
          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">7. Ihre Rechte & Beschwerderecht</h2>
            <p className="text-slate-600 leading-relaxed">
              Ihnen stehen grundsätzlich die Rechte auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) zu.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-2 mt-2">
              <p className="font-semibold text-slate-900">Recht auf Beschwerde bei der Aufsichtsbehörde (Art. 77 DSGVO):</p>
              <p className="text-sm">
                Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, haben Sie das Recht, Beschwerde bei der zuständigen Aufsichtsbehörde einzulegen. In Österreich ist dies die:
              </p>
              <div className="text-sm pt-2 font-medium">
                Österreichische Datenschutzbehörde<br />
                Barichgasse 40-42, 1030 Wien<br />
                Telefon: +43 1 52 152-0 | E-Mail: dsb@dsb.gv.at<br />
                Website: <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">www.dsb.gv.at</a>
              </div>
            </div>
          </section>

          {/* 8. Sicherheit & keine Automatisierung */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">8. Datensicherheit & Profiling</h2>
            <p className="text-slate-600 leading-relaxed">
              Wir nutzen aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine HTTPS/TLS-Verschlüsselung. Eine automatisierte Entscheidungsfindung oder Profiling im Sinne des Art. 22 DSGVO findet bei Helpify nicht statt.
            </p>
          </section>

          <div className="border-t border-slate-200 pt-6 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien. Alle Rechte vorbehalten.</p>
          </div>

        </div>
      </div>
    </main>
  );
}