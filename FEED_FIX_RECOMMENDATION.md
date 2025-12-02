# 🔴 Feed Profile Join Fix - Recommendation

## Root Cause Confirmed ✅

**Issue:** Feed query joins `user_profiles` but RLS only allows self-read, blocking feed joins.

**Diagnosis:**
- ✅ Publications RLS is correct
- ✅ Test post exists and is public
- 🔴 User profiles RLS blocks reading other users' profiles
- 🔴 Feed query fails silently when joining profiles

---

## Two Solutions Available

### Option A: Quick Policy Fix (Recommended for Speed) ⚡

**Pros:**
- ✅ Fastest to apply (2 minutes)
- ✅ No frontend changes needed
- ✅ Works immediately
- ✅ Simple SQL script

**Cons:**
- ⚠️ Exposes all columns in `user_profiles` table
- ⚠️ If table has sensitive fields, they'll be readable

**Best for:** If `user_profiles` only contains public-safe fields (username, display_name, avatar_url, bio)

**SQL File:** `FIX_FEED_PROFILE_JOIN.sql` (updated with idempotent checks)

---

### Option B: Safer View Approach (Recommended for Security) 🔒

**Pros:**
- ✅ Only exposes public-safe fields
- ✅ Keeps sensitive columns private
- ✅ Better security posture
- ✅ Explicit field control

**Cons:**
- ⚠️ Requires frontend code change
- ⚠️ Takes ~5 minutes to implement
- ⚠️ Need to update `getFeedPosts()` function

**Best for:** If `user_profiles` has sensitive fields (email, phone, private_settings)

**SQL File:** `FIX_FEED_PROFILE_JOIN_OPTION_B.sql`

**Frontend Change Required:**
```typescript
// In src/services/api.ts, change:
.select(`*, user:user_profiles!user_id(*)`)

// To:
.select(`*, user:user_profiles_public!user_id(*)`)
```

---

## Recommendation: Option A (Quick Fix)

**Why:**
1. **Speed:** Fixes the blocker immediately (2 minutes)
2. **No code changes:** Works with existing frontend
3. **Likely safe:** `user_profiles` probably only has public fields anyway
4. **Can upgrade later:** Can switch to Option B if needed

**Action:** Apply Option A now, then review `user_profiles` schema. If sensitive fields exist, upgrade to Option B.

---

## How to Apply

### Option A (Quick Fix):

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy entire contents of `FIX_FEED_PROFILE_JOIN.sql`
3. Paste and run
4. Should see: `✅ SELECT policies created successfully`
5. Test feed immediately

### Option B (Safer View):

1. Go to **Supabase Dashboard → SQL Editor**
2. Copy entire contents of `FIX_FEED_PROFILE_JOIN_OPTION_B.sql`
3. Paste and run
4. Update `src/services/api.ts` to use `user_profiles_public` view
5. Test feed

---

## Verification Steps

**After applying either option:**

1. **Verify test post flags:**
```sql
SELECT id, user_id, visibilite, est_masque, deleted_at
FROM public.publications
WHERE id = '87daf746-a724-49ec-9173-e44e2e9d8333';
```

2. **Test feed query:**
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

3. **Test in UI:**
   - Go to `https://zyeute.netlify.app`
   - Login as `comet_test@zyeute.com`
   - Refresh feed
   - ✅ Should see test post with author info

---

## After Fix Applied

**Tell Comet:** "Feed profile join RLS fix applied — refresh feed and test again"

Then Comet will:
- ✅ Refresh feed
- ✅ Verify test post appears with author info
- ✅ Test comment creation
- ✅ Verify comment persistence
- ✅ Complete validation report

---

## Status

| Component | Status |
|-----------|--------|
| Authentication | ✅ Working |
| Database (INSERT) | ✅ Working |
| Publications RLS | ✅ Correct |
| User Profiles RLS | 🔴 Too restrictive (blocks feed joins) |
| Feed Display | 🔴 Broken until profile join RLS fixed |
| Social Loop | 🔴 Blocked |

**Priority:** 🔴 **CRITICAL - Apply Option A immediately**

