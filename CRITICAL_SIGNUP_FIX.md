# 🔴 CRITICAL: Signup RLS Permission Fix

## Issue
**Error:** `"permission denied for table user_profiles"`  
**Impact:** No new users can sign up - signup flow is completely broken

## Root Cause
The Row Level Security (RLS) policy on `user_profiles` table is blocking INSERT operations during signup. When a new user signs up:
1. ✅ Supabase auth creates the user account
2. ❌ Code tries to insert profile into `user_profiles` table
3. ❌ RLS policy blocks the INSERT → signup fails

## Solution
Created migration `008_fix_signup_rls_critical.sql` that:
- Ensures RLS is enabled
- Creates INSERT policy: "Users can insert their own profile"
- Policy allows authenticated users to create their own profile (with `auth.uid() = id`)
- Grants necessary permissions

## How to Apply Fix

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire contents of `supabase/migrations/008_fix_signup_rls_critical.sql`
4. Paste into SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify success message: `✅ INSERT policy created successfully`

### Option 2: Via Supabase CLI
```bash
supabase db push
```

### Option 3: Manual SQL Execution
Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create INSERT policy
CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT INSERT ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO authenticated;
GRANT UPDATE ON user_profiles TO authenticated;
```

## Verification

After applying the fix, test signup:

1. Go to `https://zyeute.netlify.app/signup`
2. Enter username, email, password
3. Click "Créer mon compte"
4. ✅ Should succeed without "permission denied" error
5. ✅ Profile should be created in `user_profiles` table

## Security Note

The policy is secure:
- Users can ONLY insert profiles with `id = auth.uid()`
- They cannot create profiles for other users
- Only authenticated users can insert (not anonymous)

## Files Changed

- ✅ Created: `supabase/migrations/008_fix_signup_rls_critical.sql`
- ✅ Created: `CRITICAL_SIGNUP_FIX.md` (this file)

## Status

- ⏳ **PENDING:** Migration needs to be run in production Supabase
- ✅ **READY:** Migration file created and tested
- 🔴 **CRITICAL:** Signup is broken until this is applied

---

**Next Steps:**
1. Apply migration to production Supabase
2. Test signup flow
3. Verify Comet can complete golden path tests

