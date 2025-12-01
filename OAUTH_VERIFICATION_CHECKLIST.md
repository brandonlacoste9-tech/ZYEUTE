# ✅ Supabase OAuth Verification Checklist (Updated for Netlify)

_Last updated: 2025-12-01_

---

## 🔧 Supabase Auth Configuration

### ✅ Site URL

```
https://zyeute.com
```

(Use `https://zyeute-netlify.netlify.app` temporarily while DNS finishes propagating)

---

### ✅ Redirect URLs (copy-paste these into Supabase Dashboard → Auth → URL Configuration)

```
https://zyeute.com
https://zyeute.com/auth/callback
https://zyeute.com/**
https://www.zyeute.com
https://www.zyeute.com/auth/callback
https://www.zyeute.com/**
https://zyeute-netlify.netlify.app
https://zyeute-netlify.netlify.app/auth/callback
https://zyeute-netlify.netlify.app/**
http://localhost:5173
http://localhost:5173/auth/callback
http://localhost:5173/**
```

---

## 🧹 Remove These (from old Vercel config)

```
https://brandonlacoste9-tech-zyeute-as15lomj2.vercel.app
https://brandonlacoste9-tech-zyeute-l7i6iwtux.vercel.app
```

**Important:** Remove ALL Vercel URLs if you've fully migrated to Netlify.

---

## ✅ Test Steps

1. Go to your deployed site (Netlify or custom domain)
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Confirm redirect returns to:
   - `/auth/callback` with `code=` and `provider=google` in query
5. Check browser console:
   - ✅ `exchangeCodeForSession` succeeds
   - ✅ Redirect to `/` (home feed)
   - ❌ No errors like `"requested path is invalid"`

---

## ✅ Optional Logging (AuthCallback.tsx)

Enable temporary logs like:

```tsx
console.log(window.location.href);
console.log(searchParams.get("code"));
console.log(searchParams.get("provider"));
```

---

## 🧪 Local Testing

* Use: `http://localhost:5173/auth/callback`
* Make sure it's in Supabase allowed list
* Run your local dev server and test the login

---

## 🔒 Security Tips

* Do NOT include Netlify/Vercel deploy preview URLs unless necessary
* Avoid redirecting to untrusted subdomains
* Use wildcards (`/**`) only when safe

---

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

## Google Cloud Console Configuration

**Go to:** https://console.cloud.google.com/apis/credentials

#### Authorized redirect URIs
Add this **exact** URL:

```
https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback
```

**Important:** This is Supabase's callback URL, NOT your app's URL.

#### Authorized JavaScript origins (optional but recommended)
```
https://zyeute.com
https://www.zyeute.com
https://vuanulvyqkfefmjcikfk.supabase.co
```

---

## Environment Variables (Netlify)

**Go to:** Netlify Dashboard → Site Settings → Environment Variables

- [ ] `VITE_SUPABASE_URL` = `https://vuanulvyqkfefmjcikfk.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (your anon key from Supabase Dashboard)

**After updating:** Trigger a new deployment.

---

## Code Verification

#### `src/lib/supabase.ts`
- [ ] `signInWithGoogle()` uses `redirectTo: ${window.location.origin}/auth/callback`
- [ ] `detectSessionInUrl: true` is set in Supabase client config

#### `src/pages/AuthCallback.tsx`
- [ ] Component handles OAuth errors from URL parameters
- [ ] Component uses `exchangeCodeForSession()` for code-based OAuth
- [ ] Component listens for `SIGNED_IN` event
- [ ] Component redirects to `/` on success

#### `src/App.tsx`
- [ ] Route `/auth/callback` is registered
- [ ] `AuthCallback` component is imported and used

---

## Common Issues & Fixes

### Issue: `{"error":"requested path is invalid"}`

**Cause:** Redirect URL mismatch - Supabase doesn't recognize the redirect URL.

**Fix:**
1. Verify Supabase **Redirect URLs** includes: `https://zyeute.com/auth/callback`
2. Verify Google Cloud Console **Authorized redirect URIs** includes: `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`
3. Remove any old Vercel URLs from Supabase Redirect URLs
4. These are **different URLs** - don't confuse them!

---

### Issue: Redirects to wrong domain after login

**Cause:** Old Vercel URLs still in Supabase configuration.

**Fix:**
1. Remove ALL Vercel URLs from Supabase Redirect URLs
2. Add Netlify URLs (see Redirect URLs section above)
3. Update Supabase **Site URL** to `https://zyeute.com`
4. Trigger a new deployment

---

## Final Checklist

Before considering OAuth "fixed":

- [ ] Supabase Site URL = `https://zyeute.com`
- [ ] Supabase Redirect URLs include Netlify URLs (see above)
- [ ] ALL Vercel URLs removed from Supabase Redirect URLs
- [ ] Google Cloud Console Authorized redirect URI = `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`
- [ ] Environment variables set in Netlify
- [ ] Code uses `window.location.origin` for redirectTo (not hardcoded localhost)
- [ ] `/auth/callback` route exists in App.tsx
- [ ] Tested in incognito mode - login works end-to-end
- [ ] No console errors during OAuth flow

---

✅ You're now fully aligned with Supabase + Netlify OAuth best practices.

🧠 This checklist documents your current working configuration for future reference.
