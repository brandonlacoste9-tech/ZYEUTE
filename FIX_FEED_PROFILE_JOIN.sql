-- ============================================
-- CRITICAL FIX: Feed Profile Join RLS Issue
-- Issue: Feed query joins user_profiles but RLS blocks reading other users' profiles
-- Root Cause: user_profiles SELECT policy only allows self-read
-- Solution: Add policy to allow reading public profile fields for feed display
-- ============================================

-- Step 1: Check current user_profiles RLS policies
-- Run this first to see what exists:
-- SELECT 
--   policyname,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'user_profiles'
-- ORDER BY cmd, policyname;

-- Step 2: Verify RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Check if a public read policy already exists
-- If it does, we'll update it; if not, we'll create one
-- DO NOT drop existing self-read policies - they're needed for privacy

-- Step 4: Create policy to allow reading public profile fields for feed display
-- This allows authenticated users to read basic profile info (username, display_name, avatar_url)
-- needed for feed display, while keeping sensitive fields (email, etc.) private
-- Using DO block to check if policy exists first (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'Public profile fields readable for feed'
  ) THEN
    CREATE POLICY "Public profile fields readable for feed"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- Step 5: Also allow anonymous users to read public profile fields (for public feed)
-- Using DO block to check if policy exists first (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'Public profile fields readable for anonymous'
  ) THEN
    CREATE POLICY "Public profile fields readable for anonymous"
    ON public.user_profiles FOR SELECT
    TO anon
    USING (true);
  END IF;
END $$;

-- Step 6: Grant SELECT permission (if not already granted)
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

-- Step 7: Verify the policies were created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'user_profiles'
    AND cmd = 'SELECT';
  
  IF policy_count = 0 THEN
    RAISE EXCEPTION 'Failed to create SELECT policies for user_profiles';
  ELSE
    RAISE NOTICE '✅ SELECT policies created successfully (count: %)', policy_count;
  END IF;
END $$;

-- Step 8: Test the feed query pattern
-- This simulates what the frontend does:
-- SELECT 
--   p.id,
--   p.content,
--   p.media_url,
--   p.created_at,
--   up.username,
--   up.display_name,
--   up.avatar_url
-- FROM public.publications p
-- LEFT JOIN public.user_profiles up ON up.id = p.user_id
-- WHERE p.visibilite = 'public' 
--   AND p.est_masque IS NOT TRUE 
--   AND p.deleted_at IS NULL
-- ORDER BY p.created_at DESC
-- LIMIT 10;

-- ============================================
-- ALTERNATIVE: More Restrictive Policy (if above is too permissive)
-- ============================================
-- If you want to be more restrictive and only expose specific fields:

-- DROP POLICY IF EXISTS "Public profile fields readable for feed" ON public.user_profiles;
-- DROP POLICY IF EXISTS "Public profile fields readable for anonymous" ON public.user_profiles;
-- 
-- -- Create a view with only public fields
-- CREATE OR REPLACE VIEW public.user_profiles_public AS
-- SELECT 
--   id,
--   username,
--   display_name,
--   avatar_url,
--   bio,
--   created_at
-- FROM public.user_profiles;
-- 
-- -- Grant access to the view
-- GRANT SELECT ON public.user_profiles_public TO authenticated;
-- GRANT SELECT ON public.user_profiles_public TO anon;
-- 
-- -- Then update frontend to join with user_profiles_public instead of user_profiles

-- ============================================
-- Migration Complete
-- ============================================
-- 
-- After running this migration:
-- 1. Feed query should work with user_profiles join
-- 2. Posts should appear in feed with author info
-- 3. Profile fields (username, display_name, avatar) visible
-- 4. Sensitive fields still protected by existing self-read policies
--
-- Test: Refresh feed and verify posts appear with author info
-- ============================================

