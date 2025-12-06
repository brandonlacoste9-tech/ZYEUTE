# 💳 Stripe Integration Setup Guide

## ✅ What's Been Created

1. **Supabase Edge Function: `create-checkout-session`**
   - Creates Stripe checkout sessions for premium subscriptions
   - Located at: `supabase/functions/create-checkout-session/index.ts`

2. **Supabase Edge Function: `stripe-webhook`**
   - Handles Stripe webhook events
   - Updates subscriptions in database
   - Located at: `supabase/functions/stripe-webhook/index.ts`

3. **Updated `stripeService.ts`**
   - Now calls the Edge Function to create checkout sessions
   - Handles redirects to Stripe Checkout

## 🔧 Setup Steps

### Step 1: Create Products & Prices in Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create 3 products:
   - **Bronze** - $4.99 CAD/month
   - **Silver** - $9.99 CAD/month  
   - **Gold** - $19.99 CAD/month
3. For each product, create a **recurring price** (monthly subscription)
4. Copy the **Price IDs** (they start with `price_...`)

### Step 2: Get Your Stripe Keys

1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy:
   - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
   - **Secret key** (starts with `sk_test_...` or `sk_live_...`)

### Step 3: Configure Supabase Secrets

1. Go to [Supabase Dashboard → Project Settings → Edge Functions → Secrets](https://supabase.com/dashboard/project/_/settings/functions)
2. Add the following secrets:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx (get this after setting up webhook)
STRIPE_PRICE_BRONZE=price_xxxxxxxxxxxxx
STRIPE_PRICE_SILVER=price_xxxxxxxxxxxxx
STRIPE_PRICE_GOLD=price_xxxxxxxxxxxxx
SITE_URL=https://your-domain.com (or http://localhost:5173 for dev)
```

### Step 4: Configure Frontend Environment Variable

Add to your `.env` file or Vercel/Netlify environment variables:

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx (or pk_live_...)
```

### Step 5: Deploy Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### Step 6: Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://your-project-ref.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)
6. Add it to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing

### Test Checkout Flow

1. Navigate to `/premium` page
2. Click "S'abonner" on any tier
3. You should be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete the checkout
6. Check Supabase database - subscription should be created

### Test Webhook

1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook"
3. Select `checkout.session.completed`
4. Check Supabase logs to verify it was received

## 📋 Price IDs Configuration

After creating your Stripe prices, update the Edge Function secrets with your actual Price IDs:

- `STRIPE_PRICE_BRONZE` = Your Bronze monthly price ID
- `STRIPE_PRICE_SILVER` = Your Silver monthly price ID  
- `STRIPE_PRICE_GOLD` = Your Gold monthly price ID

## 🔒 Security Notes

- ✅ Never commit Stripe secret keys to git
- ✅ Use environment variables for all sensitive data
- ✅ Webhook signature verification is implemented
- ✅ User authentication required for checkout creation
- ✅ Service role key used only in Edge Functions (server-side)

## 📝 Next Steps

1. Create Stripe products and prices
2. Add Stripe keys to Supabase secrets
3. Deploy Edge Functions
4. Set up webhook endpoint in Stripe
5. Test the full flow
6. Switch to live mode when ready (update keys)

## 🆘 Troubleshooting

**Checkout not redirecting?**
- Verify `VITE_STRIPE_PUBLIC_KEY` is set
- Check browser console for errors
- Verify Edge Function is deployed

**Webhook not working?**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check Stripe webhook logs
- Check Supabase Edge Function logs

**Subscription not activating?**
- Check webhook events in Stripe Dashboard
- Verify database schema matches (subscriptions table)
- Check Edge Function logs for errors

