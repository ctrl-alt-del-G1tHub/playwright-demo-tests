// TC-020.1, TC-020.2: Company Score Navigation and Editing
//companyScoreNavigationEditing.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
  test('TC-020.1, TC-020.2: Verify Admin can view Company score and edit Company Score', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // TC-020.1: Click on the edit (pen) icon in the Company Score card
    const companyScoreCard = page.locator('[data-testid="company-score-card"]');
    await expect(companyScoreCard).toBeVisible();
    
    // Verify company score and tally amounts are displayed
    await expect(companyScoreCard.locator('[data-testid="company-score-value"]')).toBeVisible();
    await expect(companyScoreCard.locator('[data-testid="company-policy-tallies"]')).toBeVisible();
    
    const editCompanyIcon = companyScoreCard.locator('[data-testid="edit-company-score-icon"]');
    await expect(editCompanyIcon).toBeVisible();
    await editCompanyIcon.click();
    
    // Expected Result: Admin will be directed to the Edit Company Score screen
    await expect(page).toHaveURL(/.*edit.*company.*score/);
    await expect(page.locator('[data-testid="edit-company-score-screen"]')).toBeVisible();
    await expect(page.locator('[data-testid="edit-company-score-title"]')).toContainText('Edit Company Score');
    
    // TC-020.2: Click on the back button (Chevron left) next to 'Edit Company Score'
    const backButton = page.locator('[data-testid="back-button"]');
    await expect(backButton).toBeVisible();
    
    // Verify it's a chevron left icon/button
    await expect(backButton).toHaveAttribute('aria-label', /back|return/i);
    await backButton.click();
    
    // Expected Result: Admin will be returned to the Technician Dashboard screen
    await expect(page).toHaveURL(/.*technician.*dashboard/);
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-score-card"]')).toBeVisible();
  });

//------------------- TEST NOTES -------------------
// - Replace [data-testid="company-score-card"] with actual Company Score card selector
// - Replace [data-testid="company-score-value"] with actual score display selector
// - Replace [data-testid="company-policy-tallies"] with actual tallies display selector
// - Replace [data-testid="edit-company-score-icon"] with actual edit icon selector
// - Replace [data-testid="edit-company-score-screen"] with actual screen/page selector
// - Replace [data-testid="edit-company-score-title"] with actual page title selector
// - Replace [data-testid="back-button"] with actual back button selector
// - Adjust URL patterns for your actual routing structure
// - Consider using page.getByRole('button', { name: 'Back' }) or page.getByLabel('Back')
// - May need to handle breadcrumb navigation or header back buttons