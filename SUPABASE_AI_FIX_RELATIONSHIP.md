# Fix PostgREST Relationship Error - Quick Fix

## Error
```
PGRST200: Could not find a relationship between 'notifications' and 'user_profiles' in the schema cache
Hint: Perhaps you meant 'v_user_profile_feed' instead of 'user_profiles'.
```

## What I Need
PostgREST can't find the relationship between `notifications` and `user_profiles`. Please:

1. **Refresh PostgREST schema cache:**
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

2. **Check if FK constraints exist for notifications:**
   ```sql
   SELECT constraint_name, column_name
   FROM information_schema.table_constraints tc
   JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name
   WHERE tc.table_name = 'notifications'
       AND tc.constraint_type = 'FOREIGN KEY'
       AND kcu.column_name IN ('actor_id', 'post_id');
   ```

3. **If FK constraints don't exist, create them:**
   ```sql
   -- For actor_id → user_profiles.id
   ALTER TABLE notifications
   ADD CONSTRAINT notifications_actor_id_fkey
   FOREIGN KEY (actor_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

   -- For post_id → publications.id (posts is a view over publications)
   ALTER TABLE notifications
   ADD CONSTRAINT notifications_post_id_fkey
   FOREIGN KEY (post_id) REFERENCES publications(id) ON DELETE CASCADE;
   ```

4. **Re-add relationship hints (they work better with actual FK constraints):**
   ```sql
   COMMENT ON COLUMN public.notifications.actor_id IS E'@references public.user_profiles(id)';
   COMMENT ON COLUMN public.notifications.post_id IS E'@references public.publications(id)';
   ```

5. **Refresh schema cache again:**
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

6. **Test the query:**
   After refreshing, test if this works:
   ```
   GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:posts!post_id(*)
   ```

## Expected Result
- Schema cache refreshed
- FK constraints exist (or created)
- Relationship hints re-applied
- Query returns 200 OK instead of 400

Please run these steps and let me know if the query works after refreshing the schema cache.

