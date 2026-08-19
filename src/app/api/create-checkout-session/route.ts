import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const { packageName, email, name } = await req.json();

    // Mapping deiner Paket-Namen auf die Stripe Price-IDs
    let priceId = '';
    
    if (packageName.includes('Starter')) {
      priceId = 'price_1U68B5V05eYd2qm8Rh0ftoAI';
    } else if (packageName.includes('Flex')) {
      priceId = 'price_1U68C9V05eYd2qm8L5Sg53DP';
    } else {
      priceId = 'price_1U68B5V05eYd2qm8Rh0ftoAI';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      // WICHTIG: Metadata hinzugefügt, damit der Webhook den User und das Paket zuordnen kann!
      metadata: {
        email: email,
        packageName: packageName,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/dashboard/mvppage?success=true`,
      cancel_url: `${req.headers.get('origin')}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}