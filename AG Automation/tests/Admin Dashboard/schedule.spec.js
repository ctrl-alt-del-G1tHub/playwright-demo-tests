import { test, expect } from '@playwright/test';

test('Verify Technician Status container opens modal', async ({ page }) => {
  // --- Precondition ---
  // Admin is logged in and on the Admin Dashboard
  await page.goto('https://your-app-url.com/admin/dashboard');
  // (If login is required, insert login steps or use a helper function here)

  // --- Step 1: Verify "Technician Status" container is displayed ---
  const techStatusContainer = page.locator('[data-testid="technician-status-container"]');
  await expect(techStatusContainer).toBeVisible();

  // --- Step 2: Verify expected elements inside container ---
  await expect(techStatusContainer.getByText('Total Clocked In')).toBeVisible();
  await expect(techStatusContainer.getByText('Total Clocked Out')).toBeVisible();
  await expect(techStatusContainer.getByText('Total Scheduled')).toBeVisible();

  // Example: check the percentage ring (assuming it’s an SVG or canvas with label)
  const percentageRing = techStatusContainer.locator('[data-testid="percentage-ring"]');
  await expect(percentageRing).toBeVisible();

  // --- Step 3: Click the container ---
  await techStatusContainer.click();

  // --- Expected Result: Technician Status modal opens ---
  const techStatusModal = page.locator('[data-testid="technician-status-modal"]');
  await expect(techStatusModal).toBeVisible();
});

// ------------------- TEST NOTES -------------------
// - Used data-testid selectors in the example because that’s the cleanest approach for automation.
//   If your app doesn’t have them yet, you can switch to getByRole, getByText, or locator('css-selector').
// - If login is part of the test, add login steps or use a fixture/helper to log in before navigating to the dashboard.
// - The "percentage ring" check depends on how it’s implemented (text value, aria-label, or graphical element).
// ---------------------------------------------------
