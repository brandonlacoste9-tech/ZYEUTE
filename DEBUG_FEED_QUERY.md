# 🔴 Feed Query Debugging Guide

## Issue
Posts exist in database but don't render in feed UI, even after RLS fix.

## Root Cause Analysis

**Current Query:**
```typescript
supabase
  .from('posts')  // ← This is a VIEW, not a table
  .select(`*, user:user_profiles!user_id(*)`)
  .order('created_at', { ascending: false })
```

**Problem:**
- Query uses `posts` VIEW (not `publications` table)
- View might have RLS issues or WHERE clause filtering
- View might not expose data correctly

---

## Debugging Steps

### Step 1: Check if Query Returns Data

**In Browser Console (F12):**
```javascript
// Test the query directly
const { data, error } = await supabase
  .from('posts')
  .select(`*, user:user_profiles!user_id(*)`)
  .order('created_at', { ascending: false })
  .limit(10);

console.log('Feed query result:', { data, error });
```

**Expected:** Should return test post with user info  
**If empty:** Query is failing → Go to Step 2

---

### Step 2: Test Direct Publications Query

**In Browser Console:**
```javascript
// Test querying publications directly
const { data, error } = await supabase
  .from('publications')
  .select(`*, user:user_profiles!user_id(*)`)
  .eq('visibilite', 'public')
  .is('est_masque', null)
  .is('deleted_at', null)
  .order('created_at', { ascending: false })
  .limit(10);

console.log('Publications query result:', { data, error });
```

**Expected:** Should return test post  
**If works:** View is the problem → Go to Step 3

---

### Step 3: Check View Definition

**In Supabase SQL Editor:**
```sql
-- Check the posts view definition
SELECT 
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'posts';
```

**Check for:**
- WHERE clause filtering (might exclude posts)
- RLS policies on view
- Column mappings

---

### Step 4: Test View Query Directly

**In Supabase SQL Editor:**
```sql
-- Test querying the view directly
SELECT 
  p.id,
  p.content,
  p.media_url,
  p.created_at,
  up.username,
  up.display_name
FROM posts p
LEFT JOIN user_profiles up ON up.id = p.user_id
ORDER BY p.created_at DESC
LIMIT 10;
```

**Expected:** Should return test post  
**If empty:** View is filtering incorrectly

---

## Potential Fixes

### Fix 1: Query Publications Directly

**Update `src/services/api.ts`:**
```typescript
export async function getFeedPosts(page: number = 0, limit: number = 20): Promise<Post[]> {
  try {
    const start = page * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('publications')  // ← Change from 'posts' to 'publications'
      .select(`
        *,
        user:user_profiles!user_id(*)
      `)
      .eq('visibilite', 'public')  // ← Add explicit filters
      .is('est_masque', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching feed posts:', error);
      return [];
    }

    return (data || []) as Post[];
  } catch (error) {
    console.error('Error in getFeedPosts:', error);
    return [];
  }
}
```

### Fix 2: Fix Posts View RLS

**In Supabase SQL Editor:**
```sql
-- Ensure RLS is enabled on publications (base table)
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Grant SELECT on view
GRANT SELECT ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;

-- The view inherits RLS from publications table
-- But we need to ensure the view doesn't filter incorrectly
```

### Fix 3: Check View WHERE Clause

**The view might have:**
```sql
WHERE deleted_at IS NULL  -- This is correct
```

**But might be missing:**
- Visibility filter
- Mask filter
- Or might be filtering incorrectly

---

## Quick Test Script

**Run this in Browser Console (F12) after login:**
```javascript
(async () => {
  console.log('=== Testing Feed Query ===');
  
  // Test 1: Query posts view
  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select(`*, user:user_profiles!user_id(*)`)
    .limit(5);
  
  console.log('Posts view:', { data: postsData, error: postsError });
  
  // Test 2: Query publications directly
  const { data: pubData, error: pubError } = await supabase
    .from('publications')
    .select(`*, user:user_profiles!user_id(*)`)
    .eq('visibilite', 'public')
    .limit(5);
  
  console.log('Publications table:', { data: pubData, error: pubError });
  
  // Test 3: Check current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user?.id);
})();
```

**Expected Output:**
- Posts view: Should return test post or error
- Publications: Should return test post
- Current user: Should show user ID

---

## Next Steps

1. Run debugging steps above
2. Check browser console for errors
3. Test queries in Supabase SQL Editor
4. Apply appropriate fix based on findings

---

**Status:** 🔴 **DEBUGGING REQUIRED**

