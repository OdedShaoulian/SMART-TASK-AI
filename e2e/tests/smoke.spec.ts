import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for the main content to be visible
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible({ timeout: 10000 });
  });
});


