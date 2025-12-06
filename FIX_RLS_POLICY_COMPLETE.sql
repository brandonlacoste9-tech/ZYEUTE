-- ============================================
-- COMPLETE RLS FIX FOR SIGNUP
-- Run this ENTIRE script in Supabase SQL Editor
-- This ensures the INSERT policy exists and works correctly
-- ============================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing INSERT policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Step 3: Create the INSERT policy with explicit schema
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles 
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 4: Ensure SELECT policy exists (for reading own profile)
DROP POLICY IF EXISTS "Users can only read their own profile data" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;

CREATE POLICY "Users can only read their own profile data"
ON public.user_profiles 
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Step 5: Ensure UPDATE policy exists (for updating own profile)
DROP POLICY IF EXISTS "Users can update their own profile data" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile data"
ON public.user_profiles 
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 6: Grant all necessary permissions
GRANT INSERT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT UPDATE ON public.user_profiles TO authenticated;

-- Step 7: Verify the policy was created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'user_profiles'
    AND cmd = 'INSERT'
    AND policyname = 'Users can insert their own profile';
  
  IF policy_count = 0 THEN
    RAISE EXCEPTION 'Failed to create INSERT policy';
  ELSE
    RAISE NOTICE '✅ INSERT policy created successfully (count: %)', policy_count;
  END IF;
END $$;

-- Step 8: Verify RLS is enabled
DO $$
DECLARE
  rls_enabled BOOLEAN;
BEGIN
  SELECT rowsecurity INTO rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public' 
    AND tablename = 'user_profiles';
  
  IF NOT rls_enabled THEN
    RAISE EXCEPTION 'RLS is not enabled on user_profiles';
  ELSE
    RAISE NOTICE '✅ RLS is enabled on user_profiles';
  END IF;
END $$;

-- ============================================
-- VERIFICATION QUERY
-- Run this separately to verify everything is correct
-- ============================================
-- SELECT 
--   policyname,
--   cmd,
--   with_check
-- FROM pg_policies
-- WHERE tablename = 'user_profiles'
-- ORDER BY cmd;

