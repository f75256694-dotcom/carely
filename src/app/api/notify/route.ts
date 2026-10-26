import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Formulareingaben sind Nutzerdaten – vor dem Einbetten ins HTML-Mail escapen.
const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const yesNo = (value: unknown) => (value ? 'Ja' : 'Nein');

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY fehlt');
      return NextResponse.json({ error: 'Mailversand nicht konfiguriert' }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await req.json();
    const isCaregiver = data.role === 'caregiver';
    const name = String(data.name ?? '').slice(0, 120).replace(/[\r\n]/g, ' ');

    const subject = isCaregiver
      ? `🚀 Neue Helfer-Registrierung: ${name}`
      : `📩 Neue Anfrage Alltagshilfe (Döbling): ${name}`;

    const services = Array.isArray(data.services) ? data.services.join(', ') : data.services;

    // Resend gibt { data, error } zurück
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Helpify <no-reply@updates.helpifyservices.at>',
      to: ['office@helpifyservices.at'],
      // Antworten auf die Benachrichtigung gehen direkt an die anfragende Person
      ...(typeof data.email === 'string' && data.email.includes('@') ? { replyTo: data.email.trim() } : {}),
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${escapeHtml(subject)}</h2>
          <hr />
          <p><strong>Typ:</strong> ${isCaregiver ? 'Selbständige:r Alltagshelfer:in' : 'Hilfesuchende(r)'}</p>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>Bezirk:</strong> ${escapeHtml(data.district)}</p>
          ${data.zip ? `<p><strong>PLZ (Startseite):</strong> ${escapeHtml(data.zip)}</p>` : ''}
          <p><strong>Ausgewählte Leistungen:</strong> ${escapeHtml(services)}</p>
          ${data.hours_per_week ? `<p><strong>Verfügbarkeit:</strong> ${escapeHtml(data.hours_per_week)}</p>` : ''}
          ${data.package ? `<p><strong>Paket/Umfang:</strong> ${escapeHtml(data.package)}</p>` : ''}
          ${data.target_group ? `<p><strong>Zielgruppe:</strong> ${escapeHtml(data.target_group)}</p>` : ''}
          ${isCaregiver
            ? `<p><strong>Selbständigkeit bestätigt:</strong> ${yesNo(data.self_employed_confirmed)}</p>`
            : `<p><strong>AGB & Widerrufsbelehrung akzeptiert:</strong> ${yesNo(data.terms_accepted)}</p>`}
          <p><strong>Quelle:</strong> ${escapeHtml(data.source || 'direkt (Flyer)')}</p>
        </div>
      `,
    });

    if (resendError) {
      console.error('❌ Resend API Fehler:', resendError);
      return NextResponse.json({ error: resendError.message }, { status: 400 });
    }

    console.log('✅ Resend Erfolgreich:', resendData);
    return NextResponse.json({ success: true, resendData });

  } catch (error) {
    console.error('❌ Server Fehler:', error);
    return NextResponse.json({ error: 'Serverfehler beim Mailversand' }, { status: 500 });
  }
}
