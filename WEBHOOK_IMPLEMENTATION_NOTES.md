# Stripe Webhook Implementation Notes

## Implementation Summary

This document provides technical notes about the Stripe webhook implementation for Zyeuté's VIP subscription system.

## Architecture Decisions

### 1. Dual Deployment Support

**Why both Vercel and Netlify?**
- The project's README recommends Vercel but also supports Netlify
- Both deployment platforms use different serverless function architectures
- Implemented both to give flexibility in deployment choice

**File Locations:**
- Vercel: `api/webhooks/stripe.ts`
- Netlify: `netlify/functions/stripe-webhook.ts`

### 2. Database Schema: Platform vs Creator Subscriptions

**Important Distinction:**

The existing `subscriptions` table is for **creator monetization** (users subscribing to content creators).

The new `platform_subscriptions` table is for **platform VIP subscriptions** (users subscribing to Zyeuté premium features: Bronze, Silver, Gold).

**Why a separate table?**
1. Different business logic: Platform subscriptions unlock app features, creator subscriptions unlock content
2. Different relationships: One platform subscription per user vs many creator subscriptions per user
3. Different pricing: Fixed tiers (Bronze $4.99, Silver $9.99, Gold $19.99) vs creator-defined pricing
4. Separation of concerns: Platform revenue vs creator revenue

### 3. Dual-Table Strategy with Sync

**Design Pattern:**
- Primary: `platform_subscriptions` table tracks subscription details
- Secondary: `users` table gets synced fields (is_premium, premium_tier, stripe_subscription_id)
- Trigger: `sync_premium_status()` keeps them in sync automatically

**Why this approach?**
1. **Backwards compatibility**: Existing code checking `users.is_premium` continues to work
2. **Performance**: No JOINs needed for simple premium checks
3. **Flexibility**: Can query subscriptions independently when needed
4. **Data integrity**: Single source of truth with automatic sync

### 4. Webhook Events Handled

| Event | Purpose | Database Update |
|-------|---------|-----------------|
| `checkout.session.completed` | User completes payment | Create/update platform_subscriptions + users |
| `customer.subscription.updated` | Subscription status changes | Update status and dates |
| `customer.subscription.deleted` | User cancels subscription | Mark as canceled, sync to users |
| `invoice.payment_failed` | Payment fails (card declined) | Mark as past_due |

### 5. Metadata Requirements

When creating Stripe Checkout Sessions, **always include**:

```javascript
metadata: {
  userId: user.id,           // Supabase user UUID
  tier: 'bronze',            // 'bronze', 'silver', or 'gold'
}
```

The webhook uses this metadata to identify which user to update.

### 6. Security Considerations

**Webhook Signature Verification:**
- CRITICAL: Always verify webhook signatures using `stripe.webhooks.constructEvent()`
- This prevents attackers from sending fake webhook events
- Our implementation: ✅ Signature verification enabled

**Environment Variables:**
- `STRIPE_SECRET_KEY`: Server-side only, never expose to client
- `SUPABASE_SERVICE_ROLE_KEY`: Bypasses RLS, must be kept secret
- Both must be set in deployment platform (Vercel/Netlify), never in git

**Row Level Security (RLS):**
- Platform subscriptions table has RLS enabled
- Service role can manage all subscriptions (required for webhook)
- Users can only view their own subscriptions

### 7. Testing Strategy

**Local Testing:**
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:5173/api/webhooks/stripe

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

**Production Testing:**
1. Use Stripe test mode keys
2. Create test checkout session with metadata
3. Complete payment with test card (4242 4242 4242 4242)
4. Check webhook delivery in Stripe Dashboard
5. Verify database updates in Supabase

### 8. Error Handling

**Graceful Degradation:**
- If `platform_subscriptions` table doesn't exist, falls back to updating `users` table directly
- Logs errors but returns 200 to Stripe (prevents retry spam)
- Stripe will retry failed webhooks automatically (exponential backoff)

**Common Issues & Solutions:**
1. **Signature verification failed**: Check `STRIPE_WEBHOOK_SECRET` matches the endpoint
2. **User ID missing**: Ensure metadata is included in checkout session
3. **Database update failed**: Check `SUPABASE_SERVICE_ROLE_KEY` is correct and RLS policies allow service role access

### 9. Monitoring & Debugging

**Webhook Logs:**
- Vercel: Dashboard → Deployments → Function Logs
- Netlify: Dashboard → Functions → View logs

**Stripe Dashboard:**
- Webhooks page shows delivery attempts, status codes, and response bodies
- Can manually retry failed webhooks
- View event details and request/response payloads

**Database Queries:**
```sql
-- Check user's premium status
SELECT is_premium, premium_tier, stripe_subscription_id 
FROM users 
WHERE id = 'user-uuid';

-- Check platform subscription details
SELECT * 
FROM platform_subscriptions 
WHERE user_id = 'user-uuid';

-- List all active premium users
SELECT * FROM premium_users;
```

### 10. Future Enhancements

**Potential Improvements:**
1. Add webhook event logging table for audit trail
2. Implement retry logic for failed database updates
3. Add email notifications for subscription events
4. Track subscription analytics (MRR, churn rate, etc.)
5. Support prorated upgrades/downgrades between tiers
6. Add grace period for failed payments before cancellation

## Integration Checklist

Before going live:
- [ ] Run database migration: `008_platform_subscriptions.sql`
- [ ] Set environment variables in deployment platform
- [ ] Create Stripe products and prices for Bronze, Silver, Gold
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Test with Stripe test mode
- [ ] Update checkout session creation code to include metadata
- [ ] Test complete payment flow end-to-end
- [ ] Monitor webhook deliveries for 24 hours
- [ ] Switch to Stripe live mode

## Contact & Support

- **Stripe Webhook Docs**: https://stripe.com/docs/webhooks
- **Supabase RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Project Setup**: See `STRIPE_WEBHOOK_SETUP.md`

---

**Implementation Date**: November 30, 2025  
**Stripe SDK Version**: 20.0.0  
**Stripe API Version**: 2025-11-17.clover
