// netlify/functions/stripe-checkout.js
// Creates Stripe Checkout Session for subscription tiers

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map frontend pricing tiers to Stripe Price IDs (IDs must be created in Stripe dashboard)
const priceMap = {
    'bronze': process.env.STRIPE_PRICE_ID_BRONZE,
    'silver': process.env.STRIPE_PRICE_ID_SILVER,
    'gold': process.env.STRIPE_PRICE_ID_GOLD,
};

exports.handler = async (event, context) => {
    // CORS headers for React Native / web
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }

    try {
        const { tier, userEmail, userId } = JSON.parse(event.body);
        const priceId = priceMap[tier];

        if (!priceId || !userEmail || !userId) {
            return { 
                statusCode: 400, 
                headers,
                body: JSON.stringify({ error: 'Missing tier, userEmail, or userId.' }) 
            };
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            metadata: { userId: userId, tier: tier },
            customer_email: userEmail,
            client_reference_id: userId, // For webhook lookup
            success_url: `${process.env.DEPLOY_URL || 'https://your-app.com'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.DEPLOY_URL || 'https://your-app.com'}/pricing?cancelled=true`,
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ sessionId: session.id, url: session.url }),
        };
    } catch (error) {
        console.error('Stripe Checkout Error:', error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to create Stripe checkout session.', 
                details: error.message 
            }),
        };
    }
};

