/**
 * Netlify Function: Stripe Webhook Handler
 * Handles Stripe webhook events for subscription management
 * 
 * Integration: Submits tasks to Colony OS for processing
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');
const { submitTask } = require('./lib/colony-client');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Colony OS configuration
const USE_COLONY_OS = process.env.USE_COLONY_OS === 'true';
const COLONIES_SERVER_HOST = process.env.COLONIES_SERVER_HOST;
const COLONIES_USER_PRVKEY = process.env.COLONIES_USER_PRVKEY;
const COLONIES_COLONY_NAME = process.env.COLONIES_COLONY_NAME || 'zyeute-colony';

exports.handler = async (event, context) => {
  const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  if (!signature) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature' }),
    };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);

    // If Colony OS is enabled, submit task and return immediately
    if (USE_COLONY_OS && COLONIES_SERVER_HOST && COLONIES_USER_PRVKEY) {
      try {
        await submitTask(
          {
            funcname: 'validate_revenue',
            args: [JSON.stringify(stripeEvent)],
            priority: 8, // High priority for revenue events
            maxexectime: 30,
          },
          COLONIES_SERVER_HOST,
          COLONIES_COLONY_NAME,
          COLONIES_USER_PRVKEY
        );

        console.log(`✅ Stripe event ${stripeEvent.type} submitted to Colony OS`);
        
        // Return immediately to Stripe (non-blocking)
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true, method: 'colony_os' }),
        };
      } catch (colonyError) {
        console.error('⚠️ Colony OS submission failed, falling back to direct processing:', colonyError);
        // Fall through to direct processing
      }
    }

    // Direct processing (fallback or when Colony OS disabled)
    // Handle checkout.session.completed
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;
      const subscriptionId = session.subscription;

      if (!userId || !tier || !subscriptionId) {
        console.error('Missing required metadata:', { userId, tier, subscriptionId });
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing metadata' }),
        };
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
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error updating profile' }),
        };
      }

      // Also try to create subscription record in subscriptions table (for tracking)
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          subscriber_id: userId,
          creator_id: userId, // Self-subscription for premium tiers
          status: 'active',
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer,
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
    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object;
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
    if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object;
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

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${error.message}` }),
    };
  }
};

