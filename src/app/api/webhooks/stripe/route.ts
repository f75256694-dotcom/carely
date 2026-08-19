import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-07-29.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Supabase Admin-Client (mit Service Role Key, um RLS-Sperren im Webhook zu umgehen)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
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
    const packageName = session.metadata?.packageName || '';

    // Stunden anhand des Paketnamens ermitteln
    let hoursToAdd = 0;
    if (packageName.includes('4 Std') || packageName.includes('Starter')) {
      hoursToAdd = 4;
    } else if (packageName.includes('10 Std') || packageName.includes('Flex')) {
      hoursToAdd = 10;
    }

    if (userEmail && hoursToAdd > 0) {
      try {
        // 1. User-ID anhand der E-Mail in der Profiles-Tabelle ermitteln
        const { data: profile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('id, total_hours')
          .eq('email', userEmail)
          .single();

        if (fetchError || !profile) {
          console.error('User-Profil für Guthaben-Abrechnung nicht gefunden:', fetchError);
          return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        // 2. Guthaben (total_hours) in Supabase erhöhen
        const newTotalHours = (profile.total_hours || 0) + hoursToAdd;

        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ total_hours: newTotalHours })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Fehler beim Aktualisieren des Guthabens:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        console.log(`Guthaben erfolgreich um ${hoursToAdd} Std. für ${userEmail} erhöht. Neuer Stand: ${newTotalHours} Std.`);
      } catch (error) {
        console.error('Unerwarteter Fehler im Webhook-Processing:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}