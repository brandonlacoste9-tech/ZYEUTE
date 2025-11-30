# Supabase Edge Function Schedules

This document provides one-liners and instructions for configuring cron schedules for Edge Functions in the Supabase Dashboard.

## Functions Requiring Schedules

### 1. `refresh_engagement_mvs`
**Purpose:** Refreshes materialized views for engagement metrics  
**Recommended Schedule:** Every 5 minutes  
**Cron Expression:** `*/5 * * * *`

**Dashboard Configuration:**
1. Go to Supabase Dashboard → Edge Functions → `refresh_engagement_mvs`
2. Navigate to "Schedule" tab
3. Add schedule:
   - **Cron:** `*/5 * * * *`
   - **Timezone:** UTC (or your preferred timezone)

**One-liner (via Supabase CLI - if supported):**
```bash
# Note: Schedules may need to be configured via Dashboard
supabase functions set-schedule refresh_engagement_mvs "*/5 * * * *"
```

### 2. `storage-cleanup`
**Purpose:** Processes the storage deletion queue  
**Recommended Schedule:** Every hour  
**Cron Expression:** `0 * * * *`

**Dashboard Configuration:**
1. Go to Supabase Dashboard → Edge Functions → `storage-cleanup`
2. Navigate to "Schedule" tab
3. Add schedule:
   - **Cron:** `0 * * * *`
   - **Timezone:** UTC (or your preferred timezone)

**One-liner (via Supabase CLI - if supported):**
```bash
# Note: Schedules may need to be configured via Dashboard
supabase functions set-schedule storage-cleanup "0 * * * *"
```

## Optional: Daily Health Check

The `daily-health-check` function already exists and may have its own schedule. Verify in Dashboard.

## Verification

After setting schedules, verify in Dashboard:
1. Edge Functions → [Function Name] → Schedule tab
2. Check "Last Run" timestamps
3. Monitor logs for successful executions

## Troubleshooting

If schedules aren't running:
- Check function logs for errors
- Verify cron expression format
- Ensure function has proper environment variables set
- Check Supabase project limits/quotas

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Cron Expression Format](https://crontab.guru/)

