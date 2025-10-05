//technicianStatus.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');

// TC-003.1, TC-003.2: Technician Status Modal Content
test.describe('TC-003: Technician Status Modal Content', () => {
  test('TC-003.1, TC-003.2: Verify Technician Status modal displays correctly', async ({ page }) => {
    // Test Setup - Open the modal first
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'jason@artisangenius.com');
    await page.fill('[data-testid="password"]', '13243546');
    await page.click('[data-testid="login-button"]');
    await page.goto('/admin/dashboard');
    
    // Open the modal
    await page.locator('[data-testid="technician-status-container"]').click();
    const modal = page.locator('[data-testid="technician-status-modal"]');
    await expect(modal).toBeVisible();
    
    // TC-003.1: Confirm that the modal displays all Technicians scheduled to work Today
    const technicianList = modal.locator('[data-testid="technician-list"]');
    await expect(technicianList).toBeVisible();
    
    // Verify at least one technician is displayed (assuming there's test data)
    const technicianRows = technicianList.locator('[data-testid^="technician-row-"]');
    await expect(technicianRows.first()).toBeVisible();
    
    // TC-003.2: Verify for each Technician the following is displayed: Scheduled Hours, Actual
    const firstTechRow = technicianRows.first();
    await expect(firstTechRow.locator('[data-testid="scheduled-hours"]')).toBeVisible();
    await expect(firstTechRow.locator('[data-testid="actual-hours"]')).toBeVisible();
    await expect(firstTechRow.locator('[data-testid="technician-name"]')).toBeVisible();
    
    // Verify the hours are in proper format (numbers or time format)
    const scheduledHours = await firstTechRow.locator('[data-testid="scheduled-hours"]').textContent();
    const actualHours = await firstTechRow.locator('[data-testid="actual-hours"]').textContent();
    
    // Basic validation that these contain numeric values or time patterns
    expect(scheduledHours).toMatch(/\d+/);
    expect(actualHours).toMatch(/\d+/);
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-list"] with actual list container selector
// - Replace [data-testid^="technician-row-"] with actual technician row selector pattern
// - Replace [data-testid="scheduled-hours"], [data-testid="actual-hours"], [data-testid="technician-name"]
//   with actual field selectors within each row
// - Consider using page.getByRole('listitem') or similar semantic selectors
// - Adjust time/hours validation regex based on your actual data format
// - May need to handle empty state if no technicians are scheduled