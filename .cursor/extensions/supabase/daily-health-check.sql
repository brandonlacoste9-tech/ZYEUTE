-- Daily Security & Health Check
-- Run this daily to verify system health and security posture
-- Can be scheduled via pg_cron, Edge Function, or external job

-- ============================================
-- 1. Security Checks
-- ============================================

-- Check 1: Verify no public access to sensitive views
SELECT 
    'Security Check: Exposed Views' as check_name,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASS - No exposed views'
        ELSE '⚠️ WARN - ' || COUNT(*)::text || ' views accessible to anon/auth'
    END as status,
    string_agg(viewname, ', ') as details
FROM (
    SELECT viewname
    FROM pg_views
    WHERE schemaname = 'public'
    AND viewname IN ('v_user_counts')
    AND (
        has_table_privilege('anon', format('public.%I', viewname), 'SELECT')
        OR has_table_privilege('authenticated', format('public.%I', viewname), 'SELECT')
    )
) exposed_views

UNION ALL

-- Check 2: Verify RLS enabled on user-facing tables
SELECT 
    'Security Check: RLS Enabled' as check_name,
    CASE 
        WHEN COUNT(*) = COUNT(*) FILTER (WHERE rowsecurity = true) 
        THEN '✅ PASS - All tables have RLS'
        ELSE '⚠️ WARN - ' || (COUNT(*) - COUNT(*) FILTER (WHERE rowsecurity = true))::text || ' tables missing RLS'
    END as status,
    string_agg(tablename, ', ') FILTER (WHERE rowsecurity = false) as details
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'publications',
    'commentaires',
    'reactions',
    'abonnements',
    'notifications',
    'user_profiles',
    'signalements'
)

UNION ALL

-- Check 3: Verify function search_path is set
SELECT 
    'Security Check: Function search_path' as check_name,
    CASE 
        WHEN COUNT(*) FILTER (WHERE p.proconfig IS NULL OR array_to_string(p.proconfig, ', ') NOT LIKE '%search_path%') = 0
        THEN '✅ PASS - All critical functions hardened'
        ELSE '⚠️ WARN - ' || COUNT(*) FILTER (WHERE p.proconfig IS NULL OR array_to_string(p.proconfig, ', ') NOT LIKE '%search_path%')::text || ' functions need search_path'
    END as status,
    string_agg(p.proname, ', ') FILTER (WHERE p.proconfig IS NULL OR array_to_string(p.proconfig, ', ') NOT LIKE '%search_path%') as details
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE (n.nspname, p.proname) IN (
    ('public', 'get_home_feed'),
    ('public', 'get_notifications'),
    ('public', 'log_notification_event'),
    ('public', 'smart_notify'),
    ('public', 'add_comment'),
    ('public', 'react')
)

UNION ALL

-- ============================================
-- 2. Notifications Health Checks
-- ============================================

-- Check 4: Notifications pipeline health
SELECT 
    'Health Check: Notifications (24h)' as check_name,
    CASE 
        WHEN success_rate >= 95 THEN '✅ PASS - ' || success_rate::text || '% success rate'
        WHEN success_rate >= 90 THEN '⚠️ WARN - ' || success_rate::text || '% success rate (below 95%)'
        ELSE '❌ FAIL - ' || success_rate::text || '% success rate (critical)'
    END as status,
    'Total: ' || total_events::text || ', Success: ' || successful_events::text || ', Failed: ' || failed_events::text as details
FROM public.get_notification_health(24)

UNION ALL

-- Check 5: Recent notification errors
SELECT 
    'Health Check: Recent Errors' as check_name,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ PASS - No errors in last hour'
        WHEN COUNT(*) < 5 THEN '⚠️ WARN - ' || COUNT(*)::text || ' errors in last hour'
        ELSE '❌ FAIL - ' || COUNT(*)::text || ' errors in last hour (critical)'
    END as status,
    string_agg(DISTINCT error_message, '; ') FILTER (WHERE error_message IS NOT NULL) as details
FROM public.notification_logs
WHERE success = false
AND created_at > now() - interval '1 hour'

UNION ALL

-- ============================================
-- 3. System Health Checks
-- ============================================

-- Check 6: Feature flag status
SELECT 
    'System Check: Feature Flag' as check_name,
    CASE 
        WHEN value::text = 'false' THEN '✅ PASS - SQL mode active'
        WHEN value::text = 'true' THEN '⚠️ INFO - Edge Function mode active'
        ELSE '⚠️ WARN - Unknown flag value'
    END as status,
    'Current value: ' || value::text as details
FROM public.app_settings
WHERE key = 'use_edge_notifications'

UNION ALL

-- Check 7: Notification logs table health
SELECT 
    'System Check: Logs Table' as check_name,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS - ' || COUNT(*)::text || ' logs in last 24h'
        ELSE '⚠️ WARN - No logs in last 24h'
    END as status,
    'Oldest log: ' || COALESCE(MIN(created_at)::text, 'N/A') as details
FROM public.notification_logs
WHERE created_at > now() - interval '24 hours';

-- ============================================
-- Summary Report
-- ============================================

SELECT 
    '=== DAILY HEALTH CHECK SUMMARY ===' as report;

SELECT 
    COUNT(*) FILTER (WHERE status LIKE '✅%') as passed_checks,
    COUNT(*) FILTER (WHERE status LIKE '⚠️%') as warnings,
    COUNT(*) FILTER (WHERE status LIKE '❌%') as failures,
    COUNT(*) as total_checks
FROM (
    -- Re-run checks for summary
    SELECT status FROM (
        -- Security checks
        SELECT CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '⚠️ WARN' END as status
        FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_user_counts'
        AND (has_table_privilege('anon', format('public.%I', viewname), 'SELECT')
             OR has_table_privilege('authenticated', format('public.%I', viewname), 'SELECT'))
        
        UNION ALL
        
        SELECT CASE WHEN COUNT(*) = COUNT(*) FILTER (WHERE rowsecurity = true) THEN '✅ PASS' ELSE '⚠️ WARN' END
        FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('publications', 'commentaires', 'reactions', 'abonnements', 'notifications', 'user_profiles')
        
        UNION ALL
        
        -- Health checks
        SELECT CASE WHEN success_rate >= 95 THEN '✅ PASS' WHEN success_rate >= 90 THEN '⚠️ WARN' ELSE '❌ FAIL' END
        FROM public.get_notification_health(24)
    ) checks
) summary;

