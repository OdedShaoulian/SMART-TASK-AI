import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
  });
});


