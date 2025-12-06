-- ============================================
-- MANUAL TEST USER CREATION
-- Use this if RLS policy still won't work
-- Creates a test user that Comet can use for golden path testing
-- ============================================

-- Step 1: Create auth user (via Supabase Dashboard is easier, but SQL works too)
-- Go to Supabase Dashboard → Authentication → Users → Add user
-- Email: comet_test@zyeute.com
-- Password: Test123456!
-- ✅ Auto Confirm User

-- Step 2: After creating auth user, get the user ID and run this:
-- (Replace 'USER_ID_HERE' with the actual user ID from auth.users)

-- Insert profile manually (bypasses RLS by using service role)
INSERT INTO public.user_profiles (
  id,
  username,
  display_name,
  email,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_HERE', -- Replace with actual user ID from auth.users
  'comet_test',
  'Comet Test User',
  'comet_test@zyeute.com',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ALTERNATIVE: Create via Supabase Dashboard
-- ============================================
-- 
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter:
--    - Email: comet_test@zyeute.com
--    - Password: Test123456!
--    - ✅ Check "Auto Confirm User"
-- 4. Click "Create user"
-- 5. Copy the User ID (UUID)
-- 6. Go to SQL Editor and run:
--
-- INSERT INTO public.user_profiles (
--   id, username, display_name, email, created_at, updated_at
-- )
-- VALUES (
--   'PASTE_USER_ID_HERE',
--   'comet_test',
--   'Comet Test User',
--   'comet_test@zyeute.com',
--   NOW(),
--   NOW()
-- );
--
-- ============================================

