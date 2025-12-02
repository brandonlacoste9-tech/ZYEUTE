-- ============================================
-- SET UP ADMIN USER FOR SECURITY TESTING
-- ============================================

-- Option 1: Make existing user an admin
-- Update comet_test user to admin:
UPDATE public.user_profiles
SET is_admin = true,
    updated_at = NOW()
WHERE id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855';

-- Verify admin status:
SELECT id, username, email, is_admin 
FROM public.user_profiles 
WHERE id = '46db6dc0-060d-4ffd-ba5e-0dfe46878855';

-- ============================================
-- Option 2: Create new admin user
-- ============================================

-- Step 1: Create auth user in Supabase Dashboard
-- Authentication → Users → Add user
-- Email: admin_test@zyeute.com
-- Password: AdminTest123456!
-- ✅ Auto Confirm User
-- Copy User ID

-- Step 2: Insert admin profile (replace USER_ID_HERE)
INSERT INTO public.user_profiles (
  id,
  username,
  display_name,
  email,
  is_admin,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_HERE', -- Replace with admin user UUID
  'admin_test',
  'Admin Test User',
  'admin_test@zyeute.com',
  true, -- Set as admin
  NOW(),
  NOW()
);

-- Verify admin user:
SELECT id, username, email, is_admin 
FROM public.user_profiles 
WHERE is_admin = true;

-- ============================================
-- TEST ADMIN ACCESS
-- ============================================
-- After setting up admin:
-- 1. Login with admin credentials
-- 2. Navigate to /moderation
-- 3. Should have access (no redirect)
-- 4. Test non-admin user → should redirect

