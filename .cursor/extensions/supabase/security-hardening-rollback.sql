-- Security Hardening - Rollback Script
-- Use this if Phase 1 changes cause issues

-- ============================================
-- Rollback: Restore Access to Materialized Views
-- ============================================

-- Restore anon/authenticated access (if needed)
GRANT SELECT ON TABLE public.top_publications_last_7d_mv TO anon, authenticated;
GRANT SELECT ON TABLE public.trending_publications_mv TO anon, authenticated;

-- ============================================
-- Rollback: Restore Access to v_user_counts
-- ============================================

-- Restore access (if needed)
GRANT SELECT ON TABLE public.v_user_counts TO anon, authenticated;

-- ============================================
-- Rollback: Remove search_path Settings
-- ============================================
-- Note: You cannot "unset" search_path, but you can set it to default
-- Default is typically: "$user", public

-- Reset to default (if needed)
ALTER FUNCTION public.get_home_feed() RESET search_path;
ALTER FUNCTION public.get_user_feed(uuid) RESET search_path;
ALTER FUNCTION public.get_post_detail(uuid) RESET search_path;
ALTER FUNCTION public.react(uuid, text) RESET search_path;
ALTER FUNCTION public.unreact(uuid) RESET search_path;
ALTER FUNCTION public.add_comment(uuid, text) RESET search_path;
ALTER FUNCTION public.broadcast_room_changes() RESET search_path;
ALTER FUNCTION public.publications_broadcast_trigger() RESET search_path;
ALTER FUNCTION public.comments_broadcast_trigger() RESET search_path;
ALTER FUNCTION public.reactions_broadcast_trigger() RESET search_path;
ALTER FUNCTION public.get_notifications(uuid) RESET search_path;
ALTER FUNCTION public.log_notification_event(text, text, uuid, uuid, int, boolean, text, text) RESET search_path;
ALTER FUNCTION public.get_notification_health(int) RESET search_path;
ALTER FUNCTION public.is_not_deleted(timestamptz) RESET search_path;
ALTER FUNCTION public.get_publication_owner(uuid) RESET search_path;
ALTER FUNCTION public.get_setting(text, jsonb) RESET search_path;
ALTER FUNCTION public.smart_notify(text, uuid, uuid, uuid) RESET search_path;
ALTER FUNCTION public.dispatch_notification_via_edge_function(text, uuid, uuid, uuid) RESET search_path;
ALTER FUNCTION public._inc_comments_count() RESET search_path;
ALTER FUNCTION public._dec_comments_count() RESET search_path;
ALTER FUNCTION public._inc_reactions_count() RESET search_path;
ALTER FUNCTION public._dec_reactions_count() RESET search_path;
ALTER FUNCTION public.deduct_credit(uuid, numeric) RESET search_path;
ALTER FUNCTION public.handle_new_user() RESET search_path;

