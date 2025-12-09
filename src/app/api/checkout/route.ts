import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();

  // MAP TIERS TO PRICE IDs (Replace with your actual IDs or env vars)
  const prices: Record<string, string> = {
    bronze: process.env.STRIPE_PRICE_BRONZE!,
    silver: process.env.STRIPE_PRICE_SILVER!,
    gold: process.env.STRIPE_PRICE_GOLD!,
  };

  const priceId = prices[tier];

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid Tier' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium`,
    metadata: { userId: user.id, tier },
  });

  return NextResponse.json({ url: session.url });
}
