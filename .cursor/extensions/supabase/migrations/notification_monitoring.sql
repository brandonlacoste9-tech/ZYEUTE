-- Notification monitoring and logging
-- This creates a simple log table and helper functions for tracking notification health

-- Create notification_logs table for monitoring
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  notification_type text,
  actor_id uuid,
  entity_id uuid,
  recipient_count int,
  success boolean NOT NULL,
  method text NOT NULL, -- 'direct_insert' or 'edge_function'
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write logs
CREATE POLICY "notification_logs_service_only" ON public.notification_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON public.notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_success ON public.notification_logs(success, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON public.notification_logs(event_type, created_at DESC);

-- Helper function to log notification events
CREATE OR REPLACE FUNCTION public.log_notification_event(
  p_event_type text,
  p_notification_type text,
  p_actor_id uuid,
  p_entity_id uuid,
  p_recipient_count int,
  p_success boolean,
  p_method text,
  p_error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_logs (
    event_type,
    notification_type,
    actor_id,
    entity_id,
    recipient_count,
    success,
    method,
    error_message
  ) VALUES (
    p_event_type,
    p_notification_type,
    p_actor_id,
    p_entity_id,
    p_recipient_count,
    p_success,
    p_method,
    p_error_message
  );
END;
$$;

-- Function to get notification health metrics
CREATE OR REPLACE FUNCTION public.get_notification_health(
  p_hours int DEFAULT 24
)
RETURNS TABLE (
  total_events bigint,
  successful_events bigint,
  failed_events bigint,
  success_rate numeric,
  edge_function_events bigint,
  direct_insert_events bigint,
  avg_recipients numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_events,
    COUNT(*) FILTER (WHERE success = true)::bigint as successful_events,
    COUNT(*) FILTER (WHERE success = false)::bigint as failed_events,
    ROUND(
      (COUNT(*) FILTER (WHERE success = true)::numeric / NULLIF(COUNT(*), 0) * 100),
      2
    ) as success_rate,
    COUNT(*) FILTER (WHERE method = 'edge_function')::bigint as edge_function_events,
    COUNT(*) FILTER (WHERE method = 'direct_insert')::bigint as direct_insert_events,
    ROUND(AVG(recipient_count), 2) as avg_recipients
  FROM public.notification_logs
  WHERE created_at >= now() - (p_hours || ' hours')::interval;
END;
$$;

-- Function to clean up old logs (retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_notification_logs(
  p_days_to_keep int DEFAULT 30
)
RETURNS TABLE(deleted_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted bigint;
BEGIN
  DELETE FROM public.notification_logs
  WHERE created_at < now() - (p_days_to_keep || ' days')::interval;
  
  GET DIAGNOSTICS deleted = ROW_COUNT;
  
  RETURN QUERY SELECT deleted;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_notification_event(text, text, uuid, uuid, int, boolean, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_notification_health(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_notification_logs(int) TO service_role;

