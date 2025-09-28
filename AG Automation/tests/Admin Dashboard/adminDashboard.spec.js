// adminDashboard.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');


test.describe('Admin Dashboard', () => {
  
 test('Admin can view events container and navigate to Schedule screen', async ({ page }) => {
  // Login precondition
  await page.goto('Artisan Genius URL');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  
  // Step 1: Verify Events container
  await expect(page.locator('#events-container')).toBeVisible();

  // Step 2: Verify event statuses and percentage ring
  await expect(page.locator('#events-container .scheduled')).toBeVisible();
  await expect(page.locator('#events-container .in-progress')).toBeVisible();
  await expect(page.locator('#events-container .completed')).toBeVisible();
  await expect(page.locator('#events-container .percentage-ring')).toBeVisible();

  // Step 3: Click container
  await page.click('#events-container');

  // Step 4: Verify navigation to Schedule screen
  await expect(page).toHaveURL(/.*\/schedule/); 
  });

});
// ------------------- TEST NOTES -------------------
// 1. Selectors:
//    - The IDs and classes used here (#events-container, .scheduled, .in-progress, etc.)
//      are placeholders. Replace with actual selectors (e.g., data-testid, getByRole, getByText)
//      for more stable automation.
//
// 2. Login setup:
//    - Credentials are hardcoded for simplicity.
//    - For real test suites, use a fixture, helper function, or environment variables
//      to manage login flow securely and reduce duplication.
//
// 3. Dynamic data:
//    - If event statuses (Scheduled, In Progress, Completed) change frequently,
//      this test may become flaky.
//    - Consider using predictable test data, seed data, or looser assertions like
//      toHaveCountGreaterThan(0) instead of strict visibility checks.
//
// 4. Percentage ring:
//    - Currently only verifies that the percentage ring is visible.
//    - To validate correctness, add assertions to check its displayed value
//      against expected totals.
//
// 5. Navigation check:
//    - toHaveURL(/.*\/schedule/) assumes a fixed route.
//    - If the app appends query params or uses dynamic routes,
//      adjust the regex or use a more specific check.
// --------------------------------------------------
