import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

const PRODUCT_NAME = 'Concierge Pass';

async function getOrCreateProduct() {
  const products = await stripe.products.list({ limit: 100 });
  const existing = products.data.find((p) => p.name === PRODUCT_NAME);
  if (existing) return existing;
  return stripe.products.create({ name: PRODUCT_NAME, description: 'Hands-Off Mode for one trip with priority support' });
}

async function getOrCreatePrice(productId: string) {
  const prices = await stripe.prices.list({ product: productId, limit: 1 });
  if (prices.data.length) return prices.data[0].id;
  const price = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: 5000,
  });
  return price.id;
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get('tripId');
  if (!tripId) {
    return NextResponse.json({ error: 'tripId required' }, { status: 400 });
  }

  const product = await getOrCreateProduct();
  const priceId = await getOrCreatePrice(product.id);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_URL || 'http://localhost:3000'}/plan/chat?tripId=${tripId}&success=true`,
    cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/plan/chat?tripId=${tripId}&canceled=true`,
    metadata: { tripId },
    payment_intent_data: { metadata: { tripId } },
  });

  return NextResponse.json({ url: session.url });
}
