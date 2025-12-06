-- ============================================
-- CREATE TEST POST - SAFE VERSION
-- Works with actual database schema (publications table)
-- ============================================

-- Step 1: Check what columns exist in publications table
-- Run this first to see the actual schema:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'publications' AND table_schema = 'public';

-- ============================================
-- Option A: Insert into publications table directly
-- ============================================

INSERT INTO public.publications (
  id,
  user_id,
  content, -- This is the caption/text
  media_url,
  visibilite, -- visibility: 'public', 'private', etc.
  created_at
)
VALUES (
  gen_random_uuid(),
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855', -- comet_test user ID
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800', -- Quebec cityscape placeholder
  'public', -- visibility
  NOW()
)
RETURNING id, content, media_url, created_at;

-- ============================================
-- Option B: Use the insert_post function (if it exists)
-- ============================================

SELECT insert_post(
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855'::UUID, -- user_id
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test', -- content
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800', -- media_url
  'public' -- visibility
);

-- ============================================
-- Verify post was created
-- ============================================

-- Check via publications table:
SELECT id, content, media_url, created_at 
FROM public.publications 
WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
ORDER BY created_at DESC
LIMIT 1;

-- Check via posts view:
SELECT id, content, media_url, created_at 
FROM public.posts 
WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- Notes
-- ============================================
-- The 'posts' table is actually a VIEW that maps to 'publications'
-- Columns may differ between view and actual table
-- Use publications table for direct inserts
-- Use posts view for queries (matches code expectations)

