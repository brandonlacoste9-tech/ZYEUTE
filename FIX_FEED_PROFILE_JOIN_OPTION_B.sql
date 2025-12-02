-- ============================================
-- CRITICAL FIX: Feed Profile Join RLS Issue (Option B - Safer View Approach)
-- Issue: Feed query joins user_profiles but RLS blocks reading other users' profiles
-- Root Cause: user_profiles SELECT policy only allows self-read
-- Solution: Create a view with only public-safe fields and allow read on that view
-- ============================================

-- Step 1: Create a view exposing only safe public fields
-- This keeps sensitive columns (email, phone, etc.) private while unblocking the feed
CREATE OR REPLACE VIEW public.user_profiles_public AS
SELECT
  id,
  username,
  display_name,
  avatar_url,
  bio,
  created_at
FROM public.user_profiles;

-- Step 2: Grant read access on the view to authenticated and anonymous users
GRANT SELECT ON public.user_profiles_public TO authenticated;
GRANT SELECT ON public.user_profiles_public TO anon;

-- Step 3: Verify the view was created
DO $$
DECLARE
  view_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.views
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles_public'
  ) INTO view_exists;

  IF NOT view_exists THEN
    RAISE EXCEPTION 'Failed to create user_profiles_public view';
  ELSE
    RAISE NOTICE '✅ View user_profiles_public created successfully';
  END IF;
END $$;

-- Step 4: Test the feed query with the view
-- This simulates what the frontend should do:
-- SELECT 
--   p.id,
--   p.content,
--   p.media_url,
--   p.created_at,
--   up.username,
--   up.display_name,
--   up.avatar_url
-- FROM public.publications p
-- LEFT JOIN public.user_profiles_public up ON up.id = p.user_id
-- WHERE p.visibilite = 'public' 
--   AND p.est_masque IS NOT TRUE 
--   AND p.deleted_at IS NULL
-- ORDER BY p.created_at DESC
-- LIMIT 10;

-- ============================================
-- FRONTEND CHANGE REQUIRED FOR OPTION B
-- ============================================
-- 
-- Update src/services/api.ts getFeedPosts() to use the view:
-- 
-- Change from:
--   .select(`*, user:user_profiles!user_id(*)`)
-- 
-- To:
--   .select(`*, user:user_profiles_public!user_id(*)`)
-- 
-- OR update the join to use the view name explicitly
-- ============================================

-- ============================================
-- Migration Complete
-- ============================================
-- 
-- After running this migration:
-- 1. View created with only public-safe fields
-- 2. Feed query can join user_profiles_public without RLS blocking
-- 3. Posts should appear in feed with author info
-- 4. Sensitive fields still protected (not in view)
--
-- IMPORTANT: Frontend must be updated to use user_profiles_public view
-- Test: Refresh feed and verify posts appear with author info
-- ============================================

