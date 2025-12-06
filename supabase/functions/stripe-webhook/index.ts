/**
 * Supabase Edge Function: Stripe Webhook Handler
 * Handles Stripe webhook events for subscription management
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;
      const subscriptionId = session.subscription as string;

      if (!userId || !tier || !subscriptionId) {
        console.error('Missing required metadata:', { userId, tier, subscriptionId });
        return new Response('Missing metadata', { status: 400 });
      }

      // Get subscription period from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      // Update user profile with subscription info
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_tier: tier,
          is_premium: true,
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating user_profiles:', profileError);
        return new Response('Error updating profile', { status: 500 });
      }

      // Also try to create subscription record in subscriptions table (for tracking)
      // This is optional - the main update is to user_profiles
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          subscriber_id: userId,
          creator_id: userId, // Self-subscription for premium tiers
          status: 'active',
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
        }, {
          onConflict: 'stripe_subscription_id',
        });

      if (subError) {
        console.warn('Note: Could not create subscription record:', subError);
        // This is OK - the main update is to user_profiles which succeeded
      }

      console.log(`Subscription activated for user ${userId}: ${tier}`);
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const tier = subscription.metadata?.tier;

      if (userId && tier) {
        const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status === 'active' ? 'active' : 'canceled',
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
          })
          .eq('stripe_subscription_id', subscription.id);
      }
    }

    // Handle subscription cancellations
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);

        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_tier: null,
            is_premium: false,
          })
          .eq('id', userId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});

