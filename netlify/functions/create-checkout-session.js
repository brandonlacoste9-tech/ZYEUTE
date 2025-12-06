/**
 * Netlify Function: Create Stripe Checkout Session
 * Creates a Stripe checkout session for premium subscriptions
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get auth token from request
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Missing authorization header' }),
      };
    }

    // Verify user with Supabase
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Parse request body
    const { tier } = JSON.parse(event.body || '{}');
    if (!tier || !['bronze', 'silver', 'gold'].includes(tier)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid tier. Must be bronze, silver, or gold' }),
      };
    }

    // Map tier to Stripe Price ID
    const priceIds = {
      bronze: process.env.STRIPE_PRICE_BRONZE,
      silver: process.env.STRIPE_PRICE_SILVER,
      gold: process.env.STRIPE_PRICE_GOLD,
    };

    const priceId = priceIds[tier];
    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Stripe Price ID not configured for tier: ${tier}` }),
      };
    }

    // Get user email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    const customerEmail = profile?.email || user.email || '';

    // Create Stripe Checkout Session
    const baseUrl = process.env.SITE_URL || process.env.URL || 'http://localhost:8888';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium?canceled=true`,
      customer_email: customerEmail,
      locale: 'fr-CA',
      metadata: {
        userId: user.id,
        tier: tier,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier: tier,
        },
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

