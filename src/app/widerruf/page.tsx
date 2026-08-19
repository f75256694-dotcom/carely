export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 sm:p-12 border border-slate-100 space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Widerrufsbelehrung</h1>
          <p className="text-sm text-slate-500 mt-2">Stand: August 2026</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Widerrufsrecht</h2>
          <p className="text-slate-600 leading-relaxed">
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Helpify, Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien, E-Mail: <a href="mailto:office@helpifyservices.at" className="text-indigo-600 hover:underline">office@helpifyservices.at</a>) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Folgen des Widerrufs</h2>
          <p className="text-slate-600 leading-relaxed">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Vorzeitiges Erlöschen des Widerrufsrechts</h2>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
            <p>
              Bei einer Dienstleistung erlischt Ihr Widerrufsrecht vorzeitig, wenn wir mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie Ihre ausdrückliche Zustimmung dazu gegeben haben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Muster-Widerrufsformular</h2>
          <p className="text-slate-600 leading-relaxed italic">
            Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Muster verwenden:
          </p>
          <div className="bg-slate-900 text-slate-100 p-6 rounded-xl text-sm font-mono overflow-x-auto">
            <p>An: Helpify, Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien</p>
            <p>E-Mail: office@helpifyservices.at</p>
            <br />
            <p>Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</p>
            <p>Bestellt am: [Datum einfügen]</p>
            <p>Name des Verbrauchers:</p>
            <p>Anschrift des Verbrauchers:</p>
            <p>Datum:</p>
          </div>
        </section>

        <div className="border-t border-slate-200 pt-6 text-xs text-slate-400 space-y-1">
          <p>Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien</p>
        </div>

      </div>
    </main>
  );
}