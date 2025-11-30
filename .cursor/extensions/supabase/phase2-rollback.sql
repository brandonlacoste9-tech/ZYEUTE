-- Phase 2 Rollback Script
-- Use this if Phase 2 migration causes issues
-- Recreates views as SECURITY DEFINER (if needed)

-- ============================================
-- IMPORTANT: This requires original view definitions
-- ============================================
-- 
-- To rollback, you need:
-- 1. Original view definitions (from pre-checks)
-- 2. Original SECURITY DEFINER settings
-- 3. Original permissions
--
-- ============================================

-- ============================================
-- Rollback Pattern (Example)
-- ============================================
-- 
-- For each view that needs rollback:
-- 
-- 1. Get original definition (from backup or pre-checks)
-- 2. Drop current view
-- 3. Recreate as SECURITY DEFINER
-- 4. Restore permissions
--
-- ============================================

-- Example: Rollback v_user_counts
-- ⚠️ Replace with actual original definition!

/*
DROP VIEW IF EXISTS public.v_user_counts CASCADE;

CREATE VIEW public.v_user_counts
WITH (security_definer = true)  -- PostgreSQL 15+
AS
-- Paste ORIGINAL definition here
SELECT ...;

-- Restore permissions if needed
GRANT SELECT ON public.v_user_counts TO service_role;
-- Note: We may want to keep anon/auth revoked for security
*/

-- ============================================
-- Rollback All Views (Template)
-- ============================================
-- 
-- Repeat for each view that was converted:
-- - publication_engagement_breakdown
-- - trending_publications
-- - top_publications_last_7d
-- - publication_reaction_counts
-- - recent_publications
-- - v_user_profile_feed
-- - v_publication_detail
-- - v_user_counts
-- - v_public_profiles
--
-- ============================================

-- ============================================
-- Verification After Rollback
-- ============================================

-- Check views are restored
SELECT 
    schemaname,
    viewname,
    'Rolled back to SECURITY DEFINER' as status
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

-- ============================================
-- IMPORTANT: Backup Before Migration
-- ============================================
-- 
-- Before running Phase 2 migration:
-- 1. Run phase2-pre-checks.sql
-- 2. Save all view definitions
-- 3. Save current permissions
-- 4. Create database backup
-- 5. Test rollback procedure
--
-- ============================================

