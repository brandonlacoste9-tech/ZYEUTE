-- ============================================
-- CRITICAL FIX: Signup RLS Permission Issue
-- Issue: New users cannot create their own profile during signup
-- Error: "permission denied for table user_profiles"
-- ============================================
-- 
-- This migration ensures users can insert their own profile during signup.
-- The INSERT policy must allow authenticated users to create their own profile
-- with id matching auth.uid().
--
-- Generated: 2025-01-XX (Critical fix for signup flow)
-- ============================================

-- Step 1: Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON user_profiles;

-- Step 3: Create INSERT policy for profile creation during signup
-- This allows authenticated users to create their own profile
-- Security: WITH CHECK ensures they can only insert with their own user ID
CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Step 4: Verify the policy was created
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND policyname = 'Users can insert their own profile'
    AND cmd = 'INSERT'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    RAISE EXCEPTION 'Failed to create INSERT policy for user_profiles';
  END IF;
  
  RAISE NOTICE '✅ INSERT policy created successfully for user_profiles';
END $$;

-- Step 5: Grant necessary permissions (if not already granted)
-- Ensure authenticated role can INSERT into user_profiles
GRANT INSERT ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO authenticated;
GRANT UPDATE ON user_profiles TO authenticated;

-- Step 6: Verify RLS is enabled
DO $$
DECLARE
  rls_enabled BOOLEAN;
BEGIN
  SELECT rowsecurity INTO rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';
  
  IF NOT rls_enabled THEN
    RAISE EXCEPTION 'RLS is not enabled on user_profiles table';
  END IF;
  
  RAISE NOTICE '✅ RLS is enabled on user_profiles';
END $$;

-- ============================================
-- Migration Complete
-- ============================================
-- 
-- After running this migration:
-- 1. New users should be able to signup successfully
-- 2. Profile creation during signup should work
-- 3. Users can only create profiles with their own user ID (secure)
--
-- Test: Try signing up a new user and verify profile is created
-- ============================================

