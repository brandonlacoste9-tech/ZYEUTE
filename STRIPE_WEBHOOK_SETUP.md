# Stripe Webhook Setup Guide

This guide explains how to set up and configure the Stripe webhook for handling subscription payments in Zyeuté.

## Overview

The Stripe webhook handler is located at `app/api/webhooks/stripe/route.ts` and handles the following events:

- `checkout.session.completed` - When a user successfully completes a checkout session

**Note:** This project uses a hybrid architecture with Vite for the frontend and Next.js-style API routes for backend functionality. When deployed on Vercel, the API routes are automatically detected and deployed as serverless functions.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here

# Supabase Configuration (for server-side admin operations)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Stripe Dashboard Setup

### 1. Get Your Stripe Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy the **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)
3. Add it to your `.env.local` as `STRIPE_SECRET_KEY`

### 2. Set Up Webhook Endpoint

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - Local development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for testing
   - Production: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 3. Testing Locally with Stripe CLI

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli#install
```

For local development, you'll need to run the API routes separately from the Vite dev server. The easiest way is to:

1. Deploy to Vercel preview (push to a branch)
2. Use the preview URL with Stripe CLI:
```bash
stripe listen --forward-to https://your-preview.vercel.app/api/webhooks/stripe
```

Alternatively, you can test webhooks after deploying to production/staging, as the API routes are designed to run as serverless functions on Vercel.

## How It Works

1. User completes a checkout session in your app
2. Stripe sends a `checkout.session.completed` event to your webhook endpoint
3. The webhook handler:
   - Verifies the webhook signature for security
   - Extracts the `userId` from the session metadata
   - Updates the user's profile in Supabase:
     - Sets `is_premium` to `true`
     - Stores the `stripe_subscription_id`
     - Sets `plan_tier` to `"premium"`
     - Updates `updated_at` timestamp
4. Returns a 200 OK response to Stripe

## Database Schema

Ensure your Supabase `profiles` table has these columns:

```sql
- is_premium (boolean)
- stripe_subscription_id (text)
- plan_tier (text)
- updated_at (timestamp)
```

## Security Notes

- The webhook verifies the Stripe signature to prevent unauthorized requests
- Always use environment variables for sensitive keys (never commit them to git)
- Use `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) for admin operations
- The middleware in `middleware.ts` already excludes `/api` routes from authentication

## Middleware Configuration

The `middleware.ts` file is configured to exclude API routes:

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

This ensures webhooks work without authentication requirements.

## Troubleshooting

### Webhook signature verification fails
- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Check that you're using the signing secret from the correct environment (test vs. production)
- Verify the webhook body isn't being modified by middleware

### User profile not updating
- Check Supabase service role key is correct
- Verify the `profiles` table exists with the required columns
- Ensure Row Level Security (RLS) policies allow service role updates
- Check the `userId` is correctly passed in the checkout session metadata

### Testing checklist
- [ ] Webhook endpoint is accessible
- [ ] Environment variables are set correctly
- [ ] Stripe webhook is configured in dashboard
- [ ] Webhook signature verification passes
- [ ] User profile updates successfully in Supabase

## Next Steps

1. Add support for more Stripe events:
   - `customer.subscription.updated` - Handle subscription changes
   - `customer.subscription.deleted` - Handle cancellations
   - `invoice.payment_failed` - Handle failed payments

2. Add error logging and monitoring
3. Implement webhook retry logic for failed updates
4. Add tests for the webhook handler

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Supabase Service Role Key](https://supabase.com/docs/guides/api#the-service_role-key)
