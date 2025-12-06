# 💳 Stripe Price IDs Configuration

## ✅ Your Stripe Products & Prices

### Bronze Tier
- **Price ID**: `price_1SZuC6CzqBvMqSYF419Lh1xg`
- **Price**: $4.99 CAD/month
- **Product**: Bronze (Zyeute)

### Silver Tier (Argent)
- **Price ID**: `price_1SZuCACzqBvMqSYFpfpfFc9M`
- **Price**: $9.99 CAD/month
- **Product**: Argent (Zyeute)

### Gold Tier (Or)
- **Price ID**: `price_1SZuCDCzqBvMqSYFIl0C1r2T`
- **Price**: $19.99 CAD/month
- **Product**: Or (Zyeute)

## 🔧 Add to Netlify Environment Variables

Go to **Netlify Dashboard → Site Settings → Environment Variables** and add:

```
STRIPE_PRICE_BRONZE=price_1SZuC6CzqBvMqSYF419Lh1xg
STRIPE_PRICE_SILVER=price_1SZuCACzqBvMqSYFpfpfFc9M
STRIPE_PRICE_GOLD=price_1SZuCDCzqBvMqSYFIl0C1r2T
```

## 🔧 Add to Supabase Secrets (if using Supabase Edge Functions)

Go to **Supabase Dashboard → Settings → Edge Functions → Secrets** and add:

```
STRIPE_PRICE_BRONZE=price_1SZuC6CzqBvMqSYF419Lh1xg
STRIPE_PRICE_SILVER=price_1SZuCACzqBvMqSYFpfpfFc9M
STRIPE_PRICE_GOLD=price_1SZuCDCzqBvMqSYFIl0C1r2T
```

## ✅ Verification

All prices are:
- ✅ Monthly recurring subscriptions
- ✅ In CAD currency
- ✅ Correct amounts ($4.99, $9.99, $19.99)
- ✅ Price IDs are valid format

