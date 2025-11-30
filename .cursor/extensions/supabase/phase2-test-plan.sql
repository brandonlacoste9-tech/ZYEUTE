-- Phase 2 Test Plan
-- Run these tests after Phase 2 migration to verify everything works

-- ============================================
-- 1. View Accessibility Tests
-- ============================================

-- Test each view can be queried
SELECT 
    'View Accessibility Test' as test_name,
    viewname,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_views v2 
            WHERE v2.schemaname = 'public' 
            AND v2.viewname = v.viewname
        ) THEN '✅ View exists'
        ELSE '❌ View missing'
    END as status
FROM (
    SELECT unnest(ARRAY[
        'publication_engagement_breakdown',
        'trending_publications',
        'top_publications_last_7d',
        'publication_reaction_counts',
        'recent_publications',
        'v_user_profile_feed',
        'v_publication_detail',
        'v_user_counts',
        'v_public_profiles'
    ]) as viewname
) v;

-- ============================================
-- 2. RLS Verification Tests
-- ============================================

-- Test that views respect RLS (if applicable)
-- Run as different user roles to verify

-- Test as authenticated user
SET ROLE authenticated;
SELECT COUNT(*) as test_count FROM public.trending_publications LIMIT 1;
RESET ROLE;

-- Test as service_role
SET ROLE service_role;
SELECT COUNT(*) as test_count FROM public.trending_publications LIMIT 1;
RESET ROLE;

-- ============================================
-- 3. Core Functionality Tests
-- ============================================

-- Test feed queries still work
DO $$
DECLARE
    feed_count int;
BEGIN
    SELECT COUNT(*) INTO feed_count
    FROM public.get_home_feed(10, 0);
    
    IF feed_count >= 0 THEN
        RAISE NOTICE '✅ Feed query works: % rows', feed_count;
    ELSE
        RAISE WARNING '❌ Feed query failed';
    END IF;
END $$;

-- Test notifications still work
DO $$
DECLARE
    health_result record;
BEGIN
    SELECT * INTO health_result
    FROM public.get_notification_health(24);
    
    IF health_result IS NOT NULL THEN
        RAISE NOTICE '✅ Notifications health check works';
    ELSE
        RAISE WARNING '❌ Notifications health check failed';
    END IF;
END $$;

-- ============================================
-- 4. View Query Tests
-- ============================================

-- Test each view returns data (or empty result is OK)
DO $$
DECLARE
    view_name text;
    test_count int;
BEGIN
    FOR view_name IN 
        SELECT unnest(ARRAY[
            'trending_publications',
            'recent_publications',
            'v_user_counts'
        ])
    LOOP
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM public.%I LIMIT 1', view_name) INTO test_count;
            RAISE NOTICE '✅ View % works: % rows', view_name, test_count;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING '❌ View % failed: %', view_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- ============================================
-- 5. Performance Check
-- ============================================

-- Verify views still perform well
EXPLAIN ANALYZE
SELECT * FROM public.trending_publications LIMIT 10;

-- ============================================
-- 6. Summary Report
-- ============================================

SELECT 
    '=== PHASE 2 TEST SUMMARY ===' as report;

SELECT 
    COUNT(*) as total_views_tested,
    COUNT(*) FILTER (WHERE EXISTS (
        SELECT 1 FROM pg_views v2 
        WHERE v2.schemaname = 'public' 
        AND v2.viewname = v.viewname
    )) as views_accessible,
    'All tests should pass' as expectation
FROM (
    SELECT unnest(ARRAY[
        'publication_engagement_breakdown',
        'trending_publications',
        'top_publications_last_7d',
        'publication_reaction_counts',
        'recent_publications',
        'v_user_profile_feed',
        'v_publication_detail',
        'v_user_counts',
        'v_public_profiles'
    ]) as viewname
) v;

