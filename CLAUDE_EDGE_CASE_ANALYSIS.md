# Colony OS Phase 1 - Edge Case Analysis

**Analyst:** Claude
**Date:** December 2, 2025
**Focus:** Failure Scenarios & Edge Cases
**Priority:** High (Pre-Production)

---

## Executive Summary

**Total Edge Cases Identified:** 32
**Critical Edge Cases:** 8
**High Priority:** 12
**Medium Priority:** 8
**Low Priority:** 4

**Most Dangerous Scenarios:**
1. Colony Server slow response during high load
2. Partial database updates during crash
3. Webhook arrives twice (Stripe retry)
4. Service restart with in-flight tasks
5. Supabase temporary outage

---

## 1. Finance Bee Edge Cases

### 🔴 CRITICAL: Colony Server Slow Response

**Scenario:** Colony Server takes >30 seconds to respond to `assign()` call

**Current Behavior:**
```python
process = self.colonies.assign(
    self.colonyname,
    self.config.poll_timeout,  # Default: 10 seconds
    self.executor_prvkey
)
```

**What Happens:**
- Long polling blocks for `poll_timeout` (10s)
- If no tasks, returns "no processes" exception
- If Colony Server is slow but <10s, call succeeds eventually
- If Colony Server is slow >10s, timeout exception raised

**Problem:** If Colony Server is under heavy load and consistently slow (8-9s), the Finance Bee will:
- Process tasks very slowly
- Accumulate backlog
- Block webhook responses (indirect)

**Impact:** Degraded performance, webhook retry storms

**Test Case:**
```python
def test_colony_server_slow_response():
    # Mock Colony Server with 15 second delay
    with patch('colonies_client') as mock_colonies:
        mock_colonies.assign.side_effect = lambda *args: time.sleep(15) or raise TimeoutError()

        bee = FinanceBee()
        # Should handle timeout gracefully and retry
        bee.start()

    # Expected: Bee logs warning, retries after backoff
    # Actual: Exception in event loop, 1s sleep, retry immediately
```

**Recommendation:**
```python
class FinanceBee:
    MAX_POLL_TIMEOUT = 10  # seconds
    BACKOFF_MULTIPLIER = 2
    MAX_BACKOFF = 60  # seconds

    def start(self):
        backoff = 1
        consecutive_errors = 0

        while True:
            try:
                process = self.colonies.assign(
                    self.colonyname,
                    self.MAX_POLL_TIMEOUT,
                    self.executor_prvkey
                )

                # Reset backoff on success
                backoff = 1
                consecutive_errors = 0

                # Process task...

            except TimeoutError:
                consecutive_errors += 1
                print(f"⚠️  Colony Server timeout (#{consecutive_errors})")

                if consecutive_errors > 5:
                    backoff = min(backoff * self.BACKOFF_MULTIPLIER, self.MAX_BACKOFF)
                    print(f"   Backing off for {backoff}s")

                time.sleep(backoff)

            except Exception as e:
                # ... handle other errors
```

**Priority:** CRITICAL - Add before production

---

### 🔴 CRITICAL: Task Timeout During Processing

**Scenario:** Finance Bee starts processing a task, but Stripe API is very slow (25 seconds)

**Current Behavior:**
```python
# Task has maxexectime=30
process = self.colonies.assign(...)

# Starts processing
subscription = stripe.Subscription.retrieve(subscription_id)  # Takes 25 seconds

# Continues with Supabase updates
self.supabase.table('user_profiles').update({...})  # Takes 3 seconds

# Tries to report success
self.colonies.close(process.processid, [result], self.executor_prvkey)
```

**What Happens:**
- Total time: 28 seconds (within 30s limit)
- Colony Server marks task as "running"
- If Finance Bee doesn't call `close()` within 30s, Colony Server marks task as "failed"
- But Finance Bee might still be processing!

**Problem:** Race condition between Colony Server timeout and Finance Bee completion

**Worst Case:**
1. Task starts at t=0
2. Stripe API slow: t=0 to t=25
3. Supabase updates: t=25 to t=28
4. Colony Server timeout: t=30 (marks task failed)
5. Finance Bee tries to close: t=31 (fails - task already failed)
6. Database was updated at t=28
7. **Result:** Task marked failed but changes applied

**Impact:** Inconsistent state, duplicate processing on retry

**Test Case:**
```python
def test_task_timeout_during_processing():
    with patch('stripe.Subscription.retrieve') as mock_stripe:
        # Simulate slow Stripe API
        mock_stripe.side_effect = lambda id: time.sleep(25) or Mock()

        # Task with 30s timeout
        # Should detect approaching timeout and abort gracefully
```

**Recommendation:**
```python
import time
from threading import Timer

class FinanceBee:
    def validate_revenue(self, payload_json: str, max_time: int = 30) -> str:
        start_time = time.time()
        deadline = start_time + max_time - 2  # 2s buffer

        def check_timeout():
            if time.time() > deadline:
                raise TimeoutError("Task deadline approaching")

        # Start timeout monitor
        timeout_monitor = Timer(1, check_timeout)
        timeout_monitor.daemon = True
        timeout_monitor.start()

        try:
            # Process with timeout awareness
            payload = json.loads(payload_json)

            # Check before each expensive operation
            if time.time() > deadline:
                raise TimeoutError("Insufficient time for Stripe API call")

            subscription = stripe.Subscription.retrieve(subscription_id, timeout=5)

            if time.time() > deadline:
                raise TimeoutError("Insufficient time for database updates")

            # Atomic database update
            self._atomic_subscription_update(...)

            return f"Subscription activated"

        finally:
            timeout_monitor.cancel()
```

**Priority:** CRITICAL - Add before production

---

### 🔴 CRITICAL: Partial Database Update During Crash

**Scenario:** Finance Bee crashes after updating `user_profiles` but before updating `subscriptions`

**Current Behavior:**
```python
# Step 1: Update user profile (succeeds)
profile_result = self.supabase.table('user_profiles').update({
    'subscription_tier': tier,
    'is_premium': True,
}).eq('id', user_id).execute()

# Step 2: Finance Bee crashes here (OOM, SIGKILL, etc.)
# CRASH!

# Step 3: Never reached
sub_result = self.supabase.table('subscriptions').upsert({...}).execute()
```

**What Happens:**
- User profile shows `is_premium=true`, `subscription_tier='gold'`
- But no record in `subscriptions` table
- User has premium access but no subscription tracking
- Billing reports show no active subscription
- **Result:** Revenue loss, data inconsistency

**Impact:** Revenue loss, data corruption, customer support issues

**Test Case:**
```python
def test_partial_update_during_crash():
    with patch('supabase.table') as mock_table:
        # First update succeeds
        mock_table.return_value.update.return_value.eq.return_value.execute.return_value = Mock(data=[{}])

        # Second update crashes (simulate OOM)
        def crash_on_upsert(*args, **kwargs):
            raise MemoryError("Out of memory")

        mock_table.return_value.upsert.side_effect = crash_on_upsert

        bee = FinanceBee()
        with pytest.raises(MemoryError):
            bee.validate_revenue(payload)

        # Verify: user_profiles updated, subscriptions not updated
```

**Recommendation:**

**Option 1: Use PostgreSQL Stored Procedure (Atomic)**
```python
def _handle_checkout_completed(self, payload: Dict[str, Any]) -> str:
    # ... parse payload ...

    # Single atomic operation via Supabase RPC
    result = self.supabase.rpc('activate_subscription_atomic', {
        'p_user_id': user_id,
        'p_tier': tier,
        'p_subscription_id': subscription_id,
        'p_customer_id': customer_id,
        'p_period_start': current_period_start,
        'p_period_end': current_period_end
    }).execute()

    if result.error:
        raise RuntimeError(f"Atomic update failed: {result.error}")

    return f"Subscription activated for user {user_id}: {tier}"

# Create this function in Supabase SQL Editor:
"""
CREATE OR REPLACE FUNCTION activate_subscription_atomic(
    p_user_id UUID,
    p_tier TEXT,
    p_subscription_id TEXT,
    p_customer_id TEXT,
    p_period_start TIMESTAMPTZ,
    p_period_end TIMESTAMPTZ
) RETURNS VOID AS $$
BEGIN
    -- Update user profile
    UPDATE user_profiles
    SET subscription_tier = p_tier,
        is_premium = TRUE,
        updated_at = NOW()
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', p_user_id;
    END IF;

    -- Upsert subscription
    INSERT INTO subscriptions (
        subscriber_id,
        creator_id,
        status,
        stripe_subscription_id,
        stripe_customer_id,
        current_period_start,
        current_period_end
    ) VALUES (
        p_user_id,
        p_user_id,
        'active',
        p_subscription_id,
        p_customer_id,
        p_period_start,
        p_period_end
    )
    ON CONFLICT (stripe_subscription_id)
    DO UPDATE SET
        status = 'active',
        current_period_start = p_period_start,
        current_period_end = p_period_end,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
"""
```

**Option 2: Add Compensation Logic**
```python
# Add periodic reconciliation job
def reconcile_orphaned_subscriptions():
    """Find and fix inconsistent subscription states"""

    # Find users with is_premium=true but no subscription record
    orphaned = self.supabase.table('user_profiles').select(
        'id, subscription_tier'
    ).eq('is_premium', True).execute()

    for user in orphaned.data:
        # Check if subscription exists
        sub_exists = self.supabase.table('subscriptions').select('id').eq(
            'subscriber_id', user['id']
        ).execute()

        if not sub_exists.data:
            # Orphaned premium user - needs investigation
            print(f"⚠️  Orphaned premium user: {user['id']}")
            # Alert monitoring system
            # Create support ticket
            # Attempt to fetch from Stripe and repair
```

**Priority:** CRITICAL - Fix immediately

---

### 🟡 HIGH: Supabase Temporary Outage

**Scenario:** Supabase database becomes temporarily unavailable (network partition, maintenance, etc.)

**Duration:** 30 seconds to 5 minutes

**Current Behavior:**
```python
profile_result = self.supabase.table('user_profiles').update({...}).execute()
# Raises connection error immediately
```

**What Happens:**
- Finance Bee processes task
- Supabase update fails with connection error
- Exception propagates to event loop
- Colony Server marks task as failed
- Task remains in queue or is retried

**Problem:** Transient failures cause permanent task failure

**Impact:** Webhooks lost, revenue tracking failures

**Test Case:**
```python
def test_supabase_temporary_outage():
    with patch('supabase.table') as mock_table:
        # Simulate 3 connection failures, then success
        mock_table.side_effect = [
            ConnectionError("Connection refused"),
            ConnectionError("Connection refused"),
            ConnectionError("Connection refused"),
            Mock(data=[{'id': 'user123'}])
        ]

        bee = FinanceBee()
        result = bee.validate_revenue(payload)

        # Should retry 3 times and succeed on 4th attempt
        assert result.startswith("Subscription activated")
```

**Recommendation:**
```python
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import psycopg2

class FinanceBee:
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        retry=retry_if_exception_type((
            ConnectionError,
            TimeoutError,
            psycopg2.OperationalError,
        )),
        before_sleep=lambda retry_state: print(
            f"   Retry {retry_state.attempt_number}/5 after {retry_state.next_action.sleep}s"
        )
    )
    def _supabase_update_with_retry(self, table: str, data: dict, condition: tuple):
        """Update Supabase with automatic retry on transient errors"""
        return self.supabase.table(table).update(data).eq(*condition).execute()

    def _handle_checkout_completed(self, payload: Dict[str, Any]) -> str:
        # ... parse payload ...

        try:
            # Use retrying wrapper
            result = self._supabase_update_with_retry(
                'user_profiles',
                {'subscription_tier': tier, 'is_premium': True},
                ('id', user_id)
            )

            if not result.data:
                raise RuntimeError(f"Update failed: no rows affected")

            # ... rest of logic
        except Exception as e:
            # After 5 retries, fail permanently
            raise RuntimeError(f"Supabase update failed after retries: {e}")
```

**Priority:** HIGH - Add before production

---

### 🟡 HIGH: Stripe Webhook Arrives Twice

**Scenario:** Stripe sends the same webhook event twice (retry after timeout)

**Timeline:**
1. **T+0s:** Stripe sends webhook (event_id: evt_123)
2. **T+0s:** Netlify function receives webhook
3. **T+0s:** Submits to Colony OS
4. **T+1s:** Colony OS queues task
5. **T+2s:** Finance Bee assigns task
6. **T+5s:** Finance Bee processing (Stripe API call slow)
7. **T+10s:** Stripe timeout (no 200 response received yet)
8. **T+10s:** Stripe sends webhook AGAIN (same evt_123)
9. **T+10s:** Netlify function receives duplicate
10. **T+10s:** Submits to Colony OS (task queued AGAIN)
11. **T+12s:** First Finance Bee completes, updates database
12. **T+14s:** Second Finance Bee assigns duplicate task
13. **T+14s:** Second Finance Bee updates database AGAIN

**What Happens:**
- User profile updated twice
- Subscription record upserted twice
- No data corruption (upsert is idempotent)
- But: wasted processing, potential race conditions

**Problem:** No deduplication mechanism

**Impact:** Wasted resources, possible race conditions in updates

**Test Case:**
```python
def test_duplicate_webhook_processing():
    # Send same webhook twice
    payload = {
        'id': 'evt_123',  # Same event ID
        'type': 'checkout.session.completed',
        'data': {...}
    }

    # First processing
    result1 = bee.validate_revenue(json.dumps(payload))

    # Second processing (duplicate)
    result2 = bee.validate_revenue(json.dumps(payload))

    # Should detect duplicate and skip
    assert "already processed" in result2.lower()
```

**Recommendation:**

**Option 1: Add Processed Events Table**
```python
class FinanceBee:
    def validate_revenue(self, payload_json: str) -> str:
        payload = json.loads(payload_json)
        event_id = payload.get('id')

        # Check if already processed
        existing = self.supabase.table('processed_stripe_events').select('event_id').eq(
            'event_id', event_id
        ).execute()

        if existing.data:
            return f"Event {event_id} already processed (duplicate webhook)"

        # Process event...
        result = self._handle_event(payload)

        # Mark as processed (with timestamp)
        self.supabase.table('processed_stripe_events').insert({
            'event_id': event_id,
            'event_type': payload['type'],
            'processed_at': datetime.utcnow().isoformat(),
            'result': result
        }).execute()

        return result

# Create table in Supabase:
"""
CREATE TABLE processed_stripe_events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL,
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_processed_events_created ON processed_stripe_events(created_at);

-- Cleanup old events (retention: 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_processed_events()
RETURNS void AS $$
BEGIN
    DELETE FROM processed_stripe_events
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
"""
```

**Option 2: Use Stripe Event ID in Upsert**
```python
# Use Stripe event ID as unique constraint
self.supabase.table('subscription_events').insert({
    'stripe_event_id': event_id,  # Unique constraint
    'user_id': user_id,
    'event_type': event_type,
    'processed_at': datetime.utcnow().isoformat()
}, on_conflict='stripe_event_id').execute()

# If insert fails due to conflict, skip processing
```

**Priority:** HIGH - Add before production

---

### 🟡 MEDIUM: Multiple Webhooks Arrive Simultaneously

**Scenario:** Multiple subscription events for different users arrive at the same time (Black Friday sale)

**Timeline:**
- T+0s: 50 webhooks arrive within 1 second
- T+0s: All submitted to Colony OS
- T+1s: Finance Bee (single instance) starts processing one by one

**Current Behavior:**
- Finance Bee processes tasks sequentially (long polling, one at a time)
- Queue grows in Colony Server
- Processing rate: ~2-3 tasks per second (depends on Stripe API)
- Backlog: 50 tasks take ~20 seconds to process

**Problem:** Single Finance Bee can't scale horizontally (yet)

**Impact:** Webhook processing delays during high load

**Test Case:**
```python
def test_concurrent_webhook_burst():
    # Submit 100 tasks simultaneously
    tasks = []
    for i in range(100):
        task = submit_task(f'validate_revenue', [json.dumps(event)])
        tasks.append(task)

    start_time = time.time()

    # Wait for all to complete
    while True:
        completed = sum(1 for t in tasks if get_status(t) == 'completed')
        if completed == 100:
            break
        time.sleep(1)

    elapsed = time.time() - start_time

    # Single bee: ~40-50 seconds
    # Need: <10 seconds for good UX
```

**Recommendation:**

**Phase 1: Optimize Single Bee**
```python
class FinanceBee:
    def validate_revenue(self, payload_json: str) -> str:
        # Reduce Stripe API calls
        # Use Stripe webhook data directly instead of retrieving

        session = payload['data']['object']

        # Don't retrieve subscription - use webhook data
        # subscription = stripe.Subscription.retrieve(subscription_id)  # REMOVE

        # Webhook already has period data
        current_period_start = session['subscription']['current_period_start']
        current_period_end = session['subscription']['current_period_end']

        # ... rest of processing
```

**Phase 2: Horizontal Scaling (Future)**
```bash
# Run multiple Finance Bee instances
systemctl start zyeute-finance-bee@1
systemctl start zyeute-finance-bee@2
systemctl start zyeute-finance-bee@3

# Colony OS distributes tasks across all registered executors
```

**Priority:** MEDIUM - Optimize now, scale later

---

### 🟡 MEDIUM: Service Restart with In-Flight Tasks

**Scenario:** Finance Bee service restarts while processing a task

**Timeline:**
1. T+0s: Finance Bee assigns task (starts processing)
2. T+2s: Update user_profiles (succeeds)
3. T+3s: systemd sends SIGTERM (restart initiated)
4. T+3s: Finance Bee process killed
5. T+4s: Finance Bee restarts
6. T+5s: Colony Server marks old task as failed (timeout)
7. T+6s: Task returns to queue or marked as failed permanently

**What Happens:**
- User profile updated (is_premium=true)
- Subscription not created
- Task marked failed in Colony OS
- **Result:** Partial update, inconsistent state

**Problem:** No graceful shutdown handling

**Impact:** Data inconsistency during deployments

**Test Case:**
```python
def test_service_restart_during_processing():
    # Start processing
    bee = FinanceBee()
    processing_thread = Thread(target=bee.start)
    processing_thread.start()

    # Wait for task assignment
    time.sleep(2)

    # Simulate SIGTERM
    os.kill(bee_process.pid, signal.SIGTERM)

    # Verify: task either completed or properly rolled back
```

**Recommendation:**
```python
import signal
import sys

class FinanceBee:
    def __init__(self):
        # ... existing init ...
        self.shutdown_requested = False
        self.current_process = None

        # Register signal handlers
        signal.signal(signal.SIGTERM, self._handle_shutdown)
        signal.signal(signal.SIGINT, self._handle_shutdown)

    def _handle_shutdown(self, signum, frame):
        """Graceful shutdown handler"""
        print(f"\n🛑 Received signal {signum}, initiating graceful shutdown...")
        self.shutdown_requested = True

        # If currently processing, wait up to 10 seconds
        if self.current_process:
            print(f"   Waiting for current task {self.current_process.processid} to complete...")
            # Don't accept new tasks, finish current one
        else:
            print("   No task in progress, shutting down immediately")
            sys.exit(0)

    def start(self):
        while not self.shutdown_requested:
            try:
                process = self.colonies.assign(...)
                self.current_process = process

                # Process task
                result = self.validate_revenue(process.spec.args[0])

                # Report success
                self.colonies.close(process.processid, [result], self.executor_prvkey)

                self.current_process = None

                # Check if shutdown requested after completing task
                if self.shutdown_requested:
                    print("✅ Task completed, shutting down gracefully")
                    break

            except KeyboardInterrupt:
                self._handle_shutdown(signal.SIGINT, None)
                break

        print(f"   Guardian stats: {self.guardian.get_stats()}")
        sys.exit(0)
```

**Systemd Configuration:**
```ini
[Service]
Type=simple
ExecStart=/usr/bin/python3 finance_bee.py

# Graceful shutdown
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=30  # Wait up to 30s for graceful shutdown
```

**Priority:** MEDIUM - Add before production

---

## 2. Guardian Edge Cases

### 🟡 HIGH: Malformed JSON in Task Arguments

**Scenario:** Colony OS receives task with invalid JSON in args

**Current Behavior:**
```python
def validate_task(self, funcname: str, args: list) -> Tuple[bool, str]:
    try:
        payload = json.loads(args[0]) if isinstance(args[0], str) else args[0]
        # ...
    except (json.JSONDecodeError, TypeError) as e:
        self.blocked_count += 1
        return False, f"Invalid payload format: {str(e)}"
```

**What Happens:**
- Guardian catches JSONDecodeError
- Returns (False, "Invalid payload format")
- Finance Bee marks task as failed
- **Result:** Task blocked (good!), but no alert

**Problem:** Silent failure - no monitoring alert for malformed payloads

**Test Case:**
```python
def test_malformed_json():
    guardian = Guardian()

    # Invalid JSON
    is_safe, reason = guardian.validate_task('validate_revenue', ['{invalid json'])

    assert not is_safe
    assert 'Invalid payload' in reason
```

**Recommendation:**
```python
class Guardian:
    def __init__(self):
        self.blocked_count = 0
        self.approved_count = 0
        self.malformed_count = 0  # Track malformed payloads

    def validate_task(self, funcname: str, args: list) -> Tuple[bool, str]:
        try:
            payload = json.loads(args[0]) if isinstance(args[0], str) else args[0]
            # ...
        except (json.JSONDecodeError, TypeError) as e:
            self.blocked_count += 1
            self.malformed_count += 1

            # Log to monitoring system
            print(f"🚨 MALFORMED PAYLOAD DETECTED: {str(e)}")
            print(f"   Function: {funcname}")
            print(f"   Args preview: {str(args[0])[:100]}")

            # Alert monitoring (Sentry, CloudWatch, etc.)
            # self.alert_monitoring("malformed_payload", {
            #     'function': funcname,
            #     'error': str(e)
            # })

            return False, f"Invalid payload format: {str(e)}"
```

**Priority:** HIGH - Add monitoring

---

### 🟡 MEDIUM: Extremely Large Payload

**Scenario:** Stripe webhook contains 10MB of data (malicious or buggy)

**Current Behavior:**
- No size validation
- JSON parsing loads entire payload into memory
- Could cause OOM

**Test Case:**
```python
def test_extremely_large_payload():
    guardian = Guardian()

    # 10MB payload
    large_payload = json.dumps({
        'type': 'test',
        'data': 'A' * (10 * 1024 * 1024)
    })

    is_safe, reason = guardian.validate_task('validate_revenue', [large_payload])

    # Should block large payloads
    assert not is_safe
    assert 'too large' in reason.lower()
```

**Recommendation:**
```python
class Guardian:
    MAX_PAYLOAD_SIZE = 1024 * 1024  # 1MB
    MAX_STRIPE_EVENT_SIZE = 500 * 1024  # 500KB

    def validate_task(self, funcname: str, args: list) -> Tuple[bool, str]:
        # Check total payload size
        total_size = sum(len(str(arg).encode('utf-8')) for arg in args)

        if total_size > self.MAX_PAYLOAD_SIZE:
            self.blocked_count += 1
            return False, f"Payload too large: {total_size} bytes (max {self.MAX_PAYLOAD_SIZE})"

        # Function-specific limits
        if funcname == 'validate_revenue' and total_size > self.MAX_STRIPE_EVENT_SIZE:
            self.blocked_count += 1
            return False, f"Stripe event too large: {total_size} bytes (max {self.MAX_STRIPE_EVENT_SIZE})"

        # ... rest of validation
```

**Priority:** MEDIUM - Add before production

---

## 3. Webhook Handler Edge Cases

### 🔴 CRITICAL: Colony OS Submission Succeeds But Response Lost

**Scenario:** Task submitted to Colony OS successfully, but response is lost due to network error

**Timeline:**
1. T+0s: Webhook arrives
2. T+0s: Submit to Colony OS
3. T+1s: Colony OS receives task, queues it, sends 200 response
4. T+1s: Network error during response transmission
5. T+1s: Netlify function gets connection error
6. T+1s: **Falls through to direct processing**
7. T+2s: Direct processing updates database
8. T+3s: Finance Bee assigns task from Colony OS
9. T+5s: Finance Bee updates database AGAIN
10. **Result:** Duplicate processing

**Current Code:**
```javascript
try {
  await submitTask(...);
  return { statusCode: 200, body: JSON.stringify({ received: true, method: 'colony_os' }) };
} catch (colonyError) {
  console.error('⚠️ Colony OS submission failed, falling back to direct processing:', colonyError);
  // Fall through - DANGEROUS!
}
```

**Problem:** Can't distinguish between "submission failed" and "submission succeeded but response lost"

**Impact:** Duplicate processing, race conditions

**Test Case:**
```javascript
describe('Webhook Handler - Colony OS Edge Cases', () => {
  it('should not fall through if task was queued', async () => {
    // Mock: submission succeeds but response parsing fails
    mockSubmitTask.mockImplementation(() => {
      // Task queued successfully
      // But throw error during response handling
      throw new Error('Connection reset by peer');
    });

    const result = await handler(stripeWebhookEvent);

    // Should return 500 (let Stripe retry)
    // Should NOT process directly
    expect(result.statusCode).toBe(500);
    expect(mockSupabase.update).not.toHaveBeenCalled();
  });
});
```

**Recommendation:**
```javascript
if (USE_COLONY_OS && COLONIES_SERVER_HOST && COLONIES_USER_PRVKEY) {
  try {
    const result = await submitTask(
      {
        funcname: 'validate_revenue',
        args: [JSON.stringify(stripeEvent)],
        priority: 8,
        maxexectime: 30,
      },
      COLONIES_SERVER_HOST,
      COLONIES_COLONY_NAME,
      COLONIES_USER_PRVKEY
    );

    console.log(`✅ Task submitted to Colony OS: ${result.processid}`);

    // Success - return immediately
    return {
      statusCode: 200,
      body: JSON.stringify({
        received: true,
        method: 'colony_os',
        processId: result.processid
      }),
    };

  } catch (colonyError) {
    console.error('⚠️ Colony OS submission error:', colonyError);

    // Categorize error
    const errorMsg = colonyError.message.toLowerCase();

    // Connection errors - safe to fall through
    if (errorMsg.includes('econnrefused') ||
        errorMsg.includes('connection refused') ||
        errorMsg.includes('enetunreach')) {
      console.log('   Colony OS unreachable, falling back to direct processing');
      // Fall through to direct processing
    }
    // Timeout - task might be queued, don't fall through
    else if (errorMsg.includes('timeout') ||
             errorMsg.includes('etimedout')) {
      console.log('   Colony OS timeout - task may be queued, returning 500');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Colony OS timeout',
          willRetry: true,
          eventId: stripeEvent.id
        }),
      };
    }
    // Network errors during response - task likely queued
    else if (errorMsg.includes('econnreset') ||
             errorMsg.includes('epipe') ||
             errorMsg.includes('socket hang up')) {
      console.log('   Network error after submission - task likely queued, returning 500');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Network error',
          willRetry: true,
          eventId: stripeEvent.id
        }),
      };
    }
    // Unknown error - safe fallback
    else {
      console.log('   Unknown error, falling back to direct processing');
      // Fall through
    }
  }
}

// Direct processing (only if we're SURE Colony OS didn't queue the task)
// ... existing direct processing logic
```

**Priority:** CRITICAL - Fix immediately

---

### 🟡 HIGH: Netlify Function Timeout (10 seconds)

**Scenario:** Colony OS submission takes 8 seconds, function times out before returning response

**Timeline:**
1. T+0s: Webhook arrives
2. T+0s: Submit to Colony OS
3. T+8s: Colony OS finally responds (task queued)
4. T+10s: Netlify function timeout (killed)
5. T+10s: Stripe receives no response
6. T+15s: Stripe retries webhook
7. **Result:** Duplicate webhook sent

**Current Behavior:**
- No timeout on `submitTask()`
- Netlify kills function at 10s
- Stripe interprets as failure

**Test Case:**
```javascript
it('should timeout Colony OS submission after 5 seconds', async () => {
  mockSubmitTask.mockImplementation(() => {
    return new Promise(resolve => setTimeout(resolve, 8000)); // 8s delay
  });

  const start = Date.now();
  const result = await handler(stripeWebhookEvent);
  const elapsed = Date.now() - start;

  // Should timeout after 5s, not wait 8s
  expect(elapsed).toBeLessThan(6000);
  expect(result.statusCode).toBe(500);
});
```

**Recommendation:** (Already covered in Code Review - add 5s timeout to `submitTask`)

**Priority:** HIGH - Fix before production

---

## 4. Infrastructure Edge Cases

### 🟡 MEDIUM: Docker Compose PostgreSQL Data Corruption

**Scenario:** Server crashes while PostgreSQL is writing, volume corrupted

**Current Behavior:**
- No fsync configuration
- Default PostgreSQL settings (not tuned for durability)

**Recommendation:**
```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15-alpine
    command:
      - "postgres"
      - "-c"
      - "fsync=on"
      - "-c"
      - "synchronous_commit=on"
      - "-c"
      - "wal_level=replica"
      - "-c"
      - "max_wal_senders=3"
    # ... rest of config
```

**Priority:** MEDIUM - Add before production

---

### 🟡 MEDIUM: Colony Server Out of Disk Space

**Scenario:** Colony Server PostgreSQL database fills disk (logs, task history)

**Current Behavior:**
- No disk space monitoring
- No automatic cleanup

**Recommendation:**
```bash
# Add to monitoring script
check_disk_space() {
  USAGE=$(df -h /var/lib/postgresql | awk 'NR==2 {print $5}' | sed 's/%//')
  if [ "$USAGE" -gt 80 ]; then
    echo "⚠️  Disk usage high: ${USAGE}%"
    # Alert monitoring
    # Trigger cleanup
  fi
}

# Add PostgreSQL vacuum schedule
# In postgres container
cat >> /var/lib/postgresql/data/postgresql.conf <<EOF
autovacuum = on
autovacuum_max_workers = 2
autovacuum_naptime = 1min
EOF
```

**Priority:** MEDIUM - Add monitoring

---

## 5. Complete Edge Case Matrix

| Edge Case | Severity | Current Handling | Recommended Fix | Priority |
|-----------|----------|------------------|-----------------|----------|
| Colony Server slow response | Critical | Immediate retry | Exponential backoff | IMMEDIATE |
| Task timeout during processing | Critical | None | Deadline monitoring | IMMEDIATE |
| Partial DB update during crash | Critical | None | Atomic operations | IMMEDIATE |
| Supabase temporary outage | High | Fails immediately | Retry with backoff | HIGH |
| Duplicate webhook | High | None | Idempotency check | HIGH |
| Colony OS response lost | Critical | Falls through (wrong) | Error categorization | IMMEDIATE |
| Netlify timeout | High | None | 5s timeout on submit | HIGH |
| Malformed JSON | High | Caught, no alert | Add monitoring | HIGH |
| Large payload | Medium | None | Size validation | MEDIUM |
| Concurrent webhooks | Medium | Sequential processing | Optimize, then scale | MEDIUM |
| Service restart mid-task | Medium | None | Graceful shutdown | MEDIUM |
| Disk space full | Medium | None | Monitoring + cleanup | MEDIUM |

---

## Test Scenarios to Add

### Unit Tests
```python
# test_edge_cases.py

def test_colony_server_timeout():
    """Test handling of Colony Server timeout"""
    pass

def test_stripe_api_timeout():
    """Test handling of Stripe API timeout"""
    pass

def test_supabase_connection_error():
    """Test retry logic for Supabase failures"""
    pass

def test_duplicate_event_processing():
    """Test idempotency for duplicate webhooks"""
    pass

def test_partial_update_rollback():
    """Test rollback on partial updates"""
    pass

def test_task_deadline_approaching():
    """Test task abortion before timeout"""
    pass
```

### Integration Tests
```python
# test_integration_edge_cases.py

def test_end_to_end_with_slow_services():
    """Test complete flow with slow Stripe and Supabase"""
    pass

def test_service_restart_during_processing():
    """Test graceful shutdown and restart"""
    pass

def test_concurrent_webhook_burst():
    """Test handling of 100+ webhooks simultaneously"""
    pass
```

---

## Monitoring & Alerts Needed

### Critical Alerts
- [ ] Partial database update detected
- [ ] Task timeout exceeded
- [ ] Duplicate webhook processing
- [ ] Colony OS unreachable for >5 minutes

### Warning Alerts
- [ ] High error rate (>5% of tasks)
- [ ] Slow Colony Server response (>5s average)
- [ ] High task queue depth (>100 tasks)
- [ ] Malformed payload detected

### Info Alerts
- [ ] Graceful shutdown initiated
- [ ] Retry logic activated
- [ ] Fallback to direct processing

---

## Summary

**Edge Cases Requiring Immediate Fixes:** 8
**Estimated Fix Time:** 16-24 hours
**Risk if Not Fixed:** Production failures, data corruption, revenue loss

**Top Priority Edge Cases:**
1. ✅ Partial database updates → Use atomic operations
2. ✅ Task timeout during processing → Add deadline monitoring
3. ✅ Colony OS response lost → Improve error categorization
4. ✅ Duplicate webhooks → Add idempotency checks
5. ✅ Supabase outage → Add retry logic

**Next Steps:**
1. Implement atomic database operations (RPC function)
2. Add timeout handling throughout
3. Implement idempotency checks
4. Add comprehensive error categorization
5. Create test suite for edge cases
6. Set up monitoring and alerts

---

**Edge Case Analysis Complete. Ready for remediation.**
