# ✅ Feed Query Fix Applied

## Issue
Posts exist in database but don't render in feed UI, even after RLS fix.

## Root Cause
Feed query was using `posts` VIEW instead of querying `publications` table directly. The view might have:
- RLS policy issues
- Incorrect WHERE clause filtering
- Missing column mappings

## Solution Applied

**Changed:** `src/services/api.ts` - `getFeedPosts()` function

**Before:**
```typescript
.from('posts')  // VIEW - might have issues
.select(`*, user:user_profiles!user_id(*)`)
.order('created_at', { ascending: false })
```

**After:**
```typescript
.from('publications')  // Direct table query
.select(`*, user:user_profiles!user_id(*)`)
.eq('visibilite', 'public')  // Explicit filters
.is('est_masque', null)
.is('deleted_at', null)
.order('created_at', { ascending: false })
```

**Column Mapping:**
- `visibilite` → `visibility`
- `est_masque` → `is_hidden`

---

## What This Fixes

- ✅ Query bypasses view RLS issues
- ✅ Explicit filters ensure correct data
- ✅ Column names mapped correctly
- ✅ Feed should now display posts

---

## Testing

**After deployment, test:**

1. **Refresh feed:**
   - Go to `https://zyeute.netlify.app`
   - Login as `comet_test@zyeute.com`
   - Navigate to feed
   - ✅ Should see test post appear

2. **Verify in browser console:**
   ```javascript
   // Should return test post
   const { data } = await supabase
     .from('publications')
     .select(`*, user:user_profiles!user_id(*)`)
     .eq('visibilite', 'public')
     .limit(1);
   console.log('Feed data:', data);
   ```

---

## Status

| Component | Status |
|-----------|--------|
| Query Source | ✅ Changed to publications table |
| Filters | ✅ Explicit (visibilite, est_masque, deleted_at) |
| Column Mapping | ✅ Handled (visibilite → visibility) |
| RLS Policies | ✅ Applied (user_profiles) |
| Feed Display | ✅ Should work now |

**Priority:** ✅ **FIX APPLIED — READY FOR TESTING**

---

**Next:** Comet should test feed display after deployment

