# 🔴 CRITICAL: Feed Profile Join RLS Fix

## Issue
**Posts exist in database but don't appear in feed UI**

**Root Cause:** Feed query joins `user_profiles` table, but RLS policies only allow self-read. When the feed tries to fetch author info for other users, RLS blocks it, filtering out the entire row.

**Symptoms:**
- ✅ Post created successfully (ID: `87daf746-a724-49ec-9173-e44e2e9d8333`)
- ✅ Post visible in `publications` table
- ✅ RLS policies on `publications` are correct
- ❌ Post does NOT appear in feed
- ❌ Feed query fails silently due to `user_profiles` join

---

## Diagnosis

**Feed Query Pattern:**
```typescript
supabase
  .from('posts')
  .select(`
    *,
    user:user_profiles!user_id(*)  // ← This join is blocked by RLS
  `)
```

**Problem:**
- `publications` table has correct RLS (public posts readable)
- `user_profiles` table RLS only allows self-read
- When feed tries to join author profile, RLS blocks it
- Entire row filtered out, even though publication is readable

---

## Solution

### Step 1: Check Current Policies

Run this in Supabase SQL Editor:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;
```

**Expected:** Should see SELECT policies  
**If only self-read:** Need to add public read policy → Go to Step 2

---

### Step 2: Apply Profile Join Fix

Run the **ENTIRE** script from `FIX_FEED_PROFILE_JOIN.sql`:

1. Go to **Supabase Dashboard → SQL Editor**
2. Click **"New query"**
3. Copy entire contents of `FIX_FEED_PROFILE_JOIN.sql`
4. Paste and run
5. Should see: `✅ SELECT policies created successfully`

---

### Step 3: Verify Test Post Flags

**Check test post visibility:**

```sql
SELECT id, user_id, visibilite, est_masque, deleted_at
FROM public.publications
WHERE id = '87daf746-a724-49ec-9173-e44e2e9d8333';
```

**Expected:**
- `visibilite = 'public'`
- `est_masque = false` (or NULL)
- `deleted_at = NULL`

---

### Step 4: Test Feed Query with Join

**Test the actual feed query pattern:**

```sql
SELECT 
  p.id,
  p.content,
  p.media_url,
  p.created_at,
  up.username,
  up.display_name,
  up.avatar_url
FROM public.publications p
LEFT JOIN public.user_profiles up ON up.id = p.user_id
WHERE p.visibilite = 'public' 
  AND p.est_masque IS NOT TRUE 
  AND p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT 10;
```

**Expected:** Should return test post with author info  
**If empty:** Check that `visibilite = 'public'` and `est_masque = false`

---

### Step 5: Test in UI

1. Go to `https://zyeute.netlify.app`
2. Login as `comet_test@zyeute.com`
3. Refresh feed
4. ✅ Should see test post appear with author info

---

## Quick Fix (Copy-Paste Ready)

```sql
-- Enable RLS (if not already)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading public profile fields for feed
CREATE POLICY "Public profile fields readable for feed"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

-- Also allow anonymous users (for public feed)
CREATE POLICY "Public profile fields readable for anonymous"
ON public.user_profiles FOR SELECT
TO anon
USING (true);

-- Grant permissions
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
```

---

## What This Fixes

- ✅ Feed query can join `user_profiles` without RLS blocking
- ✅ Posts appear in feed with author info (username, avatar, display_name)
- ✅ Public profile fields visible (username, display_name, avatar_url)
- ✅ Sensitive fields still protected (existing self-read policies remain)
- ✅ Social loop functional

---

## Security Note

**This policy allows reading public profile fields:**
- ✅ Safe: `username`, `display_name`, `avatar_url`, `bio`
- ✅ Protected: `email`, `phone`, `private_settings` (if they exist)

**If you want stricter control:**
- Use the alternative approach in `FIX_FEED_PROFILE_JOIN.sql`
- Create a `user_profiles_public` view with only safe fields
- Update frontend to join with the view instead

---

## After Fix Applied

**Tell Comet:** "Feed profile join RLS fix applied — refresh feed and test again"

Then Comet will:
- Refresh feed
- Verify test post appears with author info
- Test comment creation
- Verify comment persistence
- Complete validation report

---

**Status:** 🔴 **CRITICAL - Feed broken until profile join RLS is fixed**

**Priority:** Fix immediately - blocks all social features

