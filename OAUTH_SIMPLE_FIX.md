# 🎯 Simple OAuth Fix - 3 Steps

Let's fix Google login with the **minimum** steps needed.

---

## ✅ Step 1: Check Supabase Dashboard (2 minutes)

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/auth/providers

1. **Is Google provider enabled?**
   - Toggle should be **ON** (green)
   - If OFF → Turn it ON

2. **Are Client ID and Secret set?**
   - Should have values from Google Cloud Console
   - If empty → You need to set up Google OAuth in Google Cloud Console first

---

## ✅ Step 2: Check Redirect URLs (1 minute)

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/auth

**Redirect URLs** should include:
```
https://zyeute.com/auth/callback
```

**Site URL** should be:
```
https://zyeute.com
```

---

## ✅ Step 3: Check Google Cloud Console (2 minutes)

**Go to:** https://console.cloud.google.com/apis/credentials

1. Find your OAuth 2.0 Client ID (the one used in Supabase)
2. **Authorized redirect URIs** must include:
```
https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback
```

---

## 🧪 Test

After fixing the above:
1. Clear browser cache
2. Go to `https://zyeute.com` in incognito
3. Click "Continuer avec Google"
4. Should redirect to Google → Login → Back to your app

---

## ❓ What Happens When You Click the Button?

**Option A:** Nothing happens (button does nothing)
- → Check browser console for errors
- → Likely: Google provider not enabled in Supabase

**Option B:** Redirects to Google but comes back to login page
- → Check Redirect URLs in Supabase
- → Check Google Cloud Console redirect URI

**Option C:** Error message appears
- → Share the exact error message

---

**Tell me which option happens, and I'll give you the exact fix!**

