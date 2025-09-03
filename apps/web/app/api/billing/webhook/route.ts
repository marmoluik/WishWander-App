import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { setTripConcierge } from '@/packages/db/schemas/Trip';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const tripId = session.metadata?.tripId;
    if (tripId) setTripConcierge(tripId, true);
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const tripId = charge.metadata?.tripId;
    if (tripId) setTripConcierge(tripId, false);
  }

  return NextResponse.json({ received: true });
}

export const config = { runtime: 'nodejs' };
