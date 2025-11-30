-- Rollback to SQL-Only Mode
-- Use this if you enabled Edge Function mode and want to revert

-- Disable Edge Function routing
UPDATE public.app_settings
SET value = 'false'::jsonb,
    updated_at = now()
WHERE key = 'use_edge_notifications';

-- Verify
SELECT 
    'Rollback Complete' as status,
    key,
    value::text as current_value,
    'SQL Mode Active' as mode
FROM public.app_settings
WHERE key = 'use_edge_notifications';

-- Note: Existing SQL triggers continue to work automatically
-- No other changes needed

