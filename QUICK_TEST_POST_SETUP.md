# 🚀 Quick Test Post Setup for Comet

## Goal: Create a test post so Comet can test comment persistence

---

## Option 1: Use Placeholder Image (FASTEST - 30 seconds)

### Step 1: Run SQL in Supabase

Go to **Supabase Dashboard → SQL Editor → New query** → Paste:

```sql
INSERT INTO public.posts (
  id,
  user_id,
  caption,
  media_url,
  type,
  hashtags,
  region,
  city,
  created_at
)
VALUES (
  gen_random_uuid(),
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800',
  'photo',
  ARRAY['Quebec', 'MTL', 'Test'],
  'Montreal',
  'Montreal',
  NOW()
)
RETURNING id, caption, media_url, created_at;
```

Click **Run** → Should see post created with ID returned.

**Done!** Comet can now test comments on this post.

---

## Option 2: Upload Real Image to Storage (More Realistic - 2 minutes)

### Step 1: Upload Image

1. Go to **Supabase Dashboard → Storage → media bucket**
2. Click **Upload file**
3. Upload a small test image (Quebec-themed if possible)
4. Copy the **public URL** after upload

### Step 2: Insert Post

Run SQL (replace `MEDIA_URL_HERE` with actual URL):

```sql
INSERT INTO public.posts (
  id,
  user_id,
  caption,
  media_url,
  type,
  hashtags,
  region,
  city,
  created_at
)
VALUES (
  gen_random_uuid(),
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test',
  'MEDIA_URL_HERE', -- Replace with Storage URL
  'photo',
  ARRAY['Quebec', 'MTL', 'Test'],
  'Montreal',
  'Montreal',
  NOW()
);
```

---

## Verify Post Was Created

Run this query:

```sql
SELECT id, caption, media_url, created_at 
FROM public.posts 
WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
ORDER BY created_at DESC
LIMIT 1;
```

Should return the test post.

---

## After Post is Created

**Tell Comet:** "Test post ready — proceed with comment testing"

Then Comet will:
- ✅ Find the test post in feed
- ✅ Create a comment
- ✅ Verify comment appears instantly
- ✅ Hard refresh
- ✅ Verify comment persists

---

## Quick Reference

**Test User ID:** `46db6dc0-060d-4ffd-ba5e-0dfe46878855`  
**Test Email:** `comet_test@zyeute.com`  
**Test Password:** `Test123456!`

**Recommended:** Use Option 1 (placeholder image) for fastest setup.

---

**Ready to create the test post?** Run Option 1 SQL above! 🚀

