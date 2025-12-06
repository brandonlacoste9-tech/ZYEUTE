/**
 * Supabase Edge Function: Create Stripe Checkout Session
 * Creates a Stripe checkout session for premium subscriptions
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user with Supabase
    const token = authHeader.replace('Bearer ', '');
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { tier } = await req.json();
    if (!tier || !['bronze', 'silver', 'gold'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier. Must be bronze, silver, or gold' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map tier to Stripe Price ID
    // TODO: Replace these with your actual Stripe Price IDs
    const priceIds: Record<string, string> = {
      bronze: Deno.env.get('STRIPE_PRICE_BRONZE') || '',
      silver: Deno.env.get('STRIPE_PRICE_SILVER') || '',
      gold: Deno.env.get('STRIPE_PRICE_GOLD') || '',
    };

    const priceId = priceIds[tier];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `Stripe Price ID not configured for tier: ${tier}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    const customerEmail = profile?.email || user.email || '';

    // Create Stripe Checkout Session
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173';
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
      customer_email: customerEmail,     locale: 'fr-CA',
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

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

