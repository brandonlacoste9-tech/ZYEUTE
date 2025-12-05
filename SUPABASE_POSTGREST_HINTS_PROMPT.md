# PostgREST Relationship Hints - Fix 400 Errors

## Problem
PostgREST is returning 400 errors when trying to join `posts` view with `user_profiles` and `notifications` with `user_profiles`/`posts`. The queries use explicit link syntax but PostgREST can't resolve the relationships.

## Current Queries (from code)
```
GET /rest/v1/posts?select=*,user:user_profiles!user_id(*)&order=created_at.desc&offset=0&limit=20
GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:posts!post_id(*)&user_id=eq.{id}&order=created_at.desc&limit=50
```

## What We Need
Add PostgREST relationship hints so PostgREST can infer the foreign key relationships:

1. **For `posts` view:**
   - `posts.user_id` → `user_profiles.id`
   - The view maps `publications` table, where `publications.user_id` references `auth.users.id`
   - But `user_profiles.id` matches `auth.users.id`, so we need to tell PostgREST about this relationship

2. **For `notifications` table:**
   - `notifications.actor_id` → `user_profiles.id` (not `auth.users`)
   - `notifications.post_id` → `posts.id` (which maps to `publications.id`)

## SQL to Add
Please run these SQL statements to add PostgREST relationship hints:

```sql
-- Fix posts view relationship hints
COMMENT ON VIEW public.posts IS E'@foreignKey (user_id) references public.user_profiles (id)';
COMMENT ON COLUMN public.posts.user_id IS E'@references public.user_profiles(id)';

-- Fix notifications table relationship hints
COMMENT ON COLUMN public.notifications.actor_id IS E'@references public.user_profiles(id)';
COMMENT ON COLUMN public.notifications.post_id IS E'@references public.posts(id)';

-- Fix stories table relationship hints (if needed)
COMMENT ON COLUMN public.stories.user_id IS E'@references public.user_profiles(id)';
```

## Expected Result
After adding these hints, PostgREST should be able to resolve:
- `user:user_profiles!user_id(*)` on `posts` view
- `actor:user_profiles!actor_id(*)` on `notifications` table
- `post:posts!post_id(*)` on `notifications` table
- `user:user_profiles!user_id(*)` on `stories` table

## Verification
After applying, test these queries:
```sql
-- Should return posts with user data
SELECT * FROM posts LIMIT 1;

-- Should return notifications with actor and post data
SELECT * FROM notifications LIMIT 1;
```

Then test the PostgREST endpoints:
- `GET /rest/v1/posts?select=*,user:user_profiles!user_id(*)`
- `GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:posts!post_id(*)`

Both should return 200 OK instead of 400 Bad Request.

