-- =====================================================
-- ZYEUTÉ DATABASE UPDATES
-- Phase 2: AI Usage Tracking & Stripe Subscriptions
-- =====================================================

-- =====================================================
-- UPDATE: usage table
-- Add AI generations count column
-- =====================================================
ALTER TABLE usage
ADD COLUMN IF NOT EXISTS ai_generations_count INTEGER DEFAULT 0 NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN usage.ai_generations_count IS 'Number of AI generations used by the user in the current month';

-- =====================================================
-- TABLE: subscriptions
-- Stripe subscription management
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- Add comments for documentation
COMMENT ON TABLE subscriptions IS 'Stripe subscription records for user premium plans';
COMMENT ON COLUMN subscriptions.user_id IS 'Reference to auth.users.id';
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'Stripe customer ID';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN subscriptions.status IS 'Subscription status: active, trialing, past_due, canceled, etc.';
COMMENT ON COLUMN subscriptions.current_period_end IS 'End of current billing period';

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own subscriptions (for status updates from webhooks)
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)

-- Policy: Service role can manage all subscriptions (for webhooks)
-- Note: This requires service_role key, not anon key
CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- Trigger: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================
-- Uncomment to verify the changes:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'usage' AND column_name = 'ai_generations_count';
--
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'subscriptions';

