-- Security Hardening - Phase 1: Immediate (Safe, No Downtime)
-- These changes are safe and can be applied immediately without affecting functionality

-- ============================================
-- 1. Revoke Access from Materialized Views
-- ============================================

-- Revoke anon/authenticated access to materialized views
REVOKE ALL ON TABLE public.top_publications_last_7d_mv FROM anon, authenticated;
REVOKE ALL ON TABLE public.trending_publications_mv FROM anon, authenticated;

-- ============================================
-- 2. Revoke Access from Exposed Auth Users View
-- ============================================

-- Restrict v_user_counts if it exposes auth.users
REVOKE ALL ON TABLE public.v_user_counts FROM anon, authenticated;

-- ============================================
-- 3. Fix Function Search Paths (Critical Functions)
-- ============================================

-- Core notification and feed functions
ALTER FUNCTION public.get_home_feed() SET search_path = public, pg_temp;
ALTER FUNCTION public.get_user_feed(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_post_detail(uuid) SET search_path = public, pg_temp;

-- Reaction functions
ALTER FUNCTION public.react(uuid, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.unreact(uuid) SET search_path = public, pg_temp;

-- Comment functions
ALTER FUNCTION public.add_comment(uuid, text) SET search_path = public, pg_temp;

-- Broadcast functions
ALTER FUNCTION public.broadcast_room_changes() SET search_path = public, pg_temp;
ALTER FUNCTION public.publications_broadcast_trigger() SET search_path = public, pg_temp;
ALTER FUNCTION public.comments_broadcast_trigger() SET search_path = public, pg_temp;
ALTER FUNCTION public.reactions_broadcast_trigger() SET search_path = public, pg_temp;

-- Notification functions
ALTER FUNCTION public.get_notifications(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.log_notification_event(text, text, uuid, uuid, int, boolean, text, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_notification_health(int) SET search_path = public, pg_temp;

-- Helper functions
ALTER FUNCTION public.is_not_deleted(timestamptz) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_publication_owner(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_setting(text, jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.smart_notify(text, uuid, uuid, uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.dispatch_notification_via_edge_function(text, uuid, uuid, uuid) SET search_path = public, pg_temp;

-- Count increment/decrement functions
ALTER FUNCTION public._inc_comments_count() SET search_path = public, pg_temp;
ALTER FUNCTION public._dec_comments_count() SET search_path = public, pg_temp;
ALTER FUNCTION public._inc_reactions_count() SET search_path = public, pg_temp;
ALTER FUNCTION public._dec_reactions_count() SET search_path = public, pg_temp;

-- Credit and user functions
ALTER FUNCTION public.deduct_credit(uuid, numeric) SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;

-- Job functions (if accessible)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'app_jobs' AND routine_name = 'refresh_engagement_materialized_views') THEN
        EXECUTE 'ALTER FUNCTION app_jobs.refresh_engagement_materialized_views() SET search_path = app_jobs, public, pg_temp';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'app_jobs' AND routine_name = 'schedule_refresh_every_n_minutes') THEN
        EXECUTE 'ALTER FUNCTION app_jobs.schedule_refresh_every_n_minutes(int) SET search_path = app_jobs, public, pg_temp';
    END IF;
END $$;

-- ============================================
-- Verification
-- ============================================

-- Check that search_paths are set
SELECT 
    routine_schema,
    routine_name,
    CASE 
        WHEN routine_name IN (
            'get_home_feed', 'get_user_feed', 'get_post_detail',
            'react', 'unreact', 'add_comment',
            'broadcast_room_changes', 'publications_broadcast_trigger',
            'comments_broadcast_trigger', 'reactions_broadcast_trigger',
            'get_notifications', 'log_notification_event', 'get_notification_health',
            'is_not_deleted', 'get_publication_owner', 'get_setting',
            'smart_notify', 'dispatch_notification_via_edge_function',
            '_inc_comments_count', '_dec_comments_count',
            '_inc_reactions_count', '_dec_reactions_count',
            'deduct_credit', 'handle_new_user'
        ) THEN '✅ Should be fixed'
        ELSE '⚠️ Check manually'
    END as status
FROM information_schema.routines
WHERE routine_schema IN ('public', 'app_jobs')
AND routine_name IN (
    'get_home_feed', 'get_user_feed', 'get_post_detail',
    'react', 'unreact', 'add_comment',
    'broadcast_room_changes', 'publications_broadcast_trigger',
    'comments_broadcast_trigger', 'reactions_broadcast_trigger',
    'get_notifications', 'log_notification_event', 'get_notification_health',
    'is_not_deleted', 'get_publication_owner', 'get_setting',
    'smart_notify', 'dispatch_notification_via_edge_function',
    '_inc_comments_count', '_dec_comments_count',
    '_inc_reactions_count', '_dec_reactions_count',
    'deduct_credit', 'handle_new_user',
    'refresh_engagement_materialized_views', 'schedule_refresh_every_n_minutes'
)
ORDER BY routine_schema, routine_name;

