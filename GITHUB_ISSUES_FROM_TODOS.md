# 📋 GitHub Issues Created from TODO Comments

This file contains GitHub issue templates for all TODO items found in the codebase.

---

## 🔴 High Priority Issues

### Issue #1: Implement Admin Role Checking
**File:** `src/components/auth/ProtectedAdminRoute.tsx`  
**Line:** 14  
**Status:** ✅ **FIXED** - Implemented in this commit

**Description:**
The `ProtectedAdminRoute` component had a placeholder admin check that always returned false. This created a security vulnerability where admin routes were inaccessible.

**Solution:**
- Created `src/lib/admin.ts` with `checkIsAdmin()` function
- Checks both `user_profiles.is_admin` and `auth.users` metadata
- Updated `ProtectedAdminRoute` to use proper admin verification
- Added loading state and error handling

---

### Issue #2: Implement Video Frame Extraction for Moderation
**File:** `src/services/moderationService.ts`  
**Line:** 214  
**Priority:** High  
**Labels:** `enhancement`, `moderation`, `video`

**Description:**
Video moderation currently only checks text content. Need to implement frame extraction and analysis for video content moderation.

**Acceptance Criteria:**
- [ ] Extract frames from video files
- [ ] Analyze frames for inappropriate content
- [ ] Integrate with existing moderation service
- [ ] Add frame analysis results to moderation logs

**Technical Notes:**
- Consider using FFmpeg or similar for frame extraction
- May need to integrate with vision AI service (e.g., Google Vision API)
- Should batch process frames to avoid performance issues

---

## 🟡 Medium Priority Issues

### Issue #3: Implement Analytics Tracking
**File:** `src/pages/Analytics.tsx`  
**Lines:** 113, 117, 121, 125  
**Priority:** Medium  
**Labels:** `enhancement`, `analytics`, `feature`

**Description:**
Analytics page has several TODO items for tracking:
- Views tracking
- Gifts received tracking
- Growth calculation
- Region breakdown

**Acceptance Criteria:**
- [ ] Implement views tracking (increment on post view)
- [ ] Track gifts received per user
- [ ] Calculate growth metrics (followers, posts, engagement)
- [ ] Add region breakdown visualization

**Technical Notes:**
- May need to create `post_views` table
- Consider using Supabase realtime for live updates
- Add indexes for performance on analytics queries

---

### Issue #4: Implement Story Engagement Tracking
**File:** `src/components/features/StoryViewer.tsx`  
**Lines:** 70, 142  
**Priority:** Medium  
**Labels:** `enhancement`, `stories`, `tracking`

**Description:**
Story viewer needs:
- Story views table to track who viewed stories
- Story replies table for story comments/replies

**Acceptance Criteria:**
- [ ] Create `story_views` table with user_id, story_id, viewed_at
- [ ] Create `story_replies` table for story comments
- [ ] Update StoryViewer to track views
- [ ] Add reply functionality to stories

**Technical Notes:**
- Use Supabase migrations for table creation
- Add RLS policies for privacy
- Consider cleanup job for old story views

---

## 🟢 Low Priority Issues

### Issue #5: Implement Live Streaming Functionality
**File:** `src/pages/GoLive.tsx`  
**Line:** 3  
**Priority:** Low  
**Labels:** `enhancement`, `feature`, `live-streaming`

**Description:**
GoLive page is a placeholder. Need to implement full live streaming functionality.

**Acceptance Criteria:**
- [ ] Integrate with streaming service (e.g., Mux, Cloudflare Stream)
- [ ] Add camera/microphone permissions
- [ ] Implement stream start/stop controls
- [ ] Add viewer count and chat integration

---

### Issue #6: Implement Live Stream Viewer
**File:** `src/pages/WatchLive.tsx`  
**Line:** 3  
**Priority:** Low  
**Labels:** `enhancement`, `feature`, `live-streaming`

**Description:**
WatchLive page is a placeholder. Need to implement live stream viewing functionality.

**Acceptance Criteria:**
- [ ] Display live stream video player
- [ ] Show live chat
- [ ] Add gift/reaction functionality
- [ ] Handle stream end/disconnect

---

### Issue #7: Implement Email Preferences
**File:** `src/pages/EmailPreferences.tsx`  
**Line:** 3  
**Priority:** Low  
**Labels:** `enhancement`, `feature`, `settings`

**Description:**
EmailPreferences page is a placeholder. Need to implement email notification preferences.

**Acceptance Criteria:**
- [ ] Create email preferences UI
- [ ] Connect to email service backend
- [ ] Save preferences to database
- [ ] Add unsubscribe functionality

---

## 📝 How to Create These Issues

### Option 1: Manual Creation
1. Go to: https://github.com/brandonlacoste9-tech/Zyeute/issues/new
2. Copy each issue template above
3. Fill in details and create

### Option 2: GitHub CLI
```bash
# Install GitHub CLI if not installed
# Then create issues:

gh issue create --title "Implement Video Frame Extraction for Moderation" \
  --body "$(cat GITHUB_ISSUES_FROM_TODOS.md | sed -n '/### Issue #2/,/^---/p')" \
  --label "enhancement,moderation,video"
```

### Option 3: GitHub Actions (Automated)
Create `.github/workflows/todo-to-issue.yml`:
```yaml
name: TODO to Issue
on:
  push:
    paths:
      - '**/*.ts'
      - '**/*.tsx'
jobs:
  create-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: alstr/todo-to-issue-action@v4
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## ✅ Completed Issues

- ✅ **Issue #1: Implement Admin Role Checking** - Fixed in commit `7378c0f`

---

**Last Updated:** Day 4  
**Total TODOs:** 13  
**Fixed:** 1  
**Remaining:** 12

