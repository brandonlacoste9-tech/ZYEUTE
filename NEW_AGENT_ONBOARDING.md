# Welcome New Agent! 🚀

Hey there! Welcome to the Zyeuté team. You're joining at an exciting time - we're 97% production ready and pushing to 100% in the next 5 hours.

---

## What Is Zyeuté?

**Quebec's first homegrown social media platform** built for 9 million Quebecers:
- Joual-first language (not translated English)
- Leather UI (VIP concierge aesthetic)
- Regional discovery (Montreal, Quebec City, Gaspésie)
- Ti-Guy AI assistant (image/video generation)
- Premium subscriptions (Bronze/Silver/Gold)

**Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Payments: Stripe
- Deployment: Netlify
- Infrastructure: Colony OS (distributed task execution)

---

## Current Status

**Production Readiness:** 97%  
**What's Working:** Auth, Database, API, Infrastructure  
**What's Left:** Testing, validation, final polish

**Team:**
- **Cursor:** Infrastructure & coordination (me)
- **VS Code:** Code quality (just finished)
- **Comet:** Testing & validation (working now)
- **Gemini:** Architecture advisor (reviewed)
- **Claude:** Code reviewer (reviewed)
- **YOU:** New agent (fresh perspective!)

---

## Your Big Chunk: Performance & Security Hardening

**Time Estimate:** 3-4 hours  
**Priority:** HIGH  
**Can Start:** Immediately

---

## Task 1: React Performance Optimization (90 min)

### Goal
Optimize React components to reduce unnecessary re-renders and improve performance.

### What to Do

#### 1.1 Add React.memo to Heavy Components (30 min)

**Target Components:**
- `src/components/features/VideoCard.tsx`
- `src/components/features/CommentThread.tsx`
- `src/components/features/FeedGrid.tsx`
- `src/components/features/StoryViewer.tsx`
- `src/components/features/SearchBar.tsx`

**Pattern:**
```typescript
// Before
export function VideoCard({ post, onFire, onComment }) {
  // ... component code
}

// After
import { memo } from 'react';

export const VideoCard = memo(function VideoCard({ post, onFire, onComment }) {
  // ... component code
});
```

**When to use React.memo:**
- Component renders frequently
- Props don't change often
- Component is expensive to render
- Parent re-renders often

**When NOT to use:**
- Component rarely renders
- Props change frequently
- Component is cheap to render

#### 1.2 Memoize Callbacks in Feed.tsx (30 min)

**File:** `src/pages/Feed.tsx`

**Current Issue:** Handler functions recreated on every render

**Solution:**
```typescript
import { useCallback } from 'react';

// Before
const handleFireToggle = (postId) => {
  // ... logic
};

// After
const handleFireToggle = useCallback((postId) => {
  // ... logic
}, [/* dependencies */]);
```

**Handlers to memoize:**
- `handleFireToggle`
- `handleComment`
- `handleShare`
- `handleUpload`

#### 1.3 Add useMemo for Expensive Calculations (30 min)

**Look for:**
- Array filtering/sorting in render
- Complex calculations
- Object transformations

**Pattern:**
```typescript
import { useMemo } from 'react';

// Before
const filteredPosts = posts.filter(p => p.is_active);

// After
const filteredPosts = useMemo(
  () => posts.filter(p => p.is_active),
  [posts]
);
```

**Files to check:**
- `src/pages/Feed.tsx`
- `src/pages/Explore.tsx`
- `src/pages/Profile.tsx`

---

## Task 2: Security Hardening (90 min)

### Goal
Harden security across the application to prevent common vulnerabilities.

### What to Do

#### 2.1 Input Validation & Sanitization (30 min)

**Add validation to user inputs:**

**File:** `src/components/features/CommentThread.tsx`
```typescript
// Add input validation
const MAX_COMMENT_LENGTH = 500;
const MIN_COMMENT_LENGTH = 1;

function validateComment(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length < MIN_COMMENT_LENGTH) {
    return { valid: false, error: 'Comment cannot be empty' };
  }
  if (text.length > MAX_COMMENT_LENGTH) {
    return { valid: false, error: `Comment too long (max ${MAX_COMMENT_LENGTH} characters)` };
  }
  // Check for suspicious patterns
  if (/<script|javascript:|onerror=/i.test(text)) {
    return { valid: false, error: 'Invalid content detected' };
  }
  return { valid: true };
}
```

**Files to add validation:**
- Comment input (`CommentThread.tsx`)
- Post creation (`Feed.tsx`)
- Profile bio (`ProfileEditSettings.tsx`)
- Search queries (`SearchBar.tsx`)

#### 2.2 XSS Prevention (30 min)

**Ensure all user-generated content is sanitized:**

**Install DOMPurify:**
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**Use in components displaying user content:**
```typescript
import DOMPurify from 'dompurify';

// Before
<div>{userContent}</div>

// After
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />
```

**Files to check:**
- `CommentThread.tsx` (comment display)
- `VideoCard.tsx` (post content)
- `Profile.tsx` (bio display)

#### 2.3 Rate Limiting Implementation (30 min)

**Add client-side rate limiting for API calls:**

**Create:** `src/lib/rateLimiter.ts`
```typescript
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  canProceed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
```

**Apply to critical actions:**
- Post creation (max 5 per minute)
- Comment creation (max 10 per minute)
- Fire reactions (max 20 per minute)
- API calls (max 60 per minute)

---

## Task 3: Error Boundary Enhancement (60 min)

### Goal
Improve error boundaries to catch and handle React errors gracefully.

### What to Do

#### 3.1 Enhance ErrorBoundary Component (30 min)

**File:** `src/components/ErrorBoundary.tsx`

**Add features:**
- Error logging to backend
- User-friendly error messages
- Retry mechanism
- Error categorization

**Pattern:**
```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to backend
    logger.error('React error boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    // Could send to error tracking service
    // sendToErrorTracking(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

#### 3.2 Add Error Boundaries to Key Routes (30 min)

**Wrap critical routes:**
- Feed page
- Profile page
- Post detail page
- Settings pages

**Pattern:**
```typescript
// In App.tsx or router
<ErrorBoundary>
  <Route path="/" element={<Feed />} />
</ErrorBoundary>
```

---

## Task 4: Code Splitting & Lazy Loading (60 min)

### Goal
Reduce initial bundle size and improve load times.

### What to Do

#### 4.1 Lazy Load Routes (30 min)

**File:** `src/App.tsx` or router file

**Pattern:**
```typescript
import { lazy, Suspense } from 'react';

// Before
import Feed from './pages/Feed';
import Profile from './pages/Profile';

// After
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));

// Wrap routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Feed />} />
    <Route path="/profile/:username" element={<Profile />} />
  </Routes>
</Suspense>
```

**Routes to lazy load:**
- Settings pages (rarely accessed)
- Marketplace (optional feature)
- Ti-Guy pages (AI features)
- Admin pages (admin only)

#### 4.2 Dynamic Imports for Heavy Components (30 min)

**Lazy load heavy components:**
- Video player
- Image editor
- Story creator
- Ti-Guy interface

**Pattern:**
```typescript
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

// Use with Suspense
<Suspense fallback={<div>Loading player...</div>}>
  <VideoPlayer src={videoUrl} />
</Suspense>
```

---

## Success Criteria

### Performance
- [ ] React.memo applied to 5+ heavy components
- [ ] Callbacks memoized in Feed.tsx
- [ ] useMemo for expensive calculations
- [ ] Initial bundle size reduced by 20%+
- [ ] Lazy loading implemented for routes

### Security
- [ ] Input validation on all user inputs
- [ ] XSS prevention with DOMPurify
- [ ] Rate limiting on critical actions
- [ ] No security warnings in build

### Error Handling
- [ ] Enhanced error boundary
- [ ] Error boundaries on all routes
- [ ] Graceful error recovery
- [ ] User-friendly error messages

### Code Splitting
- [ ] Routes lazy loaded
- [ ] Heavy components dynamic imports
- [ ] Suspense fallbacks added
- [ ] Bundle analysis shows improvement

---

## Testing Your Work

### Performance Testing
```bash
# Build and analyze bundle
npm run build
npm run preview

# Check bundle size
ls -lh dist/assets/*.js

# Test in browser
# - Open DevTools
# - Check Network tab
# - Verify lazy loading works
# - Check Performance tab
```

### Security Testing
```bash
# Run security audit
npm audit

# Check for vulnerabilities
npm audit fix

# Test XSS prevention
# - Try injecting <script> tags
# - Verify they're sanitized
```

---

## Files You'll Modify

**Performance (8-10 files):**
- `src/components/features/VideoCard.tsx`
- `src/components/features/CommentThread.tsx`
- `src/components/features/FeedGrid.tsx`
- `src/pages/Feed.tsx`
- `src/pages/Explore.tsx`
- `src/App.tsx` (or router file)

**Security (5-7 files):**
- `src/lib/rateLimiter.ts` (create)
- `src/components/features/CommentThread.tsx`
- `src/pages/Feed.tsx`
- `src/components/ErrorBoundary.tsx`
- Any components displaying user content

**Total:** 13-17 files

---

## Resources

**Documentation:**
- `MULTI_AGENT_PROGRESS.md` - Current status
- `VS_CODE_WORK_COMPLETE.md` - What VS Code just did
- `PHASE2_1_COMPLETE.md` - What I just did
- `5_HOUR_SPRINT_PLAN.md` - Overall sprint plan

**Code:**
- `src/lib/logger.ts` - Logger utility (just created by VS Code)
- `infrastructure/colony/` - Colony OS implementation

---

## Communication

**Report back when:**
- You complete each task
- You find any issues
- You need clarification
- You finish all work

**I'll:**
- Answer questions
- Review your changes
- Integrate with other work
- Deploy when ready

---

## Why This Matters

**9 million Quebecers** are waiting for a social platform that feels like home. Every optimization makes the experience better. Every security fix protects users. Every error boundary prevents frustration.

**You're not just writing code - you're building Quebec's platform.** 🇨🇦⚜️

---

## Ready to Start?

**Begin with Task 1: React Performance Optimization**

Start with `VideoCard.tsx` - add React.memo and test the impact.

**You've got this! Let's make Zyeuté fast, secure, and bulletproof!** 🔥

---

**Time:** 3-4 hours  
**Impact:** Performance + Security hardening  
**Goal:** Help push Zyeuté to 100% production ready

**Let's go!** 🚀

