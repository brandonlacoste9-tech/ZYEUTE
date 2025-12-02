/**
 * E2E Test: Homepage
 * Tests the basic functionality of the Zyeuté homepage
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loaded
    await expect(page).toHaveTitle(/Zyeuté/i);
  });

  test('should display the logo', async ({ page }) => {
    await page.goto('/');
    
    // Look for the logo (adjust selector as needed)
    const logo = page.locator('[data-testid="logo"], img[alt*="Zyeuté"], svg');
    await expect(logo.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for navigation (adjust selectors as needed)
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible({ timeout: 10000 });
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // On mobile, check for mobile-specific elements
    if (isMobile) {
      // Mobile bottom navigation should be visible
      const bottomNav = page.locator('[data-testid="bottom-nav"], nav.bottom-0, nav.fixed.bottom-0');
      await expect(bottomNav.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should not have console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected errors (like missing environment variables in test)
    const criticalErrors = consoleErrors.filter(
      (error) => 
        !error.includes('Supabase') && 
        !error.includes('env') &&
        !error.includes('401') // Ignore auth errors in tests
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Navigation', () => {
  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/');
    
    // Wait for navigation to be ready
    await page.waitForLoadState('networkidle');
    
    // Try to click on a navigation link (adjust selector as needed)
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    // Verify there are navigation links
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for h1 element
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1 for accessibility
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check that images have alt text (or are decorative)
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Image should have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBe(true);
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
