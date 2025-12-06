# Refresh PostgREST Schema Cache & Verify FK Constraints

## Problem
PostgREST is returning `PGRST200: Could not find a relationship between 'notifications' and 'user_profiles' in the schema cache`. This means PostgREST's schema cache hasn't picked up the relationship hints we added.

## Solution Steps

### Step 1: Refresh PostgREST Schema Cache
PostgREST caches the database schema. After adding relationship hints, we need to force a refresh:

```sql
-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
```

**Note:** If this doesn't work, you may need to restart PostgREST from the Supabase dashboard (Settings → API → Restart PostgREST) or wait a few minutes for auto-refresh.

### Step 2: Verify FK Constraints Exist
Check if the FK constraints actually exist (not just comments):

```sql
-- Check notifications FK constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'notifications'
ORDER BY kcu.column_name;
```

### Step 3: Create FK Constraints if Missing
If the FK constraints don't exist, create them:

```sql
-- Add FK constraint for notifications.actor_id → user_profiles.id
-- (Only if it doesn't already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_actor_id_fkey'
        AND table_name = 'notifications'
    ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_actor_id_fkey
        FOREIGN KEY (actor_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add FK constraint for notifications.post_id → posts (via publications)
-- Note: posts is a view, so we reference publications.id instead
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_post_id_fkey'
        AND table_name = 'notifications'
    ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_post_id_fkey
        FOREIGN KEY (post_id) REFERENCES publications(id) ON DELETE CASCADE;
    END IF;
END $$;
```

### Step 4: Verify user_profiles Table is Accessible
Make sure PostgREST can see the table:

```sql
-- Check table exists and is in public schema
SELECT table_schema, table_name, table_type
FROM information_schema.tables
WHERE table_name = 'user_profiles';

-- Should return: public | user_profiles | BASE TABLE
```

### Step 5: Re-add Relationship Hints (After FK Constraints)
Once FK constraints exist, re-add the hints:

```sql
-- Re-add relationship hints (they work better with actual FK constraints)
COMMENT ON COLUMN public.notifications.actor_id IS E'@references public.user_profiles(id)';
COMMENT ON COLUMN public.notifications.post_id IS E'@references public.publications(id)';

-- Refresh schema cache again
NOTIFY pgrst, 'reload schema';
```

## Expected Result
After refreshing the schema cache and ensuring FK constraints exist:
- `GET /rest/v1/notifications?select=*,actor:user_profiles!actor_id(*),post:posts!post_id(*)` should return 200 OK
- PostgREST should recognize the relationships

## If Still Failing
If it still fails after refreshing, try using FK constraint names directly in the code:
- `actor:user_profiles!notifications_actor_id_fkey(*)`
- `post:posts!notifications_post_id_fkey(*)`

But first, let's get the actual constraint names from Step 2.

