-- =====================================================
-- ZYEUTÉ ACHIEVEMENT SYSTEM - "LA FIERTÉ QUÉBÉCOISE"
-- Gamification system with Quebec-themed achievements
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: achievements
-- Master list of all possible achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  name TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL, -- French display name
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cultural', 'regional', 'engagement', 'tiguy', 'elite', 'seasonal')),
  
  -- Progression
  points INT NOT NULL DEFAULT 10,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  tier INT DEFAULT 1, -- For multi-tier achievements
  
  -- Visual
  icon TEXT NOT NULL, -- Emoji or icon identifier
  color TEXT DEFAULT '#FFD700', -- Gold default
  
  -- Unlock Conditions (JSON)
  unlock_condition JSONB NOT NULL,
  -- Examples:
  -- {"type": "post_count", "count": 10}
  -- {"type": "fires_received", "count": 1000}
  -- {"type": "location", "region": "Montreal"}
  -- {"type": "date_range", "start": "2025-06-24", "end": "2025-06-24"}
  
  -- Rewards
  reward_cennes INT DEFAULT 0,
  reward_description TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_secret BOOLEAN DEFAULT FALSE, -- Hidden until unlocked
  sort_order INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: user_achievements
-- Track which users have earned which achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  
  -- Progress tracking
  progress INT DEFAULT 0, -- For multi-step achievements
  progress_max INT DEFAULT 1,
  
  -- Earned info
  earned_at TIMESTAMPTZ,
  is_earned BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- TABLE: user_stats (extended for gamification)
-- Add gamification columns to users table
-- =====================================================
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_tier TEXT DEFAULT 'novice',
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS achievement_count INT DEFAULT 0;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned ON user_achievements(user_id, is_earned) WHERE is_earned = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_achievements_progress ON user_achievements(user_id) WHERE is_earned = FALSE;

CREATE INDEX IF NOT EXISTS idx_users_tier ON users(current_tier);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(total_points DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update tier based on points
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier based on total points
  NEW.current_tier := CASE
    WHEN NEW.total_points >= 10000 THEN 'icone'
    WHEN NEW.total_points >= 2000 THEN 'legende'
    WHEN NEW.total_points >= 500 THEN 'pur_laine'
    WHEN NEW.total_points >= 100 THEN 'vrai'
    ELSE 'novice'
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tier
DROP TRIGGER IF EXISTS trigger_update_user_tier ON users;
CREATE TRIGGER trigger_update_user_tier
  BEFORE UPDATE OF total_points ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tier();

-- Function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id UUID,
  p_achievement_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_points INT;
  v_cennes INT;
  v_already_earned BOOLEAN;
BEGIN
  -- Check if already earned
  SELECT is_earned INTO v_already_earned
  FROM user_achievements
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
  
  IF v_already_earned THEN
    RETURN FALSE; -- Already has it
  END IF;
  
  -- Get achievement details
  SELECT points, reward_cennes INTO v_points, v_cennes
  FROM achievements
  WHERE id = p_achievement_id;
  
  -- Mark as earned
  UPDATE user_achievements
  SET is_earned = TRUE,
      earned_at = NOW(),
      progress = progress_max
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
  
  -- If doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO user_achievements (user_id, achievement_id, is_earned, earned_at, progress, progress_max)
    VALUES (p_user_id, p_achievement_id, TRUE, NOW(), 1, 1);
  END IF;
  
  -- Award points
  UPDATE users
  SET total_points = total_points + v_points,
      achievement_count = achievement_count + 1
  WHERE id = p_user_id;
  
  -- Award cennes if any
  IF v_cennes > 0 THEN
    UPDATE users
    SET cennes = cennes + v_cennes
    WHERE id = p_user_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA - Quebec-themed achievements
-- =====================================================

INSERT INTO achievements (name, name_fr, description, category, points, rarity, icon, unlock_condition, reward_cennes) VALUES

-- 🍁 CULTURAL ACHIEVEMENTS
('first_poutine', 'Première Poutine', 'Partage ta première poutine sur Zyeuté', 'cultural', 10, 'common', '🍟', '{"type": "hashtag", "tag": "poutine", "count": 1}', 50),
('saint_jean', 'Fierté du 24 Juin', 'Poste pendant la Saint-Jean-Baptiste', 'cultural', 50, 'rare', '⚜️', '{"type": "date_specific", "date": "06-24"}', 200),
('winter_warrior', 'Guerrier de l''Hiver', 'Poste par -30°C ou moins', 'cultural', 25, 'uncommon', '❄️', '{"type": "weather", "condition": "cold", "temp": -30}', 100),
('maple_season', 'Temps des Sucres', 'Visite une cabane à sucre', 'cultural', 20, 'uncommon', '🍁', '{"type": "location", "place_type": "sugar_shack"}', 75),
('festival_junkie', 'Festivalier', 'Participe à 3 festivals québécois', 'cultural', 75, 'rare', '🎭', '{"type": "event", "event_type": "festival", "count": 3}', 250),
('habs_fan', 'Fan des Habs', 'Poste un match du Canadien', 'cultural', 15, 'common', '🏒', '{"type": "hashtag", "tag": "gohabsgo", "count": 1}', 50),
('fleur_de_lys', 'Porte-Drapeau', 'Utilise 100 fois le emoji ⚜️', 'cultural', 30, 'uncommon', '⚜️', '{"type": "emoji_use", "emoji": "⚜️", "count": 100}', 100),

-- ⚜️ REGIONAL ACHIEVEMENTS  
('montrealais', 'Montréalais', 'Poste 100 fois de Montréal', 'regional', 100, 'rare', '🏙️', '{"type": "location_count", "region": "Montreal", "count": 100}', 300),
('capitale', 'Capitale', 'Poste 100 fois de Québec', 'regional', 100, 'rare', '🏰', '{"type": "location_count", "region": "Quebec City", "count": 100}', 300),
('explorer', 'Explorateur du Québec', 'Poste dans les 17 régions', 'regional', 500, 'legendary', '🗺️', '{"type": "regions_visited", "count": 17}', 1000),
('gaspesie', 'Aventurier Gaspésien', 'Visite la Gaspésie', 'regional', 50, 'uncommon', '🌊', '{"type": "location", "region": "Gaspésie"}', 150),
('laurentides', 'Amoureux des Laurentides', 'Poste 10 fois des Laurentides', 'regional', 40, 'uncommon', '🏔️', '{"type": "location_count", "region": "Laurentides", "count": 10}', 100),

-- 🔥 ENGAGEMENT ACHIEVEMENTS
('first_post', 'Premier Post', 'Crée ton premier post', 'engagement', 5, 'common', '📸', '{"type": "post_count", "count": 1}', 25),
('content_creator', 'Créateur de Contenu', 'Crée 100 posts', 'engagement', 200, 'rare', '🎨', '{"type": "post_count", "count": 100}', 500),
('fire_starter', 'Allume le Feu', 'Reçois 1,000 feux', 'engagement', 150, 'rare', '🔥', '{"type": "fires_received", "count": 1000}', 400),
('viral', 'Viral', 'Atteins 100K vues sur un post', 'engagement', 250, 'epic', '🚀', '{"type": "views_single_post", "count": 100000}', 750),
('influencer', 'Influenceur', 'Atteins 10K abonnés', 'engagement', 500, 'legendary', '👑', '{"type": "followers", "count": 10000}', 2000),
('conversationalist', 'Jaseur', 'Écris 1,000 commentaires', 'engagement', 100, 'rare', '💬', '{"type": "comments_made", "count": 1000}', 300),
('community_builder', 'Bâtisseur de Communauté', 'Aide 100 nouveaux utilisateurs', 'engagement', 200, 'epic', '🤝', '{"type": "referrals", "count": 100}', 600),

-- 🤖 TI-GUY ACHIEVEMENTS
('ai_beginner', 'Débutant IA', 'Utilise Ti-Guy 10 fois', 'tiguy', 20, 'common', '🤖', '{"type": "ai_use", "count": 10}', 50),
('ai_master', 'Maître IA', 'Utilise Ti-Guy 100 fois', 'tiguy', 100, 'rare', '🦫', '{"type": "ai_use", "count": 100}', 300),
('caption_king', 'Roi des Captions', 'Génère 500 captions avec Ti-Guy', 'tiguy', 150, 'epic', '✍️', '{"type": "ai_captions", "count": 500}', 450),
('hashtag_hero', 'Héros des Hashtags', 'Utilise AI hashtags 250 fois', 'tiguy', 75, 'uncommon', '#️⃣', '{"type": "ai_hashtags", "count": 250}', 200),

-- 💎 ELITE ACHIEVEMENTS
('pur_laine', 'Pur Laine', 'Atteins 5,000 points', 'elite', 0, 'epic', '🥇', '{"type": "points", "count": 5000}', 1000),
('legende', 'Légende Vivante', 'Atteins 10,000 points', 'elite', 0, 'legendary', '💎', '{"type": "points", "count": 10000}', 2500),
('icone', 'Icône Québécoise', 'Atteins 50,000 points', 'elite', 0, 'legendary', '👑', '{"type": "points", "count": 50000}', 10000),
('og', 'Membre Fondateur', 'Compte de plus d''un an', 'elite', 100, 'epic', '🎖️', '{"type": "account_age_days", "count": 365}', 500),
('patron', 'Patron de Zyeuté', 'Invite 100 amis', 'elite', 300, 'legendary', '🌟', '{"type": "referrals", "count": 100}', 1000)

ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can view active achievements
CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = TRUE);

-- Users can view their own achievement progress
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = auth.uid());

-- System can manage achievements
CREATE POLICY "System can insert user achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "System can update user achievements"
  ON user_achievements FOR UPDATE
  USING (TRUE);

-- Admins can manage everything
CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = TRUE
    )
  );

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '🏆⚜️ Achievement System created successfully! ⚜️🏆';
  RAISE NOTICE 'Tables: achievements, user_achievements';
  RAISE NOTICE 'Added 25+ Quebec-themed achievements!';
  RAISE NOTICE 'Tier system: Novice → Vrai → Pur Laine → Légende → Icône';
END $$;

