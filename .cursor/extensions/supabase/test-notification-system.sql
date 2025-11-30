-- Test Script for Notification System
-- This validates both direct SQL and Edge Function routing

-- ============================================
-- 1. Test Feature Flag System
-- ============================================

-- Check current setting
SELECT 
    'Feature Flag Status' as test,
    key,
    value::text as current_value,
    description
FROM public.app_settings
WHERE key = 'use_edge_notifications';

-- Test get_setting function
SELECT 
    'get_setting() Test' as test,
    public.get_setting('use_edge_notifications')::text as result;

-- ============================================
-- 2. Test Direct SQL Insert (Current Mode)
-- ============================================

-- This simulates what happens when feature flag is false
-- Get a test user and publication
DO $$
DECLARE
    test_user_id uuid;
    test_pub_id uuid;
    test_notification_id uuid;
BEGIN
    -- Get first available user and publication
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    SELECT id INTO test_pub_id FROM public.publications WHERE user_id != test_user_id LIMIT 1;
    
    IF test_user_id IS NULL OR test_pub_id IS NULL THEN
        RAISE NOTICE 'No test data available - create a user and publication first';
        RETURN;
    END IF;
    
    -- Test direct insert (simulating current trigger behavior)
    INSERT INTO public.notifications (
        user_id,
        type,
        entity_id,
        actor_id,
        payload,
        lu
    ) VALUES (
        test_user_id,
        'nouvelle_publication',
        test_pub_id,
        (SELECT user_id FROM public.publications WHERE id = test_pub_id),
        '{"test": true}'::jsonb,
        false
    )
    RETURNING id INTO test_notification_id;
    
    RAISE NOTICE 'Direct insert test: Created notification %', test_notification_id;
    
    -- Clean up test notification
    DELETE FROM public.notifications WHERE id = test_notification_id;
    RAISE NOTICE 'Test notification cleaned up';
END $$;

-- ============================================
-- 3. Test Smart Notify Function
-- ============================================

-- Test smart_notify with feature flag OFF (should be no-op, existing triggers handle it)
DO $$
DECLARE
    test_user_id uuid;
    test_pub_id uuid;
BEGIN
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    SELECT id INTO test_pub_id FROM public.publications LIMIT 1;
    
    IF test_user_id IS NULL OR test_pub_id IS NULL THEN
        RAISE NOTICE 'No test data available';
        RETURN;
    END IF;
    
    -- This should be a no-op when flag is false
    PERFORM public.smart_notify('publication', test_user_id, test_pub_id);
    RAISE NOTICE 'smart_notify() called (feature flag off - no-op expected)';
END $$;

-- ============================================
-- 4. Test Monitoring Functions
-- ============================================

-- Check notification health (last 24 hours)
SELECT 
    'Notification Health (24h)' as test,
    total_events,
    successful_events,
    failed_events,
    success_rate,
    edge_function_events,
    direct_insert_events,
    avg_recipients
FROM public.get_notification_health(24);

-- View recent logs
SELECT 
    'Recent Notification Logs' as test,
    event_type,
    notification_type,
    method,
    success,
    recipient_count,
    error_message,
    created_at
FROM public.notification_logs
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 5. Test Edge Function Helper (Dry Run)
-- ============================================

-- Test get_publication_owner RPC
DO $$
DECLARE
    test_pub_id uuid;
    owner_id uuid;
BEGIN
    SELECT id INTO test_pub_id FROM public.publications LIMIT 1;
    
    IF test_pub_id IS NULL THEN
        RAISE NOTICE 'No publications available for test';
        RETURN;
    END IF;
    
    SELECT public.get_publication_owner(test_pub_id) INTO owner_id;
    RAISE NOTICE 'get_publication_owner() test: Publication % has owner %', test_pub_id, owner_id;
END $$;

-- ============================================
-- 6. Test Logging Function
-- ============================================

-- Test log_notification_event
DO $$
DECLARE
    test_user_id uuid;
    test_pub_id uuid;
BEGIN
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    SELECT id INTO test_pub_id FROM public.publications LIMIT 1;
    
    IF test_user_id IS NULL OR test_pub_id IS NULL THEN
        RAISE NOTICE 'No test data available';
        RETURN;
    END IF;
    
    -- Log a test event
    PERFORM public.log_notification_event(
        'test',
        'nouvelle_publication',
        test_user_id,
        test_pub_id,
        1,
        true,
        'direct_insert',
        NULL
    );
    
    RAISE NOTICE 'Test event logged successfully';
    
    -- Clean up test log
    DELETE FROM public.notification_logs 
    WHERE event_type = 'test' 
    AND created_at > now() - interval '1 minute';
END $$;

-- ============================================
-- 7. Summary Report
-- ============================================

SELECT 
    '=== NOTIFICATION SYSTEM TEST SUMMARY ===' as summary;

SELECT 
    'Feature Flag' as component,
    value::text as status
FROM public.app_settings
WHERE key = 'use_edge_notifications';

SELECT 
    'pg_net Extension' as component,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') 
        THEN 'INSTALLED' 
        ELSE 'NOT INSTALLED (Enable in Dashboard)' 
    END as status;

SELECT 
    'Notification Logs' as component,
    COUNT(*)::text || ' total logs' as status
FROM public.notification_logs;

SELECT 
    'Health Metrics (24h)' as component,
    COALESCE(total_events::text, '0') || ' events, ' || 
    COALESCE(success_rate::text, '0') || '% success' as status
FROM public.get_notification_health(24);

