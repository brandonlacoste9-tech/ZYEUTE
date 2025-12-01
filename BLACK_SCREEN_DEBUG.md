# 🖥️ Black Screen Debug Guide

## Quick Checks

### 1. Open Browser Console (F12 → Console tab)

**What errors do you see?**
- Copy/paste ALL red error messages
- Look for:
  - `Failed to load module`
  - `Cannot find module`
  - `ReferenceError`
  - `TypeError`

---

### 2. Check Network Tab (F12 → Network tab)

**Are files loading?**
- Look for `index.html` → Should be 200 (success)
- Look for `index-*.js` → Should be 200 (success)
- Look for `index-*.css` → Should be 200 (success)

**If any show 404 or failed:**
→ Files aren't being served correctly

---

### 3. Check if HTML is Loading

**Right-click → View Page Source**

**Do you see:**
- ✅ HTML content → HTML is loading
- ❌ Blank/empty → Server issue

---

## Most Common Causes

### Cause 1: JavaScript Error
**Symptom:** Console shows red errors

**Fix:** Share the error message, I'll fix it

---

### Cause 2: Missing Environment Variables
**Symptom:** Console shows `VITE_SUPABASE_URL` is undefined

**Fix:** Check Netlify environment variables

---

### Cause 3: Import Path Error
**Symptom:** Console shows `Cannot find module '@/...'`

**Fix:** Check `vite.config.ts` path aliases

---

## 🆘 What I Need

**Please share:**
1. **Browser console errors** (F12 → Console → Copy all red errors)
2. **Network tab status** (Are files loading? Any 404s?)
3. **What URL are you visiting?** (`zyeute.com` or Netlify URL?)

**Once I see the console errors, I can fix it immediately!**

