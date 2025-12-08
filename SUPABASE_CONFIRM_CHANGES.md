# Confirm Database Changes for PostgREST Fix

## Confirmation Required

Please tell Supabase AI:

**YES to both:**

1. **Repoint `notifications.actor_id` to `public.user_profiles(id)`**
   - Current: `notifications.actor_id` → `auth.users(id)`
   - Change to: `notifications.actor_id` → `public.user_profiles(id)`
   - Reason: Our code expects to join with `user_profiles` table, not `auth.users`
   - Safe: Yes, because `user_profiles.id` matches `auth.users.id`

2. **Update `post_id` hint to `publications`**
   - Current hint: `@references public.posts(id)` (wrong - posts is a view)
   - Change to: `@references public.publications(id)` (matches actual FK)
   - Reason: The FK constraint points to `publications`, not `posts` view
   - Note: We can still use `posts` in REST queries if the view has proper hints

## What Supabase AI Will Do

After confirmation:
1. Drop and recreate `notifications_actor_id_fkey` to point to `user_profiles`
2. Update `post_id` column comment to reference `publications`
3. Reload PostgREST schema cache
4. Provide working REST query examples

## Expected Result

After changes:
- `GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:publications!post_id(*)` should work
- Or we can use `posts` view if it has proper hints: `post:posts!post_id(*)`

