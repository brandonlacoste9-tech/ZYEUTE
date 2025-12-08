# 🔍 Supabase Project Verification Guide

> **⚠️ DEPLOYMENT NOTE**: Zyeuté now deploys with Vercel; Netlify artifacts and CLI are unsupported.  
> Update all references to use Vercel Dashboard instead of Netlify.

## Why This Matters

If your app is connected to the **wrong Supabase project** (e.g., Krypttrac instead of Zyeuté), you'll experience:
- ❌ OAuth failures
- ❌ Session/token mismatches
- ❌ 401 errors
- ❌ Redirect loops
- ❌ Database queries hitting wrong tables

---

## ✅ Quick Verification

### Step 1: Check Browser Console

Open your app (`https://zyeute.com`) and check the console. You should see:

```
[Supabase] Using URL: https://vuanulvyqkfefmjcikfk.supabase.co
[Supabase] Expected project: vuanulvyqkfefmjcikfk
```

**✅ If you see `vuanulvyqkfefmjcikfk`** → Correct project!

**❌ If you see `kihxqurnmyxnsyqgpdaw`** → Wrong project (Krypttrac)!

---

### Step 2: Verify Vercel Environment Variables

**Go to:** Vercel Dashboard → Project Settings → Environment Variables

Check these variables:

```
VITE_SUPABASE_URL = https://vuanulvyqkfefmjcikfk.supabase.co
VITE_SUPABASE_ANON_KEY = [your anon key from Zyeuté project]
```

**Important:** 
- The URL must end with `vuanulvyqkfefmjcikfk.supabase.co`
- NOT `kihxqurnmyxnsyqgpdaw.supabase.co` (that's Krypttrac)

---

### Step 3: Check Supabase CLI Link (if using CLI)

If you use Supabase CLI locally:

```bash
# Check current link
supabase projects list

# If linked to wrong project, unlink
# (Remove .supabase/config.toml or run unlink command)

# Link to correct project
supabase link --project-ref vuanulvyqkfefmjcikfk
```

---

## 🔧 How to Fix Wrong Project Connection

### Fix 1: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Find `VITE_SUPABASE_URL`
3. Update to: `https://vuanulvyqkfefmjcikfk.supabase.co`
4. Save and trigger a new deployment

### Fix 2: Verify Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk
2. Verify this is your **Zyeuté** project (not Krypttrac)
3. Copy the **anon key** from Settings → API
4. Update `VITE_SUPABASE_ANON_KEY` in Vercel

### Fix 3: Check Code Configuration

Verify `src/lib/supabase.ts` uses environment variables:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**Don't hardcode** project IDs or keys!

---

## 🧪 Test Script

Run the verification script:

```bash
node scripts/verify-supabase-project.js
```

This will:
- ✅ Check which project ID is being used
- ✅ Warn if it's the wrong project
- ✅ Test the connection
- ✅ Show current user (if logged in)

---

## 📋 Project IDs Reference

| Project | Project ID | Status |
|---------|-----------|--------|
| **Zyeuté** | `vuanulvyqkfefmjcikfk` | ✅ **CORRECT** |
| Krypttrac | `kihxqurnmyxnsyqgpdaw` | ❌ Wrong |
| Other projects | Various | ❌ Wrong |

---

## 🚨 If You're Connected to Wrong Project

1. **Update Vercel environment variables** (most important!)
2. **Trigger a new deployment**
3. **Clear browser cache** and test again
4. **Verify in console** that correct project ID appears

---

## ✅ Verification Checklist

- [ ] Browser console shows `vuanulvyqkfefmjcikfk`
- [ ] Vercel `VITE_SUPABASE_URL` = `https://vuanulvyqkfefmjcikfk.supabase.co`
- [ ] Vercel `VITE_SUPABASE_ANON_KEY` matches Zyeuté project
- [ ] No references to `kihxqurnmyxnsyqgpdaw` in code
- [ ] Supabase CLI linked to correct project (if using CLI)

---

Once verified, test OAuth again. The wrong project connection could definitely cause OAuth failures!

