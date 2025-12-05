# Fix PostgREST Relationship Error

## Error
```
PGRST200: Could not find a relationship between 'notifications' and 'user_profiles' in the schema cache
Hint: Perhaps you meant 'v_user_profile_feed' instead of 'user_profiles'.
```

## Problem
PostgREST's schema cache doesn't recognize the relationship hints we added. This could be because:
1. PostgREST schema cache needs to be refreshed
2. The `user_profiles` table might not be exposed to PostgREST
3. The FK constraint doesn't exist or isn't recognized

## Solutions to Try

### Option 1: Refresh PostgREST Schema Cache
PostgREST caches the schema. After adding relationship hints, we need to refresh it:

```sql
-- This will trigger a schema cache refresh
NOTIFY pgrst, 'reload schema';
```

Or restart PostgREST (if you have access to the Supabase dashboard, there might be a "Reload Schema" button).

### Option 2: Verify user_profiles Table Exists and is Exposed
Check if `user_profiles` table exists and is in the `public` schema:

```sql
-- Check if table exists
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- Check if it's exposed to PostgREST (should be in public schema)
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename = 'user_profiles';
```

### Option 3: Check Actual FK Constraints
Verify the FK constraints exist:

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
    AND kcu.column_name = 'actor_id';
```

### Option 4: Use FK Constraint Names Directly
If the hints aren't working, we might need to use the actual FK constraint name in the query. First, find the constraint name:

```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'notifications' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%actor%';
```

Then use it in the query: `actor:user_profiles!{constraint_name}(*)`

### Option 5: Check if user_profiles is a View
The hint suggests `v_user_profile_feed` - maybe `user_profiles` is actually a view? Check:

```sql
SELECT table_type 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';
```

If it's a view, we might need to reference it differently or create a proper FK.

## Recommended Action
1. First, refresh PostgREST schema cache: `NOTIFY pgrst, 'reload schema';`
2. Verify `user_profiles` table exists and is in `public` schema
3. Check FK constraints exist
4. If still failing, get the actual FK constraint names and use them in the code

