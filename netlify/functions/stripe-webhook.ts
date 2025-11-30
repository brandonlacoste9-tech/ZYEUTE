/**
 * Stripe Webhook Handler for Zyeuté
 * Handles Stripe events for premium VIP subscriptions
 * 
 * Deployment: Netlify Serverless Function
 * Endpoint: https://your-domain.netlify.app/.netlify/functions/stripe-webhook
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

// Admin client to bypass RLS for database updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const body = event.body!;
  const signature = event.headers['stripe-signature'];

  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Stripe signature' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  console.log(`✅ Webhook received: ${stripeEvent.type}`);

  try {
    // Handle successful payment/checkout
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      // Metadata passed from the checkout creation
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier || 'bronze'; // bronze, silver, or gold
      const subscriptionId = session.subscription as string;

      if (!userId) {
        console.error('❌ User ID missing in metadata');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'User ID missing in metadata' }),
        };
      }

      console.log(`💰 Payment success for User: ${userId}, Tier: ${tier}`);

      // OPTION 1: Update using a platform_subscriptions table (if it exists)
      // This is the recommended approach for platform VIP subscriptions
      const { error: subError } = await supabaseAdmin
        .from('platform_subscriptions')
        .upsert({
          user_id: userId,
          tier: tier,
          status: 'active',
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (subError) {
        console.log('⚠️ platform_subscriptions table not found, falling back to users table update');
        
        // OPTION 2: Fallback - update users table directly
        const { error: userError } = await supabaseAdmin
          .from('users')
          .update({
            // Add premium status fields to users table
            // Note: These fields may need to be added via migration
            is_premium: true,
            premium_tier: tier,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (userError) {
          console.error('❌ Error updating user:', userError);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database update failed' }),
          };
        }
      }

      console.log(`✅ Subscription activated for user ${userId}`);
    }

    // Handle subscription updates
    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object as any;
      const userId = subscription.metadata?.userId;

      if (userId) {
        // Update subscription status
        const status = subscription.status === 'active' ? 'active' : 
                      subscription.status === 'past_due' ? 'past_due' : 
                      'canceled';

        await supabaseAdmin
          .from('platform_subscriptions')
          .update({
            status: status,
            current_period_end: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`✅ Subscription updated for user ${userId}: ${status}`);
      }
    }

    // Handle subscription cancellations
    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      
      console.log(`🚫 Subscription canceled: ${subscription.id}`);

      // Try platform_subscriptions table first
      const { error: subError } = await supabaseAdmin
        .from('platform_subscriptions')
        .update({
          status: 'canceled',
          is_premium: false,
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);

      if (subError) {
        // Fallback to users table
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (user) {
          await supabaseAdmin
            .from('users')
            .update({
              is_premium: false,
              premium_tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
      }

      console.log(`✅ Subscription canceled`);
    }

    // Handle payment failures
    if (stripeEvent.type === 'invoice.payment_failed') {
      const invoice = stripeEvent.data.object as any;
      const subscriptionId = typeof invoice.subscription === 'string' 
        ? invoice.subscription 
        : invoice.subscription?.id;

      if (subscriptionId) {
        console.log(`⚠️ Payment failed for subscription: ${subscriptionId}`);

        await supabaseAdmin
          .from('platform_subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
