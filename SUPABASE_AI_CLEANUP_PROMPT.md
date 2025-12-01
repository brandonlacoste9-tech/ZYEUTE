# 🤖 Supabase AI Cleanup Prompt

## Copy/Paste This Into Supabase AI Chat

---

```
I need help cleaning up my Supabase project (vuanulvyqkfefmjcikfk - Zyeuté).

My project got mixed up with another project called "Krypttrac" (project ID: kihxqurnmyxnsyqgpdaw).

Can you help me:

1. **Check OAuth Redirect URLs:**
   - List all current redirect URLs in Authentication → URL Configuration
   - Identify any URLs containing "vercel.app" or "kihxqurnmyxnsyqgpdaw" (Krypttrac)
   - Show me which ones should be removed

2. **Clean Redirect URLs:**
   - Remove all URLs containing "vercel.app"
   - Remove all URLs containing "kihxqurnmyxnsyqgpdaw" (Krypttrac project)
   - Keep only:
     - https://zyeute.netlify.app
     - https://zyeute.netlify.app/**
     - https://zyeute.com
     - https://zyeute.com/**
     - https://www.zyeute.com
     - https://www.zyeute.com/**
     - http://localhost:5173
     - http://localhost:5173/**

3. **Check Site URL:**
   - What is the current Site URL?
   - Should it be: https://zyeute.netlify.app

4. **Check Google OAuth Provider:**
   - Verify Google OAuth is configured correctly
   - Ensure it's pointing to the correct project (vuanulvyqkfefmjcikfk)
   - Not pointing to Krypttrac (kihxqurnmyxnsyqgpdaw)

5. **Check Database:**
   - List all tables in the public schema
   - Identify any tables that might be from Krypttrac project
   - Show me which tables belong to Zyeuté vs Krypttrac

6. **Check Storage Buckets:**
   - List all storage buckets
   - Identify any buckets from Krypttrac
   - Show me which buckets belong to Zyeuté

7. **Verify Project Isolation:**
   - Confirm this project (vuanulvyqkfefmjcikfk) is completely separate from Krypttrac (kihxqurnmyxnsyqgpdaw)
   - No shared configurations or references

Please provide a cleanup plan and help me execute it step by step.
```

---

## 🎯 How to Use

1. **Go to:** https://supabase.com/dashboard/project/vuanulvyqkfefmjcikfk
2. **Click:** "AI Assistant" or "Ask AI" (usually in the sidebar or top bar)
3. **Paste:** The prompt above
4. **Follow:** Supabase AI's guidance to clean up

---

## 📝 What Supabase AI Can Do

- ✅ List current OAuth redirect URLs
- ✅ Identify URLs to remove
- ✅ Help remove unwanted URLs
- ✅ Check database tables
- ✅ Check storage buckets
- ✅ Verify project isolation
- ✅ Provide cleanup SQL queries (if needed)

---

## ⚠️ Important Notes

- **Backup first:** Take screenshots of current settings before cleanup
- **Test after:** After cleanup, test login/logout to ensure it works
- **One step at a time:** Let Supabase AI guide you through each step

---

## 🔍 Alternative: Manual Checklist

If Supabase AI isn't available, use `SUPABASE_CLEANUP.md` for manual steps.

