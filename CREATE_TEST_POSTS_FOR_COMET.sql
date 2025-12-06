-- Create Test Posts for Comet Validation
-- Run this in Supabase SQL Editor

-- First, get a valid user_id (use your test user or any existing user)
-- Replace 'YOUR_USER_ID_HERE' with actual UUID

-- Test Post 1: Simple text post
INSERT INTO publications (
  user_id,
  contenu,
  type_contenu,
  visibilite,
  created_at
) VALUES (
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855', -- comet_test user
  'Test post 1 from Comet validation - Quebec vibes! 🇨🇦⚜️ #Quebec #Test',
  'text',
  'public',
  NOW()
);

-- Test Post 2: Post with hashtags
INSERT INTO publications (
  user_id,
  contenu,
  type_contenu,
  visibilite,
  created_at
) VALUES (
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post 2 - Poutine is life! 🍟 Best food in Quebec! #Poutine #Montreal #QuebecFood',
  'text',
  'public',
  NOW() - INTERVAL '1 hour'
);

-- Test Post 3: Post with region
INSERT INTO publications (
  user_id,
  contenu,
  type_contenu,
  visibilite,
  region,
  created_at
) VALUES (
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post 3 - Montreal nightlife is amazing! 🌃 #Montreal #Nightlife',
  'text',
  'public',
  'Montreal',
  NOW() - INTERVAL '2 hours'
);

-- Test Post 4: Post for comment testing
INSERT INTO publications (
  user_id,
  contenu,
  type_contenu,
  visibilite,
  created_at
) VALUES (
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post 4 - Comment on this post to test comment functionality! 💬',
  'text',
  'public',
  NOW() - INTERVAL '3 hours'
);

-- Test Post 5: Post for fire testing
INSERT INTO publications (
  user_id,
  contenu,
  type_contenu,
  visibilite,
  created_at
) VALUES (
  '46db6dc0-060d-4ffd-ba5e-0dfe46878855',
  'Test post 5 - Fire this post to test reactions! 🔥',
  'text',
  'public',
  NOW() - INTERVAL '4 hours'
);

-- Verify posts were created
SELECT 
  id,
  contenu,
  type_contenu,
  visibilite,
  created_at,
  user_id
FROM publications
WHERE user_id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855'
ORDER BY created_at DESC
LIMIT 5;

