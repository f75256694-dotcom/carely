import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const isCaregiver = data.role === 'caregiver';

    const subject = isCaregiver 
      ? `🚀 Neue Helfer-Bewerbung: ${data.name}` 
      : `📩 Neue Pflege-Anfrage: ${data.name}`;

    await resend.emails.send({
      from: 'Helpify <onboarding@resend.dev>', // Nach Domain-Verifizierung durch deine eigene E-Mail ersetzen
      to: ['deine-admin-email@domain.at'], // Hier deine Ziel-E-Mail eintragen
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <hr />
          <p><strong>Typ:</strong> ${isCaregiver ? 'Alltagshelfer / Pflegekraft' : 'Hilfesuchende(r)'}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>E-Mail:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Bezirk(e):</strong> ${data.district}</p>
          <p><strong>Ausgewählte Leistungen:</strong> ${Array.isArray(data.services) ? data.services.join(', ') : data.services}</p>
          ${data.package ? `<p><strong>Paket:</strong> ${data.package}</p>` : ''}
          ${data.hours_per_week ? `<p><strong>Zeit/Woche:</strong> ${data.hours_per_week}</p>` : ''}
          ${data.target_group ? `<p><strong>Zielgruppe:</strong> ${data.target_group}</p>` : ''}
          <p><strong>Quelle:</strong> ${data.source || 'direkt'}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 });
  }
}