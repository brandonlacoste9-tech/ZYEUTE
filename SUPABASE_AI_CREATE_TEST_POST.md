# 📋 Instructions for Supabase AI: Create Test Post

## Goal
Create a test post in the database so Comet can test comment persistence.

---

## Action Required

**Please create a test post for user ID:** `46db6dc0-060d-4ffd-ba5e-0dfe46878855`

---

## Steps

### Step 1: Check Publications Table Schema

First, verify the actual columns in the `publications` table:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'publications' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Step 2: Create Test Post

Based on the schema, insert a test post with:

- **user_id:** `46db6dc0-060d-4ffd-ba5e-0dfe46878855`
- **content/caption:** `"Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test"`
- **media_url:** `"https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800"` (Quebec cityscape placeholder)
- **visibility:** `"public"` (or whatever the column name is)

### Step 3: Verify Post Created

Run this to confirm:

```sql
SELECT id, content, media_url, created_at 
FROM public.publications 
WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
ORDER BY created_at DESC
LIMIT 1;
```

---

## Expected Result

- ✅ Post inserted successfully
- ✅ Post visible in `publications` table
- ✅ Post accessible via `posts` view (if it exists)
- ✅ Post will appear in feed for `comet_test@zyeute.com` user

---

## After Completion

**Reply:** "Test post created successfully. Post ID: [id], visible in feed."

Then I'll tell Comet: **"Test post ready"** and they'll proceed with comment testing.

---

**Please execute Steps 1-3 above and confirm when done.**

