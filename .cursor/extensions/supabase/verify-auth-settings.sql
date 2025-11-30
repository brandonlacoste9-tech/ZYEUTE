-- Verify Auth Settings (After Enabling Leaked Password Protection)
-- This checks what we can verify via SQL (some settings are Dashboard-only)

-- ============================================
-- Check Auth Configuration
-- ============================================

-- Note: Leaked password protection is a Dashboard setting
-- and cannot be queried directly via SQL. This script checks
-- related auth configuration that we can verify.

SELECT 
    'Auth Settings Verification' as check_type,
    'Leaked password protection must be verified in Dashboard' as note;

-- Check if auth schema exists and is accessible
SELECT 
    'Auth Schema' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth')
        THEN '✅ Auth schema exists'
        ELSE '⚠️ Auth schema not found'
    END as status;

-- Check auth.users table exists
SELECT 
    'Auth Users Table' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'auth' AND table_name = 'users'
        )
        THEN '✅ Auth users table exists'
        ELSE '⚠️ Auth users table not found'
    END as status;

-- Note: Actual leaked password protection setting is in Dashboard
-- and cannot be queried via SQL. Verify manually:
-- Dashboard → Authentication → Settings → "Leaked password protection" = Enabled

