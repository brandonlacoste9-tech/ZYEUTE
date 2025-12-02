# 🧪 Testing Guide - Zyeuté

Comprehensive guide for testing Zyeuté's codebase.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Unit Testing](#unit-testing)
4. [E2E Testing](#e2e-testing)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Coverage Requirements](#coverage-requirements)
8. [CI/CD Integration](#cicd-integration)

---

## 🎯 Overview

Zyeuté uses a comprehensive testing strategy to ensure code quality and reliability:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between modules
- **E2E Tests**: Test complete user journeys
- **Coverage Target**: 70%+ code coverage

---

## 🛠️ Testing Stack

### Unit & Integration Testing
- **Vitest** - Fast, Vite-native test runner
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - Browser environment simulation

### E2E Testing
- **Playwright** - Cross-browser E2E testing
- **Chromium, Firefox, WebKit** - Multiple browser support
- **Mobile testing** - iOS and Android simulation

### Coverage
- **@vitest/coverage-v8** - Fast, accurate coverage reporting
- **HTML, JSON, LCOV** - Multiple report formats

---

## 🧪 Unit Testing

### Running Unit Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are located alongside the files they test:

```
src/
  lib/
    utils.ts
    utils.test.ts     # ✅ Tests for utils.ts
  components/
    Button.tsx
    Button.test.tsx   # ✅ Tests for Button.tsx
```

### Example Unit Test

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatNumber } from './utils';

describe('formatNumber', () => {
  it('should format thousands with K suffix', () => {
    expect(formatNumber(1500)).toBe('1.5K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(2500000)).toBe('2.5M');
  });
});
```

### Component Testing

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

## 🎭 E2E Testing

### Running E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/homepage.spec.ts

# Run in specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### E2E Test Structure

Tests are located in the `e2e/` directory:

```
e2e/
  homepage.spec.ts      # Homepage tests
  auth.spec.ts          # Authentication tests
  posts.spec.ts         # Post creation tests
  admin.spec.ts         # Admin panel tests
```

### Example E2E Test

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to feed
    await expect(page).toHaveURL(/\/feed/);
  });
});
```

---

## 🚀 Running Tests

### Local Development

```bash
# Quick test run
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e
```

### CI/CD Pipeline

Tests run automatically on:
- Every pull request
- Every push to `main`, `develop`, or `master`
- Scheduled runs (weekly)

The CI pipeline runs:
1. ✅ Unit tests with coverage
2. ✅ E2E tests (on production deployments)
3. ✅ Coverage reporting
4. ✅ Test result artifacts

---

## ✍️ Writing Tests

### Best Practices

#### Unit Tests
1. **Test behavior, not implementation**
   ```typescript
   // ❌ Bad: Testing implementation details
   expect(component.state.count).toBe(5);
   
   // ✅ Good: Testing user-visible behavior
   expect(screen.getByText('Count: 5')).toBeInTheDocument();
   ```

2. **Use descriptive test names**
   ```typescript
   // ❌ Bad
   it('works', () => { ... });
   
   // ✅ Good
   it('should format numbers over 1000 with K suffix', () => { ... });
   ```

3. **Follow Arrange-Act-Assert pattern**
   ```typescript
   it('should increment counter on click', async () => {
     // Arrange
     render(<Counter />);
     const button = screen.getByRole('button');
     
     // Act
     await userEvent.click(button);
     
     // Assert
     expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

#### E2E Tests
1. **Test critical user journeys**
   - Signup and login
   - Creating posts
   - Admin access control
   - Payment flows

2. **Use data-testid for stable selectors**
   ```typescript
   // Component
   <button data-testid="submit-post">Post</button>
   
   // Test
   await page.click('[data-testid="submit-post"]');
   ```

3. **Wait for network idle**
   ```typescript
   await page.goto('/');
   await page.waitForLoadState('networkidle');
   ```

### What to Test

#### High Priority
- ✅ Utility functions (`src/lib/utils.ts`)
- ✅ Authentication flows
- ✅ Post creation and display
- ✅ Admin functionality
- ✅ Payment processing
- ✅ API interactions

#### Medium Priority
- ✅ Component rendering
- ✅ Form validation
- ✅ Error handling
- ✅ State management
- ✅ Routing

#### Low Priority
- ⚪ UI animations
- ⚪ Style calculations
- ⚪ Third-party integrations (mock instead)

---

## 📊 Coverage Requirements

### Thresholds

Vitest enforces the following coverage thresholds:

```typescript
coverage: {
  thresholds: {
    lines: 70,       // 70% of lines covered
    functions: 70,   // 70% of functions covered
    branches: 70,    // 70% of branches covered
    statements: 70,  // 70% of statements covered
  }
}
```

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Reports are generated in:
coverage/
  index.html        # Visual HTML report
  lcov.info         # LCOV format (for CI)
  coverage.json     # JSON format
```

Open `coverage/index.html` in your browser to view detailed coverage.

### Excluded from Coverage

- `node_modules/`
- `dist/`, `build/`
- Test files (`*.test.ts`, `*.spec.ts`)
- Config files (`*.config.ts`)
- Type definitions (`*.d.ts`)
- Scripts and utilities (`scripts/`, `netlify/`)

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Tests run on every PR and push via `.github/workflows/ci.yml`:

```yaml
test-unit:
  name: 🧪 Unit Tests
  runs-on: self-hosted
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20.19.0'
    - run: npm ci
    - run: npm run test
    - run: npm run test:coverage
```

### Test Results

- **Pass/Fail**: Pipeline fails if tests fail
- **Coverage**: Coverage reports uploaded as artifacts
- **E2E Results**: Playwright HTML report available in artifacts

### Viewing Results

1. Go to GitHub Actions tab
2. Click on the workflow run
3. View "Test Results" artifact
4. Download and open `index.html` for detailed results

---

## 🐛 Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test src/lib/utils.test.ts

# Run tests matching pattern
npm test -- --grep "formatNumber"

# Debug with node inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### E2E Tests

```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode (step through)
npx playwright test --debug

# Specific test
npx playwright test e2e/homepage.spec.ts --debug

# Generate trace
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

## 🔧 Configuration Files

### Vitest Config
`vitest.config.ts` - Unit test configuration

### Playwright Config
`playwright.config.ts` - E2E test configuration

### Test Setup
`src/test/setup.ts` - Global test setup and mocks

---

## 📚 Resources

### Documentation
- **Vitest**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev

### Tutorials
- [Testing React Apps](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

## 🎯 Quick Commands Reference

```bash
# Unit Tests
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage

# E2E Tests
npm run test:e2e           # Headless
npm run test:e2e:ui        # With UI
npx playwright test --debug # Debug mode

# Coverage
npm run test:coverage      # Generate report
open coverage/index.html   # View report

# CI/CD
git push                   # Triggers CI pipeline
```

---

**Happy Testing!** 🔥⚜️

*Testing ensures Zyeuté remains stable and reliable for the Quebec community.*
