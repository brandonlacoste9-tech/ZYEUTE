-- =====================================================
-- ZYEUTÉ CREATOR SUBSCRIPTIONS & MONETIZATION
-- Complete subscription system with Stripe integration
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: subscription_tiers
-- Creator-defined subscription offerings
-- =====================================================
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tier Info
  name TEXT NOT NULL, -- "Basic", "Premium", "VIP"
  name_fr TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 4.99), -- Minimum $4.99 CAD
  currency TEXT DEFAULT 'CAD',
  
  -- Benefits (JSON array)
  benefits JSONB DEFAULT '[]'::jsonb,
  -- Example: ["Exclusive posts", "Behind the scenes", "Monthly Q&A"]
  
  -- Settings
  is_active BOOLEAN DEFAULT TRUE,
  max_subscribers INT, -- Optional limit
  
  -- Stripe
  stripe_price_id TEXT, -- Stripe Price ID
  stripe_product_id TEXT, -- Stripe Product ID
  
  -- Stats
  subscriber_count INT DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(creator_id, name)
);

-- =====================================================
-- TABLE: subscriptions
-- Active user subscriptions
-- =====================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  subscriber_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  
  -- Subscription Status
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
  
  UNIQUE(subscriber_id, creator_id)
);

-- =====================================================
-- TABLE: creator_earnings
-- Track all creator revenue
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Revenue Source
  source TEXT NOT NULL CHECK (source IN ('subscription', 'gift', 'tip', 'sponsored')),
  source_id UUID, -- Reference to subscription_id, gift_id, etc.
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  platform_fee DECIMAL(10,2) NOT NULL, -- 30% platform fee
  creator_net DECIMAL(10,2) NOT NULL, -- 70% to creator
  
  -- Payout Status
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
  payout_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: creator_payouts
-- Track payouts to creators
-- =====================================================
CREATE TABLE IF NOT EXISTS creator_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  
  -- Method
  payout_method TEXT NOT NULL CHECK (payout_method IN ('stripe', 'interac', 'paypal')),
  payout_destination TEXT, -- Email, bank account, etc.
  
  -- Stripe
  stripe_transfer_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Dates
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: exclusive_content
-- Mark posts as subscriber-only
-- =====================================================
CREATE TABLE IF NOT EXISTS exclusive_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE UNIQUE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Access Level
  min_tier_id UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,
  is_exclusive BOOLEAN DEFAULT TRUE,
  
  -- Preview
  preview_text TEXT, -- Teaser for non-subscribers
  
  -- Stats
  views_subscribers INT DEFAULT 0,
  views_nonsubscribers INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXTEND users TABLE
-- Add creator settings
-- =====================================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS creator_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_subscribers INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_earnings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payout_email TEXT,
ADD COLUMN IF NOT EXISTS payout_method TEXT DEFAULT 'stripe';

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_creator ON subscription_tiers(creator_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_price ON subscription_tiers(price);

CREATE INDEX IF NOT EXISTS idx_subscriptions_subscriber ON subscriptions(subscriber_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator ON subscriptions(creator_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator ON creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_payout_status ON creator_earnings(payout_status) WHERE payout_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_creator_earnings_created ON creator_earnings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_creator_payouts_creator ON creator_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_payouts_status ON creator_payouts(status) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_exclusive_content_post ON exclusive_content(post_id);
CREATE INDEX IF NOT EXISTS idx_exclusive_content_creator ON exclusive_content(creator_id);

CREATE INDEX IF NOT EXISTS idx_users_creator ON users(is_creator) WHERE is_creator = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_stripe ON users(stripe_account_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to check if user is subscribed to creator
CREATE OR REPLACE FUNCTION is_subscribed_to(
  p_subscriber_id UUID,
  p_creator_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_subscribed BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM subscriptions
    WHERE subscriber_id = p_subscriber_id
    AND creator_id = p_creator_id
    AND status = 'active'
    AND current_period_end > NOW()
  ) INTO v_is_subscribed;
  
  RETURN v_is_subscribed;
END;
$$ LANGUAGE plpgsql;

-- Function to get creator's monthly recurring revenue
CREATE OR REPLACE FUNCTION get_creator_mrr(p_creator_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_mrr DECIMAL;
BEGIN
  SELECT COALESCE(SUM(st.price), 0) INTO v_mrr
  FROM subscriptions s
  JOIN subscription_tiers st ON s.tier_id = st.id
  WHERE s.creator_id = p_creator_id
  AND s.status = 'active';
  
  RETURN v_mrr;
END;
$$ LANGUAGE plpgsql;

-- Function to record subscription revenue
CREATE OR REPLACE FUNCTION record_subscription_revenue(
  p_subscription_id UUID,
  p_amount DECIMAL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_creator_id UUID;
  v_platform_fee DECIMAL;
  v_creator_net DECIMAL;
BEGIN
  -- Get creator ID
  SELECT creator_id INTO v_creator_id
  FROM subscriptions
  WHERE id = p_subscription_id;
  
  -- Calculate fees (30% platform, 70% creator)
  v_platform_fee := p_amount * 0.30;
  v_creator_net := p_amount * 0.70;
  
  -- Record earnings
  INSERT INTO creator_earnings (
    creator_id,
    source,
    source_id,
    amount,
    platform_fee,
    creator_net
  ) VALUES (
    v_creator_id,
    'subscription',
    p_subscription_id,
    p_amount,
    v_platform_fee,
    v_creator_net
  );
  
  -- Update creator pending earnings
  UPDATE users
  SET pending_earnings = pending_earnings + v_creator_net,
      total_earnings = total_earnings + v_creator_net
  WHERE id = v_creator_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription counts
CREATE OR REPLACE FUNCTION update_subscription_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    -- Increment counts
    UPDATE subscription_tiers
    SET subscriber_count = subscriber_count + 1
    WHERE id = NEW.tier_id;
    
    UPDATE users
    SET total_subscribers = total_subscribers + 1
    WHERE id = NEW.creator_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'active' AND NEW.status != 'active' THEN
      -- Decrement counts
      UPDATE subscription_tiers
      SET subscriber_count = subscriber_count - 1
      WHERE id = NEW.tier_id;
      
      UPDATE users
      SET total_subscribers = total_subscribers - 1
      WHERE id = NEW.creator_id;
    ELSIF OLD.status != 'active' AND NEW.status = 'active' THEN
      -- Increment counts
      UPDATE subscription_tiers
      SET subscriber_count = subscriber_count + 1
      WHERE id = NEW.tier_id;
      
      UPDATE users
      SET total_subscribers = total_subscribers + 1
      WHERE id = NEW.creator_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for subscription counts
DROP TRIGGER IF EXISTS trigger_update_subscription_counts ON subscriptions;
CREATE TRIGGER trigger_update_subscription_counts
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_counts();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exclusive_content ENABLE ROW LEVEL SECURITY;

-- Subscription Tiers: Public can view active tiers
CREATE POLICY "Anyone can view active subscription tiers"
  ON subscription_tiers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Creators can manage their own tiers"
  ON subscription_tiers FOR ALL
  USING (creator_id = auth.uid());

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (subscriber_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  USING (TRUE);

-- Earnings: Creators can view their own earnings
CREATE POLICY "Creators can view their own earnings"
  ON creator_earnings FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "System can insert earnings"
  ON creator_earnings FOR INSERT
  WITH CHECK (TRUE);

-- Payouts: Creators can view their own payouts
CREATE POLICY "Creators can view their own payouts"
  ON creator_payouts FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can request payouts"
  ON creator_payouts FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- Exclusive Content: Creators manage, subscribers view
CREATE POLICY "Creators can manage exclusive content"
  ON exclusive_content FOR ALL
  USING (creator_id = auth.uid());

CREATE POLICY "Subscribers can view exclusive content"
  ON exclusive_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.subscriber_id = auth.uid()
      AND subscriptions.creator_id = exclusive_content.creator_id
      AND subscriptions.status = 'active'
    )
  );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '💰⚜️ Creator Subscription System created successfully! ⚜️💰';
  RAISE NOTICE 'Tables: subscription_tiers, subscriptions, creator_earnings, creator_payouts, exclusive_content';
  RAISE NOTICE 'Functions: is_subscribed_to, get_creator_mrr, record_subscription_revenue';
  RAISE NOTICE 'Ready for Stripe integration!';
END $$;

