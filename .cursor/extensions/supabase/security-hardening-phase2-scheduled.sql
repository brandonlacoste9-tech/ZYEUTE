-- Security Hardening - Phase 2: Scheduled (Requires Migration Window)
-- These changes require careful planning and may need app updates

-- ============================================
-- IMPORTANT: Review and Test Before Running
-- ============================================
-- 
-- This phase requires:
-- 1. Reviewing each view definition
-- 2. Testing that behavior is preserved
-- 3. Updating any app code that depends on these views
-- 4. Running during a maintenance window
--
-- ============================================

-- ============================================
-- 1. Convert SECURITY DEFINER Views to INVOKER
-- ============================================
-- 
-- Strategy: For each view, we need to:
-- 1. Get the current definition
-- 2. Recreate as SECURITY INVOKER (default)
-- 3. Ensure underlying tables have proper RLS
-- 4. Test that queries still work correctly
--
-- NOTE: This is a template. Review each view definition first!
-- ============================================

-- Example pattern (DO NOT RUN BLINDLY - Review definitions first):
/*
-- Step 1: Get current definition
SELECT pg_get_viewdef('public.trending_publications', true);

-- Step 2: Recreate as INVOKER (remove SECURITY DEFINER)
CREATE OR REPLACE VIEW public.trending_publications
WITH (security_invoker = true)  -- PostgreSQL 15+
AS
SELECT ...;  -- Paste definition from Step 1

-- OR for older PostgreSQL:
DROP VIEW IF EXISTS public.trending_publications CASCADE;
CREATE VIEW public.trending_publications AS
SELECT ...;  -- Same definition, no SECURITY DEFINER
*/

-- ============================================
-- 2. Move pg_trgm Extension to extensions Schema
-- ============================================
-- 
-- This is complex and requires:
-- 1. Identifying all dependencies
-- 2. Creating extension in extensions schema
-- 3. Updating all references
-- 4. Dropping from public
--
-- RECOMMENDATION: Defer this to a dedicated maintenance window
-- ============================================

-- Step 1: Check dependencies
SELECT 
    n.nspname as schema_name,
    t.typname as type_name,
    d.objid::regclass as dependent_object
FROM pg_depend d
JOIN pg_type t ON d.refobjid = t.oid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE t.typname LIKE '%trgm%'
OR d.refobjid = (SELECT oid FROM pg_extension WHERE extname = 'pg_trgm');

-- Step 2: Create in extensions schema (if not exists)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Step 3: Update dependencies (requires careful migration)
-- This is complex - defer to maintenance window

-- ============================================
-- Rollback Plan (if needed)
-- ============================================

-- If views need to be reverted:
/*
-- Recreate as SECURITY DEFINER (if needed)
CREATE OR REPLACE VIEW public.trending_publications
WITH (security_definer = true)
AS
SELECT ...;  -- Original definition
*/

-- ============================================
-- Verification Queries
-- ============================================

-- Check view security settings (PostgreSQL 15+)
SELECT 
    schemaname,
    viewname,
    viewowner,
    -- Check if SECURITY DEFINER (requires pg_catalog query)
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_views 
            WHERE schemaname = v.schemaname 
            AND viewname = v.viewname
        ) THEN 'Check manually'
        ELSE 'Unknown'
    END as security_type
FROM pg_views v
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

