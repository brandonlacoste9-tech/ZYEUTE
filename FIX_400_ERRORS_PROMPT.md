# 🔧 Fix 400 Errors - PostgREST Join Issue

## Problem

Getting 400 errors on queries like:
- `/rest/v1/posts?select=*,user:user_profiles(*)`
- `/rest/v1/stories?select=*,user:user_profiles(*)`

The tables exist, but PostgREST can't perform the joins because the view doesn't expose the foreign key relationship properly.

## Solution

I've created a migration to fix the `posts` view to support PostgREST joins.

## Apply the Fix

### Option 1: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/sql
2. Click "New query"
3. Copy contents of: `supabase/migrations/20250102000001_fix_posts_view_joins.sql`
4. Paste and run

### Option 2: Ask Supabase AI

```
I'm getting 400 errors on PostgREST queries trying to join posts with user_profiles:

/rest/v1/posts?select=*,user:user_profiles(*)

The posts view exists but PostgREST can't perform the join. Please run this SQL to fix it:

[Paste contents of supabase/migrations/20250102000001_fix_posts_view_joins.sql]

This will:
1. Recreate the posts view with proper FK relationship
2. Add comments to help PostgREST understand relationships
3. Fix stories table joins
4. Test that the view works

After running, test the query:
SELECT * FROM posts LIMIT 1;
```

## After Fix

Test your app again - the 400 errors should be gone and queries should return 200.

