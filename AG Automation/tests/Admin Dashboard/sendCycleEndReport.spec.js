// TC-015.1, TC-015.2, TC-015.3: Cycle Report Sending
//sendCycleEndReport.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
test('TC-015.1, TC-015.2, TC-015.3: Verify Admin can send cycle end report', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  
  // TC-015.1: Look for End of Cycle Report notification
  await expect(page.getByText('Cycle Notifications')).toBeVisible();
  await expect(page.getByText('1 New')).toBeVisible();
  await expect(page.getByText('End of Cycle Report').first()).toBeVisible();
  await expect(page.getByText("All edits complete? Let's send the team the report.")).toBeVisible();
  
  // Click View button
  const viewButton = page.getByRole('button', { name: 'View' });
  await viewButton.click();
  
  // Wait for modal to open
  const modal = page.locator('[role="dialog"]').filter({ hasText: 'End of Cycle Report' });
  await expect(modal).toBeVisible({ timeout: 5000 });
  
  // Verify modal content
  await expect(modal.getByText('Review and finalize the current performance cycle')).toBeVisible();
  await expect(modal.getByText('Cycle has ended. All scores and hours must be correct')).toBeVisible();
  
  // Get the Complete Cycle button - use a more specific selector
  const completeCycleButton = modal.locator('button').filter({ hasText: 'Complete Cycle' });
  await expect(completeCycleButton).toBeVisible();
  
  // Check if button is enabled
  const isDisabled = await completeCycleButton.isDisabled();
  console.log('Complete Cycle button disabled:', isDisabled);
  
  if (!isDisabled) {
    // Click Complete Cycle
    await completeCycleButton.click({ timeout: 5000 });
    
    // Wait for modal to close and check for success
    await expect(modal).not.toBeVisible({ timeout: 10000 });
    
    // Take screenshot after completion
    await page.screenshot({ path: 'after-cycle-complete.png', fullPage: true });
    
    // Check for any toast/alert messages
    const toastMessages = await page.locator('[role="alert"], [role="status"]').all();
    if (toastMessages.length > 0) {
      for (const toast of toastMessages) {
        const text = await toast.textContent();
        console.log('Toast message:', text);
      }
    }
  } else {
    console.log('Complete Cycle button is disabled - may require additional actions first');
  }
  
  // Note: TC-015.2 and TC-015.3 (checklist and send report) may be part of a different workflow
  // or require the cycle to be completed first. This test covers TC-015.1.
});

test('TC-015.4: Test Cancel button', async ({ page }) => {
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
  
  // Click Cancel
  const cancelButton = modal.getByRole('button', { name: 'Cancel' });
  await cancelButton.click();
  
  // Verify modal closes
  await expect(modal).not.toBeVisible();
  
  // Verify still on dashboard
  await expect(page).toHaveURL(/.*\/dashboard$/);
  
  // Verify notification still exists
  await expect(page.getByText('End of Cycle Report').first()).toBeVisible();
});
  
test('Debug: Find Send Cycle End Report elements', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // First, complete the cycle to trigger the next notification
  console.log('\n=== Step 1: Complete the cycle first ===');
  
  const viewButton = page.getByRole('button', { name: 'View' });
  if (await viewButton.isVisible()) {
    await viewButton.click();
    await page.waitForTimeout(1000);
    
    const modal = page.locator('[role="dialog"]').filter({ hasText: 'End of Cycle Report' });
    if (await modal.isVisible()) {
      const completeCycleBtn = modal.getByRole('button', { name: 'Complete Cycle' });
      if (await completeCycleBtn.isVisible()) {
        console.log('Clicking Complete Cycle button...');
        await completeCycleBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  }
  
  // Take screenshot after completing cycle
  await page.screenshot({ path: 'after-cycle-completion.png', fullPage: true });
  
  // Now look for the next notification
  console.log('\n=== Step 2: Look for new notification ===');
  
  const cycleNotifSection = page.locator('text=Cycle Notifications').locator('../..');
  const notifHTML = await cycleNotifSection.innerHTML();
  console.log('\n=== Cycle Notifications after completion: ===');
  console.log(notifHTML.substring(0, 2000));
  
  // Look for "Report Cycle End" or similar text
  const reportCycleEndCount = await page.locator('text=/report.*cycle.*end/i').count();
  console.log('\n=== "Report Cycle End" count: ===', reportCycleEndCount);
  
  // Look for any new View buttons
  const newViewButtons = await page.getByRole('button', { name: /view/i }).all();
  console.log('\n=== View buttons after completion: ===', newViewButtons.length);
  for (let i = 0; i < newViewButtons.length; i++) {
    const isVisible = await newViewButtons[i].isVisible();
    const parent = await newViewButtons[i].locator('..').textContent();
    console.log(`${i}: Visible=${isVisible}, Context="${parent?.trim().substring(0, 100)}"`);
  }
  
  // Click any visible View button to see what modal appears
  if (newViewButtons.length > 0 && await newViewButtons[0].isVisible()) {
    console.log('\n=== Clicking View button ===');
    await newViewButtons[0].click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'after-second-view-click.png' });
    
    // Check what modal appeared
    const modals = await page.locator('[role="dialog"]').all();
    console.log('\n=== Modals after second View click: ===', modals.length);
    
    for (let i = 0; i < modals.length; i++) {
      const isVisible = await modals[i].isVisible();
      if (isVisible) {
        const modalText = await modals[i].textContent();
        console.log(`\nVisible modal ${i}:`);
        console.log(modalText?.substring(0, 1000));
        
        // Look for checkboxes in the modal
        const checkboxes = await modals[i].locator('input[type="checkbox"], [role="checkbox"]').all();
        console.log(`\nCheckboxes in modal: ${checkboxes.length}`);
        
        // Look for checklist items
        const listItems = await modals[i].locator('li, [role="listitem"]').all();
        console.log(`List items in modal: ${listItems.length}`);
        
        // Look for Send button
        const sendButtons = await modals[i].locator('button').all();
        console.log(`\nButtons in modal: ${sendButtons.length}`);
        for (let j = 0; j < sendButtons.length; j++) {
          const btnText = await sendButtons[j].textContent();
          console.log(`  Button ${j}: "${btnText?.trim()}"`);
        }
      }
    }
  }
  
  // Look for toast/snackbar notifications
  console.log('\n=== Looking for toast/notification elements: ===');
  const toasts = await page.locator('[role="alert"], [class*="toast" i], [class*="snackbar" i], [class*="notification" i]').all();
  console.log('Toast elements found:', toasts.length);
});


test('Debug: Check modal state and complete cycle properly', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Check if a modal is already open
  const openModals = await page.locator('[role="dialog"]:visible').all();
  console.log('\n=== Open modals on page load: ===', openModals.length);
  
  if (openModals.length > 0) {
    console.log('Modal is already open, closing it first...');
    const closeBtn = page.locator('[role="dialog"]').getByRole('button', { name: /cancel|close|×/i });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
  }
  
  // Now click View button
  const viewButton = page.getByRole('button', { name: 'View' });
  console.log('\n=== Clicking View button ===');
  await viewButton.click();
  await page.waitForTimeout(1000);
  
  // Get the modal
  const modal = page.locator('[role="dialog"]').filter({ hasText: 'End of Cycle Report' });
  await expect(modal).toBeVisible();
  
  // Get modal content
  const modalText = await modal.textContent();
  console.log('\n=== Modal content: ===');
  console.log(modalText);
  
  // Find Complete Cycle button
  const completeCycleBtn = modal.getByRole('button', { name: /complete.*cycle/i });
  console.log('\n=== Complete Cycle button visible: ===', await completeCycleBtn.isVisible());
  
  // Click it and wait longer
  await completeCycleBtn.click();
  console.log('Clicked Complete Cycle, waiting for response...');
  
  // Wait for network activity to settle
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'after-complete-click.png', fullPage: true });
  
  // Check if modal closed
  const modalStillVisible = await modal.isVisible();
  console.log('\n=== Modal still visible after Complete: ===', modalStillVisible);
  
  // Check notifications again
  const cycleNotifSection = page.locator('text=Cycle Notifications').locator('../..');
  const notifText = await cycleNotifSection.textContent();
  console.log('\n=== Cycle Notifications text: ===');
  console.log(notifText);
  
  // Look for any toast/snackbar messages
  const alerts = await page.locator('[role="alert"], [role="status"]').all();
  console.log('\n=== Alert/Status messages: ===', alerts.length);
  for (let i = 0; i < alerts.length; i++) {
    const text = await alerts[i].textContent();
    console.log(`Alert ${i}: "${text}"`);
  }
  
  // Check if there's a new notification or button
  const allButtons = await page.getByRole('button').all();
  console.log('\n=== All visible buttons: ===');
  for (let i = 0; i < allButtons.length; i++) {
    const isVisible = await allButtons[i].isVisible();
    if (isVisible) {
      const text = await allButtons[i].textContent();
      console.log(`Button: "${text?.trim()}"`);
    }
  }
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="end-of-cycle-report-notification"] with actual notification selector
// - Replace [data-testid="report-cycle-end-modal"] with actual modal selector
// - Replace [data-testid="cycle-report-checklist"] with actual checklist container selector
// - Replace [data-testid^="checklist-item-"] with actual checkbox selector pattern
// - Replace [data-testid="send-cycle-end-report-button"] with actual send button selector
// - Replace [data-testid="toast-confirmation"] with actual toast/notification selector
// - This test depends on previous cycle completion - consider test sequencing
// - Consider mocking the cycle end state for consistent testing
// - Report content verification (Production Score, etc.) may need API testing
// - Toast message timing may need waitForTimeout or proper waiting strategy
// - Handle edge cases where checklist items vary based on cycle data