# 🎫 GitHub Issues Ready to Create

## Issue #1: Implement Video Frame Extraction for Moderation

**Title:** `feat: Implement video frame extraction and analysis for content moderation`

**Labels:** `enhancement`, `moderation`, `video`, `high-priority`

**Body:**
```markdown
## Description

Video moderation currently only checks text content. Need to implement frame extraction and analysis for video content moderation to detect inappropriate visual content.

## Current State

- Text moderation works ✅
- Video upload works ✅
- Video frame analysis missing ❌

## Acceptance Criteria

- [ ] Extract frames from video files (consider FFmpeg or similar)
- [ ] Analyze frames for inappropriate content
- [ ] Integrate with existing moderation service (`moderationService.ts`)
- [ ] Add frame analysis results to moderation logs
- [ ] Handle batch processing to avoid performance issues
- [ ] Add error handling for video processing failures

## Technical Notes

- Consider using Google Vision API or similar for frame analysis
- May need to extract frames at intervals (e.g., every 5 seconds)
- Should batch process frames to avoid rate limits
- Store analysis results in `moderation_logs` table

## Related Files

- `src/services/moderationService.ts` (line 214)
- `src/pages/moderation/Moderation.tsx`

## Priority

**High** - Content safety is critical for platform trust
```

---

## Issue #2: Implement Analytics Tracking

**Title:** `feat: Implement analytics tracking for views, gifts, growth, and region breakdown`

**Labels:** `enhancement`, `analytics`, `feature`, `medium-priority`

**Body:**
```markdown
## Description

Analytics page has several TODO items for tracking user engagement metrics:
- Views tracking
- Gifts received tracking  
- Growth calculation
- Region breakdown

## Current State

- Analytics page UI exists ✅
- Data tracking missing ❌
- Metrics show placeholder values ❌

## Acceptance Criteria

- [ ] Implement views tracking (increment on post view)
  - Create `post_views` table if needed
  - Track view events in `PostDetail` and `Player` components
- [ ] Track gifts received per user
  - Connect to existing gifts system
  - Aggregate gift data for analytics
- [ ] Calculate growth metrics
  - Followers growth over time
  - Posts growth over time
  - Engagement growth (fire_count, comments)
- [ ] Add region breakdown visualization
  - Group analytics by Quebec region
  - Show regional engagement patterns

## Technical Notes

- May need to create `post_views` table
- Consider using Supabase realtime for live updates
- Add indexes for performance on analytics queries
- Cache aggregated data for performance

## Related Files

- `src/pages/Analytics.tsx` (lines 113, 117, 121, 125)

## Priority

**Medium** - Business metrics important but not blocking core functionality
```

---

## Issue #3: Implement Story Engagement Tracking

**Title:** `feat: Add story views and replies tracking`

**Labels:** `enhancement`, `stories`, `tracking`, `medium-priority`

**Body:**
```markdown
## Description

Story viewer needs:
- Story views table to track who viewed stories
- Story replies table for story comments/replies

## Current State

- Story viewer works ✅
- Story creation works ✅
- Views tracking missing ❌
- Replies functionality missing ❌

## Acceptance Criteria

- [ ] Create `story_views` table
  - Columns: `user_id`, `story_id`, `viewed_at`
  - Add RLS policies for privacy
- [ ] Create `story_replies` table
  - Columns: `id`, `story_id`, `user_id`, `text`, `created_at`
  - Support nested replies if needed
- [ ] Update `StoryViewer` to track views
  - Increment view count on story view
  - Store view record in database
- [ ] Add reply functionality to stories
  - Reply input field
  - Submit reply handler
  - Display replies below story

## Technical Notes

- Use Supabase migrations for table creation
- Add RLS policies for privacy (users can only see their own views)
- Consider cleanup job for old story views (stories expire after 24h)
- Reuse comment UI patterns from `CommentThread`

## Related Files

- `src/components/features/StoryViewer.tsx` (lines 70, 142)
- `src/pages/Feed.tsx` (StoryCarousel)

## Priority

**Medium** - User engagement feature, enhances story functionality
```

---

## 📋 How to Create These Issues

### Option 1: GitHub Web UI
1. Go to: https://github.com/brandonlacoste9-tech/Zyeute/issues/new
2. Copy each issue template above
3. Fill in title and labels
4. Create issue

### Option 2: GitHub CLI
```bash
# Issue 1
gh issue create \
  --title "feat: Implement video frame extraction and analysis for content moderation" \
  --body-file GITHUB_ISSUES_READY.md \
  --label "enhancement,moderation,video,high-priority"

# Issue 2
gh issue create \
  --title "feat: Implement analytics tracking for views, gifts, growth, and region breakdown" \
  --body-file GITHUB_ISSUES_READY.md \
  --label "enhancement,analytics,feature,medium-priority"

# Issue 3
gh issue create \
  --title "feat: Add story views and replies tracking" \
  --body-file GITHUB_ISSUES_READY.md \
  --label "enhancement,stories,tracking,medium-priority"
```

### Option 3: Copy-Paste Ready
Each issue above is formatted for direct copy-paste into GitHub Issues.

---

**Status:** ✅ Ready to create  
**Total Issues:** 3  
**Priority Breakdown:** 1 High, 2 Medium

