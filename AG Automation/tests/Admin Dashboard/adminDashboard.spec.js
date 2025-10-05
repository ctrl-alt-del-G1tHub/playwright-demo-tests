// adminDashboard.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');


test.describe('Admin Dashboard', () => {
  
 test('Admin can view events container and navigate to Schedule screen', async ({ page }) => {
  // Login precondition
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  
  // Step 1: Verify Events container
  await expect(page.getByText('Events')).toBeVisible();

  // Step 2: Verify event statuses and percentage ring
  const eventsCard = page.locator('div.MuiCard-root:has-text("Events")');

  await expect(eventsCard.getByText('Scheduled', { exact: true }).first()).toBeVisible();
  await expect(eventsCard.getByText('In Progress', { exact: true })).toBeVisible();
  await expect(eventsCard.getByText('Completed', { exact: true })).toBeVisible();

  await expect(eventsCard.locator('.MuiTypography-caption').nth(2)).toBeVisible();

  // Step 3: Click container
  await page.locator('div.MuiCard-root:has-text("Events")').nth(1).click();

 // Click the <a> that contains the span with text "Events"
await page.locator('a:has(span:text("Events"))').click();

// Wait for navigation
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
