// netlify/functions/stripe-webhook.js
// Handles Stripe webhook events and updates Supabase user_profiles

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase Client with Service Role Key
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use Service Key for secure backend operations
);

exports.handler = async (event) => {
    const sig = event.headers['stripe-signature'];
    let stripeEvent;

    // 1. Verify Webhook Signature (Security Critical)
    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error(`❌ Webhook Signature Error: ${err.message}`);
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: `Webhook Error: ${err.message}` }) 
        };
    }

    // 2. Handle the Event Type
    const data = stripeEvent.data.object;

    try {
        if (stripeEvent.type === 'checkout.session.completed') {
            const { metadata, customer, mode } = data;
            
            // Ensure this is a subscription checkout
            if (mode !== 'subscription') {
                console.log('Ignoring non-subscription checkout.');
                return { statusCode: 200, body: JSON.stringify({ received: true }) };
            }

            // Get user details from metadata
            const userId = metadata?.userId || data.client_reference_id;
            const newTier = metadata?.tier;
            const stripeCustomerId = customer;

            if (!userId || !newTier) {
                console.error('❌ Missing userId or tier in checkout session');
                return { 
                    statusCode: 400, 
                    body: JSON.stringify({ error: 'Missing userId or tier' }) 
                };
            }

            // 3. Fulfill the Order (Update Supabase)
            const { data: updateData, error: updateError } = await supabase
                .from('user_profiles')
                .update({ 
                    subscription_tier: newTier,
                    plan: newTier, // Map to existing plan field for backward compatibility
                    stripe_customer_id: stripeCustomerId,
                    is_premium: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select();

            if (updateError) {
                console.error('❌ Supabase Update Error:', updateError);
                // In production, queue a retry or alert
                return { 
                    statusCode: 500, 
                    body: JSON.stringify({ error: 'Database fulfillment failed', details: updateError.message }) 
                };
            }

            // Verify that the update actually affected a row
            if (!updateData || updateData.length === 0) {
                console.error(`❌ Update failed: No profile found with userId ${userId}. Customer may have paid but will not receive premium access.`);
                return { 
                    statusCode: 404, 
                    body: JSON.stringify({ 
                        error: 'Profile not found',
                        message: `No user profile found with id: ${userId}. Payment processed but premium status not granted.` 
                    }) 
                };
            }

            console.log(`✅ User ${userId} upgraded to ${newTier} tier.`);
            return { 
                statusCode: 200, 
                body: JSON.stringify({ 
                    received: true, 
                    message: `User ${userId} upgraded to ${newTier}` 
                }) 
            };
        }

        // Handle subscription updates
        if (stripeEvent.type === 'customer.subscription.updated') {
            const subscription = data;
            const customerId = subscription.customer;
            
            // Find user by stripe_customer_id
            const { data: userProfile, error: userError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('stripe_customer_id', customerId)
                .single();

            if (userError || !userProfile) {
                console.error(`❌ User profile not found for Stripe customer: ${customerId}`);
                // Continue processing but log the error
            } else if (subscription.status === 'active') {
                // Subscription is active - ensure premium status
                const { data: updateData, error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ is_premium: true })
                    .eq('id', userProfile.id)
                    .select();

                if (updateError) {
                    console.error(`❌ Failed to update premium status for user ${userProfile.id}:`, updateError);
                } else if (!updateData || updateData.length === 0) {
                    console.error(`❌ Update failed: No profile found with id ${userProfile.id} for subscription update`);
                } else {
                    console.log(`✅ Updated premium status for user ${userProfile.id}`);
                }
            } else if (subscription.status === 'canceled') {
                // Subscription canceled - downgrade to free
                const { data: updateData, error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ 
                        subscription_tier: null,
                        plan: 'free',
                        is_premium: false 
                    })
                    .eq('id', userProfile.id)
                    .select();

                if (updateError) {
                    console.error(`❌ Failed to downgrade user ${userProfile.id}:`, updateError);
                } else if (!updateData || updateData.length === 0) {
                    console.error(`❌ Update failed: No profile found with id ${userProfile.id} for subscription cancellation`);
                } else {
                    console.log(`✅ Downgraded user ${userProfile.id} to free tier`);
                }
            }
        }

        // Handle payment failures
        if (stripeEvent.type === 'invoice.payment_failed') {
            const invoice = data;
            const customerId = invoice.customer;
            
            // Optionally notify user or update status
            console.log(`⚠️ Payment failed for customer: ${customerId}`);
            // You could add logic here to send notification or update user status
        }

        // Handle subscription deletions
        if (stripeEvent.type === 'customer.subscription.deleted') {
            const subscription = data;
            const customerId = subscription.customer;
            
            // Downgrade user to free
            const { data: userProfile, error: userError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('stripe_customer_id', customerId)
                .single();

            if (userError || !userProfile) {
                console.error(`❌ User profile not found for Stripe customer: ${customerId}`);
            } else {
                const { data: updateData, error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ 
                        subscription_tier: null,
                        plan: 'free',
                        is_premium: false 
                    })
                    .eq('id', userProfile.id)
                    .select();

                if (updateError) {
                    console.error(`❌ Failed to downgrade user ${userProfile.id}:`, updateError);
                } else if (!updateData || updateData.length === 0) {
                    console.error(`❌ Update failed: No profile found with id ${userProfile.id} for subscription deletion`);
                } else {
                    console.log(`⬇️ User ${userProfile.id} downgraded to free tier.`);
                }
            }
        }

        // 4. Success Response
        return { 
            statusCode: 200, 
            body: JSON.stringify({ received: true, type: stripeEvent.type }) 
        };
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: 'Webhook processing failed', details: error.message }) 
        };
    }
};

