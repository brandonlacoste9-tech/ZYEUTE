# 🔥 Stripe Webhook Setup Guide

This guide explains how to set up and deploy the Stripe webhook handler for Zyeuté premium VIP subscriptions.

## 📋 Overview

The Stripe webhook handles the following events:
- ✅ `checkout.session.completed` - User completes payment for VIP subscription
- 🔄 `customer.subscription.updated` - Subscription status changes
- ❌ `customer.subscription.deleted` - User cancels subscription
- ⚠️ `invoice.payment_failed` - Payment fails (card declined, etc.)

## 🗄️ Database Setup

### Step 1: Run Migration

The webhook requires the `platform_subscriptions` table. Run this migration:

```bash
# Using Supabase CLI
supabase migration up 008_platform_subscriptions

# Or apply the SQL directly in Supabase Dashboard
# File: supabase/migrations/008_platform_subscriptions.sql
```

This migration creates:
- `platform_subscriptions` table - Tracks user VIP subscriptions (Bronze, Silver, Gold)
- Adds `is_premium`, `premium_tier`, `stripe_subscription_id` fields to `users` table
- Trigger to sync premium status between tables
- Helper functions: `has_active_premium()`, `get_user_premium_tier()`

### Database Schema

```sql
platform_subscriptions
├── id (UUID)
├── user_id (UUID, references users)
├── tier (TEXT: 'bronze' | 'silver' | 'gold')
├── status (TEXT: 'active' | 'canceled' | 'past_due' | 'expired')
├── stripe_subscription_id (TEXT)
├── stripe_customer_id (TEXT)
├── current_period_start (TIMESTAMPTZ)
├── current_period_end (TIMESTAMPTZ)
├── canceled_at (TIMESTAMPTZ)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## 🔐 Environment Variables

Add these environment variables to your deployment platform:

### Required
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...           # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...         # Webhook signing secret (from Stripe Dashboard)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # Service role key (bypasses RLS)
```

### Where to Find

1. **STRIPE_SECRET_KEY**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys) → API Keys → Secret key
2. **STRIPE_WEBHOOK_SECRET**: [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → Add endpoint → Copy signing secret
3. **SUPABASE_SERVICE_ROLE_KEY**: [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API → service_role key (Keep this secret!)

## 🚀 Deployment

### Option 1: Vercel (Recommended)

**Endpoint**: `https://your-domain.vercel.app/api/webhooks/stripe`

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Add Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables listed above

3. **Configure Stripe Webhook**:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

### Option 2: Netlify

**Endpoint**: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

1. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

2. **Add Environment Variables**:
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required variables

3. **Configure Stripe Webhook**:
   - Same as Vercel, but use: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

## 🧪 Testing

### Test Webhook Locally

#### Using Stripe CLI

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli

2. **Login**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   
   For Vercel (using local dev server):
   ```bash
   # Terminal 1: Run your dev server
   npm run dev
   
   # Terminal 2: Forward webhooks
   stripe listen --forward-to localhost:5173/api/webhooks/stripe
   ```
   
   For Netlify (using netlify dev):
   ```bash
   # Terminal 1: Run netlify dev
   netlify dev
   
   # Terminal 2: Forward webhooks
   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
   ```

4. **Trigger test event**:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Test Payment Flow

1. Create a test checkout session with metadata:
   ```javascript
   const session = await stripe.checkout.sessions.create({
     mode: 'subscription',
     line_items: [{
       price: 'price_bronze_monthly', // Your Stripe price ID
       quantity: 1,
     }],
     success_url: 'https://your-domain.com/success',
     cancel_url: 'https://your-domain.com/canceled',
     metadata: {
       userId: 'user-uuid-here',
       tier: 'bronze',
     },
   });
   ```

2. Complete the checkout in test mode

3. Check your webhook logs and database:
   ```sql
   SELECT * FROM platform_subscriptions WHERE user_id = 'user-uuid-here';
   SELECT is_premium, premium_tier FROM users WHERE id = 'user-uuid-here';
   ```

## 📊 Monitoring

### Stripe Dashboard

Monitor webhook deliveries:
- [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- View recent webhook attempts
- Retry failed webhooks
- Check delivery logs

### Application Logs

Check serverless function logs:
- **Vercel**: Dashboard → Deployments → Function Logs
- **Netlify**: Dashboard → Functions → View logs

Look for:
- ✅ `Webhook received: checkout.session.completed`
- 💰 `Payment success for User: {userId}, Tier: {tier}`
- ✅ `Subscription activated for user {userId}`

## 🔧 Troubleshooting

### Webhook Signature Verification Failed

**Error**: `❌ Webhook signature verification failed`

**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Make sure you're using the signing secret for the correct webhook endpoint
- Check that the request body is not parsed before verification

### User ID Missing in Metadata

**Error**: `❌ User ID missing in metadata`

**Solution**:
- When creating checkout sessions, always include:
  ```javascript
  metadata: {
    userId: user.id,
    tier: 'bronze', // or 'silver', 'gold'
  }
  ```

### Database Update Failed

**Error**: `❌ Error updating user`

**Solution**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that the `platform_subscriptions` table exists
- Verify RLS policies allow service role to insert/update
- Run the migration: `008_platform_subscriptions.sql`

### Webhook Not Receiving Events

**Solution**:
1. Check Stripe Dashboard → Webhooks → View event logs
2. Verify the endpoint URL is correct
3. Check that your deployment is live
4. Ensure the webhook is not disabled in Stripe

## 🔒 Security Best Practices

1. **Never commit secrets**: Keep `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in environment variables only
2. **Always verify webhook signatures**: The code already does this with `stripe.webhooks.constructEvent`
3. **Use HTTPS in production**: Both Vercel and Netlify provide HTTPS automatically
4. **Monitor webhook attempts**: Regularly check Stripe Dashboard for suspicious activity
5. **Set up webhook alerts**: Configure Stripe to notify you of failed webhooks

## 📝 Integration with Checkout

To create a checkout session that triggers this webhook, use:

```typescript
import { loadStripe } from '@stripe/stripe-js';

async function subscribeToPremium(tier: 'bronze' | 'silver' | 'gold') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Call your backend to create checkout session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tier,
      userId: user.id,
      priceId: `price_${tier}_monthly`, // Your Stripe price ID
    }),
  });

  const { sessionId } = await response.json();
  
  const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY!);
  await stripe?.redirectToCheckout({ sessionId });
}
```

## 🎯 Next Steps

1. ✅ Run database migration
2. ✅ Deploy webhook endpoint
3. ✅ Add environment variables
4. ✅ Configure Stripe webhook
5. ✅ Test with Stripe CLI
6. 🔧 Create checkout session endpoint (separate task)
7. 🎨 Update UI to use new subscription flow

---

**Questions?** Check the [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks) or [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
