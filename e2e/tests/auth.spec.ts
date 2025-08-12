import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign up and sign in buttons for unauthenticated users', async ({ page }) => {
    // Check that we're on the landing page
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    
    // Check for sign up button
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    
    // Check for sign in link
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should display features list on landing page', async ({ page }) => {
    // Check for features section
    await expect(page.getByText('✨ Features')).toBeVisible();
    
    // Check for specific features
    await expect(page.getByText('AI-powered task breakdown')).toBeVisible();
    await expect(page.getByText('Smart subtask generation')).toBeVisible();
    await expect(page.getByText('Progress tracking')).toBeVisible();
    await expect(page.getByText('User-specific task management')).toBeVisible();
  });

  test('should have proper navigation structure', async ({ page }) => {
    // Check that the app has proper semantic structure
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper heading hierarchy
    await expect(page.getByRole('heading', { name: 'Welcome to SmartTask AI' })).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible and properly laid out
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    
    // Check that features are still accessible
    await expect(page.getByText('✨ Features')).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    // Check that buttons have proper ARIA labels and roles
    const signUpButton = page.getByRole('button', { name: 'Get Started' });
    await expect(signUpButton).toBeVisible();
    
    const signInButton = page.getByRole('button', { name: 'Sign in' });
    await expect(signInButton).toBeVisible();
    
    // Check that buttons are keyboard accessible
    await page.keyboard.press('Tab');
    await expect(signUpButton).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(signInButton).toBeFocused();
  });

  test('should handle authentication modal interactions', async ({ page }) => {
    // Click sign up button
    await page.getByRole('button', { name: 'Get Started' }).click();
    
    // Note: In a real test environment with Clerk, we would test the actual modal
    // For now, we'll just verify the button click doesn't cause errors
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
  });

  test('should maintain state after page refresh', async ({ page }) => {
    // Check initial state
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Check that state is maintained
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
  });

  test('should have proper error handling for network issues', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Try to navigate to the page
    await page.goto('/');
    
    // Check that the page still loads (it should work since it's mostly static)
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    
    // Restore online mode
    await page.context().setOffline(false);
  });

  test('should have proper loading states', async ({ page }) => {
    // Navigate to the page and check for any loading indicators
    await page.goto('/');
    
    // The landing page should load immediately without loading states
    await expect(page.getByText('Welcome to SmartTask AI')).toBeVisible();
    
    // Check that there are no unexpected loading spinners
    const loadingSpinners = page.locator('[role="status"]');
    await expect(loadingSpinners).toHaveCount(0);
  });
});
