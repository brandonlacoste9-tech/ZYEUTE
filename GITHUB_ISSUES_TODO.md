# GitHub Issues for TODOs

This document contains all TODO items found in the codebase that should be converted to GitHub issues.

## Issue 1: Extract and Map Hashtags from Post Content

**File:** `src/services/api.ts:125`

**Priority:** Medium

**Description:**
Currently, hashtags are set to `null` in the feed posts. We need to:
- Extract hashtags from post content (caption/content field)
- Optionally join with a hashtags table if one exists
- Store extracted hashtags in the Post type

**Code Location:**
```typescript
// src/services/api.ts line 125
hashtags: null,  // TODO: Extract from content or join hashtags table
```

**Acceptance Criteria:**
- [ ] Extract hashtags from post content using regex pattern
- [ ] Check if hashtags table exists in database
- [ ] Join hashtags table in query if available
- [ ] Map hashtags to Post.hashtags field
- [ ] Add tests for hashtag extraction

---

## Issue 2: Map Region and City Fields from Publications

**File:** `src/services/api.ts:126-127`

**Priority:** Low

**Description:**
Region and city fields from publications table need to be mapped to the Post type.

**Code Location:**
```typescript
// src/services/api.ts lines 126-127
region: null,  // TODO: Map from region field if exists
city: null,  // TODO: Map from city field if exists
```

**Acceptance Criteria:**
- [ ] Check if region/city fields exist in publications table
- [ ] Map region field to Post.region
- [ ] Map city field to Post.city
- [ ] Add migration if fields don't exist in publications table
- [ ] Update database types

---

## Issue 3: Implement Video Frame Extraction and Analysis

**File:** `src/services/moderationService.ts:215`

**Priority:** High

**Description:**
Video content moderation requires frame extraction and analysis. Currently videos are marked as safe without analysis.

**Code Location:**
```typescript
// src/services/moderationService.ts line 215
// TODO: Implement frame extraction and analysis
```

**Acceptance Criteria:**
- [ ] Research video frame extraction libraries (e.g., ffmpeg.wasm)
- [ ] Implement frame extraction at key intervals (e.g., every 1-2 seconds)
- [ ] Pass extracted frames to OpenAI Vision API for analysis
- [ ] Aggregate frame analysis results
- [ ] Flag video if any frame contains inappropriate content
- [ ] Add tests for video moderation
- [ ] Consider performance and cost implications

**Dependencies:**
- OpenAI API key must be configured
- May require additional video processing libraries

---

## Issue 4: Implement Live Stream Viewer Page

**File:** `src/pages/WatchLive.tsx:3`

**Priority:** High

**Description:**
Live streaming viewer page needs to be fully implemented.

**Code Location:**
```typescript
// src/pages/WatchLive.tsx line 3
// TODO: Implement live stream viewer
```

**Acceptance Criteria:**
- [ ] Design live stream viewer UI
- [ ] Integrate WebRTC or streaming service (e.g., Twitch, YouTube Live API)
- [ ] Implement video player for live streams
- [ ] Add real-time chat functionality
- [ ] Add viewer count display
- [ ] Add fire/like reactions for live streams
- [ ] Handle stream end/disconnect gracefully
- [ ] Add tests

**Related:** This likely connects to the GoLive page (Issue 5)

---

## Issue 5: Implement Live Streaming Functionality

**File:** `src/pages/GoLive.tsx:3`

**Priority:** High

**Description:**
Complete implementation of live streaming broadcast functionality.

**Code Location:**
```typescript
// src/pages/GoLive.tsx line 3
// TODO: Implement live streaming functionality
```

**Acceptance Criteria:**
- [ ] Research streaming technologies (WebRTC, RTMP, HLS)
- [ ] Choose streaming service/infrastructure
- [ ] Implement stream setup and configuration UI
- [ ] Add camera/microphone permission handling
- [ ] Implement stream broadcasting
- [ ] Add stream quality settings
- [ ] Integrate with live_streams database table
- [ ] Add stream analytics (viewers, duration, engagement)
- [ ] Add tests

**Related:** This works with WatchLive page (Issue 4)

---

## Issue 6: Implement Email Preferences Management

**File:** `src/pages/EmailPreferences.tsx:3`

**Priority:** Medium

**Description:**
Email preferences page needs full implementation to allow users to manage email notifications.

**Code Location:**
```typescript
// src/pages/EmailPreferences.tsx line 3
// TODO: Implement email preferences functionality
```

**Acceptance Criteria:**
- [ ] Design email preferences UI with toggle switches
- [ ] List all email notification types (new followers, comments, likes, etc.)
- [ ] Integrate with email_preferences database table
- [ ] Implement preference save/update functionality
- [ ] Add email frequency options (immediate, daily digest, weekly)
- [ ] Add unsubscribe from all option
- [ ] Respect user preferences in emailService
- [ ] Add tests

**Database:** Uses `email_preferences` table from migration 007_email_system.sql

---

## Issue 7: Implement Views Tracking for Analytics

**File:** `src/pages/Analytics.tsx:117`

**Priority:** Medium

**Description:**
Views tracking is currently set to 0. Need to implement view counting for posts.

**Code Location:**
```typescript
// src/pages/Analytics.tsx line 117
totalViews: 0, // TODO: Implement views tracking
```

**Acceptance Criteria:**
- [ ] Create post_views or views table if not exists
- [ ] Track view events when posts are viewed
- [ ] Prevent duplicate views from same user (debounce or daily limit)
- [ ] Aggregate views count in analytics
- [ ] Add views breakdown by region/time
- [ ] Consider performance (don't slow down feed loading)
- [ ] Add tests

---

## Issue 8: Implement Gifts Tracking for Analytics

**File:** `src/pages/Analytics.tsx:121`

**Priority:** Low

**Description:**
Gifts received tracking is not implemented in analytics.

**Code Location:**
```typescript
// src/pages/Analytics.tsx line 121
totalGiftsReceived: 0, // TODO: Implement gifts tracking
```

**Acceptance Criteria:**
- [ ] Verify gifts table exists and has proper structure
- [ ] Query total gifts received for user
- [ ] Display gift breakdown by type
- [ ] Show gift value/monetary equivalent
- [ ] Add gift history timeline
- [ ] Add tests

---

## Issue 9: Calculate Growth Metrics for Analytics

**File:** `src/pages/Analytics.tsx:125`

**Priority:** Medium

**Description:**
Growth calculations (posts, followers, engagement) are set to 0.

**Code Location:**
```typescript
// src/pages/Analytics.tsx line 125
recentGrowth: {
  posts: 0, // TODO: Calculate growth
  followers: 0,
  engagement: 0,
}
```

**Acceptance Criteria:**
- [ ] Define time period for "recent growth" (e.g., last 7 days, 30 days)
- [ ] Calculate posts growth: (new posts - previous period posts)
- [ ] Calculate followers growth: (new followers - previous period followers)
- [ ] Calculate engagement growth rate
- [ ] Display as percentage change
- [ ] Add trend indicators (up/down arrows)
- [ ] Add tests

---

## Issue 10: Implement Region Breakdown for Analytics

**File:** `src/pages/Analytics.tsx:129`

**Priority:** Low

**Description:**
Region breakdown showing audience distribution by Quebec region is not implemented.

**Code Location:**
```typescript
// src/pages/Analytics.tsx line 129
regionBreakdown: [], // TODO: Implement region breakdown
```

**Acceptance Criteria:**
- [ ] Query follower locations by region
- [ ] Query post engagement by region
- [ ] Create region breakdown chart/visualization
- [ ] Use Quebec regions from quebecFeatures.ts
- [ ] Show top 5 regions
- [ ] Add percentage of total audience
- [ ] Add tests

---

## Issue 11: Create Story Views Table and Track Views

**File:** `src/components/features/StoryViewer.tsx:74`

**Priority:** Medium

**Description:**
Story views are not being tracked. Need to create database table and track views.

**Code Location:**
```typescript
// src/components/features/StoryViewer.tsx line 74
// TODO: Create story_views table and insert view
// For now, just log
```

**Acceptance Criteria:**
- [ ] Create migration for story_views table
  - Columns: id, story_id, viewer_id, viewed_at, is_counted (to prevent duplicates)
- [ ] Insert view record when story is viewed
- [ ] Prevent duplicate views (only count once per user per story)
- [ ] Add view count to stories query
- [ ] Display view count to story creator
- [ ] Add viewer list for story creator
- [ ] Add tests

---

## Issue 12: Create Story Replies Table

**File:** `src/components/features/StoryViewer.tsx:146`

**Priority:** Medium

**Description:**
Story replies need proper storage. Currently they may be sent as DMs or notifications.

**Code Location:**
```typescript
// src/components/features/StoryViewer.tsx line 146
// TODO: Create story_replies table
// For now, send as DM or notification
```

**Acceptance Criteria:**
- [ ] Create migration for story_replies table
  - Columns: id, story_id, user_id, content, created_at
- [ ] Implement story reply submission
- [ ] Display replies to story creator
- [ ] Add reply notification to creator
- [ ] Consider privacy (replies visible only to creator)
- [ ] Add tests
- [ ] Decide: separate from DMs or integrate?

---

## Summary

Total TODOs found: **12**

### Priority Breakdown:
- **High Priority:** 3 (Video moderation, Live streaming viewer, Live streaming broadcaster)
- **Medium Priority:** 6 (Hashtags, Email preferences, Views tracking, Growth metrics, Story views, Story replies)
- **Low Priority:** 3 (Region/city mapping, Gifts tracking, Region breakdown)

### Estimated Effort:
- **Quick wins (1-2 hours):** Issues 1, 2, 8
- **Medium effort (1-2 days):** Issues 6, 7, 9, 10, 11, 12
- **Large effort (1-2 weeks):** Issues 3, 4, 5

### Recommended Order:
1. Issue 11 & 12 (Story views and replies) - Core feature completion
2. Issue 7 & 9 (Views and growth tracking) - Analytics improvement
3. Issue 1 & 2 (Hashtags and location) - Feed enhancement
4. Issue 6 (Email preferences) - User experience
5. Issue 3 (Video moderation) - Security/safety
6. Issue 4 & 5 (Live streaming) - Major feature
7. Issue 8 & 10 (Gifts and region breakdown) - Nice-to-haves

