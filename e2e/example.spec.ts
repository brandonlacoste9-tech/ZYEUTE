import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  // Navigate to a page
  await page.goto('https://example.com');
  
  // Some test steps here
  await page.click('button');
  
  // Fixed: added await for web-first assertion
  await expect(page).toHaveTitle('Expected Title');
  
  // More test steps
  await page.waitForTimeout(1000);
});

