import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { priceId } = JSON.parse(event.body || '{}');

    if (!priceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing priceId' }),
      };
    }

    // Get the origin for success/cancel URLs
    const origin =
      event.headers.origin || event.headers.host || 'https://your-netlify-site.netlify.app';

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium`,
      // Optional: Add customer_email or other metadata as needed
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
    };
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
};
