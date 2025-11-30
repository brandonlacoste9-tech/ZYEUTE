-- =====================================================
-- ZYEUTÉ MODERATION SYSTEM
-- Complete database schema for AI moderation
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: moderation_logs
-- Stores all AI moderation analysis results
-- =====================================================
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'bio', 'message', 'story')),
  content_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- AI Analysis Results
  ai_severity TEXT NOT NULL CHECK (ai_severity IN ('safe', 'low', 'medium', 'high', 'critical')),
  ai_categories TEXT[] DEFAULT '{}',
  ai_confidence INT CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  ai_reason TEXT NOT NULL,
  ai_action TEXT NOT NULL CHECK (ai_action IN ('allow', 'flag', 'hide', 'remove', 'ban')),
  ai_context_note TEXT,
  
  -- Human Review
  human_reviewed BOOLEAN DEFAULT FALSE,
  human_reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  human_decision TEXT CHECK (human_decision IN ('approve', 'remove', 'ban', 'dismiss')),
  human_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'removed', 'dismissed')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for moderation_logs
CREATE INDEX IF NOT EXISTS idx_moderation_logs_user ON moderation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_status ON moderation_logs(status);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_severity ON moderation_logs(ai_severity);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_content ON moderation_logs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created ON moderation_logs(created_at DESC);

-- =====================================================
-- TABLE: user_strikes
-- Strike system for content violations
-- =====================================================
CREATE TABLE IF NOT EXISTS user_strikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Strike Information
  strike_count INT DEFAULT 0 CHECK (strike_count >= 0 AND strike_count <= 10),
  strikes JSONB DEFAULT '[]'::jsonb,
  -- strikes format: [{"date": "ISO-8601", "reason": "text", "severity": "high", "categories": ["bullying"]}]
  
  -- Ban Information
  ban_until TIMESTAMPTZ,
  is_permanent_ban BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  
  -- Appeal Information
  appeal_status TEXT CHECK (appeal_status IN ('none', 'pending', 'accepted', 'rejected')),
  appeal_reason TEXT,
  appeal_date TIMESTAMPTZ,
  appeal_reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  appeal_reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_strikes
CREATE INDEX IF NOT EXISTS idx_user_strikes_user ON user_strikes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_strikes_ban_until ON user_strikes(ban_until) WHERE ban_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_strikes_appeal_status ON user_strikes(appeal_status) WHERE appeal_status = 'pending';

-- =====================================================
-- TABLE: content_reports
-- User-submitted content reports
-- =====================================================
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reporter & Reported
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content Information
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'bio', 'message', 'story', 'user')),
  content_id UUID,
  
  -- Report Details
  report_type TEXT NOT NULL CHECK (report_type IN (
    'bullying', 'harassment', 'hate_speech', 'violence', 
    'sexual_content', 'spam', 'fraud', 'misinformation',
    'illegal', 'self_harm', 'other'
  )),
  details TEXT,
  
  -- Review Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution TEXT CHECK (resolution IN ('content_removed', 'user_warned', 'user_banned', 'no_action')),
  resolution_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for content_reports
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_reported_user ON content_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON content_reports(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_created ON content_reports(created_at DESC);

-- Prevent spam reporting (1 report per user per content)
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_reports_unique ON content_reports(reporter_id, content_type, content_id) WHERE reporter_id IS NOT NULL;

-- =====================================================
-- TABLE: blocked_users
-- User blocking relationships
-- =====================================================
CREATE TABLE IF NOT EXISTS blocked_users (
  blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Indexes for blocked_users
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id);

-- =====================================================
-- TABLE: restricted_users
-- Restricted users (can see but can't interact)
-- =====================================================
CREATE TABLE IF NOT EXISTS restricted_users (
  restricter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  restricted_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (restricter_id, restricted_id),
  CHECK (restricter_id != restricted_id)
);

-- Indexes for restricted_users
CREATE INDEX IF NOT EXISTS idx_restricted_users_restricter ON restricted_users(restricter_id);
CREATE INDEX IF NOT EXISTS idx_restricted_users_restricted ON restricted_users(restricted_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restricted_users ENABLE ROW LEVEL SECURITY;

-- Moderation Logs: Only admins can view
CREATE POLICY "Admins can view all moderation logs"
  ON moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

CREATE POLICY "System can insert moderation logs"
  ON moderation_logs FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can update moderation logs"
  ON moderation_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

-- User Strikes: Users can view their own, admins can view all
CREATE POLICY "Users can view their own strikes"
  ON user_strikes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all strikes"
  ON user_strikes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

CREATE POLICY "System can manage strikes"
  ON user_strikes FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- Content Reports: Users can view their own reports, admins can view all
CREATE POLICY "Users can view their own reports"
  ON content_reports FOR SELECT
  USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
  ON content_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

CREATE POLICY "Users can create reports"
  ON content_reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can update reports"
  ON content_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

-- Blocked Users: Users can manage their own blocks
CREATE POLICY "Users can view their blocks"
  ON blocked_users FOR SELECT
  USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks"
  ON blocked_users FOR INSERT
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Users can delete their blocks"
  ON blocked_users FOR DELETE
  USING (blocker_id = auth.uid());

-- Restricted Users: Users can manage their own restrictions
CREATE POLICY "Users can view their restrictions"
  ON restricted_users FOR SELECT
  USING (restricter_id = auth.uid());

CREATE POLICY "Users can create restrictions"
  ON restricted_users FOR INSERT
  WITH CHECK (restricter_id = auth.uid());

CREATE POLICY "Users can delete their restrictions"
  ON restricted_users FOR DELETE
  USING (restricter_id = auth.uid());

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_moderation_logs_updated_at
  BEFORE UPDATE ON moderation_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_strikes_updated_at
  BEFORE UPDATE ON user_strikes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_reports_updated_at
  BEFORE UPDATE ON content_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE moderation_logs IS 'AI-powered content moderation analysis results';
COMMENT ON TABLE user_strikes IS 'User violation strike system with ban management';
COMMENT ON TABLE content_reports IS 'User-submitted content violation reports';
COMMENT ON TABLE blocked_users IS 'User blocking relationships';
COMMENT ON TABLE restricted_users IS 'User restriction relationships (Instagram restrict feature)';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Zyeuté Moderation System tables created successfully! 🛡️⚜️';
  RAISE NOTICE 'Tables: moderation_logs, user_strikes, content_reports, blocked_users, restricted_users';
  RAISE NOTICE 'Next steps: Update is_admin column on users table for admin access';
END $$;

