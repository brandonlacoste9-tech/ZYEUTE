# 🧪 Comet Test Plan: Golden Path Validation

## 📋 Pre-Test Information

### **Environment URLs**

**Primary (Production):**
- **Live URL:** `https://zyeute.netlify.app`
- **Status:** ✅ Confirmed live (Netlify deployment)
- **Custom Domain:** `https://zyeuté.com` (still propagating DNS)

**Note:** Use `zyeute.netlify.app` for testing. Custom domain will be available once DNS propagation completes.

**Staging (if available):**
- Check Netlify dashboard for staging URL

---

### **Test Account Setup**

**Option 1: Create Fresh Test Accounts** (Recommended)
- Use signup flow to create new accounts
- This tests the full new-user journey
- **Email domains:** Use disposable emails or your test domain

**Option 2: Use Existing Test Accounts** (If available)
- Admin account: [To be provided by user]
- Non-admin account: [To be provided by user]

**Option 3: Create via Supabase Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email/password
4. ✅ Check "Auto Confirm User" (for testing)
5. For admin: Run SQL: `UPDATE user_profiles SET is_admin = true WHERE id = 'user-id';`

**Note:** Creating fresh accounts via signup is recommended to test the full journey.

---

### **Known Issues to Watch For**

#### **1. Auth Redirect Issues**
- **Potential:** Email confirmation might redirect to wrong page
- **Watch for:** Redirect loops, blank screens, wrong route
- **Expected:** 
  - After signup: Redirects to `/login` with alert message
  - After email confirmation: Redirects to `/` (feed) via `/auth/callback`
  - After login: Redirects to `/` (feed)
- **Known Behavior:** `AuthCallback.tsx` handles OAuth and email confirmation, redirects to `/` on success

#### **2. Feed Refresh Timing**
- **Potential:** Feed might not refresh immediately after post
- **Watch for:** Post doesn't appear, need manual refresh
- **Expected:** Post appears instantly via `refreshFeed` state

#### **3. Comment Optimistic Updates**
- **Potential:** Comment might not appear immediately
- **Watch for:** Comment missing until refresh, no toast feedback
- **Expected:** Comment appears instantly + toast shows

#### **4. Admin Route Protection**
- **Potential:** Non-admin might see error instead of redirect
- **Watch for:** 404 errors, blank pages, error messages
- **Expected:** Smooth redirect to `/` (home) - `ProtectedAdminRoute` redirects non-admins to home
- **Known Behavior:** Shows loading spinner while checking, then redirects if not admin

#### **5. Hard Refresh Persistence**
- **Potential:** Data might not persist after refresh
- **Watch for:** Posts/comments disappear
- **Expected:** All data persists correctly

---

## 🎯 Test Execution Plan

### **Test 1: Post Creation → Feed Refresh**

**Duration:** ~10 minutes  
**Priority:** 🔴 Critical

**Steps:**
1. ✅ Navigate to `https://zyeute.netlify.app`
2. ✅ Login as test user (or create new account)
3. ✅ Navigate to home/feed (`/`)
4. ✅ Look for upload button or "Écris ton premier post" CTA
5. ✅ Click upload/CTA → Should navigate to `/upload`
6. ✅ Upload image/video (use test media)
7. ✅ Add caption: `"Test post from Comet - [TIMESTAMP]"`
8. ✅ Add hashtag if prompted: `#TestComet`
9. ✅ Click submit/publish
10. ✅ **VERIFY:** Toast shows "Post publié! 🔥"
11. ✅ **VERIFY:** Redirects to `/` (feed)
12. ✅ **VERIFY:** Post appears IMMEDIATELY in feed (no refresh needed)
13. ✅ **VERIFY:** Post shows correct caption, timestamp, user info
14. ✅ Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
15. ✅ **VERIFY:** Post STILL appears in feed after refresh
16. ✅ Screenshot: Post in feed
17. ✅ Screenshot: Post detail view (click post)

**Success Criteria:**
- ✅ Post appears immediately (optimistic update)
- ✅ Post persists after hard refresh
- ✅ No console errors
- ✅ Toast feedback shows

**Failure Indicators:**
- ❌ Post doesn't appear until manual refresh
- ❌ Post disappears after hard refresh
- ❌ No toast feedback
- ❌ Redirect doesn't happen
- ❌ Console errors

---

### **Test 2: Comment Persistence**

**Duration:** ~10 minutes  
**Priority:** 🔴 Critical

**Steps:**
1. ✅ Use post from Test 1 (or find any existing post)
2. ✅ Click on post to open detail view (`/p/[post-id]`)
3. ✅ Scroll to comments section
4. ✅ Click comment input field
5. ✅ Type: `"Test comment from Comet - [TIMESTAMP]"`
6. ✅ Click submit/send button
7. ✅ **VERIFY:** Comment appears IMMEDIATELY (optimistic update)
8. ✅ **VERIFY:** Toast shows "Commentaire publié! 💬"
9. ✅ **VERIFY:** Comment count increments
10. ✅ **VERIFY:** Comment shows correct text, user info, timestamp
11. ✅ Hard refresh (Ctrl+Shift+R)
12. ✅ **VERIFY:** Comment PERSISTS after refresh
13. ✅ **VERIFY:** Comment still shows correct data
14. ✅ Screenshot: Comment in thread
15. ✅ Screenshot: Comment after refresh

**Success Criteria:**
- ✅ Comment appears instantly (optimistic update)
- ✅ Toast feedback shows
- ✅ Comment persists after hard refresh
- ✅ No console errors

**Failure Indicators:**
- ❌ Comment doesn't appear until refresh
- ❌ Comment disappears after hard refresh
- ❌ No toast feedback
- ❌ Comment count doesn't update
- ❌ Console errors

---

### **Test 3: Admin Security**

**Duration:** ~10 minutes  
**Priority:** 🟡 High (Security)

**Steps:**

**Part A: Non-Admin Access Test**
1. ✅ Logout (if logged in)
2. ✅ Login as NON-ADMIN user
3. ✅ Verify logged in successfully
4. ✅ Navigate directly to: `https://zyeute.netlify.app/moderation`
5. ✅ **VERIFY:** Redirects (not error page)
6. ✅ **VERIFY:** Redirects to `/` or `/login` (not 404)
7. ✅ **VERIFY:** No error messages shown
8. ✅ **VERIFY:** Console shows security log (if visible)
9. ✅ Screenshot: Redirect result

**Part B: Admin Access Test**
10. ✅ Logout
11. ✅ Login as ADMIN user
12. ✅ Navigate to: `https://zyeute.netlify.app/moderation`
13. ✅ **VERIFY:** Access GRANTED (no redirect)
14. ✅ **VERIFY:** Moderation dashboard loads
15. ✅ **VERIFY:** Can see moderation tools/content
16. ✅ Screenshot: Moderation dashboard

**Success Criteria:**
- ✅ Non-admin redirected smoothly
- ✅ Admin granted access
- ✅ No error pages
- ✅ Security logging works

**Failure Indicators:**
- ❌ Non-admin sees error page (should redirect)
- ❌ Admin redirected (should have access)
- ❌ 404 errors
- ❌ Blank pages

---

## 📊 Test Results Template

### **Test Run: [Date/Time]**

**Tester:** Comet  
**Environment:** Production (`https://zyeute.netlify.app`)  
**Browser:** [Chrome/Firefox/Safari]  
**Device:** [Desktop/Mobile]

---

### **Test 1 Results: Post Creation → Feed Refresh**

**Status:** ✅ Pass / ❌ Fail / ⚠️ Partial

**Issues Found:**
1. [Issue description]
   - **Step:** [Which step]
   - **Expected:** [What should happen]
   - **Actual:** [What happened]
   - **Screenshot:** [Link/attachment]
   - **Severity:** Critical/High/Medium/Low

**Screenshots:**
- [ ] Post upload form
- [ ] Post in feed (immediate)
- [ ] Post in feed (after refresh)
- [ ] Post detail view

**Console Errors:** [List any errors]

---

### **Test 2 Results: Comment Persistence**

**Status:** ✅ Pass / ❌ Fail / ⚠️ Partial

**Issues Found:**
1. [Issue description]
   - **Step:** [Which step]
   - **Expected:** [What should happen]
   - **Actual:** [What happened]
   - **Screenshot:** [Link/attachment]
   - **Severity:** Critical/High/Medium/Low

**Screenshots:**
- [ ] Comment input
- [ ] Comment in thread (immediate)
- [ ] Comment in thread (after refresh)
- [ ] Toast notification

**Console Errors:** [List any errors]

---

### **Test 3 Results: Admin Security**

**Status:** ✅ Pass / ❌ Fail / ⚠️ Partial

**Non-Admin Test:**
- [ ] Redirected correctly
- [ ] No error page
- [ ] Security log visible

**Admin Test:**
- [ ] Access granted
- [ ] Dashboard loads
- [ ] Tools functional

**Issues Found:**
1. [Issue description]
   - **Step:** [Which step]
   - **Expected:** [What should happen]
   - **Actual:** [What happened]
   - **Screenshot:** [Link/attachment]
   - **Severity:** Critical/High/Medium/Low

**Screenshots:**
- [ ] Non-admin redirect
- [ ] Admin dashboard
- [ ] Access denied message (if any)

**Console Errors:** [List any errors]

---

## 🔧 Quick Fixes Reference

### **If Post Doesn't Appear Immediately:**
- Check `Feed.tsx` line 75-80 (refreshFeed listener)
- Check `Upload.tsx` line 98 (refreshFeed state)

### **If Comment Doesn't Appear:**
- Check `PostDetail.tsx` line 143-163 (optimistic update)
- Check realtime subscription (line 96-115)

### **If Admin Redirect Fails:**
- Check `ProtectedAdminRoute.tsx` (admin check logic)
- Check `App.tsx` line 415 (route protection)

---

## 📝 Notes for Comet

**Browser Console:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**Screenshot Tips:**
- Capture full page (not just viewport)
- Include URL bar in screenshots
- Show toast notifications if visible
- Capture console errors if any

**Timing:**
- Note delays between actions
- Note if optimistic updates are instant
- Note if refreshes are slow

---

## ✅ Ready to Execute

**Once you have:**
1. ✅ Test account credentials (or created new ones)
2. ✅ Confirmed URL is live
3. ✅ Browser DevTools ready

**Execute all 3 tests and provide:**
- ✅ Screenshots of each step
- ✅ List of issues found
- ✅ Console errors (if any)
- ✅ Recommendations for fixes

**Timeline:** ~30-40 minutes

---

**Let's lock the golden path! 🔥⚜️**

