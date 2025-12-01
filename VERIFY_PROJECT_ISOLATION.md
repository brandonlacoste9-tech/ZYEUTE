# ✅ Verify Zyeuté Project Isolation

## 🎯 Goal: Ensure Zyeuté is NOT connected to Krypttrac

---

## ✅ Correct Configuration

**Zyeuté Supabase Project:**
- Project ID: `vuanulvyqkfefmjcikfk`
- URL: `https://vuanulvyqkfefmjcikfk.supabase.co`

**Krypttrac Supabase Project:**
- Project ID: `kihxqurnmyxnsyqgpdaw`
- URL: `https://kihxqurnmyxnsyqgpdaw.supabase.co` ❌ **DO NOT USE**

---

## 🔍 Verification Steps

### 1. Check Netlify Environment Variables

**Go to:** Netlify Dashboard → Your Site → Site Settings → Environment Variables

**Required Variables:**
```
VITE_SUPABASE_URL = https://vuanulvyqkfefmjcikfk.supabase.co
VITE_SUPABASE_ANON_KEY = [your Zyeuté anon key]
```

**❌ WRONG (Krypttrac):**
```
VITE_SUPABASE_URL = https://kihxqurnmyxnsyqgpdaw.supabase.co  ← DELETE THIS
```

---

### 2. Check Browser Console

**Open your site** → Press F12 → Console tab

**✅ CORRECT:**
```
[Supabase] Using URL: https://vuanulvyqkfefmjcikfk.supabase.co
[Supabase] Expected project: vuanulvyqkfefmjcikfk
```

**❌ WRONG:**
```
[Supabase] Using URL: https://kihxqurnmyxnsyqgpdaw.supabase.co
❌ WRONG SUPABASE PROJECT! Using kihxqurnmyxnsyqgpdaw instead of vuanulvyqkfefmjcikfk
```

---

### 3. Verify Supabase Dashboard

**Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk

**Check:**
- ✅ Project name is "Zyeuté" (or your Zyeuté project name)
- ✅ Project ID is `vuanulvyqkfefmjcikfk`
- ❌ NOT `kihxqurnmyxnsyqgpdaw` (that's Krypttrac)

---

### 4. Check Code References

**Search your codebase for:**
```bash
grep -r "kihxqurnmyxnsyqgpdaw" .
```

**Should only find:**
- Documentation files (can be cleaned up)
- Error detection code (correct - it warns if wrong project is used)

**Should NOT find:**
- Actual configuration files using Krypttrac project ID
- Environment variable files (.env) with Krypttrac URL

---

## 🛠️ Fix If Wrong Project Detected

### Step 1: Update Netlify Environment Variables

1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Find `VITE_SUPABASE_URL`
4. Change to: `https://vuanulvyqkfefmjcikfk.supabase.co`
5. Save

### Step 2: Get Correct Anon Key

1. Go to: https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk/settings/api
2. Copy "anon public" key
3. Update `VITE_SUPABASE_ANON_KEY` in Netlify

### Step 3: Redeploy

Netlify will automatically rebuild with new environment variables.

---

## ✅ Verification Checklist

- [ ] Netlify `VITE_SUPABASE_URL` = `https://vuanulvyqkfefmjcikfk.supabase.co`
- [ ] Netlify `VITE_SUPABASE_ANON_KEY` = Zyeuté anon key (not Krypttrac)
- [ ] Browser console shows `vuanulvyqkfefmjcikfk`
- [ ] No errors about wrong project
- [ ] Supabase Dashboard shows Zyeuté project (not Krypttrac)

---

## 📝 Notes

- The code has built-in checks to detect if the wrong project is used
- If you see `❌ WRONG SUPABASE PROJECT!` in console, update Netlify env vars
- Old documentation files may reference Krypttrac - these are just docs, not active config

