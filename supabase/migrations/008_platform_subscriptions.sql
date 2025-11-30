-- =====================================================
-- ZYEUTÉ PLATFORM VIP SUBSCRIPTIONS
-- Tracks user subscriptions to Zyeuté Premium (Bronze, Silver, Gold)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: platform_subscriptions
-- User subscriptions to Zyeuté VIP tiers
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Subscription Details
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'paused', 'expired')),
  
  -- Stripe Info
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  
  -- Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_subscription UNIQUE(user_id)
);

-- =====================================================
-- EXTEND users TABLE (Optional fields for backward compatibility)
-- Add premium status fields
-- =====================================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_tier TEXT DEFAULT 'free' CHECK (premium_tier IN ('free', 'bronze', 'silver', 'gold')),
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_user ON platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_status ON platform_subscriptions(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_stripe ON platform_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_platform_subscriptions_tier ON platform_subscriptions(tier) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_users_premium ON users(is_premium) WHERE is_premium = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_premium_tier ON users(premium_tier);

-- =====================================================
-- FUNCTION: Sync premium status from platform_subscriptions to users
-- =====================================================
CREATE OR REPLACE FUNCTION sync_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update users table when subscription changes
    UPDATE users
    SET 
      is_premium = (NEW.status = 'active'),
      premium_tier = CASE 
        WHEN NEW.status = 'active' THEN NEW.tier 
        ELSE 'free' 
      END,
      stripe_subscription_id = NEW.stripe_subscription_id,
      updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Reset premium status when subscription is deleted
    -- Note: Each user can only have ONE platform VIP subscription (enforced by UNIQUE constraint)
    -- This is different from creator subscriptions where a user can subscribe to multiple creators
    UPDATE users
    SET 
      is_premium = FALSE,
      premium_tier = 'free',
      stripe_subscription_id = NULL,
      updated_at = NOW()
    WHERE id = OLD.user_id;
    
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep users table in sync
DROP TRIGGER IF EXISTS trigger_sync_premium_status ON platform_subscriptions;
CREATE TRIGGER trigger_sync_premium_status
  AFTER INSERT OR UPDATE OR DELETE ON platform_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_premium_status();

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE platform_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own platform subscription"
  ON platform_subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- System can manage subscriptions (for webhooks)
CREATE POLICY "Service role can manage platform subscriptions"
  ON platform_subscriptions FOR ALL
  USING (TRUE);

-- =====================================================
-- VIEW: Premium users with subscription details
-- =====================================================
CREATE OR REPLACE VIEW premium_users AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  u.avatar_url,
  ps.tier,
  ps.status,
  ps.current_period_start,
  ps.current_period_end,
  ps.created_at as subscribed_at
FROM users u
JOIN platform_subscriptions ps ON u.id = ps.user_id
WHERE ps.status = 'active';

-- =====================================================
-- FUNCTION: Check if user has active premium
-- =====================================================
CREATE OR REPLACE FUNCTION has_active_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_premium BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM platform_subscriptions
    WHERE user_id = p_user_id
    AND status = 'active'
    AND current_period_end > NOW()
  ) INTO v_has_premium;
  
  RETURN v_has_premium;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Get user premium tier
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_premium_tier(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_tier TEXT;
BEGIN
  SELECT tier INTO v_tier
  FROM platform_subscriptions
  WHERE user_id = p_user_id
  AND status = 'active'
  AND current_period_end > NOW();
  
  RETURN COALESCE(v_tier, 'free');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '💎⚜️ Platform VIP Subscriptions created successfully! ⚜️💎';
  RAISE NOTICE 'Table: platform_subscriptions';
  RAISE NOTICE 'Functions: has_active_premium, get_user_premium_tier';
  RAISE NOTICE 'Ready for Stripe webhook integration!';
END $$;
