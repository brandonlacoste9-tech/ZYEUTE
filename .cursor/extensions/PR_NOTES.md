# Pull Request: Supabase Synchronization & Edge Functions Export

## Summary

- **Exported 3 Edge Functions:**
  - `refresh_engagement_mvs`: refreshes engagement MVs; on a 5-min schedule
  - `posts-sharing`: generates signed URLs with follower-only access control
  - `storage-cleanup`: batch deletes files via storage deletion queue

- **Generated TypeScript types** (`src/types/supabase.ts`) for all tables, views, and functions

- **Added full schema export and comparison checklist** for auditing and future diffs

## Verification

- ✅ Edge Functions deploy locally via `supabase start` and `supabase functions serve`
- ✅ Functions compile without external/bare specifier issues; use `Deno.serve`
- ✅ Confirmed env variables are resolved in hosted/runtime (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SERVICE_ROLE`)
- ✅ Types compile in app build
- ✅ RLS policies summarized and cross-checked

## Files Changed

### Edge Functions
- `supabase/functions/refresh_engagement_mvs/index.ts`
- `supabase/functions/posts-sharing/index.ts`
- `supabase/functions/storage-cleanup/index.ts`

### Type Definitions
- `src/types/supabase.ts`

### Documentation
- `SUPABASE_SCHEMA_EXPORT.md` - Complete database schema documentation
- `SUPABASE_COMPARISON_CHECKLIST.md` - Quick reference for PR review

### Configuration
- `.gitignore` - Tightened ignore patterns for generated artifacts

## Follow-ups

- [ ] Set schedules for `refresh_engagement_mvs` and `storage-cleanup` in the Dashboard
- [ ] Configure protected/private Realtime channels where relevant
- [ ] Consider adding CI job: `supabase db lint + typegen` on PRs (see `.github/workflows/supabase-ci.yml`)

## Testing

### Local Edge Function Testing

```bash
# Start local Supabase
supabase start

# Serve edge functions
supabase functions serve

# Test refresh_engagement_mvs
curl -X POST http://localhost:54321/functions/v1/refresh_engagement_mvs \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Test posts-sharing
curl -X POST http://localhost:54321/functions/v1/posts-sharing \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"publication_id": "uuid-here"}'

# Test storage-cleanup
curl -X POST http://localhost:54321/functions/v1/storage-cleanup \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### Type Checking

```bash
# Verify TypeScript types compile
npx tsc --noEmit src/types/supabase.ts
```

## Related Issues

- Closes #[issue-number] - Export missing Edge Functions
- Related to #[issue-number] - Supabase synchronization

