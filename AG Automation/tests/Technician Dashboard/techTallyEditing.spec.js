// TC-021.1, TC-021.2, TC-021.3: Tech Tally Editing
const { test, expect } = require('../../fixtures/technicianDashboard.fixtures');

test.describe('TC-021: Tech Tally Editing', () => {
  test('TC-021.1, TC-021.2, TC-021.3: Verify Admin can edit Tech Tally in Company Score', async ({ page }) => {
    // Test Setup - Navigate to Edit Company Score screen
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Navigate to Edit Company Score screen
    await page.locator('[data-testid="company-score-card"] [data-testid="edit-company-score-icon"]').click();
    await expect(page.locator('[data-testid="edit-company-score-screen"]')).toBeVisible();
    
    // TC-021.1: Click the edit (pen) icon next to the desired Tech Tally
    const techTalliesList = page.locator('[data-testid="tech-tallies-list"]');
    await expect(techTalliesList).toBeVisible();
    
    const techTallyRows = techTalliesList.locator('[data-testid^="tech-tally-row-"]');
    await expect(techTallyRows.first()).toBeVisible();
    
    const firstTallyEditIcon = techTallyRows.first().locator('[data-testid="edit-tech-tally-icon"]');
    await expect(firstTallyEditIcon).toBeVisible();
    await firstTallyEditIcon.click();
    
    // Expected Result: Pre-filled Tech Tally modal will open
    const techTallyModal = page.locator('[data-testid="tech-tally-modal"]');
    await expect(techTallyModal).toBeVisible();
    await expect(techTallyModal.locator('[data-testid="modal-title"]')).toContainText('Tech Tally');
    
    // Verify modal is pre-filled with existing data
    const companyScoreField = techTallyModal.locator('[data-testid="company-score-field"]');
    const existingScore = await companyScoreField.inputValue();
    expect(existingScore).not.toBe(''); // Should have existing value
    
    // TC-021.2: Fill out the form and save
    
    // Click and enter desired data in 'Company Score' field
    await companyScoreField.clear();
    await companyScoreField.fill('85');
    
    // Select 'Company Policy Metric' using dropdown
    const policyMetricDropdown = techTallyModal.locator('[data-testid="company-policy-metric-dropdown"]');
    await expect(policyMetricDropdown).toBeVisible();
    await policyMetricDropdown.click();
    await page.locator('[data-testid="policy-metric-option"]').first().click();
    
    // Select 'Technician' using dropdown
    const technicianDropdown = techTallyModal.locator('[data-testid="technician-dropdown"]');
    await expect(technicianDropdown).toBeVisible();
    await technicianDropdown.click();
    await page.locator('[data-testid="technician-option"]').first().click();
    
    // Select 'Tally Date' using calendar selector
    const tallyDateField = techTallyModal.locator('[data-testid="tally-date-field"]');
    await expect(tallyDateField).toBeVisible();
    await tallyDateField.click();
    
    // Handle calendar picker (adjust based on your calendar implementation)
    const calendarPicker = page.locator('[data-testid="calendar-picker"]');
    if (await calendarPicker.isVisible()) {
      // Select today's date or a specific date
      await page.locator('[data-testid="calendar-today"]').click();
    } else {
      // If it's a simple date input
      await tallyDateField.fill('2025-09-15');
    }
    
    // Click and enter 'Notes'
    const notesField = techTallyModal.locator('[data-testid="notes-field"]');
    await expect(notesField).toBeVisible();
    await notesField.fill('Updated company score for policy compliance improvement');
    
    // Click 'Save' button
    const saveButton = techTallyModal.locator('[data-testid="save-button"]');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Expected Result: Tech Tally updated, returned to Edit Company Score screen, toast displays
    await expect(techTallyModal).not.toBeVisible();
    await expect(page.locator('[data-testid="edit-company-score-screen"]')).toBeVisible();
    
    // Check for confirmation toast
    const toastMessage = page.locator('[data-testid="toast-confirmation"]');
    await expect(toastMessage).toBeVisible();
    await expect(toastMessage).toContainText(/updated|success|saved/i);
    
    // Verify we're back on Edit Company Score screen
    await expect(page.locator('[data-testid="edit-company-score-title"]')).toContainText('Edit Company Score');
    
    // TC-021.3: Test Cancel functionality (reopen modal to test)
    await firstTallyEditIcon.click();
    await expect(techTallyModal).toBeVisible();
    
    const cancelButton = techTallyModal.locator('[data-testid="cancel-button"]');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    
    // Expected Result: Modal closes and Admin remains on Technician Dashboard screen
    // Note: Based on the requirement, cancel should return to Technician Dashboard, not Edit Company Score screen
    await expect(techTallyModal).not.toBeVisible();
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="tech-tallies-list"] with actual tallies list container selector
// - Replace [data-testid^="tech-tally-row-"] with actual tally row selector pattern
// - Replace [data-testid="edit-tech-tally-icon"] with actual edit icon selector
// - Replace [data-testid="tech-tally-modal"] with actual modal selector
// - Replace [data-testid="company-score-field"] with actual score input selector
// - Replace [data-testid="company-policy-metric-dropdown"] with actual policy dropdown selector
// - Replace [data-testid="policy-metric-option"] with actual policy option selector
// - Replace [data-testid="technician-dropdown"] with actual technician dropdown selector
// - Replace [data-testid="technician-option"] with actual technician option selector
// - Replace [data-testid="tally-date-field"] with actual date field selector
// - Replace [data-testid="calendar-picker"] with actual calendar component selector
// - Replace [data-testid="notes-field"] with actual notes input selector
// - Adjust calendar interaction based on your actual date picker implementation
// - Handle dropdown selections based on your actual dropdown components