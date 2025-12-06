# 🔴 RLS Policy Troubleshooting Guide

## Issue
Signup is getting `"permission denied for table user_profiles"` even though policy was supposedly created.

## Step 1: Verify Policy Exists

Run this in Supabase SQL Editor:

```sql
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles' 
  AND cmd = 'INSERT';
```

**Expected:** Should see policy `"Users can insert their own profile"` with `WITH CHECK (auth.uid() = id)`

**If empty:** Policy doesn't exist → Go to Step 2

**If exists but not working:** Go to Step 3

---

## Step 2: Apply Complete Fix

Run the **ENTIRE** script from `FIX_RLS_POLICY_COMPLETE.sql`:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire contents of `FIX_RLS_POLICY_COMPLETE.sql`
4. Paste and run
5. Should see: `✅ INSERT policy created successfully`

---

## Step 3: Check for Other Issues

### Issue A: Policy exists but WITH CHECK is wrong

**Check:**
```sql
SELECT with_check FROM pg_policies 
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';
```

**Should be:** `(auth.uid() = id)` or `((SELECT auth.uid()) = id)`

**If different:** Re-run `FIX_RLS_POLICY_COMPLETE.sql`

### Issue B: RLS not enabled

**Check:**
```sql
SELECT rowsecurity FROM pg_tables 
WHERE tablename = 'user_profiles';
```

**Should be:** `true`

**If false:** Run `ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`

### Issue C: Permissions not granted

**Check:**
```sql
SELECT privilege_type FROM information_schema.role_table_grants
WHERE table_name = 'user_profiles' 
  AND grantee = 'authenticated';
```

**Should include:** `INSERT`, `SELECT`, `UPDATE`

**If missing:** Run grants from `FIX_RLS_POLICY_COMPLETE.sql`

---

## Step 4: Test the Policy

After applying fix, test signup:

1. Go to `https://zyeute.netlify.app/signup`
2. Enter test credentials
3. Submit form
4. **Expected:** Success, redirect to login
5. **If error:** Check browser console for exact error message

---

## Step 5: Manual Test User (Workaround)

If RLS still won't work, create a manual test user:

### Via Supabase Dashboard:

1. **Create Auth User:**
   - Go to Authentication → Users → Add user
   - Email: `comet_test@zyeute.com`
   - Password: `Test123456!`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"
   - **Copy the User ID** (UUID)

2. **Create Profile:**
   - Go to SQL Editor
   - Run:
   ```sql
   INSERT INTO public.user_profiles (
     id, username, display_name, email, created_at, updated_at
   )
   VALUES (
     'PASTE_USER_ID_HERE', -- Replace with UUID from step 1
     'comet_test',
     'Comet Test User',
     'comet_test@zyeute.com',
     NOW(),
     NOW()
   );
   ```

3. **Test Login:**
   - Go to `https://zyeute.netlify.app/login`
   - Email: `comet_test@zyeute.com`
   - Password: `Test123456!`
   - Should login successfully

---

## Common Issues

### Issue: "Policy exists but signup still fails"

**Possible causes:**
1. Policy `WITH CHECK` clause is wrong
2. User ID doesn't match `auth.uid()` during insert
3. Another policy is blocking (check all policies)

**Solution:** Re-run `FIX_RLS_POLICY_COMPLETE.sql` which drops and recreates all policies

### Issue: "Can't insert even with service role"

**Possible causes:**
1. Table doesn't exist
2. Wrong schema (`public.user_profiles` vs `user_profiles`)
3. Column names don't match

**Solution:** Verify table exists:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'user_profiles';
```

---

## Quick Fix (Copy-Paste Ready)

If you just want to fix it quickly, run this:

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);
GRANT INSERT, SELECT, UPDATE ON public.user_profiles TO authenticated;
```

Then verify:
```sql
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';
```

---

## Status Check

After applying fix, run verification:

```sql
-- Check policy exists
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';

-- Check RLS enabled
SELECT rowsecurity FROM pg_tables WHERE tablename = 'user_profiles';

-- Check permissions
SELECT privilege_type FROM information_schema.role_table_grants
WHERE table_name = 'user_profiles' AND grantee = 'authenticated';
```

**All should return positive results.**

---

**Last Updated:** After RLS policy issue  
**Status:** Troubleshooting guide ready

