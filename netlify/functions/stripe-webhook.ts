/**
 * Netlify Function: Stripe Webhook Handler (TypeScript)
 * Handles Stripe webhook events for subscription management
 *
 * This function verifies Stripe signatures and updates the subscriptions table
 * when checkout sessions are completed.
 */

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handler: Handler = async (event) => {
  // Get Stripe signature from headers
  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing stripe-signature header' }),
    };
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook secret not configured' }),
    };
  }

  try {
    // Netlify functions pass body as string, need to handle it properly
    const body = typeof event.body === 'string' ? event.body : JSON.stringify(event.body || '');

    // Verify the webhook signature
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event;

    // Handle checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      // Extract data from session
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error('Missing userId in session metadata');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing userId in metadata' }),
        };
      }

      if (!subscriptionId) {
        console.error('Missing subscription_id in session');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing subscription_id' }),
        };
      }

      // Retrieve subscription details from Stripe to get period end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      const status =
        subscription.status === 'active' || subscription.status === 'trialing'
          ? subscription.status
          : 'active'; // Default to active for completed checkout

      // Update subscriptions table
      const { error: subError } = await supabaseAdmin.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: status,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'stripe_subscription_id',
        }
      );

      if (subError) {
        console.error('Error updating subscriptions table:', subError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to update subscription' }),
        };
      }

      // Also update user_profiles for backward compatibility
      const tier = session.metadata?.tier;
      if (tier) {
        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_tier: tier,
            is_premium: true,
            stripe_customer_id: customerId,
          })
          .eq('id', userId);
      }

      console.log(`✅ Subscription activated for user ${userId}: ${subscriptionId}`);
    }

    // Handle subscription updates
    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const status =
          subscription.status === 'active' || subscription.status === 'trialing'
            ? subscription.status
            : subscription.status === 'past_due'
              ? 'past_due'
              : 'canceled';

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
      }
    }

    // Handle subscription cancellations
    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // Optionally update user_profiles
        await supabaseAdmin
          .from('user_profiles')
          .update({
            is_premium: false,
            subscription_tier: null,
          })
          .eq('id', userId);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${error.message}` }),
    };
  }
};
