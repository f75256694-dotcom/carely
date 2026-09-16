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
            <p className="text-sm text-slate-500 mt-2">Stand: September 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Einleitung und Überblick</h2>
            <p className="text-slate-600 leading-relaxed">
              Wir haben diese Datenschutzerklärung verfasst, um Ihnen gemäß der Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten wir als Verantwortliche verarbeiten, zu welchen Zwecken dies geschieht und welche Rechte Ihnen zustehen.
            </p>
            <div className="bg-slate-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-slate-700 text-sm font-medium">
              Kurz gesagt: Wir verarbeiten Ihre Daten vertraulich, zweckgebunden und ausschließlich im Rahmen der Vermittlung von Alltagshilfe.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Kontaktdaten des Verantwortlichen</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-2">
              <p className="font-semibold text-slate-900">Helpify</p>
              <p>Florian Touraj Saubiez</p>
              <p>Kulmgasse 44, 1170 Wien, Österreich</p>
              <p>E-Mail: <a href="mailto:office@helpifyservices.at" className="text-emerald-700 hover:underline font-medium">office@helpifyservices.at</a></p>
              <p>Telefon: +49 176 32089328</p>
              <p>Impressum: <a href="/imprint" className="text-emerald-700 hover:underline font-medium">/imprint</a></p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Datenverarbeitung im Rahmen der Vermittlung</h2>
            <p className="text-slate-600 leading-relaxed">
              Helpify tritt als Vermittlungs- und Organisationsplattform für Alltagshilfe und Betreuungsleistungen auf. 
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Erhebung von Anfragedaten:</strong> Wenn Sie unser Anfrageformular ausfüllen, verarbeiten wir Ihren Namen, Ihre Kontaktdaten (E-Mail, Telefonnummer), den Bezirk sowie Angaben zum gewünschten Betreuungsumfang.</li>
              <li><strong>Zweck & Rechtsgrundlage:</strong> Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen und zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), nämlich der Anbahnung und Vermittlung von passenden selbstständigen Alltagshelfern.</li>
              <li><strong>Weitergabe an Dienstleister:</strong> Zur Erfüllung der Vermittlung werden relevante Anfragedaten in erforderlichem Umfang an die von uns überprüften Alltagshelfer weitergeleitet.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Technische Auftragsverarbeiter & Hosting</h2>
            <p className="text-slate-600 leading-relaxed">
              Für den sicheren und stabilen Betrieb unserer Plattform nutzen wir externe technische Dienstleister auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) sowie Auftragsverarbeitungsverträgen (Art. 28 DSGVO):
            </p>
            <ul className="space-y-3 text-slate-600">
              <li>
                <strong>Hetzner Online GmbH:</strong> Webhosting und Server-Infrastruktur (Industriestr. 25, 91710 Gunzenhausen, Deutschland). Serverstandorte in der EU.
              </li>
              <li>
                <strong>Supabase Inc.:</strong> Datenbankinfrastruktur zur sicheren Speicherung der Anfragedaten.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Speicherdauer</h2>
            <p className="text-slate-600 leading-relaxed">
              Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Abwicklung der Vermittlung notwendig ist oder gesetzliche Aufbewahrungsfristen (z. B. steuerrechtliche Vorgaben nach UGB/BAO) dies vorschreiben.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Ihre Rechte</h2>
            <p className="text-slate-600 leading-relaxed">
              Ihnen stehen gemäß DSGVO die Rechte auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) zu.
            </p>
            <div className="text-slate-600 pt-2">
              <p className="font-medium text-slate-800">Zuständige Aufsichtsbehörde in Österreich:</p>
              <p>Österreichische Datenschutzbehörde, Barichgasse 40-42, 1030 Wien | <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">www.dsb.gv.at</a></p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Sicherheit & TLS-Verschlüsselung</h2>
            <p className="text-slate-600 leading-relaxed">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine HTTPS/TLS-Verschlüsselung.
            </p>
          </section>

          <div className="border-t border-slate-200 pt-6 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Helpify – Alle Rechte vorbehalten.</p>
          </div>

        </div>
      </div>
    </main>
  );
}