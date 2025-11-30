-- Phase 2 Pre-Migration Checks
-- Run this BEFORE executing Phase 2 migration
-- Identifies dependencies and potential issues

-- ============================================
-- 1. List All SECURITY DEFINER Views
-- ============================================

SELECT 
    'SECURITY DEFINER Views' as check_type,
    schemaname,
    viewname,
    viewowner,
    'Review definition before migration' as action
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
-- 2. Get View Definitions
-- ============================================

-- Get definitions for review
SELECT 
    viewname,
    pg_get_viewdef(format('public.%I', viewname)::regclass, true) as definition
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
-- 3. Check View Dependencies
-- ============================================

-- Check if views are used by other views
SELECT 
    dependent_view.schemaname || '.' || dependent_view.viewname as dependent_view,
    'depends on' as relation,
    source_view.schemaname || '.' || source_view.viewname as source_view
FROM pg_views dependent_view
CROSS JOIN pg_views source_view
WHERE dependent_view.schemaname = 'public'
AND source_view.schemaname = 'public'
AND source_view.viewname IN (
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
AND dependent_view.viewname != source_view.viewname
-- Check if definition references source view
AND dependent_view.viewdefinition LIKE '%' || source_view.viewname || '%';

-- ============================================
-- 4. Check Underlying Table RLS
-- ============================================

-- Verify RLS is enabled on tables used by views
SELECT DISTINCT
    t.schemaname,
    t.tablename,
    t.rowsecurity as rls_enabled,
    CASE 
        WHEN t.rowsecurity THEN '✅ RLS enabled'
        ELSE '⚠️ RLS NOT enabled - Fix before converting view'
    END as status
FROM pg_tables t
WHERE t.schemaname = 'public'
AND t.tablename IN (
    'publications',
    'commentaires',
    'reactions',
    'abonnements',
    'notifications',
    'user_profiles',
    'signalements',
    'hashtags'
)
ORDER BY t.tablename;

-- ============================================
-- 5. Check pg_trgm Dependencies
-- ============================================

-- Find all objects using pg_trgm
SELECT 
    'pg_trgm Dependencies' as check_type,
    n.nspname as schema_name,
    CASE 
        WHEN c.relkind = 'r' THEN 'table'
        WHEN c.relkind = 'i' THEN 'index'
        WHEN c.relkind = 'v' THEN 'view'
        WHEN c.relkind = 'm' THEN 'materialized view'
        ELSE 'other'
    END as object_type,
    c.relname as object_name,
    'Review before moving extension' as action
FROM pg_depend d
JOIN pg_extension e ON d.refobjid = e.oid
JOIN pg_class c ON d.objid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE e.extname = 'pg_trgm'
AND d.deptype = 'n'  -- normal dependency
ORDER BY n.nspname, c.relname;

-- ============================================
-- 6. Summary Report
-- ============================================

SELECT 
    '=== PHASE 2 PRE-MIGRATION SUMMARY ===' as report;

SELECT 
    COUNT(*) as total_views_to_migrate,
    COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM pg_tables t 
        WHERE t.schemaname = 'public' 
        AND t.rowsecurity = true
    )) as views_with_rls_tables,
    'Review each view definition before migration' as recommendation
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
);

