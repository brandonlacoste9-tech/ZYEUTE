# 🧹 Supabase Cleanup Guide

## 🎯 Goal: Clean up tangled Supabase configuration

---

## ✅ Step 1: Verify You're in the Right Project

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk

**Verify:**
- ✅ Project name is "Zyeuté" (or your Zyeuté project name)
- ✅ Project ID is `vuanulvyqkfefmjcikfk`
- ❌ NOT `kihxqurnmyxnsyqgpdaw` (that's Krypttrac - wrong project!)

---

## 🧹 Step 2: Clean Up OAuth Redirect URLs

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/auth

### Remove These (Old/Unused):

❌ **All Vercel URLs:**
- `https://brandonlacoste9-tech-zyeute-*.vercel.app`
- `https://*.vercel.app/**`
- Any `vercel.app` domains

❌ **Wrong Project URLs:**
- `https://kihxqurnmyxnsyqgpdaw.supabase.co` (Krypttrac)
- Any URLs with `kihxqurnmyxnsyqgpdaw`

❌ **Old/Test URLs:**
- `http://localhost:3000` (unless you need it)
- Any preview/test URLs you don't use

### Keep Only These (Clean List):

✅ **Production:**
```
https://zyeute.netlify.app
https://zyeute.netlify.app/**
https://zyeute.com
https://zyeute.com/**
https://www.zyeute.com
https://www.zyeute.com/**
```

✅ **Development (if needed):**
```
http://localhost:5173
http://localhost:5173/**
```

---

## 🧹 Step 3: Clean Up Site URL

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/auth

**Set Site URL to:**
```
https://zyeute.netlify.app
```

(Or `https://zyeute.com` if your custom domain is working)

---

## 🧹 Step 4: Clean Up Google OAuth Provider

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/auth/providers

**Check Google OAuth:**
- ✅ Enabled
- ✅ Client ID is correct (from Google Cloud Console)
- ✅ Client Secret is correct

**Verify Google Cloud Console:**
- Go to: https://console.cloud.google.com/apis/credentials
- Find your OAuth 2.0 Client ID
- **Authorized redirect URIs** should ONLY have:
  ```
  https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback
  ```
- ❌ Remove any Vercel URLs
- ❌ Remove any Krypttrac URLs (`kihxqurnmyxnsyqgpdaw`)

---

## 🧹 Step 5: Check Database Tables

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/editor

**Verify you have:**
- ✅ `user_profiles` table
- ✅ `posts` table
- ✅ Other Zyeuté tables

**Remove (if any):**
- ❌ Tables from Krypttrac project
- ❌ Test tables you don't need
- ❌ Duplicate tables

---

## 🧹 Step 6: Clean Up Storage Buckets

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/storage/buckets

**Keep:**
- ✅ `avatars` (if you use it)
- ✅ `posts` (if you use it)
- ✅ `stories` (if you use it)
- ✅ Other Zyeuté buckets

**Remove:**
- ❌ Buckets from Krypttrac
- ❌ Test buckets
- ❌ Unused buckets

---

## 🧹 Step 7: Check API Keys

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/api

**Verify:**
- ✅ `anon` key matches what's in Netlify `VITE_SUPABASE_ANON_KEY`
- ✅ `service_role` key is secure (never expose in frontend)

**If keys are compromised or wrong:**
- Regenerate them
- Update Netlify environment variables

---

## ✅ Cleanup Checklist

- [ ] Verified correct project (`vuanulvyqkfefmjcikfk`)
- [ ] Removed all Vercel redirect URLs
- [ ] Removed all Krypttrac references
- [ ] Set clean Site URL (`https://zyeute.netlify.app`)
- [ ] Clean redirect URLs list (only Netlify + localhost)
- [ ] Google OAuth configured correctly
- [ ] Google Cloud Console cleaned up
- [ ] Database tables verified (only Zyeuté tables)
- [ ] Storage buckets cleaned (only Zyeuté buckets)
- [ ] API keys verified and secure

---

## 🎯 Result

After cleanup, you'll have:
- ✅ Clean OAuth configuration
- ✅ Only Zyeuté URLs
- ✅ No Vercel references
- ✅ No Krypttrac references
- ✅ Simple, maintainable setup

---

## 📝 Notes

- **Backup first:** If unsure, take screenshots before deleting
- **Test after:** After cleanup, test login/logout to ensure it works
- **One at a time:** Clean up one section at a time, test, then move to next

