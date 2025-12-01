# 🔍 OAuth Debug Testing Guide

## Quick Testing Steps

### 1. Open App in Incognito
👉 `https://zyeute.com` (private/incognito window)

### 2. Open DevTools Console
- Right click → Inspect → Console tab
- Clear console logs (optional)

### 3. Click "Continuer avec Google"

---

## 🟢 Expected Working Flow

Console should show:

```
🔵 Initiating Google OAuth...
[Browser redirects to Google]
[User completes Google login]
[Browser redirects back]
🔍 AuthCallback mounted
Current URL: https://zyeute.com/auth/callback?code=...
Hash: 
Search params: ?code=...&provider=google
Code param: [some code]
Exchanging OAuth code for session...
✅ Session established: { user: ..., expiresAt: ... }
[Redirects to /]
```

**Result:** ✅ User is logged in and on home feed

---

## 🔴 Common Failure Patterns

### Pattern 1: Never Reaches Callback
**Console shows:**
```
🔵 Initiating Google OAuth...
[nothing after this]
```

**Final URL:** `https://zyeute.com/login` (stays on login page)

**Cause:** Redirect URL mismatch

**Fix:**
- Verify `https://zyeute.com/auth/callback` is in Supabase Redirect URLs
- Verify Google Cloud Console has `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`

---

### Pattern 2: Reaches Callback But No Code
**Console shows:**
```
🔍 AuthCallback mounted
Current URL: https://zyeute.com/auth/callback
Hash: #access_token=...
Search params: 
Code param: null
No code param found, checking for hash-based OAuth...
```

**Final URL:** `https://zyeute.com/auth/callback` (stuck)

**Cause:** Supabase using hash-based OAuth instead of code-based

**Fix:**
- This should still work via `detectSessionInUrl`
- Wait for `Auth state change: SIGNED_IN` log
- If no session after 3 seconds, check Supabase configuration

---

### Pattern 3: Code Exchange Fails
**Console shows:**
```
Code param: abc123
Exchanging OAuth code for session...
❌ OAuth exchange error: [error message]
```

**Final URL:** `https://zyeute.com/login?error=...`

**Cause:** Invalid code or Supabase configuration issue

**Fix:**
- Check error message details
- Verify Supabase project URL matches environment variables
- Check Supabase Dashboard → Logs for auth errors

---

### Pattern 4: No Session Established
**Console shows:**
```
✅ Session established: { user: ..., expiresAt: ... }
[But then redirects back to /login]
```

**OR**

```
❌ No session established after OAuth callback
Current URL: https://zyeute.com/auth/callback
```

**Final URL:** `https://zyeute.com/login?error=no_session`

**Cause:** Session not being stored or ProtectedRoute rejecting

**Fix:**
- Check if session is actually stored: `supabase.auth.getSession()` in console
- Verify `ProtectedRoute` component isn't rejecting valid sessions
- Check browser storage (localStorage) for Supabase session

---

## 📋 What to Share After Testing

Copy/paste:

1. **Console logs** (everything from clicking button to final state)
2. **Final URL** (what URL are you on after OAuth completes?)
3. **Quick summary:**
   - Did it reach `/auth/callback`? ✅ or ❌
   - Did you see `✅ Session established`? ✅ or ❌
   - Where did you end up? (`/login` or `/` or `/auth/callback`)

---

## 🔧 Quick Manual Checks

### Check Session in Console
After OAuth, open console and run:
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

If `session` is `null`, the session wasn't stored.

### Check Redirect URLs
In Supabase Dashboard → Auth → URL Configuration:
- Site URL should be: `https://zyeute.com`
- Redirect URLs should include: `https://zyeute.com/auth/callback`

### Check Google Cloud Console
Authorized redirect URIs should include:
- `https://vuanulvyqkfefmjcikfk.supabase.co/auth/v1/callback`

---

## 🎯 Most Likely Issues

Based on "looping back to login page":

1. **Redirect URL mismatch** (most common)
   - Supabase doesn't recognize the callback URL
   - Fix: Add exact URL to Supabase Redirect URLs

2. **Session not being stored**
   - OAuth succeeds but session isn't persisted
   - Fix: Check `detectSessionInUrl: true` in supabase.ts

3. **ProtectedRoute rejecting session**
   - Session exists but route guard doesn't see it
   - Fix: Check ProtectedRoute logic in App.tsx

---

Ready to test! Share your console logs and I'll pinpoint the exact issue. 🎯

