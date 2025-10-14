// TC-014.1, TC-014.2, TC-014.3: Cycle Completion Process
//completeCycle.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
 test.describe('TC-014: Complete Cycle Functionality', () => {
  test('TC-014.1, TC-014.2, TC-014.3: Verify Admin can complete Cycle', async ({ page }) => {
    // Login
    await page.goto('https://app.artisangenius.com/');
    await page.fill('#email', 'jason@artisangenius.com');
    await page.fill('#password', '13243546');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await page.waitForTimeout(2000);
    
    // TC-014.1: Check for End of Cycle Report notification in Cycle Notifications
    const cycleNotificationsSection = page.locator('text=Cycle Notifications').locator('../..');
    await expect(cycleNotificationsSection).toBeVisible();
    
    // Verify "1 New" notification indicator
    await expect(cycleNotificationsSection.getByText('1 New')).toBeVisible();
    
    // Verify End of Cycle Report notification
    await expect(page.getByText('End of Cycle Report').first()).toBeVisible();
    await expect(page.getByText("All edits complete? Let's send the team the report.")).toBeVisible();
    
    // Click View button
    const viewButton = page.getByRole('button', { name: 'View' });
    await expect(viewButton).toBeVisible();
    await viewButton.click();
    
    // Expected Result: End of Cycle Report modal opens
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'End of Cycle Report' });
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // Verify modal title and content
    await expect(modal.getByText('End of Cycle Report').first()).toBeVisible();
    await expect(modal.getByText('Review and finalize the current performance cycle')).toBeVisible();
    
    // Verify warning message
    await expect(modal.getByText('Cycle has ended. All scores and hours must be correct')).toBeVisible();
    await expect(modal.getByText('Changes should NOT be made after cycle is marked complete')).toBeVisible();
    await expect(modal.getByText('Technicians will see their final bonus and leaderboard standings')).toBeVisible();
    
    // Verify buttons are present
    const completeCycleButton = modal.getByRole('button', { name: 'Complete Cycle' });
    const cancelButton = modal.getByRole('button', { name: 'Cancel' });
    
    await expect(completeCycleButton).toBeVisible();
    await expect(cancelButton).toBeVisible();
    
    // TC-014.3: Test Cancel functionality first
    await cancelButton.click();
    
    // Expected Result: Modal closes, notification remains
    await expect(modal).not.toBeVisible();
    await expect(page.getByText('End of Cycle Report').first()).toBeVisible();
    
    // Re-open modal for TC-014.2
    await viewButton.click();
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    // TC-014.2: Click Complete Cycle
    const completeCycleBtn = modal.getByRole('button', { name: 'Complete Cycle' });
    await completeCycleBtn.click();
    
    // Expected Result: Modal closes
    await expect(modal).not.toBeVisible({ timeout: 5000 });
    
    // Verify we're still on the dashboard
    await expect(page).toHaveURL(/.*\/dashboard$/);
    
    // Take screenshot of final state
    await page.screenshot({ path: 'after-complete-cycle.png' });
    
    console.log('Cycle completion workflow tested successfully');
  });
  
  test('TC-014.4: Verify modal close button works', async ({ page }) => {
    // Login
    await page.goto('https://app.artisangenius.com/');
    await page.fill('#email', 'jason@artisangenius.com');
    await page.fill('#password', '13243546');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await page.waitForTimeout(2000);
    
    // Open modal
    await page.getByRole('button', { name: 'View' }).click();
    
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'End of Cycle Report' });
    await expect(modal).toBeVisible();
    
    // Find and click the X close button (from HTML: ×)
    const closeButton = modal.locator('button').filter({ hasText: '×' });
    if (await closeButton.isVisible()) {
      await closeButton.click();
      
      // Verify modal closes
      await expect(modal).not.toBeVisible();
    }
  });
});

test('Debug: Find Cycle End Report elements', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'cycle-end-report-debug.png', fullPage: true });
  
  // Search for "End of Cycle Report"
  const endOfCycleCount = await page.locator('text=/end.*of.*cycle.*report/i').count();
  console.log('\n=== "End of Cycle Report" count: ===', endOfCycleCount);
  
  if (endOfCycleCount > 0) {
    const endOfCycleElement = page.locator('text=/end.*of.*cycle.*report/i').first();
    await endOfCycleElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const container = endOfCycleElement.locator('../..');
    const containerHTML = await container.innerHTML();
    console.log('\n=== End of Cycle Report container HTML: ===');
    console.log(containerHTML.substring(0, 1500));
    
    await container.screenshot({ path: 'end-of-cycle-section.png' });
  }
  
  // Check Cycle Notifications container
  console.log('\n=== Looking for Cycle Notifications: ===');
  const cycleNotifCount = await page.locator('text=/cycle.*notification/i').count();
  console.log('Cycle Notifications count:', cycleNotifCount);
  
  if (cycleNotifCount > 0) {
    const cycleNotif = page.locator('text=/cycle.*notification/i').first();
    await cycleNotif.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Get the notifications container
    const notifContainer = cycleNotif.locator('../..');
    const notifHTML = await notifContainer.innerHTML();
    console.log('\n=== Cycle Notifications HTML: ===');
    console.log(notifHTML.substring(0, 2000));
    
    // Look for View buttons in this container
    const viewButtons = await notifContainer.locator('button, a').all();
    console.log('\n=== Buttons/Links in Cycle Notifications: ===', viewButtons.length);
    for (let i = 0; i < viewButtons.length; i++) {
      const text = await viewButtons[i].textContent();
      const tag = await viewButtons[i].evaluate(el => el.tagName);
      console.log(`${i}: <${tag}> "${text?.trim()}"`);
    }
  }
  
  // Look for any "Complete Cycle" text or buttons
  console.log('\n=== Looking for "Complete Cycle": ===');
  const completeCycleCount = await page.locator('text=/complete.*cycle/i').count();
  console.log('Complete Cycle count:', completeCycleCount);
  
  // Look for notification-related elements
  console.log('\n=== Looking for notification indicators: ===');
  const badges = await page.locator('[class*="badge" i], [class*="notification" i]').all();
  console.log('Notification badges/indicators:', badges.length);
  
  // Search for modals that might be hidden
  const modals = await page.locator('[role="dialog"], [class*="modal" i], [class*="Modal" i]').all();
  console.log('\n=== Modals on page: ===', modals.length);
  for (let i = 0; i < modals.length; i++) {
    const isVisible = await modals[i].isVisible();
    const ariaLabel = await modals[i].getAttribute('aria-label');
    console.log(`Modal ${i}: visible=${isVisible}, aria-label="${ariaLabel}"`);
  }
  
  // Check if there's a View button we found earlier
  const viewButtons = await page.getByRole('button', { name: /view/i }).all();
  console.log('\n=== View buttons on page: ===', viewButtons.length);
  for (let i = 0; i < viewButtons.length; i++) {
    const text = await viewButtons[i].textContent();
    const isVisible = await viewButtons[i].isVisible();
    console.log(`${i}: "${text?.trim()}" - Visible: ${isVisible}`);
  }
  
  // Try clicking the View button if it exists
  if (viewButtons.length > 0) {
    console.log('\n=== Attempting to click first View button: ===');
    await viewButtons[0].click();
    await page.waitForTimeout(1000);
    
    // Check what appeared
    await page.screenshot({ path: 'after-view-click.png' });
    
    const newModals = await page.locator('[role="dialog"], [class*="modal" i]').all();
    console.log('Modals after click:', newModals.length);
    
    for (let i = 0; i < newModals.length; i++) {
      const isVisible = await newModals[i].isVisible();
      if (isVisible) {
        const modalText = await newModals[i].textContent();
        console.log(`Visible modal ${i} text:`, modalText?.substring(0, 500));
      }
    }
  }
});
  
//------------------- TEST NOTES -------------------
// - Replace [data-testid="cycle-notifications-container"] with actual notifications container selector
// - Replace [data-testid="cycle-end-report-notification"] with actual notification selector
// - Replace [data-testid="view-button"] with actual View button selector
// - Replace [data-testid="cycle-end-report-modal"] with actual modal selector
// - Replace [data-testid="complete-cycle-button"] with actual Complete Cycle button selector
// - Replace [data-testid="end-of-cycle-report-notification"] with actual new notification selector
// - Replace [data-testid="cancel-button"] with actual Cancel button selector
// - This test heavily depends on cycle timing - consider mocking or test data setup
// - May need to handle different notification states and timing
// - Consider using page.getByRole('button', { name: 'Complete Cycle' }) for semantic selectors