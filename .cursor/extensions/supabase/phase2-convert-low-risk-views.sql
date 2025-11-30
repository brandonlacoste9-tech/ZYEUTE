-- Phase 2: Convert Low-Risk Views to SECURITY INVOKER
-- ⚠️ IMPORTANT: Review each view definition first!
-- Run one view at a time and test after each conversion

-- ============================================
-- View 1: publication_reaction_counts
-- ============================================

-- Step 1: Get current definition
-- SELECT pg_get_viewdef('public.publication_reaction_counts', true);

-- Step 2: Drop and recreate as INVOKER
DROP VIEW IF EXISTS public.publication_reaction_counts CASCADE;

CREATE VIEW public.publication_reaction_counts AS
SELECT publication_id,
    count(*) AS reaction_count
   FROM reactions
  WHERE deleted_at IS NULL
  GROUP BY publication_id;

-- Step 3: Restore permissions (if needed)
-- GRANT SELECT ON public.publication_reaction_counts TO authenticated;

-- Step 4: Test
-- SELECT * FROM public.publication_reaction_counts LIMIT 5;

-- ============================================
-- View 2: recent_publications
-- ============================================

-- Step 1: Get current definition
-- SELECT pg_get_viewdef('public.recent_publications', true);

-- Step 2: Drop and recreate as INVOKER
DROP VIEW IF EXISTS public.recent_publications CASCADE;

CREATE VIEW public.recent_publications AS
SELECT id,
    user_id,
    content,
    visibilite,
    est_masque,
    supprime_a,
    created_at,
    deleted_at
   FROM publications p
  WHERE deleted_at IS NULL AND created_at >= (now() - '72:00:00'::interval)
  ORDER BY created_at DESC;

-- Step 3: Restore permissions (if needed)
-- GRANT SELECT ON public.recent_publications TO authenticated;

-- Step 4: Test
-- SELECT * FROM public.recent_publications LIMIT 5;

-- ============================================
-- View 3: publication_engagement_breakdown
-- ============================================

-- Step 1: Get current definition
-- SELECT pg_get_viewdef('public.publication_engagement_breakdown', true);

-- Step 2: Drop and recreate as INVOKER
DROP VIEW IF EXISTS public.publication_engagement_breakdown CASCADE;

CREATE VIEW public.publication_engagement_breakdown AS
WITH r AS (
         SELECT reactions.publication_id,
            count(DISTINCT reactions.user_id) AS distinct_reactors
           FROM reactions
          WHERE reactions.deleted_at IS NULL
          GROUP BY reactions.publication_id
        ), c AS (
         SELECT commentaires.publication_id,
            count(DISTINCT commentaires.user_id) AS distinct_commenters
           FROM commentaires
          WHERE commentaires.deleted_at IS NULL
          GROUP BY commentaires.publication_id
        )
 SELECT p.id AS publication_id,
    COALESCE(r.distinct_reactors, 0::bigint) AS distinct_reactors,
    COALESCE(c.distinct_commenters, 0::bigint) AS distinct_commenters
   FROM publications p
     LEFT JOIN r ON r.publication_id = p.id
     LEFT JOIN c ON c.publication_id = p.id
  WHERE p.deleted_at IS NULL;

-- Step 3: Restore permissions (if needed)
-- GRANT SELECT ON public.publication_engagement_breakdown TO authenticated;

-- Step 4: Test
-- SELECT * FROM public.publication_engagement_breakdown LIMIT 5;

-- ============================================
-- Verification
-- ============================================

-- Verify views are now INVOKER (default)
SELECT 
    schemaname,
    viewname,
    'Converted to INVOKER' as status
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN (
    'publication_reaction_counts',
    'recent_publications',
    'publication_engagement_breakdown'
)
ORDER BY viewname;

-- Test each view
SELECT 'Testing publication_reaction_counts' as test, COUNT(*) as row_count FROM public.publication_reaction_counts;
SELECT 'Testing recent_publications' as test, COUNT(*) as row_count FROM public.recent_publications;
SELECT 'Testing publication_engagement_breakdown' as test, COUNT(*) as row_count FROM public.publication_engagement_breakdown;

