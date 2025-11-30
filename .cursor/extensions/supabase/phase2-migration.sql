-- Phase 2 Migration: Convert SECURITY DEFINER Views to INVOKER
-- ⚠️ IMPORTANT: Review pre-checks and test thoroughly before running
-- This is a TEMPLATE - Review each view definition first!

-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- 
-- 1. This script is a TEMPLATE
-- 2. Review each view definition from phase2-pre-checks.sql
-- 3. Test each conversion individually
-- 4. Have rollback script ready
-- 5. Run during maintenance window
--
-- ============================================

-- ============================================
-- Step 1: Get Current Definitions
-- ============================================
-- Run this first to capture current definitions:
-- SELECT viewname, pg_get_viewdef(format('public.%I', viewname)::regclass, true) 
-- FROM pg_views WHERE schemaname = 'public' AND viewname IN (...);

-- ============================================
-- Step 2: Convert Views (Example Pattern)
-- ============================================
-- 
-- For each view, use this pattern:
-- 
-- 1. Get definition: SELECT pg_get_viewdef('public.view_name', true);
-- 2. Drop view: DROP VIEW IF EXISTS public.view_name CASCADE;
-- 3. Recreate as INVOKER: CREATE VIEW public.view_name AS [definition];
-- 4. Test: SELECT * FROM public.view_name LIMIT 1;
-- 5. Verify RLS: Test with different user roles
--
-- ============================================

-- Example: Convert v_user_counts (if safe to do so)
-- ⚠️ DO NOT RUN BLINDLY - Review definition first!

/*
-- Step 1: Get current definition
SELECT pg_get_viewdef('public.v_user_counts', true);

-- Step 2: Drop and recreate as INVOKER
DROP VIEW IF EXISTS public.v_user_counts CASCADE;

CREATE VIEW public.v_user_counts AS
-- Paste definition from Step 1 here
-- Remove any SECURITY DEFINER clause
SELECT ...;

-- Step 3: Restore permissions (if needed)
-- GRANT SELECT ON public.v_user_counts TO service_role;
-- Note: We already revoked anon/auth in Phase 1
*/

-- ============================================
-- Step 3: Convert Other Views
-- ============================================
-- Repeat the pattern above for each view:
-- - publication_engagement_breakdown
-- - trending_publications
-- - top_publications_last_7d
-- - publication_reaction_counts
-- - recent_publications
-- - v_user_profile_feed
-- - v_publication_detail
-- - v_public_profiles

-- ============================================
-- Step 4: Move pg_trgm Extension (Complex - Defer)
-- ============================================
-- 
-- This is complex and requires:
-- 1. Identifying all dependencies
-- 2. Creating extension in extensions schema
-- 3. Updating all references
-- 4. Dropping from public
--
-- RECOMMENDATION: Defer to separate maintenance window
-- or skip if not critical
--
-- ============================================

-- ============================================
-- Verification Queries
-- ============================================

-- Check views are now INVOKER (default)
SELECT 
    schemaname,
    viewname,
    'Converted to INVOKER' as status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN (
    'publication_engagement_breakdown',
    'trending_publications',
    'top_publications_last_7d',
    'publication_reaction_counts',
    'recent_publications',
    'v_user_profile_feed',
    'v_publication_detail',
    'v_user_counts',
    'v_public_profiles'
)
ORDER BY viewname;

-- Test each view with different roles
-- (Run as different users to verify RLS works)

-- ============================================
-- IMPORTANT: This is a TEMPLATE
-- ============================================
-- 
-- DO NOT run this script as-is!
-- 
-- Steps to follow:
-- 1. Run phase2-pre-checks.sql
-- 2. Review each view definition
-- 3. Convert one view at a time
-- 4. Test thoroughly
-- 5. Proceed to next view
-- 6. Have rollback ready for each view
--
-- ============================================

