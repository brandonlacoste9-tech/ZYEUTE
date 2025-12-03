# Comet - Create Test Post Instructions

Hey Comet! 🐝

The feed is empty because there are no posts in the database yet. Here's how to create test posts:

---

## OPTION A: Create Post via UI (Recommended)

### Step 1: Make Sure You're Logged In

**Check:** Do you see your avatar/username in the header?
- If YES: You're logged in, proceed
- If NO: Go to `/login` and login first

### Step 2: Find the Upload/Create Button

**Look for:**
- "Écris ton premier post" button
- Plus (+) icon
- Upload button
- "Create Post" button

**Location:** Usually in header or floating button

### Step 3: Click Upload Button

**Action:** Click the create/upload button

**Expected:** Should open:
- Upload modal
- Post creation form
- File picker

### Step 4: Fill Post Form

**Enter:**
- **Content/Caption:** "Test post from Comet - Quebec vibes! 🇨🇦⚜️"
- **Image:** (optional - can skip for text post)
- **Hashtags:** Add #Quebec #Test

### Step 5: Submit

**Action:** Click submit/post button

**Watch for:**
- Loading state
- Success message
- Redirect to feed

### Step 6: Verify Post Appears

**Check feed:**
- Should see your post
- Should be at top of feed
- Screenshot: `test-post-created.png`

**If post appears:** ✅ Feed is working!  
**If post doesn't appear:** Report to me immediately

---

## OPTION B: Ask Me to Create Test Posts

**If you can't find upload button:**

Tell me: "Can't find upload button, please create test posts via Supabase"

**I'll:**
1. Create 3-5 test posts directly in database
2. Deploy
3. Ask you to refresh and re-test

---

## What to Do RIGHT NOW

### Try Option A First (10 min)

1. **Check if logged in**
   - Look for avatar in header
   - If not logged in: Go to `/login`

2. **Find upload button**
   - Look in header
   - Look for floating button
   - Look for "Create Post" text

3. **Create test post**
   - Fill form
   - Submit
   - Watch what happens

4. **Report back:**
```
UPLOAD TEST:
- Found upload button: YES/NO
- Location: [where you found it]
- Form opened: YES/NO
- Post submitted: YES/NO
- Post appeared in feed: YES/NO
- Screenshot: [attached]
```

### If Option A Doesn't Work (5 min)

**Report:**
```
Can't create post via UI:
- Issue: [what's blocking you]
- Screenshot: [current state]
- Request: Create test posts via Supabase
```

**Then I'll:**
- Create test posts in database
- You refresh and continue testing

---

## After Posts Are Created

**Continue with your tests:**
- TEST 1 Part B: Fire button (now you have posts to test)
- TEST 1 Part C: Comments (now you have posts to comment on)
- TEST 2: Navigation (posts will display on other pages)

---

## START NOW

**Action 1:** Check if you're logged in  
**Action 2:** Look for upload/create button  
**Action 3:** Try to create a post  
**Action 4:** Report what happens

**Let's get some posts in the feed!** 🐝🔥🇨🇦⚜️

