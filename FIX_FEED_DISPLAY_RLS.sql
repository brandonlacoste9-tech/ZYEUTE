-- ============================================
-- CRITICAL FIX: Feed Display RLS Policy
-- Issue: Posts exist in database but don't appear in feed
-- Root Cause: Missing or incorrect RLS SELECT policy on publications table
-- ============================================

-- Step 1: Check current RLS policies on publications
-- Run this first to see what exists:
-- SELECT 
--   policyname,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'publications'
-- ORDER BY cmd, policyname;

-- Step 2: Enable RLS on publications (if not already enabled)
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing SELECT policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public publications" ON public.publications;
DROP POLICY IF EXISTS "Users can view publications" ON public.publications;
DROP POLICY IF EXISTS "Authenticated users can view publications" ON public.publications;
DROP POLICY IF EXISTS "Public publications are viewable by all" ON public.publications;

-- Step 4: Create SELECT policy for viewing publications
-- This allows authenticated users to view public publications
-- and their own publications (regardless of visibility)
CREATE POLICY "Users can view public and own publications"
ON public.publications FOR SELECT
TO authenticated
USING (
  -- Can view public publications
  visibilite = 'public' 
  -- OR can view own publications (any visibility)
  OR user_id = auth.uid()
  -- OR can view publications from users they follow (if visibility = 'amis')
  OR (
    visibilite = 'amis' 
    AND EXISTS (
      SELECT 1 FROM public.abonnements 
      WHERE follower_id = auth.uid() 
      AND followee_id = publications.user_id
    )
  )
)
AND est_masque IS NOT TRUE  -- Not hidden
AND deleted_at IS NULL;     -- Not deleted

-- Step 5: Also allow anonymous users to view public publications (if needed)
CREATE POLICY "Anonymous users can view public publications"
ON public.publications FOR SELECT
TO anon
USING (
  visibilite = 'public'
  AND est_masque IS NOT TRUE
  AND deleted_at IS NULL
);

-- Step 6: Grant SELECT permission
GRANT SELECT ON public.publications TO authenticated;
GRANT SELECT ON public.publications TO anon;

-- Step 7: Verify the policies were created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'publications'
    AND cmd = 'SELECT';
  
  IF policy_count = 0 THEN
    RAISE EXCEPTION 'Failed to create SELECT policies for publications';
  ELSE
    RAISE NOTICE '✅ SELECT policies created successfully (count: %)', policy_count;
  END IF;
END $$;

-- Step 8: Test the query (should return posts)
-- Run this as authenticated user to verify:
-- SELECT id, content, media_url, created_at 
-- FROM public.publications 
-- WHERE visibilite = 'public' 
--   AND est_masque IS NOT TRUE 
--   AND deleted_at IS NULL
-- ORDER BY created_at DESC
-- LIMIT 10;

-- ============================================
-- ALTERNATIVE: Simpler policy (if above is too complex)
-- ============================================
-- If the complex policy doesn't work, try this simpler version:

-- DROP POLICY IF EXISTS "Users can view public and own publications" ON public.publications;
-- 
-- CREATE POLICY "Users can view all non-hidden publications"
-- ON public.publications FOR SELECT
-- TO authenticated
-- USING (
--   est_masque IS NOT TRUE 
--   AND deleted_at IS NULL
-- );

-- ============================================
-- Migration Complete
-- ============================================
-- 
-- After running this migration:
-- 1. Posts should appear in feed
-- 2. Users can view public posts
-- 3. Users can view their own posts
-- 4. Feed query should work correctly
--
-- Test: Refresh feed and verify posts appear
-- ============================================

