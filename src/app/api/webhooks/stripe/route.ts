import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Safe initialisieren für Next.js Build
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
  });

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signatur-Fehler: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userEmail = session.customer_details?.email || session.metadata?.email;
    const amountTotal = session.amount_total; // Betrag in Cents (z. B. 23900 = 239,00 €)

    // Ermittle Stunden anhand des Zahlungsbetrags (Funktioniert garantiert mit Payment Links)
    let hoursToAdd = 0;
    if (amountTotal === 23900) {
      hoursToAdd = 10; // Flex-Paket (239 €)
    } else if (amountTotal === 9900) {
      hoursToAdd = 4; // Starter-Paket (99 €)
    }

    if (userEmail && hoursToAdd > 0) {
      try {
        // 1. Profil anhand von email laden & hours_balance auslesen
        const { data: profile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('id, hours_balance')
          .eq('email', userEmail)
          .single();

        if (fetchError || !profile) {
          console.error('User-Profil für Guthaben-Abrechnung nicht gefunden:', fetchError);
          return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        // 2. Guthaben berechnen und in hours_balance speichern
        const newBalance = (profile.hours_balance || 0) + hoursToAdd;

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ hours_balance: newBalance })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Fehler beim Aktualisieren des Guthabens:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`Guthaben erfolgreich um ${hoursToAdd} Std. für ${userEmail} erhöht. Neuer Stand: ${newBalance} Std.`);
      } catch (error) {
        console.error('Unerwarteter Fehler im Webhook-Processing:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}