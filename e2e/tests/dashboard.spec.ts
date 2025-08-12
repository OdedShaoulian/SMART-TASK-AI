import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication to simulate logged-in user
    await page.addInitScript(() => {
      // Mock Clerk user data
      window.localStorage.setItem('clerk-db', JSON.stringify({
        user: {
          id: 'test-user-id',
          firstName: 'Test',
          lastName: 'User',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
        },
        session: {
          id: 'test-session-id',
          userId: 'test-user-id',
        },
      }));
    });

    await page.goto('/');
  });

  test('should display welcome message with user name', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForSelector('text=Welcome back, Test!');
    
    await expect(page.getByText('Welcome back, Test!')).toBeVisible();
    await expect(page.getByText("Let's make today productive with SmartTask AI")).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for statistics cards
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Subtasks')).toBeVisible();
    
    // Check for icons
    await expect(page.locator('svg[data-lucide="check-square"]')).toBeVisible();
    await expect(page.locator('svg[data-lucide="clock"]')).toBeVisible();
    await expect(page.locator('svg[data-lucide="trending-up"]')).toBeVisible();
    await expect(page.locator('svg[data-lucide="brain"]')).toBeVisible();
  });

  test('should display quick action buttons', async ({ page }) => {
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for quick actions section
    await expect(page.getByText('Quick Actions')).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByText('Create New Task')).toBeVisible();
    await expect(page.getByText('View All Tasks')).toBeVisible();
  });

  test('should navigate to create task page', async ({ page }) => {
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Click create task button
    await page.getByText('Create New Task').click();
    
    // Should navigate to create task page
    await expect(page).toHaveURL('/tasks/new');
  });

  test('should navigate to tasks list page', async ({ page }) => {
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Click view all tasks button
    await page.getByText('View All Tasks').click();
    
    // Should navigate to tasks page
    await expect(page).toHaveURL('/tasks');
  });

  test('should display empty state when no tasks exist', async ({ page }) => {
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for empty state
    await expect(page.getByText('No tasks yet')).toBeVisible();
    await expect(page.getByText('Get started by creating your first task')).toBeVisible();
    await expect(page.getByText('Create Your First Task')).toBeVisible();
    
    // Check for brain icon
    await expect(page.locator('svg[data-lucide="brain"]')).toBeVisible();
  });

  test('should display recent tasks when tasks exist', async ({ page }) => {
    // Mock API response with tasks
    await page.route('**/api/tasks', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Task 1', completed: false, subtasks: [] },
          { id: '2', title: 'Task 2', completed: true, subtasks: [{ id: '1', title: 'Subtask 1' }] },
          { id: '3', title: 'Task 3', completed: false, subtasks: [] },
        ]),
      });
    });

    await page.goto('/');
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for recent tasks section
    await expect(page.getByText('Recent Tasks')).toBeVisible();
    
    // Check for task items
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();
    
    // Check for subtask counts
    await expect(page.getByText('0 subtasks')).toBeVisible();
    await expect(page.getByText('1 subtask')).toBeVisible();
  });

  test('should toggle task completion', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/tasks', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Task 1', completed: false, subtasks: [] },
        ]),
      });
    });

    await page.route('**/api/tasks/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: '1', title: 'Task 1', completed: true, subtasks: [] }),
        });
      }
    });

    await page.goto('/');
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Find and click the checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    
    // Check that the task is now completed (has strikethrough)
    await expect(page.getByText('Task 1')).toHaveClass(/line-through/);
  });

  test('should show "View all tasks" link when more than 5 tasks exist', async ({ page }) => {
    // Mock API response with more than 5 tasks
    await page.route('**/api/tasks', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Task 1', completed: false, subtasks: [] },
          { id: '2', title: 'Task 2', completed: false, subtasks: [] },
          { id: '3', title: 'Task 3', completed: false, subtasks: [] },
          { id: '4', title: 'Task 4', completed: false, subtasks: [] },
          { id: '5', title: 'Task 5', completed: false, subtasks: [] },
          { id: '6', title: 'Task 6', completed: false, subtasks: [] },
        ]),
      });
    });

    await page.goto('/');
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for "View all tasks" link
    await expect(page.getByText('View all 6 tasks →')).toBeVisible();
    
    // Click the link
    await page.getByText('View all 6 tasks →').click();
    
    // Should navigate to tasks page
    await expect(page).toHaveURL('/tasks');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/tasks', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/');
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check for error message
    await expect(page.getByText('Failed to load tasks')).toBeVisible();
    
    // Check for retry button
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('text=Welcome back, Test!');
    
    // Check that content is still visible and properly laid out
    await expect(page.getByText('Welcome back, Test!')).toBeVisible();
    await expect(page.getByText('Quick Actions')).toBeVisible();
    
    // Check that statistics cards are properly stacked
    const statsCards = page.locator('.card');
    await expect(statsCards).toHaveCount(4);
  });

  test('should have proper loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/tasks', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/');
    
    // Check for loading spinner
    await expect(page.locator('[role="status"]')).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('text=No tasks yet');
    
    // Check that loading spinner is gone
    await expect(page.locator('[role="status"]')).not.toBeVisible();
  });
});
