# 💳 Netlify Stripe Integration Setup Guide

## ✅ What's Been Created

1. **Netlify Function: `create-checkout-session`**
   - Creates Stripe checkout sessions for premium subscriptions
   - Located at: `netlify/functions/create-checkout-session.js`

2. **Netlify Function: `stripe-webhook`**
   - Handles Stripe webhook events
   - Updates subscriptions in database
   - Located at: `netlify/functions/stripe-webhook.js`

3. **Updated `netlify.toml`**
   - Functions directory configured
   - Ready for deployment

4. **Updated `stripeService.ts`**
   - Supports both Netlify Functions and Supabase Edge Functions
   - Auto-detects deployment platform

## 🔧 Setup Steps

### Step 1: Install Dependencies

The Netlify Functions need `stripe` and `@supabase/supabase-js`. These should already be in your `package.json`, but verify:

```bash
npm install stripe @supabase/supabase-js
```

### Step 2: Create Products & Prices in Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create 3 products:
   - **Bronze** - $4.99 CAD/month
   - **Silver** - $9.99 CAD/month  
   - **Gold** - $19.99 CAD/month
3. For each product, create a **recurring price** (monthly subscription)
4. Copy the **Price IDs** (they start with `price_...`)

### Step 3: Configure Netlify Environment Variables

1. Go to your Netlify Dashboard → Site Settings → Environment Variables
2. Add the following variables:

#### Required Variables:

```
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx (or sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx (get this after setting up webhook)
STRIPE_PRICE_BRONZE=price_xxxxxxxxxxxxx
STRIPE_PRICE_SILVER=price_xxxxxxxxxxxxx
STRIPE_PRICE_GOLD=price_xxxxxxxxxxxxx

# Supabase Configuration (for webhook)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL (for redirects)
SITE_URL=https://your-site.netlify.app

# Frontend Stripe Key (for client-side)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx (or pk_live_...)

# Existing Supabase Keys
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Optional (for using Netlify Functions instead of Supabase):

```
VITE_USE_NETLIFY_FUNCTIONS=true
VITE_NETLIFY_FUNCTION_URL=/.netlify/functions/create-checkout-session
```

### Step 4: Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL:
   ```
   https://your-site.netlify.app/.netlify/functions/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)
6. Add it to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 5: Deploy to Netlify

The functions will be automatically deployed when you push to your repository. Or deploy manually:

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify (use your token)
netlify login

# Or set token directly
export NETLIFY_AUTH_TOKEN=nfp_Ui78e5dKFq6hQqnzYNQyrDHcpMykgSXke9f8

# Deploy
netlify deploy --prod
```

### Step 6: Test the Integration

1. Navigate to `/premium` page on your deployed site
2. Click "S'abonner" on any tier
3. You should be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete the checkout
6. Check Supabase database - subscription should be created

## 🔄 How It Works

### Checkout Flow:
1. User clicks "S'abonner" → `subscribeToPremium(tier)`
2. Frontend calls Netlify Function (or Supabase Edge Function)
3. Function creates Stripe Checkout Session
4. User redirected to Stripe Checkout
5. User completes payment
6. Stripe sends webhook to Netlify Function
7. Function updates `user_profiles` table in Supabase
8. User gets premium features!

### Platform Detection:
- The code automatically detects if you're on Netlify and uses Netlify Functions
- Otherwise, it falls back to Supabase Edge Functions
- You can force Netlify Functions by setting `VITE_USE_NETLIFY_FUNCTIONS=true`

## 🔒 Security Notes

- ✅ Never commit Stripe secret keys to git
- ✅ Use Netlify environment variables for all sensitive data
- ✅ Webhook signature verification is implemented
- ✅ User authentication required for checkout creation
- ✅ Service role key used only in serverless functions (server-side)

## 📝 Netlify Token Usage

Your Netlify token (`nfp_Ui78e5dKFq6hQqnzYNQyrDHcpMykgSXke9f8`) should be:

1. **Set as environment variable** (not in code):
   ```bash
   export NETLIFY_AUTH_TOKEN=nfp_Ui78e5dKFq6hQqnzYNQyrDHcpMykgSXke9f8
   ```

2. **Or added to Netlify Dashboard**:
   - Site Settings → Build & Deploy → Environment Variables
   - Add: `NETLIFY_AUTH_TOKEN` = `nfp_Ui78e5dKFq6hQqnzYNQyrDHcpMykgSXke9f8`

3. **For CI/CD**, add to your GitHub Actions or other CI secrets

## 🆘 Troubleshooting

**Functions not deploying?**
- Check `netlify.toml` has `[functions]` section enabled
- Verify functions are in `netlify/functions/` directory
- Check Netlify build logs

**Checkout not redirecting?**
- Verify `VITE_STRIPE_PUBLIC_KEY` is set
- Check browser console for errors
- Verify Netlify Function is deployed (check Functions tab in Netlify Dashboard)

**Webhook not working?**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check Stripe webhook logs
- Check Netlify Function logs (Netlify Dashboard → Functions → stripe-webhook → Logs)

**Subscription not activating?**
- Check webhook events in Stripe Dashboard
- Verify database schema matches (user_profiles table)
- Check Netlify Function logs for errors

## 📋 Next Steps

1. ✅ Create Stripe products and prices
2. ✅ Add Stripe keys to Netlify environment variables
3. ✅ Deploy to Netlify
4. ✅ Set up webhook endpoint in Stripe
5. ✅ Test the full flow
6. ✅ Switch to live mode when ready (update keys)

## 🎯 Alternative: Use Supabase Edge Functions

If you prefer to use Supabase Edge Functions instead of Netlify Functions:

1. Don't set `VITE_USE_NETLIFY_FUNCTIONS=true`
2. Deploy Supabase Edge Functions (see `STRIPE_SETUP.md`)
3. The code will automatically use Supabase Edge Functions

Both options work - choose based on your preference!

