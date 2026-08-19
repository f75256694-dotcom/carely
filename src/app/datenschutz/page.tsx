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
                        <p className="text-sm text-slate-500 mt-2">Fassung 17.08.2026-113233097</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Einleitung und Überblick</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Wir haben diese Datenschutzerklärung verfasst, um Ihnen gemäß der Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten wir als Verantwortliche – und die von uns beauftragten Auftragsverarbeiter (z. B. Provider) – verarbeiten, zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten Sie haben. Die verwendeten Begriffe sind geschlechtsneutral zu verstehen.
                        </p>
                        <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 rounded-r-lg text-slate-700 text-sm font-medium">
                            Kurz gesagt: Wir informieren Sie umfassend über Daten, die wir über Sie verarbeiten.
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            Datenschutzerklärungen klingen für gewöhnlich sehr technisch und verwenden juristische Fachbegriffe. Diese Datenschutzerklärung soll Ihnen hingegen die wichtigsten Dinge so einfach und transparent wie möglich beschreiben.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Anwendungsbereich</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten. Der Anwendungsbereich umfasst:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>alle Onlineauftritte (Websites, Onlineshops), die wir betreiben</li>
                            <li>Social Media Auftritte und E-Mail-Kommunikation</li>
                            <li>mobile Apps für Smartphones und andere Geräte</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Rechtsgrundlagen</h2>
                        <p className="text-slate-600 leading-relaxed">Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden Bedingungen zutrifft:</p>
                        <ul className="space-y-2 text-slate-600">
                            <li><strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</strong> Sie haben uns Ihre Einwilligung gegeben...</li>
                            <li><strong>Vertrag (Art. 6 Abs. 1 lit. b DSGVO):</strong> Zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen...</li>
                            <li><strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO):</strong> Zum Beispiel gesetzliche Aufbewahrungsfristen.</li>
                            <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO):</strong> Zum sicheren und effizienten Betrieb der Website.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Kontaktdaten des Verantwortlichen</h2>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-2">
                            <p className="font-semibold text-slate-900">Helpify</p>
                            <p>Florian Touraj Saubiez</p>
                            <p>Kulmgasse 44, 1170 Wien, Österreich</p>
                            <p>E-Mail: <a href="mailto:office@helpifyservices.at" className="text-indigo-600 hover:underline">office@helpifyservices.at</a></p>
                            <p>Telefon: +49 176 32089328</p>
                            <p>Impressum: <a href="https://helpifyservices.at/imprint" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://helpifyservices.at/imprint</a></p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Speicherdauer</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Wir speichern personenbezogene Daten nur so lange, wie es für die Bereitstellung unserer Dienstleistungen unbedingt notwendig ist oder gesetzliche Fristen es vorschreiben.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Rechte laut Datenschutz-Grundverordnung</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Ihnen stehen laut DSGVO folgende Rechte zu: Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21) sowie Beschwerde bei einer Aufsichtsbehörde (Art. 77).
                        </p>
                        <div className="text-slate-600">
                            <p className="font-medium text-slate-800">Österreichische Datenschutzbehörde:</p>
                            <p>Barichgasse 40-42, 1030 Wien | <a href="https://www.dsb.gv.at/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://www.dsb.gv.at/</a></p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Sicherheit & TLS-Verschlüsselung</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein und nutzen HTTPS/TLS-Verschlüsselung, um Ihre Daten abhörsicher im Internet zu übertragen.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Kommunikation</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Wenn Sie mit uns per Telefon, E-Mail oder Online-Formular kommunizieren, verarbeiten wir Ihre Angaben zur Bearbeitung und Abwicklung Ihres Anliegens auf Basis von Art. 6 Abs. 1 lit. a, b und f DSGVO.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Auftragsverarbeitungsvertrag (AVV)</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Weil wir Dienstleister einsetzen, haben wir sogenannte Auftragsverarbeitungsverträge (AVV) gemäß Art. 28 DSGVO abgeschlossen, um den Schutz Ihrer Daten zu garantieren.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">1&1 IONOS Webhosting</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Wir nutzen die Webhosting-Dienste der 1&1 IONOS SE (Elgendorfer Str. 57, 56410 Montabaur, Deutschland). Besucherdaten werden 8 Wochen gespeichert. Weitere Infos finden Sie in der <a href="https://www.ionos.de/terms-gtc/datenschutzerklaerung/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">IONOS Datenschutzerklärung</a>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-slate-900">Erklärung verwendeter Begriffe</h2>
                        <div className="space-y-3 text-slate-600 text-sm">
                            <p><strong>Aufsichtsbehörde:</strong> Eine unabhängige staatliche Stelle zur Überwachung des Datenschutzes.</p>
                            <p><strong>Auftragsverarbeiter:</strong> Eine Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet.</p>
                            <p><strong>Dritter:</strong> Jede natürliche oder juristische Stelle außer der betroffenen Person, dem Verantwortlichen und dem Auftragsverarbeiter.</p>
                            <p><strong>Einwilligung:</strong> Freiwillige, informierte und unmissverständlich abgegebene Willensbekundung.</p>
                            <p><strong>Empfänger:</strong> Jede Stelle, der Daten offengelegt werden.</p>
                            <p><strong>Personenbezogene Daten:</strong> Alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen (inkl. IP-Adresse).</p>
                            <p><strong>Verantwortlicher:</strong> Wer allein oder gemeinsam über die Zwecke und Mittel der Datenverarbeitung entscheidet.</p>
                            <p><strong>Verarbeitung:</strong> Jeder Vorgang im Zusammenhang mit Daten (Erheben, Speichern, Löschen etc.).</p>
                        </div>
                    </section>

                    <div className="border-t border-slate-200 pt-6 space-y-2">
                        <h2 className="text-xl font-semibold text-slate-900">Schlusswort</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Herzlichen Glückwunsch, wenn Sie bis hierhin gelesen haben! Bei Fragen zum Datenschutz zögern Sie bitte nicht, uns zu kontaktieren.
                        </p>
                        <p className="text-xs text-slate-400 pt-4">
                            Quelle: Erstellt mit dem Datenschutz Generator von AdSimple
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );
}