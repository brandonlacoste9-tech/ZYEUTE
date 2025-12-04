# Cursor Agents Task Descriptions

**Repository**: `brandonlacoste9-tech/Zyeute`  
**Branch**: `main` (or create feature branches)  
**Last Updated**: 2025-01-27

This document contains ready-to-use task descriptions for Cursor Agents working on the Zyeuté project.

---

## 🚨 Priority 1: Critical Fixes

### Task 1: Fix Dependabot YAML Syntax Error (CRITICAL) ✅ COMPLETED

**Priority**: 🔴 Critical - Blocks multiple PRs  
**Status**: ✅ Fixed - YAML syntax corrected, validated

**Task Description**:
```
Fix YAML syntax error in .github/dependabot.yml that's preventing Dependabot from processing dependency updates.

Error Location: Lines 18-19
Issue: `prefix: "chore"` and `include: "scope"` are incorrectly indented. These should be separate top-level keys under the npm package-ecosystem entry, not nested under `labels:`.

Current (incorrect):
```yaml
    labels:
      - "dependencies"
      prefix: "chore"
      include: "scope"
```

Expected structure:
- `prefix` and `include` should be at the same indentation level as `labels:`, `schedule:`, etc.
- Reference: https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

Requirements:
1. Fix YAML indentation for `prefix` and `include` keys
2. Validate YAML syntax (use yamllint or similar)
3. Ensure Dependabot can parse the file
4. Verify the structure matches GitHub's Dependabot schema

Files to modify:
- .github/dependabot.yml

Success Criteria:
- ✅ YAML file is valid (no syntax errors)
- ✅ Dependabot can process the configuration
- ✅ PRs #66, #69, #70 can merge without YAML errors
- ✅ Labeler workflow continues to work

Testing:
- Run: `yamllint .github/dependabot.yml` (if available)
- Or validate via GitHub Actions/Dependabot UI
```

**Estimated Time**: 15 minutes  
**Complexity**: Low  
**Impact**: High - Unblocks 3 PRs

---

## 🔧 Priority 2: Code Quality Improvements

### Task 2: Replace console.log with Logger Utility

**Priority**: 🟡 High - Code quality and production readiness

**Task Description**:
```
Replace all console.log, console.info, and console.debug statements with the project's logger utility in the Zyeuté codebase.

Context:
- Project has a logger utility at `src/lib/logger.ts` that provides environment-aware logging
- ESLint rule `no-console` is set to warn (allows console.warn/error)
- Logger automatically disables debug/info logs in production builds
- Previous work: Some console statements already exist and should be migrated

Requirements:
1. Import logger: `import { logger } from '@/lib/logger'` or `import { logger } from '../lib/logger'`
2. Replace `console.log()` → `logger.debug()` or `logger.info()` (use debug for verbose, info for important)
3. Replace `console.info()` → `logger.info()`
4. Replace `console.debug()` → `logger.debug()`
5. Keep `console.warn()` and `console.error()` as-is (ESLint allows these)
6. For context-specific logging, use `logger.withContext('ComponentName')`

Files to focus:
- src/components/**/*.tsx
- src/pages/**/*.tsx
- src/services/**/*.ts
- src/hooks/**/*.ts
- src/lib/**/*.ts (except logger.ts itself)

Exclude:
- src/lib/logger.ts (logger implementation)
- src/test/**/*.ts (test files can use console)
- *.test.tsx, *.spec.ts files

Example replacements:
```typescript
// Before
console.log('User logged in:', user);
console.info('Fetching posts...');

// After
logger.info('User logged in:', user);
logger.debug('Fetching posts...');

// With context
const log = logger.withContext('Feed');
log.info('Loading feed');
```

Success Criteria:
- ✅ All console.log/info/debug replaced with logger
- ✅ Code compiles without errors
- ✅ No functionality broken
- ✅ Production builds don't show debug logs
- ✅ ESLint no-console warnings resolved (except allowed warn/error)

Testing:
- Run: `npm run lint` - should show fewer/no console warnings
- Run: `npm run build` - verify production build works
- Check browser console in dev mode - logs should still appear
- Check browser console in production - debug/info logs should be hidden
```

**Estimated Time**: 2-3 hours  
**Complexity**: Medium  
**Impact**: High - Production readiness, better debugging

---

### Task 3: Fix TypeScript `any` Types

**Priority**: 🟡 High - Type safety

**Task Description**:
```
Replace explicit `any` types with proper TypeScript types throughout the Zyeuté codebase.

Context:
- ESLint rule `@typescript-eslint/no-explicit-any` is set to warn
- Found ~45 instances of `: any` across 24 files
- Improves type safety and developer experience
- Helps catch bugs at compile time

Requirements:
1. Identify all `: any` type annotations
2. Replace with specific types:
   - Use existing types from `src/types/`
   - Create new types/interfaces when needed
   - Use `unknown` for truly unknown types (then narrow with type guards)
   - Use generics where appropriate
   - Use union types for multiple possibilities

3. Common patterns to fix:
   - Function parameters: `(param: any)` → `(param: User | Post | string)`
   - Event handlers: `(e: any)` → `(e: React.ChangeEvent<HTMLInputElement>)`
   - API responses: `(data: any)` → `(data: ApiResponse<User>)`
   - Generic utilities: Use generics `<T>` instead of `any`

Files with `any` types (24 files):
- src/components/ui/Toast.tsx
- src/components/moderation/ReportModal.tsx
- src/components/Toast.tsx
- src/components/features/StoryCreator.tsx
- src/components/features/CommentThread.tsx
- src/components/features/GiftModal.tsx
- src/services/subscriptionService.ts
- src/services/stripeService.ts
- src/services/imageService.ts
- src/services/achievementService.ts
- src/services/api.ts
- src/pages/settings/ProfileEditSettings.tsx
- src/pages/VoiceSettingsPage.tsx
- src/hooks/useSettingsPreferences.ts
- src/pages/Premium.tsx
- src/pages/AuthCallback.tsx
- src/pages/Login.tsx
- src/pages/Marketplace.tsx
- src/pages/Signup.tsx
- src/lib/utils.ts
- src/lib/admin.ts
- src/lib/logger.ts (some instances may be acceptable)
- src/pages/Analytics.tsx

Example fixes:
```typescript
// Before
function processUser(user: any) {
  return user.name;
}

// After
function processUser(user: User) {
  return user.name;
}

// Before
function handleChange(e: any) {
  setValue(e.target.value);
}

// After
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}

// Before
async function fetchData(): Promise<any> {
  const response = await api.get('/data');
  return response.data;
}

// After
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function fetchData<T>(): Promise<T> {
  const response = await api.get<ApiResponse<T>>('/data');
  return response.data;
}
```

Success Criteria:
- ✅ All `: any` replaced with proper types
- ✅ Code compiles without TypeScript errors
- ✅ No runtime errors introduced
- ✅ ESLint `no-explicit-any` warnings resolved
- ✅ Type safety improved (catch errors at compile time)

Testing:
- Run: `npm run type-check` - should pass
- Run: `npm run lint` - should show fewer/no `no-explicit-any` warnings
- Run: `npm run build` - should succeed
- Manual testing: Verify functionality still works
```

**Estimated Time**: 4-6 hours  
**Complexity**: Medium-High  
**Impact**: High - Type safety, fewer runtime errors

---

### Task 4: Remove Unused Variables and Imports

**Priority**: 🟢 Medium - Code cleanliness

**Task Description**:
```
Remove unused variables, imports, and parameters throughout the Zyeuté codebase.

Context:
- ESLint rule `@typescript-eslint/no-unused-vars` is set to warn
- Unused code increases bundle size and maintenance burden
- Some unused variables may be prefixed with `_` (which ESLint ignores)

Requirements:
1. Identify unused:
   - Import statements
   - Variables
   - Function parameters
   - Type imports

2. Remove unused code OR mark as intentionally unused:
   - Remove if truly unused
   - Prefix with `_` if needed for interface compliance (e.g., `_event: Event`)
   - Use ESLint ignore comment if removal would break something

3. Common patterns:
   - Unused React imports (if using new JSX transform)
   - Unused type imports
   - Unused destructured variables
   - Unused function parameters in callbacks

Example fixes:
```typescript
// Before
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { unusedFunction } from './utils';

function Component() {
  const [count, setCount] = useState(0);
  const unusedVar = 'test';
  useEffect(() => {
    // Only using setCount
  }, []);
}

// After
import { useState, useEffect } from 'react';

function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Only using setCount
  }, []);
}

// If parameter required by interface but unused:
function handleClick(_event: React.MouseEvent) {
  // _ prefix tells ESLint this is intentionally unused
}
```

Success Criteria:
- ✅ All unused variables/imports removed
- ✅ Code compiles without errors
- ✅ No functionality broken
- ✅ ESLint `no-unused-vars` warnings resolved
- ✅ Bundle size may be slightly reduced

Testing:
- Run: `npm run lint` - should show fewer/no unused-vars warnings
- Run: `npm run build` - verify build succeeds
- Run: `npm run type-check` - verify types still work
```

**Estimated Time**: 2-3 hours  
**Complexity**: Low-Medium  
**Impact**: Medium - Code cleanliness, smaller bundle

---

## 🧪 Priority 3: Testing & Validation

### Task 5: Test Blank Page Fixes

**Priority**: 🟢 Medium - User experience validation

**Task Description**:
```
Test the 9 recently fixed blank pages in Zyeuté and create a test report documenting results.

Context:
- Previous work fixed blank page issues on several routes
- Need to verify all pages render correctly
- Document any remaining issues

Pages to test:
1. /story/create - Story creation page
2. /settings/favorites - Favorites settings
3. /settings/hidden - Hidden content settings
4. /settings/content - Content preferences
5. /settings/photos - Photo settings
6. /settings/audio - Audio settings
7. /settings/storage - Storage settings
8. /settings/app - App settings
9. /settings/language - Language settings

Requirements:
1. Navigate to each page in development mode
2. Verify:
   - Page renders (not blank)
   - No console errors
   - Navigation works (can go back/forward)
   - UI elements are visible and functional
   - Loading states work (if applicable)
   - Error states handled (if applicable)

3. Test scenarios:
   - Authenticated user
   - Unauthenticated user (if applicable)
   - Mobile viewport (responsive)
   - Desktop viewport

4. Create test report document:
   - File: `BLANK_PAGE_TEST_REPORT.md`
   - Include: Page name, status (✅/❌), issues found, screenshots (if issues)

Example report format:
```markdown
# Blank Page Test Report
Date: 2025-01-27

## Results

### ✅ /story/create
- Status: PASS
- Renders correctly
- No console errors
- Navigation works

### ❌ /settings/favorites
- Status: FAIL
- Issue: Blank page still appears
- Console error: "Cannot read property 'map' of undefined"
- Screenshot: [link]
```

Success Criteria:
- ✅ All 9 pages tested
- ✅ Test report created with results
- ✅ Issues documented (if any)
- ✅ Screenshots included for failures
- ✅ Recommendations provided for fixes (if needed)
```

**Estimated Time**: 1-2 hours  
**Complexity**: Low  
**Impact**: Medium - User experience validation

---

## 📋 Task Summary

| Task | Priority | Time | Complexity | Impact |
|------|----------|------|------------|--------|
| 1. Fix Dependabot YAML | 🔴 Critical | 15 min | Low | High |
| 2. Replace console.log | 🟡 High | 2-3 hrs | Medium | High |
| 3. Fix `any` types | 🟡 High | 4-6 hrs | Medium-High | High |
| 4. Remove unused vars | 🟢 Medium | 2-3 hrs | Low-Medium | Medium |
| 5. Test blank pages | 🟢 Medium | 1-2 hrs | Low | Medium |

**Total Estimated Time**: ~10-15 hours

---

## 🚀 How to Use These Tasks

### For Cursor Agents:

1. **Go to**: `cursor.com/agents`
2. **Click**: "New Agent"
3. **Paste**: One of the task descriptions above (copy the entire task description block)
4. **Select**:
   - Repository: `brandonlacoste9-tech/Zyeute`
   - Branch: `main` (or create feature branch like `fix/dependabot-yaml`)
5. **Submit**: Let the agent work autonomously

### Recommended Order:

1. **Start with Task 1** (Dependabot fix) - Quick win, unblocks PRs
2. **Then Task 2** (Logger replacement) - Improves production readiness
3. **Then Task 3** (Type fixes) - Improves type safety
4. **Then Task 4** (Unused vars) - Code cleanup
5. **Finally Task 5** (Testing) - Validation

### Creating Feature Branches:

```bash
# For each task, create a feature branch
git checkout -b fix/dependabot-yaml
git checkout -b refactor/replace-console-logs
git checkout -b refactor/fix-any-types
git checkout -b cleanup/remove-unused-vars
git checkout -b test/blank-pages-validation
```

### PR Naming Convention:

- `fix: resolve dependabot YAML syntax error`
- `refactor: replace console.log with logger utility`
- `refactor: replace any types with proper TypeScript types`
- `chore: remove unused variables and imports`
- `test: validate blank page fixes`

---

## 📝 Notes

- **ESLint Configuration**: See `.eslintrc.json` for current rules
- **Logger Utility**: Located at `src/lib/logger.ts`
- **Type Definitions**: See `src/types/` directory
- **Previous Work**: PRs #66, #69, #70 fixed ~405 `react/no-unescaped-entities` errors
- **CI Status**: Non-blocking (PR #68), so fixes can be gradual

---

## 🔄 Updates

- **2025-01-27**: Initial task descriptions created
- Tasks based on current project state and ESLint configuration
- All tasks are autonomous and can be run independently
