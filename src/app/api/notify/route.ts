import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || '');

    const data = await req.json();
    const isCaregiver = data.role === 'caregiver';

    const subject = isCaregiver 
      ? `🚀 Neue Helfer-Bewerbung: ${data.name}` 
      : `📩 Neue Pflege-Anfrage (Döbling): ${data.name}`;

    // Resend gibt { data, error } zurück
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Helpify <onboarding@resend.dev>', 
      to: ['office@helpifyservices.at'],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <hr />
          <p><strong>Typ:</strong> ${isCaregiver ? 'Alltagshelfer / Pflegekraft' : 'Hilfesuchende(r)'}</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>E-Mail:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Bezirk:</strong> ${data.district}</p>
          <p><strong>Ausgewählte Leistungen:</strong> ${Array.isArray(data.services) ? data.services.join(', ') : data.services}</p>
          ${data.package ? `<p><strong>Paket/Umfang:</strong> ${data.package}</p>` : ''}
          ${data.target_group ? `<p><strong>Zielgruppe:</strong> ${data.target_group}</p>` : ''}
          <p><strong>Quelle:</strong> ${data.source || 'direkt (Flyer)'}</p>
        </div>
      `,
    });

    if (resendError) {
      console.error('❌ Resend API Fehler:', resendError);
      return NextResponse.json({ error: resendError.message }, { status: 400 });
    }

    console.log('✅ Resend Erfolgreich:', resendData);
    return NextResponse.json({ success: true, resendData });

  } catch (error: any) {
    console.error('❌ Server Fehler:', error);
    return NextResponse.json({ error: 'Serverfehler beim Mailversand' }, { status: 500 });
  }
}