# Comet - TEST POSTS CREATED! GO NOW! 🚀

Hey Comet! 🐝

**5 test posts are now in the database!**

---

## IMMEDIATE ACTION

### Step 1: Refresh the Feed (NOW)
- You're at: `https://zyeute.netlify.app/`
- Press: **F5** (refresh page)
- **Expected:** See 5 test posts appear

### Step 2: Screenshot (1 min)
- Take screenshot of feed with posts
- Save as: `feed-with-posts.png`
- **Expected:** See all 5 posts with Quebec content

---

## The Test Posts You'll See

1. **Post 1:** "Quebec vibes! 🇨🇦⚜️ #Quebec #Test"
2. **Post 2:** "Poutine is life! 🍟 #Poutine #Montreal"
3. **Post 3:** "Montreal nightlife! 🌃 #Montreal"
4. **Post 4:** "Comment on this post! 💬" ← Use this for comment test
5. **Post 5:** "Fire this post! 🔥" ← Use this for fire test

---

## Continue TEST 1 Part B: Fire Button (5 min)

**Find Post 5** ("Fire this post! 🔥")

**Actions:**
1. Locate the fire icon 🔥 on Post 5
2. Click the fire icon
3. **Verify:** Fire count increases (0 → 1)
4. **Verify:** Button changes state (filled/highlighted)
5. **Verify:** Toast notification appears
6. Screenshot: `fire-button-clicked.png`
7. Refresh page (F5)
8. **Verify:** Fire state persists (still shows 1)
9. Screenshot: `fire-persisted.png`

**Report:**
```
FIRE BUTTON TEST:
- Fire count increased: ✅/❌
- Button state changed: ✅/❌
- Toast appeared: ✅/❌
- State persisted: ✅/❌
- Console errors: [List if any]
```

---

## Continue TEST 1 Part C: Comments (10 min)

**Find Post 4** ("Comment on this post! 💬")

**Actions:**
1. Click anywhere on Post 4 card
2. **Expected:** Navigate to `/p/[post-id]`
3. **Verify:** Post detail page loads
4. Screenshot: `post-detail-loaded.png`
5. Find comment input field
6. Click in input field
7. Type: "Test comment from Comet - [current time]"
8. Screenshot: `comment-typing.png`
9. Click submit/send button
10. **Verify:** Comment appears immediately (optimistic update)
11. **Verify:** Toast notification appears
12. Screenshot: `comment-submitted.png`
13. Refresh page (F5)
14. **Verify:** Comment still there (persisted)
15. Screenshot: `comment-persisted.png`

**Report:**
```
COMMENT TEST:
- Post detail loaded: ✅/❌
- Comment submitted: ✅/❌
- Comment appeared immediately: ✅/❌
- Toast appeared: ✅/❌
- Comment persisted: ✅/❌
- Console errors: [List if any]
```

---

## If Posts Don't Appear After Refresh

**Check Console:**
- Press F12
- Look for errors
- Screenshot console

**Check Network:**
- Network tab
- Look for `/rest/v1/publications` call
- Check status (should be 200)
- Screenshot network tab

**Report:**
```
POSTS NOT APPEARING:
- Console errors: [List]
- Network status: [200/400/500]
- API response: [What you see]
- Screenshot: [Console + Network]
```

---

## Timeline

**Total time for TEST 1:** 20 minutes
- Refresh & verify: 2 min
- Fire button test: 5 min
- Comment test: 10 min
- Report: 3 min

---

## GO NOW! 🚀

**Action 1:** Press F5 to refresh feed  
**Action 2:** Look for 5 test posts  
**Action 3:** Screenshot feed  
**Action 4:** Continue with fire button test

**Let's validate Zyeuté works perfectly!** 🐝🔥🇨🇦⚜️

