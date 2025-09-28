// TC-022.1: Field Score Navigation
//fieldScoreNavigation.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
  test('TC-022.1: Verify Admin can view Field Score and edit via Edit Field Score screen', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify Field Score card displays score and peer review metrics
    const fieldScoreCard = page.locator('[data-testid="field-score-card"]');
    await expect(fieldScoreCard).toBeVisible();
    await expect(fieldScoreCard.locator('[data-testid="field-score-value"]')).toBeVisible();
    await expect(fieldScoreCard.locator('[data-testid="peer-review-metrics"]')).toBeVisible();
    
    // TC-022.1: Click on the edit (pen) icon in the Field Score card
    const editFieldScoreIcon = fieldScoreCard.locator('[data-testid="edit-field-score-icon"]');
    await expect(editFieldScoreIcon).toBeVisible();
    await editFieldScoreIcon.click();
    
    // Expected Result: Admin will be directed to the Edit Field Score screen and Field Metrics workflow
    await expect(page).toHaveURL(/.*edit.*field.*score/);
    await expect(page.locator('[data-testid="edit-field-score-screen"]')).toBeVisible();
    await expect(page.locator('[data-testid="edit-field-score-title"]')).toContainText('Edit Field Score');
    
    // Verify Field Metrics workflow is accessible/visible
    await expect(page.locator('[data-testid="field-metrics-workflow"]')).toBeVisible();
    
    // Verify peer review metrics and crew review management options are available
    await expect(page.locator('[data-testid="peer-review-metrics-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="crew-review-management"]')).toBeVisible();
    
    // Verify delete crew review functionality is available (as mentioned in requirements)
    const crewReviewItems = page.locator('[data-testid^="crew-review-item-"]');
    if (await crewReviewItems.count() > 0) {
      const deleteButton = crewReviewItems.first().locator('[data-testid="delete-crew-review"]');
      await expect(deleteButton).toBeVisible();
    }
  });

//------------------- TEST NOTES -------------------
// - Replace [data-testid="field-score-card"] with actual Field Score card selector
// - Replace [data-testid="field-score-value"] with actual score display selector
// - Replace [data-testid="peer-review-metrics"] with actual metrics display selector
// - Replace [data-testid="edit-field-score-icon"] with actual edit icon selector
// - Replace [data-testid="edit-field-score-screen"] with actual screen selector
// - Replace [data-testid="field-metrics-workflow"] with actual workflow container selector
// - Replace [data-testid="peer-review-metrics-section"] with actual metrics section selector
// - Replace [data-testid="crew-review-management"] with actual crew review section selector
// - Replace [data-testid^="crew-review-item-"] with actual crew review item selector pattern
// - Replace [data-testid="delete-crew-review"] with actual delete button selector
// - Adjust URL pattern for your Edit Field Score routing
// - Consider adding tests for actual crew review deletion workflow
