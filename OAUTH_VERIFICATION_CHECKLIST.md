# 🔐 OAuth Configuration Verification Checklist

## Quick Verification Script

Run the automated verification script:

```bash
node scripts/verify-oauth-config.js
```

This will check:
- ✅ Environment variables
- ✅ Code configuration
- ✅ Route setup
- ✅ Expected values

---

## Manual Verification Steps

### 1. Supabase Dashboard Configuration

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/auth

#### Site URL
- [ ] **Site URL** is set to: `https://zyeute.com`
- [ ] **NOT** set to `localhost` or `http://`

#### Redirect URLs
Add these **exact** URLs (one per line):

```
https://zyeute.com/auth/callback
https://zyeute.com/**
https://brandonlacoste9-tech-zyeute-l7i6iwtux.vercel.app/auth/callback
https://brandonlacoste9-tech-zyeute-l7i6iwtux.vercel.app/**
http://localhost:5173/auth/callback
http://localhost:5173/**
```

**Important:** The wildcard `/**` allows all paths under that domain.

#### Google OAuth Provider
- [ ] Go to: **Authentication → Providers → Google**
- [ ] **Enabled** toggle is ON
- [ ] **Client ID** is set (from Google Cloud Console)
- [ ] **Client Secret** is set (from Google Cloud Console)

---

### 2. Google Cloud Console Configuration

**Go to:** https://console.cloud.google.com/apis/credentials

#### OAuth 2.0 Client ID
- [ ] Find your OAuth 2.0 Client ID (the one used in Supabase)
- [ ] Click **Edit**

#### Authorized redirect URIs
Add this **exact** URL:

```
https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback
```

**Important:** This is Supabase's callback URL, NOT your app's URL.

#### Authorized JavaScript origins (optional but recommended)
```
https://zyeute.com
https://vuanulvyqkfefmjcikfk.supabase.co
```

---

### 3. Environment Variables (Netlify/Vercel)

#### Netlify Environment Variables
**Go to:** Netlify Dashboard → Site Settings → Environment Variables

- [ ] `VITE_SUPABASE_URL` = `https://vuanulvyqkfefmjcikfk.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key from Supabase Dashboard)

#### Vercel Environment Variables (if using Vercel)
**Go to:** Vercel Dashboard → Project Settings → Environment Variables

- [ ] `VITE_SUPABASE_URL` = `https://vuanulvyqkfefmjcikfk.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key from Supabase Dashboard)

**After updating:** Trigger a new deployment.

---

### 4. Code Verification

#### `src/lib/supabase.ts`
- [ ] `signInWithGoogle()` uses `redirectTo: ${window.location.origin}/auth/callback`
- [ ] `detectSessionInUrl: true` is set in Supabase client config

#### `src/pages/AuthCallback.tsx`
- [ ] Component handles OAuth errors from URL parameters
- [ ] Component listens for `SIGNED_IN` event
- [ ] Component redirects to `/` on success

#### `src/App.tsx`
- [ ] Route `/auth/callback` is registered
- [ ] `AuthCallback` component is imported and used

---

## Common Issues & Fixes

### Issue: `{"error":"requested path is invalid"}`

**Cause:** Redirect URL mismatch between Supabase and Google Cloud Console.

**Fix:**
1. Verify Supabase **Redirect URLs** includes: `https://zyeute.com/auth/callback`
2. Verify Google Cloud Console **Authorized redirect URIs** includes: `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`
3. These are **different URLs** - don't confuse them!

---

### Issue: Redirects to `localhost:3000` after login

**Cause:** `VITE_APP_URL` or Supabase Site URL is set to localhost.

**Fix:**
1. Check Netlify/Vercel environment variables - remove any `VITE_APP_URL` pointing to localhost
2. Update Supabase **Site URL** to `https://zyeute.com`
3. Trigger a new deployment

---

### Issue: OAuth works locally but not in production

**Cause:** Environment variables not set in production.

**Fix:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Netlify/Vercel
2. Ensure they match your Supabase project (`vuanulvyqkfefmjcikfk`)
3. Trigger a new deployment after updating

---

## Testing OAuth Flow

### 1. Test in Incognito Mode
1. Open `https://zyeute.com` in incognito window
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect to `/auth/callback` then `/` (home feed)

### 2. Check Browser Console
Look for:
- ✅ `[Supabase] Using URL: https://vuanulvyqkfefmjcikfk.supabase.co`
- ✅ `Auth state change: SIGNED_IN`
- ❌ Any errors about redirect URLs
- ❌ Any 404 errors

### 3. Verify Session
After login:
- [ ] User is redirected to home feed (`/`)
- [ ] Profile page loads (`/profile/me`)
- [ ] No "Profile Not Found" errors

---

## Final Checklist

Before considering OAuth "fixed":

- [ ] Supabase Site URL = `https://zyeute.com`
- [ ] Supabase Redirect URLs include `https://zyeute.com/auth/callback` and `https://zyeute.com/**`
- [ ] Google Cloud Console Authorized redirect URI = `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`
- [ ] Environment variables set in Netlify/Vercel
- [ ] Code uses `window.location.origin` for redirectTo (not hardcoded localhost)
- [ ] `/auth/callback` route exists in App.tsx
- [ ] Tested in incognito mode - login works end-to-end
- [ ] No console errors during OAuth flow

---

## Need Help?

If OAuth still fails after verifying all above:

1. **Check browser console** for specific error messages
2. **Check Netlify/Vercel build logs** for environment variable issues
3. **Check Supabase Dashboard → Logs** for authentication errors
4. **Share the exact error message** you see

The error `{"error":"requested path is invalid"}` specifically means:
- Supabase received a redirect request to a path not in your Redirect URLs list
- OR Google is redirecting to the wrong Supabase callback URL

Double-check both configurations!

