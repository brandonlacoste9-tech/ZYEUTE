# Testing Guide for Zyeuté

This guide explains how to write and run tests for the Zyeuté project.

## Quick Start

```bash
# Install dependencies (includes test tools)
npm install

# Run all tests
npm run test:all

# Run unit tests with watch mode
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Test Structure

```
src/
├── components/
│   └── Button.test.tsx      # Component unit tests
├── services/
│   └── openaiService.test.ts # Service unit tests
└── test/
    ├── setup.ts             # Test setup & mocks
    └── utils.tsx            # Test utilities

e2e/
├── auth.spec.ts             # Authentication E2E tests
└── example.spec.ts          # Example E2E tests
```

## Unit Tests (Vitest)

Unit tests are for testing individual components and functions in isolation.

### Writing Unit Tests

```typescript
// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/utils';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Unit Tests

```bash
# Watch mode (development)
npm run test

# Run once
npm run test:run

# With coverage
npm run test:coverage
```

## Integration Tests

Integration tests verify that multiple parts of the system work together.

### Writing Integration Tests

```typescript
// src/services/openaiService.integration.test.ts
import { describe, it, expect } from 'vitest';
import { generateImage } from './openaiService';

describe('OpenAI Service Integration', () => {
  it('should generate image with valid prompt', async () => {
    const imageUrl = await generateImage('Une poutine', 'realistic');
    expect(imageUrl).toBeTruthy();
    expect(imageUrl).toMatch(/^https?:\/\//);
  });
});
```

### Running Integration Tests

```bash
npm run test:integration
```

## E2E Tests (Playwright)

E2E tests simulate real user interactions in a browser.

### Writing E2E Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL(/feed/i);
  await expect(page.getByText(/bienvenue/i)).toBeVisible();
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

## Test Utilities

### `renderWithProviders`

Use this instead of `render()` from `@testing-library/react` to include providers:

```typescript
import { renderWithProviders } from '../test/utils';

test('component with router', () => {
  renderWithProviders(<MyComponent />);
  // Component has access to Router context
});
```

### Mocking Supabase

```typescript
import { mockSupabase } from '../test/utils';

// Mock Supabase responses
mockSupabase.from.mockReturnValue({
  select: vi.fn().mockResolvedValue({
    data: [{ id: 1, caption: 'Test post' }],
    error: null,
  }),
});
```

## Coverage Goals

- **Target:** 70%+ coverage
- **Critical paths:** 90%+ coverage
  - Authentication
  - Post creation/editing
  - Payment flows
  - Admin functions

## Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // ✅ Good: Test what user sees
   expect(screen.getByText('Post créé!')).toBeVisible();
   
   // ❌ Bad: Test internal state
   expect(component.state.isSubmitted).toBe(true);
   ```

2. **Use semantic queries**
   ```typescript
   // ✅ Good: Accessible queries
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText(/email/i);
   
   // ❌ Bad: Implementation details
   screen.getByTestId('submit-btn');
   ```

3. **Mock external dependencies**
   ```typescript
   // Mock Supabase, OpenAI, Stripe
   vi.mock('../lib/supabase', () => ({
     supabase: mockSupabase,
   }));
   ```

4. **Clean up after tests**
   - Vitest automatically cleans up with `afterEach`
   - Playwright handles browser cleanup

5. **Test critical user journeys**
   - Signup → Login → Create Post → View Feed
   - Payment flow
   - Admin moderation

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every push to `main` or `develop`
- Manual workflow dispatch

See `.github/workflows/ci.yml` for details.

## Troubleshooting

### Tests fail in CI but pass locally

- Check Node.js version matches (20.19.0)
- Verify environment variables are set
- Check for timeouts (increase if needed)

### Playwright tests fail

- Ensure browsers are installed: `npx playwright install`
- Check that preview server starts correctly
- Verify BASE_URL is set correctly

### Coverage below threshold

- Run `npm run test:coverage` to see detailed report
- Focus on uncovered lines in critical files
- Add tests for missing coverage

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Playwright Documentation](https://playwright.dev)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
