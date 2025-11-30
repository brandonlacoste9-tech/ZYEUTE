-- Test Edge Function Mode
-- Run this AFTER enabling pg_net and configuring environment variables
-- AND setting feature flag to true

-- ============================================
-- Prerequisites Check
-- ============================================

SELECT 
    '=== Prerequisites Check ===' as step;

SELECT 
    'Feature Flag' as check_item,
    CASE 
        WHEN value::text = 'true' THEN '✅ ENABLED'
        ELSE '❌ DISABLED - Enable first!'
    END as status
FROM public.app_settings
WHERE key = 'use_edge_notifications'

UNION ALL

SELECT 
    'pg_net Extension' as check_item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') 
        THEN '✅ INSTALLED'
        ELSE '❌ NOT INSTALLED - Enable in Dashboard!'
    END as status

UNION ALL

SELECT 
    'Environment Variables' as check_item,
    CASE 
        WHEN current_setting('app.supabase_url', true) IS NOT NULL 
        THEN '✅ CONFIGURED'
        ELSE '⚠️ NOT SET - Check configuration'
    END as status;

-- ============================================
-- Test Smart Notify (Edge Function Path)
-- ============================================

DO $$
DECLARE
    test_actor_id uuid;
    test_pub_id uuid;
    test_follower_id uuid;
BEGIN
    -- Get test data
    SELECT id INTO test_actor_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO test_pub_id FROM public.publications WHERE user_id = test_actor_id LIMIT 1;
    SELECT id INTO test_follower_id FROM auth.users WHERE id != test_actor_id LIMIT 1;
    
    IF test_actor_id IS NULL OR test_pub_id IS NULL OR test_follower_id IS NULL THEN
        RAISE NOTICE '⚠️ Need test data - create users and publications first';
        RETURN;
    END IF;
    
    RAISE NOTICE '=== Testing Edge Function Mode ===';
    RAISE NOTICE 'Actor: %', test_actor_id;
    RAISE NOTICE 'Publication: %', test_pub_id;
    RAISE NOTICE 'Follower: %', test_follower_id;
    
    -- Call smart_notify (should route to Edge Function)
    PERFORM public.smart_notify(
        'publication',
        test_actor_id,
        test_pub_id,
        test_follower_id
    );
    
    RAISE NOTICE '✅ smart_notify() called';
    RAISE NOTICE '   Check notification_logs for method = ''edge_function''';
    
END $$;

-- ============================================
-- Verify Edge Function Was Called
-- ============================================

SELECT 
    '=== Edge Function Call Verification ===' as step;

-- Check logs for edge_function method
SELECT 
    event_type,
    notification_type,
    method,
    success,
    error_message,
    created_at
FROM public.notification_logs
WHERE method = 'edge_function'
ORDER BY created_at DESC
LIMIT 10;

-- If no logs, Edge Function might not have been called
-- Check for errors
SELECT 
    'Recent Errors' as check_type,
    COUNT(*)::text || ' errors' as result
FROM public.notification_logs
WHERE success = false
AND created_at > now() - interval '5 minutes';

-- ============================================
-- Health Check
-- ============================================

SELECT 
    '=== Health Metrics (Edge Function Mode) ===' as step,
    total_events,
    successful_events,
    failed_events,
    success_rate,
    edge_function_events,
    direct_insert_events,
    avg_recipients
FROM public.get_notification_health(24);

-- ============================================
-- Summary
-- ============================================

SELECT 
    '=== Test Summary ===' as summary;

SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Edge Function calls detected'
        ELSE '⚠️ No Edge Function calls found - check configuration'
    END as status
FROM public.notification_logs
WHERE method = 'edge_function'
AND created_at > now() - interval '5 minutes';

