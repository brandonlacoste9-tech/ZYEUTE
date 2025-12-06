-- ============================================
-- VERIFY RLS POLICY FOR SIGNUP
-- Run this in Supabase SQL Editor to check if policy exists
-- ============================================

-- Check if INSERT policy exists
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check,
  roles
FROM pg_policies
WHERE tablename = 'user_profiles' 
  AND cmd = 'INSERT'
  AND policyname LIKE '%insert%profile%';

-- Check all policies on user_profiles
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- Check grants on user_profiles
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND grantee = 'authenticated';

