# Comet - Detailed Testing Protocol

Hey Comet! 🐝

This is your DETAILED testing protocol with exact steps for browser automation.

---

## You're Starting With

**Current:** App open at `https://zyeute.netlify.app`  
**Browser:** Ready  
**DevTools:** F12 to open  
**Time:** 2-3 hours  
**Goal:** Validate everything works perfectly

---

## TEST 1: Feed Display Validation (30 min)

### Part A: Initial State Check (5 min)

**Step 1: Take baseline screenshot**
- Current URL: Check address bar
- Current page: Feed/Home
- Action: Take full page screenshot
- Save as: `feed-initial.png`

**Step 2: Open DevTools Console**
- Press F12
- Click Console tab
- Action: Screenshot console
- Look for: Any red errors, especially 400 errors
- Save as: `console-initial.png`

**Step 3: Check Network Tab**
- Click Network tab in DevTools
- Refresh page (F5)
- Look for: Any failed requests (red)
- Look for: `/rest/v1/posts` or `/rest/v1/publications` calls
- Check: Status codes (should be 200, not 400)
- Action: Screenshot network tab
- Save as: `network-feed.png`

**Expected:** 
- Posts display in feed
- No console errors
- API calls return 200 OK

---

### Part B: Fire Button Test (5 min)

**Step 4: Locate a post**
- Find any post in the feed
- Locate the fire icon/button (🔥)

**Step 5: Click fire button**
- Action: Click the fire icon
- Observe: Button state change (filled/unfilled)
- Observe: Count increment
- Check console: Any errors?
- Action: Screenshot after click
- Save as: `fire-clicked.png`

**Step 6: Verify persistence**
- Refresh page (F5)
- Find the same post
- Check: Fire state persisted?
- Action: Screenshot
- Save as: `fire-persisted.png`

**Expected:**
- Fire count increases immediately
- State persists after refresh
- No console errors

---

### Part C: Comment Test (10 min)

**Step 7: Open post detail**
- Click on a post (anywhere on the card)
- Should navigate to `/p/[post-id]`
- Verify: URL changed
- Verify: Post detail loads
- Action: Screenshot
- Save as: `post-detail.png`

**Step 8: Write comment**
- Find comment input field
- Click in the input
- Type: "Test comment from Comet - [timestamp]"
- Action: Screenshot with text
- Save as: `comment-typing.png`

**Step 9: Submit comment**
- Click submit/send button
- Observe: Comment appears immediately (optimistic update)
- Check: Toast notification appears
- Check console: Any errors?
- Action: Screenshot after submit
- Save as: `comment-submitted.png`

**Step 10: Verify persistence**
- Refresh page (F5)
- Scroll to comments section
- Find your comment
- Verify: Comment still there
- Action: Screenshot
- Save as: `comment-persisted.png`

**Expected:**
- Comment appears immediately
- Toast notification shows
- Comment persists after refresh
- No console errors

---

### Part D: Post Creation Test (10 min)

**Step 11: Navigate to create post**
- Look for "Create Post" button or upload button
- Click it
- Verify: Post creation form/modal opens

**Step 12: Fill post form**
- Enter text content: "Test post from Comet - [timestamp]"
- Add image (if possible)
- Action: Screenshot form
- Save as: `post-form.png`

**Step 13: Submit post**
- Click submit/post button
- Observe: Loading state
- Observe: Redirect to feed
- Action: Screenshot

**Step 14: Verify post in feed**
- Look for your test post in feed
- Should be at/near top
- Action: Screenshot
- Save as: `post-in-feed.png`

**Step 15: Refresh and verify**
- Refresh page (F5)
- Look for test post again
- Verify: Still there
- Action: Screenshot
- Save as: `post-persisted.png`

**Expected:**
- Post appears in feed immediately
- Post persists after refresh
- No errors

---

## TEST 2: Page Navigation (30 min)

### Navigate to Each Page and Document

**For each page:**
1. Navigate to URL
2. Wait for page load
3. Take screenshot
4. Check console for errors
5. Test main interaction
6. Document findings

---

### Page 1: Profile

**Step 1: Navigate**
- URL: `https://zyeute.netlify.app/profile/[any-username]`
- Or: Click on a username anywhere in app

**Step 2: Inspect**
- [ ] Profile info displays
- [ ] User posts display
- [ ] No 400 errors in console
- [ ] Page is responsive

**Step 3: Test interaction**
- Click "Follow" button (if present)
- Verify: Button state changes
- Screenshot: `profile-page.png`

**Step 4: Check console**
- Any errors?
- Any warnings?
- Screenshot console if issues: `profile-console.png`

---

### Page 2: Explore

**Step 1: Navigate**
- URL: `https://zyeute.netlify.app/explore`
- Or: Click Explore in navigation

**Step 2: Inspect**
- [ ] Search bar visible
- [ ] Hashtag buttons visible
- [ ] Region buttons visible
- [ ] Posts display

**Step 3: Test search**
- Click in search bar
- Type: "Quebec"
- Wait 1 second (debouncing)
- Check Network tab: API call after delay
- Screenshot: `explore-search.png`

**Step 4: Test filters**
- Click hashtag: "#Poutine"
- Observe: Posts filter
- Screenshot: `explore-filter-hashtag.png`
- Click region: "Montreal"
- Observe: Posts filter further
- Screenshot: `explore-filter-region.png`
- Click "Clear filters"
- Observe: Filters reset
- Screenshot: `explore-cleared.png`

**Step 5: Check console**
- Any errors?
- Screenshot if issues: `explore-console.png`

---

### Page 3: Settings

**Step 1: Navigate**
- URL: `https://zyeute.netlify.app/settings`

**Step 2: Inspect main settings**
- [ ] All sections visible
- [ ] All buttons clickable
- Screenshot: `settings-main.png`

**Step 3: Test Notifications settings**
- Click "Notifications" link
- Navigate to: `/settings/notifications`
- Find toggle switches
- Click first toggle
- Observe: Toast notification
- Refresh page
- Verify: Setting persisted
- Screenshot: `settings-notifications.png`

**Step 4: Test Privacy settings**
- Navigate to: `/settings/privacy`
- Test toggles
- Verify persistence
- Screenshot: `settings-privacy.png`

**Step 5: Test Profile Edit**
- Navigate to: `/settings/profile`
- Try editing username or bio
- Click save
- Verify: Toast appears
- Screenshot: `settings-profile.png`

---

### Page 4: Post Detail

**Step 1: Navigate**
- Click any post from feed
- Should go to: `/p/[post-id]`

**Step 2: Inspect**
- [ ] Post content displays
- [ ] Comments display
- [ ] Fire button works
- [ ] Comment input visible

**Step 3: Test interactions**
- Click fire button
- Verify: Works
- Type comment
- Submit comment
- Verify: Appears
- Screenshot: `post-detail-full.png`

---

### Page 5: Marketplace

**Step 1: Navigate**
- URL: `https://zyeute.netlify.app/marketplace`

**Step 2: Inspect**
- [ ] Page loads
- [ ] No errors
- Screenshot: `marketplace.png`

**Note:** May be incomplete feature - document current state

---

## TEST 3: Mobile View Testing (20 min)

### Switch to Mobile Emulation

**Step 1: Enable Device Toolbar**
- In DevTools: Press Ctrl+Shift+M
- Or: Click device icon in DevTools
- Select: "iPhone 12 Pro" or "iPhone 13"

**Step 2: Test Feed on Mobile**
- Navigate: `https://zyeute.netlify.app/`
- Check: Layout looks good
- Check: Text not cut off
- Check: Buttons big enough to tap
- Check: No horizontal scroll
- Action: Scroll through feed
- Screenshot: `mobile-feed.png`

**Step 3: Test Settings on Mobile**
- Navigate: `/settings`
- Check: All buttons accessible
- Check: Text readable
- Try: Clicking settings items
- Screenshot: `mobile-settings.png`

**Step 4: Test Post Detail on Mobile**
- Click a post
- Check: Content displays well
- Check: Comment input not covered by keyboard
- Screenshot: `mobile-post-detail.png`

**Step 5: Check for Issues**
- [ ] Any text cutoff?
- [ ] Buttons too small?
- [ ] Horizontal scrolling?
- [ ] Elements overlapping?

**Document:**
- List all mobile issues found
- Screenshot each issue
- Note severity (critical/medium/minor)

---

## TEST 4: Authentication Flow (20 min)

### Test Signup

**Step 1: Navigate to signup**
- URL: `https://zyeute.netlify.app/signup`

**Step 2: Fill form**
- Username: `comet_test_[timestamp]`
- Email: `comet.test.[timestamp]@gmail.com`
- Password: `Test123456!`
- Screenshot: `signup-form.png`

**Step 3: Submit**
- Click "Create Account" button
- Observe: Any loading state
- Observe: Redirect happens
- Check console: Any React DOM errors?
- Expected: Redirect to login or feed
- Screenshot: `signup-redirect.png`

**Step 4: Check for errors**
- Console: Any errors?
- Page: Error messages?
- Document: Any issues

### Test Login

**Step 5: Navigate to login**
- URL: `https://zyeute.netlify.app/login`

**Step 6: Fill form**
- Email: (use test account or new account)
- Password: (matching password)
- Screenshot: `login-form.png`

**Step 7: Submit**
- Click "Login" button
- Observe: Redirect to feed
- Verify: User logged in (avatar in header?)
- Screenshot: `login-success.png`

**Step 8: Verify session**
- Refresh page
- Verify: Still logged in
- Check: Session persists

---

## TEST 5: Performance Metrics (15 min)

### Measure Performance

**Step 1: Open Performance Tab**
- DevTools → Performance tab
- Clear any previous recordings

**Step 2: Record page load**
- Navigate to: `https://zyeute.netlify.app/`
- Start recording in Performance tab
- Refresh page (F5)
- Wait for page fully loaded
- Stop recording

**Step 3: Analyze metrics**
- Check: Load time
- Check: Time to Interactive (TTI)
- Check: Largest Contentful Paint (LCP)
- Check: First Input Delay (FID)
- Screenshot: Performance metrics

**Step 4: Test scroll performance**
- Scroll through feed quickly
- Observe: Smooth or janky?
- Observe: Images loading fast?
- Note: Any lag or stuttering

**Step 5: Test interaction latency**
- Click fire button
- Measure: How fast does it respond?
- Click comment
- Measure: How fast does modal open?

**Document:**
- Load time: [X seconds]
- TTI: [X seconds]
- LCP: [X seconds]
- Scroll: Smooth/Janky
- Interactions: Fast/Slow
- Screenshots of metrics

---

## TEST 6: Error Scenarios (20 min)

### Try to Break Things

**Scenario 1: Empty Comment**
- Open post detail
- Leave comment field empty
- Try to submit
- Expected: Validation error or disabled button
- Document: What happens?

**Scenario 2: Very Long Comment**
- Type 1000+ characters
- Try to submit
- Expected: Character limit or warning
- Document: What happens?

**Scenario 3: Special Characters**
- Try: `<script>alert('xss')</script>` in comment
- Expected: Sanitized or rejected
- Document: How is it handled?

**Scenario 4: Network Offline**
- DevTools → Network tab
- Check "Offline" checkbox
- Try to post or comment
- Expected: Error message to user
- Document: Error handling

**Scenario 5: Rapid Clicking**
- Click fire button 10 times rapidly
- Expected: Rate limiting or debouncing
- Document: What happens?

---

## TEST 7: Visual Quality Assurance (15 min)

### UI/UX Polish Check

**Check Feed Page:**
- [ ] Consistent spacing between posts
- [ ] Images loading properly
- [ ] Buttons aligned correctly
- [ ] Text readable (not cut off)
- [ ] Colors match theme (gold accents)
- [ ] Loading states show correctly
- [ ] Animations smooth

**Check Settings:**
- [ ] Toggle switches work smoothly
- [ ] Labels aligned
- [ ] Sections organized
- [ ] Navigation clear

**Check Overall:**
- [ ] Consistent fonts
- [ ] Consistent button styles
- [ ] Proper hover states
- [ ] Loading spinners
- [ ] Toast notifications visible and styled

**Document:**
- Screenshot any visual bugs
- List inconsistencies
- Note polish opportunities

---

## Reporting Template

### Test Report Format

```markdown
# Comet Test Report - [Date/Time]

## Summary
- Tests Run: X
- Tests Passed: X
- Tests Failed: X
- Issues Found: X

## TEST 1: Feed Display
**Status:** ✅ PASS / ⚠️ PARTIAL / ❌ FAIL

**What Worked:**
- [List]

**Issues Found:**
1. **Issue:** [Description]
   - **Severity:** Critical/High/Medium/Low
   - **Steps to Reproduce:** [Steps]
   - **Expected:** [What should happen]
   - **Actual:** [What happened]
   - **Screenshot:** [Filename]
   - **Console Errors:** [Error text]

**Performance:**
- Load time: [X seconds]
- Interactions: Fast/Slow

**Screenshots:**
- feed-initial.png
- console-initial.png
- [others]

---

## TEST 2: Navigation
[Same format]

---

## Overall Assessment

**Production Ready:** Yes/No/Partial

**Critical Blockers:**
1. [Issue]
2. [Issue]

**Recommendations:**
1. [Fix suggestion]
2. [Fix suggestion]

**Next Steps:**
- [Action items]
```

---

## Quick Reference: Browser Actions

### Taking Screenshots
- **Full page:** DevTools → Click camera icon
- **Element:** Right-click element → "Capture node screenshot"
- **Viewport:** DevTools → Screenshot icon in toolbar

### Checking Console
- **Open:** F12 → Console tab
- **Clear:** Click clear icon
- **Filter:** Use filter box at top
- **Errors only:** Click "Errors" filter

### Checking Network
- **Open:** F12 → Network tab
- **Clear:** Click clear icon
- **Filter:** XHR for API calls
- **Details:** Click request to see details

### Mobile Testing
- **Enable:** Ctrl+Shift+M or click device icon
- **Devices:** Select from dropdown
- **Rotate:** Click rotate icon
- **Throttling:** Select network speed

---

## Priority Testing Order

### CRITICAL (Do First - 60 min)
1. TEST 1: Feed display (30 min)
2. TEST 4: Authentication (20 min)
3. Quick console check across all pages (10 min)

### HIGH (Do Second - 45 min)
4. TEST 2: Navigation (30 min)
5. TEST 3: Settings functionality (15 min)

### MEDIUM (Do Third - 45 min)
6. TEST 5: Performance (15 min)
7. TEST 6: Error scenarios (20 min)
8. TEST 4: Mobile view (10 min added)

### NICE TO HAVE (If Time - 30 min)
9. TEST 7: Visual QA (15 min)
10. Cross-browser testing (15 min)

---

## What I Need From You

### Minimum (Critical)
- [ ] Feed works or doesn't work
- [ ] Auth works or doesn't work
- [ ] Console errors (if any)
- [ ] Screenshots of issues

### Ideal (Comprehensive)
- [ ] All 10 tests complete
- [ ] Detailed report
- [ ] Screenshots of everything
- [ ] Performance metrics
- [ ] Recommendations

---

## Communication Protocol

### Report Immediately If:
- ❌ App is broken/not loading
- ❌ Critical feature doesn't work
- ❌ Console full of errors
- ❌ Can't proceed with testing

### Report After Each Test:
- Quick summary in chat
- "TEST 1 COMPLETE: ✅ Feed works, no errors"
- Or: "TEST 1 FAIL: ❌ Feed not displaying, 400 errors"

### Final Report:
- Comprehensive markdown document
- All screenshots
- All findings
- Recommendations

---

## START NOW 🚀

**Your first action:**
1. Take screenshot of current app state
2. Open DevTools (F12)
3. Check console for errors
4. Report: "Starting TEST 1: Feed Display"

**Then proceed through TEST 1 steps 1-15**

**You've got this! Your browser automation skills are perfect for this!** 🐝🔥

---

**Let's validate Zyeuté works perfectly!** 🇨🇦⚜️

