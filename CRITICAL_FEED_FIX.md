# 🔴 CRITICAL: Feed Display Fix

## Issue
**Posts exist in database but don't appear in feed UI**

**Symptoms:**
- ✅ Post created successfully (ID: `87daf746-a724-49ec-9173-e44e2e9d8333`)
- ✅ Post visible in `publications` table
- ❌ Post does NOT appear in feed
- ❌ Post does NOT appear in profile
- ❌ Feed shows empty/placeholder

**Root Cause:** Missing or incorrect RLS SELECT policy on `publications` table

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
WHERE tablename = 'publications'
ORDER BY cmd, policyname;
```

**Expected:** Should see SELECT policies  
**If empty:** No SELECT policies exist → Go to Step 2

---

### Step 2: Apply RLS Fix

Run the **ENTIRE** script from `FIX_FEED_DISPLAY_RLS.sql`:

1. Go to **Supabase Dashboard → SQL Editor**
2. Click **"New query"**
3. Copy entire contents of `FIX_FEED_DISPLAY_RLS.sql`
4. Paste and run
5. Should see: `✅ SELECT policies created successfully`

---

### Step 3: Verify Fix

**Test Query (as authenticated user):**

```sql
SELECT id, content, media_url, created_at 
FROM public.publications 
WHERE visibilite = 'public' 
  AND est_masque IS NOT TRUE 
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:** Should return test post  
**If empty:** Policy might need adjustment

---

### Step 4: Test in UI

1. Go to `https://zyeute.netlify.app`
2. Login as `comet_test@zyeute.com`
3. Refresh feed
4. ✅ Should see test post appear

---

## Quick Fix (Copy-Paste Ready)

If you want to try the simpler version first:

```sql
-- Enable RLS
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view public and own publications" ON public.publications;
DROP POLICY IF EXISTS "Anonymous users can view public publications" ON public.publications;

-- Create simple SELECT policy (allows viewing all non-hidden posts)
CREATE POLICY "Users can view all non-hidden publications"
ON public.publications FOR SELECT
TO authenticated
USING (
  est_masque IS NOT TRUE 
  AND deleted_at IS NULL
);

-- Grant permissions
GRANT SELECT ON public.publications TO authenticated;
GRANT SELECT ON public.publications TO anon;
```

---

## What This Fixes

- ✅ Users can view posts in feed
- ✅ Posts appear in profile
- ✅ Feed query works correctly
- ✅ Social loop functional

---

## After Fix Applied

**Tell Comet:** "Feed RLS fix applied — refresh feed and test again"

Then Comet will:
- Refresh feed
- Verify test post appears
- Test comment creation
- Verify comment persistence
- Complete validation report

---

**Status:** 🔴 **CRITICAL - Feed broken until RLS policy is fixed**

**Priority:** Fix immediately - blocks all social features

