# 🔍 Feed Debugging Guide

## Issue
Feed query fixes applied but posts still not rendering in UI.

## Debugging Steps

### Step 1: Check Browser Console

**Open DevTools (F12) → Console tab**

Look for these log messages:
- `[getFeedPosts] Starting query:` - Confirms API is being called
- `[getFeedPosts] Query result:` - Shows data returned from Supabase
- `[Feed] Fetching posts, page:` - Confirms component is calling API
- `[Feed] Received posts data:` - Shows data received by component
- `[Feed] Set posts (page 0):` - Confirms state update

**Expected:** Should see all these logs with data  
**If missing:** Component not calling API or API not being called

---

### Step 2: Check Network Tab

**Open DevTools (F12) → Network tab**

1. Filter by "Fetch/XHR"
2. Look for requests to Supabase API
3. Check:
   - Request URL (should include `publications`)
   - Request payload (should have filters)
   - Response status (should be 200)
   - Response data (should contain posts)

**Expected:** Should see Supabase API call with 200 response  
**If 401/403:** Auth issue  
**If 404:** Wrong endpoint  
**If empty response:** Query returning no data

---

### Step 3: Test Query Directly in Console

**Paste this in Browser Console (after login):**

```javascript
(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_URL';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Testing feed query...');
  
  const { data, error } = await supabase
    .from('publications')
    .select(`*, user:user_profiles!user_id(*)`)
    .eq('visibilite', 'public')
    .is('est_masque', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10);
  
  console.log('Direct query result:', { data, error });
  console.log('Post count:', data?.length || 0);
  console.log('First post:', data?.[0]);
})();
```

**Expected:** Should return test post  
**If empty:** RLS or query issue  
**If error:** Check error message

---

### Step 4: Check Component State

**In Browser Console:**

```javascript
// Check React component state (if React DevTools installed)
// Or check via window object if exposed
```

**Or add temporary debug button:**

Add this to Feed.tsx temporarily:
```tsx
<button onClick={() => {
  console.log('Current state:', { posts, isLoading, hasMore });
  fetchPosts(0);
}}>
  Debug: Log State & Refresh
</button>
```

---

### Step 5: Verify Test Post Exists

**In Supabase SQL Editor:**

```sql
-- Check test post exists and is public
SELECT 
  id, 
  user_id, 
  content, 
  visibilite, 
  est_masque, 
  deleted_at,
  created_at
FROM public.publications
WHERE id = '87daf746-a724-49ec-9173-e44e2e9d8333';
```

**Expected:**
- `visibilite = 'public'`
- `est_masque = false` or NULL
- `deleted_at = NULL`

---

### Step 6: Test RLS Policies

**In Supabase SQL Editor (as authenticated user):**

```sql
-- Test if RLS allows reading publications
SELECT COUNT(*) 
FROM public.publications
WHERE visibilite = 'public' 
  AND est_masque IS NOT TRUE 
  AND deleted_at IS NULL;
```

**Expected:** Should return count > 0  
**If 0:** RLS blocking query

---

### Step 7: Check Component Render

**Look for debug info in UI:**

If `NODE_ENV === 'development'`, you should see:
- Posts count: X
- Is loading: true/false
- Has more: true/false
- Current user: username

**If posts count > 0 but not rendering:** Component rendering issue  
**If posts count = 0:** Query/data issue

---

## Common Issues & Fixes

### Issue 1: Component Not Re-rendering

**Symptom:** Data fetched but UI doesn't update

**Fix:** Check React state updates, ensure `setPosts` is called

### Issue 2: Query Returns Empty Array

**Symptom:** API call succeeds but `data = []`

**Fix:** Check filters, verify test post matches criteria

### Issue 3: RLS Blocking Query

**Symptom:** 401/403 errors or empty results

**Fix:** Verify RLS policies allow reading publications

### Issue 4: Column Mapping Issue

**Symptom:** Data returned but component crashes

**Fix:** Check Post type matches mapped data structure

### Issue 5: Caching Issue

**Symptom:** Old query logic still running

**Fix:** Hard refresh (Ctrl+Shift+R), clear cache, rebuild

---

## Next Steps

1. Run debugging steps above
2. Check console logs
3. Verify test post exists and is public
4. Test query directly
5. Check component state
6. Report findings

---

**Status:** 🔍 **DEBUGGING IN PROGRESS**

