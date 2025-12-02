-- ============================================
-- CREATE TEST POST FOR VALIDATION
-- This creates a test post so Comet can test comment persistence
-- ============================================

-- Step 1: Upload a test image to Supabase Storage first
-- Go to Storage → media bucket → Upload file
-- Use a small test image (e.g., 1x1px PNG or a Quebec-themed image)
-- Copy the public URL after upload

-- Step 2: Insert test post
-- Replace 'TEST_USER_ID' with comet_test user ID: 46db6dc0-060d-4ffd-ba5e-0dfe46878855
-- Replace 'MEDIA_URL_HERE' with the public URL from Storage

INSERT INTO public.posts (
  id,
  user_id,
  caption,
  media_url,
  media_type,
  hashtags,
  region,
  city,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(), -- Auto-generate post ID
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855', -- comet_test user ID
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test',
  'MEDIA_URL_HERE', -- Replace with actual Storage URL
  'image', -- or 'video' if using video
  ARRAY['Quebec', 'MTL', 'Test'], -- Hashtags array
  'Montreal', -- Region
  'Montreal', -- City
  NOW(),
  NOW()
)
RETURNING id, caption, media_url, created_at;

-- ============================================
-- ALTERNATIVE: Use a placeholder image URL
-- ============================================
-- If you don't want to upload to Storage, use a placeholder service:

INSERT INTO public.posts (
  id,
  user_id,
  caption,
  media_url,
  media_type,
  hashtags,
  region,
  city,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post from Comet - Validation testing for Zyeuté 🇨🇦⚜️ #Quebec #MTL #Test',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800', -- Quebec cityscape placeholder
  'image',
  ARRAY['Quebec', 'MTL', 'Test'],
  'Montreal',
  'Montreal',
  NOW(),
  NOW()
)
RETURNING id, caption, media_url, created_at;

-- ============================================
-- VERIFY POST WAS CREATED
-- ============================================
-- Run this to verify:
-- SELECT id, caption, media_url, created_at 
-- FROM public.posts 
-- WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
-- ORDER BY created_at DESC
-- LIMIT 1;

