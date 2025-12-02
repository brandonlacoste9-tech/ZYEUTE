# 📋 GitHub Issues for VS Code Cloud Agent

## Issue #1: Replace console.log with logger utility and standardize error handling

**Title:** Replace all console.log with logger utility and standardize error handling

**Priority:** High  
**Labels:** `code-quality`, `refactoring`, `enhancement`

**Description:**

Replace all remaining `console.log` statements with the logger utility from `src/lib/logger.ts`. This ensures production builds don't have noisy debug logs while maintaining observability for errors and warnings.

**Current State:**
- Logger utility exists at `src/lib/logger.ts`
- Some files already use logger (main.tsx, supabase.ts)
- Many files still use direct `console.log` statements
- Error handling is inconsistent across the codebase

**Files to Update:**
- `src/services/api.ts` (21 console statements)
- `src/pages/Analytics.tsx` (multiple console statements)
- `src/services/achievementService.ts` (9 console statements)
- `src/pages/Profile.tsx` (6 console statements)
- `src/pages/AuthCallback.tsx` (38 console statements - OAuth debugging)
- All other files with console statements

**Tasks:**
1. Replace `console.log` with `logger.debug()` or `logger.info()`
2. Replace `console.error` with `logger.error()`
3. Replace `console.warn` with `logger.warn()`
4. Ensure production builds disable debug/info logs (already configured in logger)
5. Standardize error handling patterns:
   - Use try/catch blocks consistently
   - Log errors with context
   - Show user-friendly error messages via toast notifications
   - Don't expose sensitive error details to users

**Acceptance Criteria:**
- [ ] No direct `console.log` statements remain in the codebase
- [ ] All logging uses the logger utility from `src/lib/logger.ts`
- [ ] Error handling is consistent across all files
- [ ] Production builds have no debug logs (verified via build output)
- [ ] Error/warn logs remain for monitoring
- [ ] User-facing errors are friendly and don't expose sensitive details

**Technical Notes:**
- Logger utility already configured to disable debug/info in production
- Use `logger.withContext('ComponentName')` for better log organization
- Keep OAuth debugging logs but use logger instead of console

---

## Issue #2: Security hardening - CSP, input validation, and XSS prevention

**Title:** Security hardening - CSP review, input validation, and XSS prevention

**Priority:** High  
**Labels:** `security`, `enhancement`, `critical`

**Description:**

Perform comprehensive security review and hardening across the application. Focus on Content Security Policy, input validation, XSS prevention, and authentication token handling.

**Current State:**
- CSP headers configured in `netlify.toml` and `vercel.json`
- Some input validation exists but not comprehensive
- User-generated content displayed without sanitization in some places
- Authentication tokens handled via Supabase (needs review)

**Tasks:**

1. **Content Security Policy Review:**
   - Verify CSP headers are correctly configured
   - Test CSP in production (check browser console for violations)
   - Ensure Stripe domains are properly whitelisted
   - Verify Supabase domains are whitelisted
   - Check for any unsafe-inline or unsafe-eval usage

2. **Input Validation:**
   - Add validation to all form inputs (signup, login, post creation, comments)
   - Validate file uploads (type, size, content)
   - Sanitize user input before database storage
   - Add rate limiting to prevent abuse

3. **XSS Prevention:**
   - Review all places where user content is rendered
   - Sanitize HTML content (comments, captions, usernames)
   - Use React's built-in XSS protection (avoid `dangerouslySetInnerHTML`)
   - Review markdown rendering if used

4. **Authentication Security:**
   - Review Supabase token handling
   - Ensure tokens are stored securely (httpOnly cookies if possible)
   - Review session management
   - Add token refresh handling

5. **API Security:**
   - Review RLS policies (already done, but verify)
   - Add rate limiting to API endpoints
   - Verify CORS configuration
   - Review error messages (don't leak sensitive info)

**Files to Review:**
- `netlify.toml` (CSP headers)
- `vercel.json` (CSP headers)
- `src/pages/Signup.tsx` (input validation)
- `src/pages/Login.tsx` (input validation)
- `src/pages/PostDetail.tsx` (XSS prevention)
- `src/components/features/CommentThread.tsx` (XSS prevention)
- `src/services/api.ts` (API security)
- `src/lib/supabase.ts` (auth security)

**Acceptance Criteria:**
- [ ] CSP headers reviewed and verified (no violations in production)
- [ ] All form inputs have validation
- [ ] User-generated content is sanitized before display
- [ ] No `dangerouslySetInnerHTML` usage (or properly sanitized)
- [ ] Rate limiting added to critical endpoints
- [ ] Error messages don't leak sensitive information
- [ ] Authentication token handling reviewed and secure

**Security Checklist:**
- [ ] CSP violations: 0
- [ ] XSS vulnerabilities: 0
- [ ] Input validation: 100% coverage
- [ ] Rate limiting: Critical endpoints protected
- [ ] Token security: Reviewed and secure

---

## Issue #3: Performance optimizations - React.memo, code splitting, lazy loading

**Title:** Performance optimizations - React.memo, code splitting, and lazy loading

**Priority:** Medium  
**Labels:** `performance`, `enhancement`, `optimization`

**Description:**

Implement performance optimizations to improve app load time, reduce bundle size, and optimize rendering. Focus on React component memoization, code splitting, and lazy loading.

**Current State:**
- Some components already use `React.memo` (VideoCard, CommentThread)
- No code splitting implemented
- Images load eagerly
- Heavy pages load all code upfront

**Tasks:**

1. **React Component Memoization:**
   - Add `React.memo` to frequently re-rendered components:
     - Feed items (already done for VideoCard)
     - Comment items (already done for CommentThread)
     - User avatars
     - Post cards in Explore
     - Settings items
   - Use `useCallback` and `useMemo` where appropriate
   - Avoid unnecessary re-renders

2. **Code Splitting:**
   - Lazy load heavy pages:
     - Analytics page
     - Marketplace page
     - Moderation page
     - Settings pages
   - Use React.lazy() and Suspense
   - Split vendor bundles (React, Supabase, etc.)

3. **Image Optimization:**
   - Add lazy loading to images
   - Use WebP format where supported
   - Add loading="lazy" attribute
   - Implement image placeholders

4. **Bundle Optimization:**
   - Analyze bundle size (use webpack-bundle-analyzer or similar)
   - Remove unused dependencies
   - Tree shake unused code
   - Optimize imports (avoid importing entire libraries)

5. **Virtual Scrolling:**
   - Consider virtual scrolling for long lists (Feed, Comments)
   - Use react-window or react-virtualized if needed

**Files to Update:**
- `src/App.tsx` (add lazy loading for routes)
- `src/pages/Analytics.tsx` (lazy load)
- `src/pages/Marketplace.tsx` (lazy load)
- `src/pages/Moderation.tsx` (lazy load)
- `src/components/Avatar.tsx` (add React.memo)
- `src/pages/Explore.tsx` (optimize post cards)
- `src/components/features/VideoCard.tsx` (already memoized, verify)

**Acceptance Criteria:**
- [ ] Heavy pages lazy loaded (Analytics, Marketplace, Moderation)
- [ ] Frequently re-rendered components use React.memo
- [ ] Images lazy load (loading="lazy" attribute)
- [ ] Bundle size reduced (measure before/after)
- [ ] Initial load time improved (measure before/after)
- [ ] No performance regressions (test on slow devices)

**Performance Targets:**
- [ ] Initial bundle size: < 500KB (gzipped)
- [ ] Time to Interactive: < 3 seconds
- [ ] First Contentful Paint: < 1.5 seconds
- [ ] Lighthouse Performance Score: > 90

**Testing:**
- Test on slow 3G connection
- Test on low-end devices
- Use Lighthouse for performance metrics
- Monitor bundle size in CI/CD

---

## Issue #4: Convert remaining TODOs to GitHub issues

**Title:** Convert remaining TODOs to GitHub issues with proper labels

**Priority:** Low  
**Labels:** `documentation`, `maintenance`, `enhancement`

**Description:**

Convert all remaining TODO comments in the codebase to properly formatted GitHub issues with labels, acceptance criteria, and priority levels.

**Current State:**
- 13 TODO items found in codebase
- Some TODOs documented in `GITHUB_ISSUES_FROM_TODOS.md`
- Need to create actual GitHub issues

**TODOs to Convert:**

1. **Video Frame Extraction for Moderation** (`src/services/moderationService.ts:214`)
   - Priority: High
   - Labels: `enhancement`, `moderation`, `video`
   - Already documented in `GITHUB_ISSUES_FROM_TODOS.md`

2. **Analytics Tracking** (`src/pages/Analytics.tsx`)
   - Views tracking (line 113)
   - Gifts tracking (line 117)
   - Growth calculation (line 121)
   - Region breakdown (line 125)
   - Priority: Medium
   - Labels: `enhancement`, `analytics`, `feature`

3. **Story Engagement** (`src/components/features/StoryViewer.tsx`)
   - Story views table (line 70)
   - Story replies table (line 142)
   - Priority: Medium
   - Labels: `enhancement`, `feature`, `stories`

4. **Live Streaming** (`src/pages/GoLive.tsx`, `src/pages/WatchLive.tsx`)
   - Priority: Low
   - Labels: `enhancement`, `feature`, `live-streaming`

5. **Email Preferences** (`src/pages/EmailPreferences.tsx`)
   - Priority: Low
   - Labels: `enhancement`, `feature`, `settings`

6. **API Mapping TODOs** (`src/services/api.ts`)
   - Hashtags extraction (line 122)
   - Region mapping (line 123)
   - City mapping (line 124)
   - Priority: Medium
   - Labels: `enhancement`, `api`, `data-mapping`

**Tasks:**
1. Review each TODO in the codebase
2. Create GitHub issue for each TODO
3. Add proper labels (enhancement, bug, feature, etc.)
4. Add priority level (High, Medium, Low)
5. Add acceptance criteria
6. Link to code location
7. Add to project board if applicable

**Acceptance Criteria:**
- [ ] All 13 TODOs converted to GitHub issues
- [ ] Each issue has proper labels
- [ ] Each issue has priority level
- [ ] Each issue has acceptance criteria
- [ ] Each issue links to code location
- [ ] Issues organized in project board

**Template for Each Issue:**
```markdown
**Title:** [Brief description]

**Priority:** [High/Medium/Low]

**Labels:** [relevant labels]

**Description:**
[Detailed description of what needs to be done]

**Code Location:**
- File: `src/path/to/file.ts`
- Line: 123

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Technical Notes:**
[Any technical considerations]
```

---

## Summary

**Total Issues:** 4  
**Priority Breakdown:**
- High Priority: 2 (Code quality, Security)
- Medium Priority: 1 (Performance)
- Low Priority: 1 (Documentation)

**Estimated Time:**
- Issue #1: 2-3 hours
- Issue #2: 2-3 hours
- Issue #3: 3-4 hours
- Issue #4: 1 hour

**Total:** ~8-11 hours of systematic improvement work

---

**Created:** After build fixes  
**Status:** Ready for VS Code Cloud Agent to work on

