# 🚀 Execute Both Fixes - Step-by-Step Guide

## ⏱️ Total Time: ~3 minutes

This guide combines both fixes so Comet can test immediately while signup works for everyone.

---

## Step 1: Fix RLS Policy (1 minute)

### Action:
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New query"**
3. Copy-paste this **ENTIRE** block:

```sql
-- Fix RLS Policy for Signup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

GRANT INSERT, SELECT, UPDATE ON public.user_profiles TO authenticated;
```

4. Click **"Run"** (or press `Ctrl+Enter`)
5. ✅ Should see: **"Success. No rows returned"**

### Verify (optional):
```sql
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'user_profiles' AND cmd = 'INSERT';
```
Should show: `"Users can insert their own profile" | INSERT`

---

## Step 2: Create Manual Test User (2 minutes)

### Part A: Create Auth User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email:** `comet_test@zyeute.com`
   - **Password:** `Test123456!`
   - ✅ **Check "Auto Confirm User"** (important!)
4. Click **"Create user"**
5. **Copy the User ID** (UUID) - you'll need it in Part B

### Part B: Create Profile

1. Go back to **SQL Editor**
2. Click **"New query"**
3. Copy-paste this (replace `PASTE_USER_ID_HERE` with UUID from Part A):

```sql
-- Create profile for Comet test user
INSERT INTO public.user_profiles (
  id,
  username,
  display_name,
  email,
  created_at,
  updated_at
)
VALUES (
  'PASTE_USER_ID_HERE', -- Replace with UUID from Authentication → Users
  'comet_test',
  'Comet Test User',
  'comet_test@zyeute.com',
  NOW(),
  NOW()
);
```

4. Replace `'PASTE_USER_ID_HERE'` with the actual UUID
5. Click **"Run"**
6. ✅ Should see: **"Success. 1 row inserted"**

---

## Step 3: Verify Test User Works

1. Go to `https://zyeute.netlify.app/login`
2. Enter:
   - **Email:** `comet_test@zyeute.com`
   - **Password:** `Test123456!`
3. Click **"Se connecter"**
4. ✅ Should login successfully and see feed

---

## ✅ Done!

**Tell Comet:** "Test user ready — proceed with golden path validation"

**Test Credentials:**
- Email: `comet_test@zyeute.com`
- Password: `Test123456!`

---

## What This Accomplishes

| Fix | Impact |
|-----|--------|
| **RLS Policy** | Signup works for all new users |
| **Manual Test User** | Comet can test immediately |

**Result:** Signup fixed + Testing can proceed = **Best of both worlds** ✅

---

## Troubleshooting

### If RLS fix fails:
- Check you're in the correct Supabase project
- Verify table name is `user_profiles` (not `users`)
- Check SQL syntax (no typos)

### If test user creation fails:
- Verify User ID is correct (copy-paste from Authentication → Users)
- Check User ID is wrapped in quotes: `'uuid-here'`
- Verify email matches: `comet_test@zyeute.com`

### If login fails:
- Verify "Auto Confirm User" was checked
- Check password is exactly: `Test123456!`
- Verify profile was created (check `user_profiles` table)

---

**Ready to execute? Follow Steps 1-3 above!** 🚀

