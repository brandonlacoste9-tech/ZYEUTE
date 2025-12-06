# Confirmation for Supabase AI

## ✅ YES to Both Changes

**1. Repoint `notifications.actor_id` to `public.user_profiles(id)`**
   - Please change the FK from `auth.users(id)` to `public.user_profiles(id)`
   - This matches what our code expects
   - Safe because `user_profiles.id` matches `auth.users.id`

**2. Update `post_id` hint to `publications`**
   - Please update the column comment from `@references public.posts(id)` to `@references public.publications(id)`
   - This matches the actual FK constraint which points to `publications`

## After You Apply Changes

Please:
1. Apply the FK change for `actor_id`
2. Update the `post_id` hint
3. Reload schema cache: `NOTIFY pgrst, 'reload schema';`
4. Test: `GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:publications!post_id(*)`

## Expected Result

After these changes, the query should return 200 OK instead of 400.

Thank you!

