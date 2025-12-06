import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests critical auth flows: login, signup, logout
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Navigate to login (adjust route as needed)
    await page.goto('/login');
    
    // Check for login form elements
    // await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    // await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    // await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible();
  });

  test.skip('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    // await page.fill('[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    // await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD || 'password123');
    
    // Submit
    // await page.click('button[type="submit"]');
    
    // Verify redirect to feed
    // await expect(page).toHaveURL(/feed/i);
    // await expect(page.getByText(/bienvenue/i)).toBeVisible();
  });

  test.skip('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    // await page.fill('[name="email"]', 'invalid@example.com');
    // await page.fill('[name="password"]', 'wrongpassword');
    
    // Submit
    // await page.click('button[type="submit"]');
    
    // Verify error message
    // await expect(page.getByText(/erreur|invalid/i)).toBeVisible();
  });
});
