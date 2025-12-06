# 🧪 New User Production Journey Test Checklist

## 🎯 Test Scope
**Environment:** Production (`brandonlacoste9-tech-zyeute.vercel.app` or `zyeuté.com`)  
**Goal:** Verify complete new-user flow from signup to first post/comment

---

## 📋 Test Steps

### 1. Signup Flow
- [ ] Navigate to `/signup`
- [ ] Enter email, password, username
- [ ] Submit form
- [ ] **Expected:** Success message, redirect to email confirmation
- [ ] **Check for glitches:**
  - [ ] Form validation errors
  - [ ] Redirect loops
  - [ ] Error messages unclear

### 2. Email Confirmation
- [ ] Check email inbox
- [ ] Click confirmation link
- [ ] **Expected:** Redirect to app, logged in
- [ ] **Check for glitches:**
  - [ ] Link doesn't work
  - [ ] Redirects to wrong page
  - [ ] Session not created

### 3. First Login
- [ ] After email confirmation, verify logged in
- [ ] **Expected:** See feed/home page
- [ ] **Check for glitches:**
  - [ ] Auth flicker/flash
  - [ ] Redirect loops
  - [ ] Blank screen
  - [ ] Error messages

### 4. Profile Setup
- [ ] Navigate to profile (or prompted)
- [ ] Add minimal profile info (optional)
- [ ] **Expected:** Profile saves successfully
- [ ] **Check for glitches:**
  - [ ] Save button doesn't work
  - [ ] No feedback on save
  - [ ] Data doesn't persist

### 5. First Post Creation
- [ ] Navigate to `/upload` or upload button
- [ ] Select image/video
- [ ] Add caption
- [ ] Submit post
- [ ] **Expected:** Post uploads, redirects to feed, post appears
- [ ] **Check for glitches:**
  - [ ] Upload fails silently
  - [ ] Post succeeds but feed doesn't refetch
  - [ ] Post doesn't appear in feed
  - [ ] Redirect doesn't happen
  - [ ] No success feedback

### 6. First Comment
- [ ] Navigate to a post (click on feed item)
- [ ] Add a comment
- [ ] Submit comment
- [ ] **Expected:** Comment appears immediately
- [ ] **Check for glitches:**
  - [ ] Comment doesn't save
  - [ ] Comment saves but doesn't appear
  - [ ] No feedback on submit
  - [ ] Button disabled with no explanation

### 7. Hard Refresh & Persistence
- [ ] After creating post and comment, hard refresh (Ctrl+F5 / Cmd+Shift+R)
- [ ] **Expected:** Both post and comment still visible
- [ ] **Check for glitches:**
  - [ ] Post disappears
  - [ ] Comment disappears
  - [ ] Feed shows old data
  - [ ] Auth state lost

---

## 🐛 Common Issues to Watch For

### Auth Issues
- [ ] Redirect loops after login
- [ ] Session not persisting
- [ ] Auth state flickering
- [ ] Wrong redirect URLs

### Data Persistence
- [ ] Posts not saving to database
- [ ] Comments not saving
- [ ] Feed not updating after actions
- [ ] Optimistic updates not syncing

### UI/UX Issues
- [ ] Disabled buttons with no feedback
- [ ] Loading states missing
- [ ] Error messages unclear
- [ ] Success feedback missing
- [ ] Navigation breaks

### Performance Issues
- [ ] Slow page loads
- [ ] Feed scroll janky
- [ ] Images not loading
- [ ] Excessive re-renders

---

## 📝 Test Results Template

### Test Run: [Date/Time]

**Tester:** [Name]  
**Environment:** [URL]  
**Browser:** [Chrome/Firefox/Safari]  
**Device:** [Desktop/Mobile]

#### Issues Found:

1. **Issue:** [Description]
   - **Location:** [Page/Component]
   - **Steps to reproduce:** [Steps]
   - **Expected:** [What should happen]
   - **Actual:** [What actually happened]
   - **Severity:** [Critical/High/Medium/Low]

2. **Issue:** [Description]
   - ...

#### Fixed Issues:

1. ✅ **Issue:** [Description]
   - **Fix:** [What was changed]
   - **Verified:** [How it was tested]

---

## ✅ Success Criteria

**Journey is successful if:**
- ✅ User can signup and confirm email
- ✅ User can login and see feed
- ✅ User can create first post
- ✅ Post appears in feed immediately
- ✅ User can comment on post
- ✅ Comment appears immediately
- ✅ Both persist after hard refresh
- ✅ No broken buttons or dead ends
- ✅ Clear feedback at each step

---

## 🔧 Quick Fixes Applied

### Fix 1: Feed Refresh After Upload
**Issue:** Post succeeds but feed doesn't refetch  
**Fix:** Added `refreshFeed` state to trigger feed refresh on navigation  
**File:** `src/pages/Upload.tsx`, `src/pages/Feed.tsx`

### Fix 2: Comment Persistence
**Issue:** Comment saves but doesn't appear immediately  
**Fix:** Added optimistic update + realtime subscription fallback  
**File:** `src/pages/PostDetail.tsx`

### Fix 3: CommentThread Performance
**Issue:** Comment threads re-render unnecessarily  
**Fix:** Added React.memo with custom comparison  
**File:** `src/components/features/CommentThread.tsx`

---

**Last Updated:** Day 4  
**Status:** Ready for testing

