
// TC-006.1: Cycle Notifications
//viewCycleNotifications.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');

test('TC-006.1: Verify Admin can view cycle notifications', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Verify Cycle Notifications section exists
  await expect(page.getByText('Cycle Notifications')).toBeVisible();
  
  // Find and click the View button - simpler approach
  // Based on your screenshot, there should be a "View" button in that section
  const viewButton = page.getByRole('button', { name: 'View' });
  
  // Wait for it and click
  await viewButton.waitFor({ state: 'visible', timeout: 10000 });
  await viewButton.click();
  
  // Verify modal/workflow opens
  await expect(page.locator('.modal, [class*="modal"], [class*="Modal"]').first()).toBeVisible({ timeout: 10000 });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="cycle-notification-alert"] with actual notification alert selector
// - Replace [data-testid="cycle-notification-view-button"] with actual View button selector
// - Replace [data-testid="cycle-notification-workflow"] with actual workflow container/page selector
// - May need to create test data or mock notifications for consistent testing
// - Consider using page.getByRole('button', { name: 'View' }) or page.getByText('View')
// - Adjust URL pattern matching based on your actual routing
// - Handle cases where no notifications exist in test environment
// Add this to see what's actually on the page:
test('Debug: See what buttons exist', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Take a screenshot to see the state
  await page.screenshot({ path: 'dashboard-state.png', fullPage: true });
  
  // List all buttons on the page
  const buttons = await page.getByRole('button').all();
  console.log('Found buttons:', await Promise.all(buttons.map(b => b.textContent())));
  
  // List all links (View might be a link, not a button)
  const links = await page.getByRole('link').all();
  console.log('Found links:', await Promise.all(links.map(l => l.textContent())));
});
