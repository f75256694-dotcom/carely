import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </Link>

        <div className="bg-white shadow-sm rounded-2xl p-8 sm:p-12 border border-slate-100 space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Widerrufsbelehrung</h1>
            <p className="text-sm text-slate-500 mt-2">Stand: Oktober 2026 – Anwendbares Recht: FAGG (Österreich)</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Widerrufsrecht für Vermittlungsverträge</h2>
            <p className="text-slate-600 leading-relaxed">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag über die <strong>Vermittlung von Alltagshilfe</strong> zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Helpify</p>
              <p>Florian Touraj Saubiez</p>
              <p>Kulmgasse 44, 1170 Wien, Österreich</p>
              <p><strong>E-Mail:</strong> <a href="mailto:office@helpifyservices.at" className="text-emerald-700 hover:underline font-medium">office@helpifyservices.at</a></p>
              <p><strong>Telefon:</strong> +49 176 32089328</p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium text-slate-900">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Folgen des Widerrufs</h2>
            <p className="text-slate-600 leading-relaxed">
              Wenn Sie diesen Vermittlungsvertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Vorzeitiges Erlöschen des Widerrufsrechts & Wertersatz (§ 16, § 18 FAGG)</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>Besonderer Hinweis (§ 18 Abs. 1 Z 1 FAGG):</strong> Ihr Widerrufsrecht bezüglich der Vermittlungsdienstleistung erlischt vorzeitig, wenn Helpify die geschuldete Vermittlung auf Ihren ausdrücklichen Wunsch hin vollständig erbracht hat und Sie vor Beginn der Ausführung bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung verlieren.
              </p>
              <p>
                <strong>Wertersatzpflicht (§ 16 FAGG):</strong> Haben Sie verlangt, dass die Vermittlung von Alltagshilfe während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Vermittlungsleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Vermittlungsleistungen entspricht.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Online-Widerruf (§ 13a FAGG)</h2>
            <p className="text-slate-600 leading-relaxed">
              Sie können Ihr Widerrufsrecht auch online unter <strong className="text-slate-900">www.helpifyservices.at</strong> ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (z. B. durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Muster-Widerrufsformular</h2>
            <p className="text-slate-600 leading-relaxed italic">
              (Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und an ns zurücksenden):
            </p>
            <div className="bg-slate-900 text-slate-100 p-6 rounded-xl text-sm font-mono overflow-x-auto leading-relaxed space-y-2">
              <p>An: Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien</p>
              <p>E-Mail: office@helpifyservices.at</p>
              <br />
              <p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Vermittlung der folgenden Dienstleistung:</p>
              <p>Bestellt am (*): [Datum einfügen]</p>
              <p>Name des/der Verbraucher(s): [Name einfügen]</p>
              <p>Anschrift des/der Verbraucher(s): [Adresse einfügen]</p>
              <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
              <p>Datum: [Datum einfügen]</p>
              <br />
              <p className="text-slate-400 text-xs">(*) Unzutreffendes streichen.</p>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-1">
            <p>© {new Date().getFullYear()} Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien</p>
          </div>

        </div>
      </div>
    </main>
  );
}