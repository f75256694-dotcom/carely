'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, MapPin, Lock, Search, Handshake, ArrowLeft, X } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  const [role, setRole] = useState<'seeker' | 'caregiver' | null>(
    initialRole === 'caregiver' ? 'caregiver' : initialRole ? 'seeker' : null
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [password, setPassword] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals für AGB und Datenschutz
  const [showAgbModal, setShowAgbModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    if (!termsAccepted) {
      setErrorMsg('Bitte akzeptiere die AGB und die Datenschutzerklärung, um dich zu registrieren.');
      return;
    }

    if (role === 'caregiver' && !hasInsurance) {
      setErrorMsg('Bitte bestätige deine Privathaftpflichtversicherung, um fortzufahren.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            zip: zip,
          },
        },
      });

      if (authError) throw authError;

      if (authData?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: fullName,
            role: role,
            zip: zip,
            has_insurance_confirmed: role === 'caregiver' ? hasInsurance : false,
            terms_accepted: termsAccepted,
            hours_balance: role === 'seeker' ? 0 : undefined,
            total_earned: role === 'caregiver' ? 0 : undefined,
          },
        ]);

        if (profileError) throw profileError;

        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Registrierungsfehler:', err);
      setErrorMsg(err.message || JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-black text-[#0A2E23]">Wie möchtest du Helpify nutzen?</h2>
          <p className="text-xs text-slate-500 font-medium">Wähle deinen Bereich aus, um fortzufahren.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole('seeker')}
            className="p-8 bg-white border-2 border-emerald-950/10 hover:border-[#1B4D3E] rounded-[2rem] shadow-sm hover:shadow-md transition text-left space-y-4 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-[#1B4D3E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0A2E23]">Hilfe finden</h3>
              <p className="text-xs text-slate-500 mt-1">Ich suche Alltagsbegleitung für mich oder Angehörige.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className="p-8 bg-white border-2 border-emerald-950/10 hover:border-[#1B4D3E] rounded-[2rem] shadow-sm hover:shadow-md transition text-left space-y-4 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-emerald-50 text-[#1B4D3E] rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0A2E23]">Als selbständiger Alltagshelfer starten</h3>
              <p className="text-xs text-slate-500 mt-1">Bestimme deine Zeiten selbst – inkl. einfachem Start-Guide.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRole(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1B4D3E] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bereich wechseln</span>
          </button>
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-[#1B4D3E] px-3 py-1 rounded-full">
            {role === 'seeker' ? 'Hilfe finden' : 'Selbstständiger Helfer'}
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold whitespace-pre-wrap">
            {errorMsg}
          </div>
        )}

        {role === 'caregiver' && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs space-y-1">
            <p className="font-bold text-[#0A2E23]">💡 Gut zu wissen:</p>
            <p className="text-slate-600">
              Als selbstständiger Helfer meldest du kurz ein freies Gewerbe an (Personenbetreuung). 
              Keine Sorge: Wir unterstützen dich direkt nach der Registrierung via WhatsApp Schritt für Schritt dabei!
            </p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Vollständiger Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'caregiver' ? 'Anna Huber' : 'Maria Schmidt'}
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">E-Mail-Adresse</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Postleitzahl</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={5}
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="1170"
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 tracking-wider uppercase">Passwort</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 6 Zeichen"
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-[#FAFAF7] border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#1B4D3E] text-slate-900 text-sm font-medium outline-none transition"
              />
            </div>
          </div>

          {/* Haftpflicht-Checkbox */}
          {role === 'caregiver' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="mt-0.5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] w-4 h-4 cursor-pointer shrink-0 accent-[#1B4D3E]"
                />
                <span className="text-slate-700 leading-tight">
                  Ich bestätige, dass ich über eine aufrechte Privathaftpflichtversicherung (z. B. im Rahmen einer Haushaltsversicherung) verfüge.
                </span>
              </label>
            </div>
          )}

          {/* Rechtliche Bestätigung: AGB & Datenschutz */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#1B4D3E] focus:ring-[#1B4D3E] w-4 h-4 cursor-pointer shrink-0 accent-[#1B4D3E]"
              />
              <span className="text-slate-600 leading-tight">
                Ich akzeptiere die{' '}
                <button
                  type="button"
                  onClick={() => setShowAgbModal(true)}
                  className="text-[#1B4D3E] font-bold underline hover:text-[#13382d] inline"
                >
                  AGB
                </button>{' '}
                und habe die{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#1B4D3E] font-bold underline hover:text-[#13382d] inline"
                >
                  Datenschutzerklärung
                </button>{' '}
                gelesen.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-base shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? 'Konto wird erstellt...'
              : role === 'caregiver'
              ? 'Kostenlos als Helfer registrieren'
              : 'Kostenlos registrieren'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600 font-medium">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-[#1B4D3E] font-bold hover:underline">
              Hier anmelden
            </Link>
          </p>
        </div>
      </div>

      {/* AGB MODAL */}
      {showAgbModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#FAFAF7]">
              <div>
                <h3 className="text-lg font-bold text-[#0A2E23]">Allgemeine Geschäftsbedingungen (AGB)</h3>
                <p className="text-xs text-slate-500">Fassung vom 17.08.2026</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAgbModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">1. Geltungsbereich und Vertragspartner</h4>
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über Dienstleistungen im Bereich Alltagshilfe und Betreuung, die zwischen der <strong>Helpify</strong> (Inhaber: Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien, Österreich, nachfolgend „Anbieter“) und dem Kunden (nachfolgend „Kunde“) abgeschlossen werden. Mit der Inanspruchnahme unserer Dienste erkennt der Kunde die Geltung dieser AGB an.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">2. Vertragsabschluss</h4>
                <p>
                  Der Vertrag zwischen dem Anbieter und dem Kunden kommt durch die Buchung über unsere Online-Kanäle, per E-Mail, Telefon oder durch eine schriftliche Vereinbarung zustande. Der Anbieter behält sich das Recht vor, Buchungen oder Anfragen ohne Angabe von Gründen abzulehnen.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">3. Leistungsumfang</h4>
                <p>
                  Der genaue Umfang der zu erbringenden Leistungen ergibt sich aus der jeweiligen Leistungsbeschreibung auf der Website oder der individuellen Vereinbarung zwischen den Parteien. Helpify erbringt Dienstleistungen im Bereich der alltäglichen Unterstützung und Betreuung. Es handelt sich hierbei um reine Dienstverträge, ein bestimmter Erfolg wird – sofern nicht ausdrücklich schriftlich vereinbart – nicht geschuldet.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">4. Mitwirkungspflichten des Kunden</h4>
                <p>
                  Der Kunde ist verpflichtet, alle für die Durchführung der Dienstleistung erforderlichen Informationen, Zugänge und gefahrlose Rahmenbedingungen rechtzeitig und wahrheitsgemäß zur Verfügung zu stellen. Der Kunde stellt sicher, dass von seinen Räumlichkeiten, Geräten oder Haustieren keine unverhältnismäßigen Gefahren ausgehen. Eventuelle Verzögerungen oder Schäden, die durch das Ausbleiben von Mitwirkungshandlungen oder fehlerhaften Angaben entstehen, gehen nicht zu Lasten des Anbieters.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">5. Preise und Zahlungsbedingungen</h4>
                <p>
                  Es gelten die zum Zeitpunkt der Bestellung bzw. Vereinbarung auf der Website angegebenen Preise. Alle Preise verstehen sich in Euro. Rechnungen sind – sofern nicht anders vereinbart – sofort nach Erhalt ohne Abzug zur Zahlung fällig. Bei Zahlungsverzug behält sich der Anbieter vor, Verzugszinsen und Mahnspesen zu berechnen.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">6. Stornierung, Rücktritt und Widerruf</h4>
                <p>
                  Buchungen können bis zu 24 Stunden vor dem vereinbarten Leistungstermin kostenlos storniert werden, sofern nichts anderes vereinbart wurde. Bei kurzfristigeren Stornierungen oder dem Nichterscheinen des Kunden wird die vereinbarte Leistung zu 100 % in Rechnung gestellt.
                </p>
                <p className="pt-1">
                  <strong>Hinweis für Verbraucher:</strong> Sofern der Kunde Verbraucher im Sinne des Konsumentenschutzgesetzes (KSchG) ist, stehen ihm die gesetzlichen Widerrufsrechte bei Fernabsatzgeschäften zu. Details hierzu finden sich in unserer gesonderten Widerrufsbelehrung.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">7. Haftung und Gewährleistung</h4>
                <p>
                  Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Verletzung die Erreichung des Vertragszwecks gefährdet. Die Haftung ist in diesem Fall auf den vorhersehbaren, typischen Schaden begrenzt. Die Haftung für indirekte Schäden, entgangenen Gewinn oder Folgeschäden ist ausgeschlossen.
                </p>
                <p className="pt-1">
                  <strong>Wichtig:</strong> Gesetzliche Gewährleistungsrechte des Kunden (insb. für Verbraucher) bleiben von dieser Haftungsbeschränkung unberührt.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">8. Datenschutz</h4>
                <p>
                  Die Verarbeitung personenbezogener Daten des Kunden erfolgt im Einklang mit der geltenden Datenschutz-Grundverordnung (DSGVO) und unserer auf der Website einsehbaren Datenschutzerklärung.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">9. Schlussbestimmungen</h4>
                <p>
                  Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für Vollkaufleute ist Wien.
                </p>
              </section>

              <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-[#FAFAF7] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowAgbModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-xs transition"
              >
                AGB akzeptieren & schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATENSCHUTZ MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#FAFAF7]">
              <div>
                <h3 className="text-lg font-bold text-[#0A2E23]">Datenschutzerklärung</h3>
                <p className="text-xs text-slate-500">Fassung vom 17.08.2026</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Einleitung und Überblick</h4>
                <p>
                  Wir haben diese Datenschutzerklärung verfasst, um Ihnen gemäß der Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten wir als Verantwortliche verarbeiten.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Verantwortlicher</h4>
                <p>
                  Helpify – Florian Touraj Saubiez<br />
                  Kulmgasse 44, 1170 Wien, Österreich<br />
                  E-Mail: office@helpifyservices.at
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Rechtsgrundlagen</h4>
                <p>
                  Wir verarbeiten Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. a (Einwilligung), lit. b (Vertragserfüllung) und lit. f (berechtigtes Interesse) der DSGVO.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Ihre Rechte</h4>
                <p>
                  Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu.
                </p>
              </section>

              <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400">
                Helpify – Florian Touraj Saubiez, Kulmgasse 44, 1170 Wien
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-[#FAFAF7] flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#13382d] text-white font-bold text-xs transition"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-slate-800 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="flex flex-col items-center text-center mb-8 space-y-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-md shrink-0">
            <svg 
              className="w-6 h-6 text-[#86EFAC]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/>
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black tracking-tight text-[#0A2E23] font-serif leading-none">Helpify</span>
            <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">Senioren & Alltagshilfe</span>
          </div>
        </Link>

        <div className="pt-2">
          <h1 className="text-3xl font-serif font-black text-[#0A2E23] tracking-tight">Konto erstellen</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Anfrage speichern & passende Helfer direkt matchen.</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center p-8 text-slate-500 font-medium">Laden...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}