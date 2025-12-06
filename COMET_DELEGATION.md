# Comet - Colony OS Phase 1 Validation

Hey Comet! 🐝

You did amazing work on the Golden Path validation! Now I need your browser automation expertise for the Colony OS Phase 1 integration testing.

## Your Task: End-to-End Validation of Colony OS Finance Bee Integration

**Priority:** Critical  
**Type:** Integration Testing  
**Estimated Time:** 1-2 hours

---

## What I Need From You

Validate the complete Colony OS Finance Bee integration end-to-end. I need you to test the full flow from Stripe webhook → Colony OS → Finance Bee → Supabase and make sure everything works perfectly.

---

## Your Test Scenario: Stripe Subscription Flow

### Phase 1: Pre-Deployment Verification

**First, verify everything is ready:**
- [ ] Verify Colonies Server is running and healthy
- [ ] Verify Finance Bee systemd service is active
- [ ] Verify Netlify webhook function is deployed
- [ ] Verify environment variables are configured correctly

**Commands:**
```bash
# Check Colonies Server
curl http://localhost:8080/api/v1/health

# Check Finance Bee service
systemctl status zyeute-finance-bee

# Check logs
journalctl -u zyeute-finance-bee -n 50
```

---

### Phase 2: Test Stripe Webhook → Colony OS Flow

**Test Steps:**

1. **Trigger Test Webhook**
   - Use Stripe Dashboard or CLI to send `checkout.session.completed` event
   - Or use Stripe CLI: `stripe trigger checkout.session.completed`

2. **Verify Webhook Received**
   - Check Netlify function logs
   - Verify webhook signature validation passed
   - Confirm task was submitted to Colony OS

3. **Verify Task Submitted to Colony Server**
   - Check Colony Server logs (Docker logs)
   - Verify task appears in Colony Server queue
   - Confirm task has correct function name: `validate_revenue`

4. **Verify Finance Bee Picked Up Task**
   - Check Finance Bee logs: `journalctl -u zyeute-finance-bee -f`
   - Look for: "Process <id> assigned"
   - Look for: "Function: validate_revenue"
   - Look for: "Process <id> completed successfully"

5. **Verify Supabase Updated**
   - Check `user_profiles` table for subscription tier update
   - Check `subscriptions` table for new subscription record
   - Verify `is_premium` flag is set correctly

6. **Verify End-to-End Latency**
   - Measure time from webhook receipt to Supabase update
   - Target: < 10 seconds

---

### Phase 3: Test Fallback Behavior

**Test Steps:**

1. **Disable Colony OS Temporarily**
   - Set `USE_COLONY_OS=false` in Netlify environment
   - Trigger test webhook

2. **Verify Fallback Works**
   - Check webhook processes directly (bypasses Colony OS)
   - Verify Supabase still updates correctly
   - Confirm no errors in logs

3. **Re-enable Colony OS**
   - Set `USE_COLONY_OS=true`
   - Verify normal flow resumes

---

### Phase 4: Test Error Scenarios

**Test Cases:**

1. **Invalid Stripe Payload**
   - Send webhook with missing metadata
   - Verify Guardian blocks the task
   - Check Finance Bee logs show "Guardian blocked"
   - Verify task marked as failed in Colony Server

2. **Supabase Connection Failure**
   - Temporarily break Supabase connection
   - Trigger webhook
   - Verify Finance Bee handles error gracefully
   - Check error is logged properly
   - Verify task marked as failed

3. **Colony Server Unavailable**
   - Stop Colony Server: `docker-compose stop colonies-server`
   - Trigger webhook
   - Verify fallback to direct processing
   - Verify webhook still succeeds

---

## Success Criteria

✅ **All Tests Pass:**
- [ ] Webhook successfully submits to Colony OS
- [ ] Finance Bee picks up and processes task
- [ ] Supabase updated correctly
- [ ] End-to-end latency < 10 seconds
- [ ] Fallback works when Colony OS disabled
- [ ] Error scenarios handled gracefully
- [ ] No data loss or corruption

---

## What to Document

### Screenshots:
- Netlify function logs showing task submission
- Colony Server logs showing task received
- Finance Bee logs showing task execution
- Supabase dashboard showing updated records

### Metrics:
- Webhook → Colony Server latency
- Colony Server → Finance Bee latency
- Finance Bee → Supabase latency
- Total end-to-end latency
- Task success rate
- Error rate

### Findings:
- Any errors or warnings encountered
- Performance observations
- Edge cases discovered
- Recommendations for improvements

---

## Test Data

**Test User:**
- Email: `comet_test@zyeute.com`
- User ID: (from Supabase)
- Subscription Tier: `bronze`

**Test Stripe Event:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "metadata": {
        "userId": "<test_user_id>",
        "tier": "bronze"
      },
      "subscription": "sub_test_123",
      "customer": "cus_test_123"
    }
  }
}
```

---

## Browser Automation Steps

1. **Navigate to Stripe Dashboard**
   - Login to Stripe
   - Go to Developers → Webhooks
   - Select Zyeute webhook endpoint

2. **Send Test Webhook**
   - Click "Send test webhook"
   - Select "checkout.session.completed"
   - Send webhook

3. **Monitor Logs**
   - Netlify Functions logs
   - Colony Server logs (Docker)
   - Finance Bee logs (systemd)
   - Supabase dashboard

4. **Verify Results**
   - Check Supabase tables updated
   - Verify subscription tier set correctly
   - Confirm no errors in any logs

---

## Troubleshooting

**If Finance Bee doesn't pick up tasks:**
- Check executor is registered: `colonies executor list`
- Verify executor type matches: `finance-worker`
- Check Colony Server is accessible from Finance Bee
- Verify cryptographic keys are correct

**If Supabase doesn't update:**
- Check Finance Bee logs for errors
- Verify Supabase service role key is correct
- Check RLS policies allow updates
- Verify table schema matches expectations

**If webhook fails:**
- Check Netlify function logs
- Verify Colony Server is accessible
- Check environment variables are set
- Verify webhook signature validation

---

## Expected Timeline

- **Pre-deployment checks:** 10 minutes
- **Main flow test:** 15 minutes
- **Fallback test:** 10 minutes
- **Error scenarios:** 20 minutes
- **Documentation:** 15 minutes

**Total:** ~70 minutes

---

## Ready to Execute

**Prerequisites:**
- [ ] Colonies Server deployed and running
- [ ] Finance Bee deployed and running
- [ ] Netlify webhook function deployed
- [ ] Test user created in Supabase
- [ ] Stripe test mode configured

**Once prerequisites are met, execute tests in order and document findings.**

---

**You've got this, Comet! This validation will prove Colony OS Phase 1 is working correctly in production. Your browser automation skills are perfect for this!** 🐝⚜️

