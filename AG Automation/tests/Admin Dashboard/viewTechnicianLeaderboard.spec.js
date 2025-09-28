// TC-011.1, TC-011.2: Leaderboard Display and Functionality
//technicianStatus.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');

test.describe('TC-011: Leaderboard Display and Functionality', () => {
  test('TC-011.1, TC-011.2: Verify Admin can view the technician leaderboard', async ({ page }) => {
    // Test Setup - Login
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    // TC-011.1: Log in or select Dashboard
    await page.goto('/admin/dashboard');
    
    // Expected Result: Admin Dashboard screen will open and display only Active Techs in the leaderboard
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    const leaderboard = page.locator('[data-testid="technician-leaderboard"]');
    await expect(leaderboard).toBeVisible();
    
    // Verify only Active Techs are displayed (default cycle)
    const technicianRows = leaderboard.locator('[data-testid^="technician-row-"]');
    await expect(technicianRows.first()).toBeVisible();
    
    // Verify all displayed technicians have "Active" status
    const rowCount = await technicianRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = technicianRows.nth(i);
      const status = await row.locator('[data-testid="technician-status"]').textContent();
      expect(status.toLowerCase()).toContain('active');
    }
    
    // Verify Top Technician has golden box and award icon for metrics (CS, FS, TS, PS, AS)
    const topTechRow = technicianRows.first();
    await expect(topTechRow).toHaveClass(/.*gold.*|.*top.*|.*highlighted.*/);
    
    const metrics = ['CS', 'FS', 'TS', 'PS', 'AS'];
    for (const metric of metrics) {
      const metricCell = topTechRow.locator(`[data-testid="metric-${metric}"]`);
      await expect(metricCell).toBeVisible();
      await expect(metricCell.locator('[data-testid="award-icon"]')).toBeVisible();
    }
    
    // TC-011.2: Select the cycle dropdown menu and expand it
    const cycleDropdown = page.locator('[data-testid="cycle-dropdown"]');
    await expect(cycleDropdown).toBeVisible();
    await cycleDropdown.click();
    
    // Verify dropdown expands with expected options
    const dropdownOptions = page.locator('[data-testid="cycle-dropdown-options"]');
    await expect(dropdownOptions).toBeVisible();
    
    const expectedCycles = ['Current Cycle', 'Last Cycle', '3 Cycles', '6 Cycles', 'YTD Cycles', '12 Cycles', 'All Cycles'];
    for (const cycle of expectedCycles) {
      await expect(dropdownOptions.locator(`[data-testid="cycle-option"]`).filter({ hasText: cycle })).toBeVisible();
    }
    
    // Select a different cycle (e.g., "Last Cycle")
    await dropdownOptions.locator(`[data-testid="cycle-option"]`).filter({ hasText: 'Last Cycle' }).click();
    
    // Expected Result: Admin Dashboard displays the Technician data from the selected cycle
    await expect(cycleDropdown).toContainText('Last Cycle');
    
    // Wait for data to refresh
    await page.waitForTimeout(1000);
    
    // Verify leaderboard data has updated (technician list may be different)
    await expect(leaderboard).toBeVisible();
    await expect(technicianRows.first()).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-leaderboard"] with actual leaderboard container selector
// - Replace [data-testid^="technician-row-"] with actual technician row selector pattern
// - Replace [data-testid="technician-status"] with actual status field selector
// - Replace metric selectors [data-testid="metric-CS"] etc. with actual metric column selectors
// - Replace [data-testid="award-icon"] with actual award/gold star icon selector
// - Replace [data-testid="cycle-dropdown"] with actual dropdown selector
// - Replace [data-testid="cycle-dropdown-options"] with actual dropdown menu selector
// - Replace [data-testid="cycle-option"] with actual option selector
// - Consider using page.getByRole('combobox') for dropdown and page.getByRole('option') for options
// - Adjust class matching regex for top technician highlighting
// - Handle cases where no technician data exists for selected cycle
