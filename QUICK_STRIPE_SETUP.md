# ⚡ Quick Stripe Setup Checklist

## ✅ Step 1: Stripe Products Created
- ✅ Bronze: $4.99 CAD/month → `price_1SZuC6CzqBvMqSYF419Lh1xg`
- ✅ Silver: $9.99 CAD/month → `price_1SZuCACzqBvMqSYFpfpfFc9M`
- ✅ Gold: $19.99 CAD/month → `price_1SZuCDCzqBvMqSYFIl0C1r2T`

## 📋 Step 2: Add to Netlify Environment Variables

Go to: **Netlify Dashboard → Your Site → Site Settings → Environment Variables**

Add these variables:

```
# Stripe Price IDs
STRIPE_PRICE_BRONZE=price_1SZuC6CzqBvMqSYF419Lh1xg
STRIPE_PRICE_SILVER=price_1SZuCACzqBvMqSYFpfpfFc9M
STRIPE_PRICE_GOLD=price_1SZuCDCzqBvMqSYFIl0C1r2T

# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Stripe Webhook Secret (get after setting up webhook)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Supabase (for webhook to update database)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL
SITE_URL=https://your-site.netlify.app
```

## 📋 Step 3: Set Up Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)
6. Add it to Netlify as `STRIPE_WEBHOOK_SECRET`

## 🚀 Step 4: Deploy

```bash
netlify deploy --prod
```

## ✅ Step 5: Test

1. Go to `/premium` page
2. Click "S'abonner" on any tier
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription in Supabase `user_profiles` table

## 🎉 Done!

Your Stripe integration is now complete and ready to process payments!

