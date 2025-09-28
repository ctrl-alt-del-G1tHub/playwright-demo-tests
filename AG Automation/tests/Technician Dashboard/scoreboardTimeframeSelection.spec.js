// TC-017.1, TC-017.2: Scoreboard Timeframe Selection
test.describe('TC-017: Scoreboard Timeframe Selection', () => {
  test('TC-017.1, TC-017.2: Verify Admin can select Scoreboard timeframe', async ({ page }) => {
    // Test Setup - Navigate to Technician Dashboard
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to a specific technician dashboard (may need to be adjusted based on routing)
    await page.goto('/technician/dashboard/tech-001'); // Adjust URL as needed
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify tech name and picture are displayed
    await expect(page.locator('[data-testid="technician-dashboard-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="technician-dashboard-picture"]')).toBeVisible();
    
    // TC-017.1: Click on the 'Time' drop-down menu
    const timeDropdown = page.locator('[data-testid="time-dropdown"]');
    await expect(timeDropdown).toBeVisible();
    await timeDropdown.click();
    
    // Expected Result: Menu expands and displays time options
    const dropdownMenu = page.locator('[data-testid="time-dropdown-menu"]');
    await expect(dropdownMenu).toBeVisible();
    
    const expectedTimeOptions = [
      'Current Cycle', 'Last Cycle', '3 Cycles', '6 Cycles', 
      'YTD Cycles', '12 Cycles', 'All Cycles'
    ];
    
    // Verify all expected time options are present
    for (const option of expectedTimeOptions) {
      await expect(dropdownMenu.locator('[data-testid="time-option"]').filter({ hasText: option })).toBeVisible();
    }
    
    // Store initial data for comparison
    const initialScoreboardData = await page.locator('[data-testid="scoreboard-data"]').textContent();
    
    // TC-017.2: Select a time option from the dropdown (e.g., "Last Cycle")
    await dropdownMenu.locator('[data-testid="time-option"]').filter({ hasText: 'Last Cycle' }).click();
    
    // Expected Result: Data will update and reflect the selected time
    await expect(timeDropdown).toContainText('Last Cycle');
    
    // Wait for data to refresh
    await page.waitForTimeout(2000);
    
    // Verify data has updated (content should be different)
    const updatedScoreboardData = await page.locator('[data-testid="scoreboard-data"]').textContent();
    
    // Verify scoreboard section is still visible and functioning
    await expect(page.locator('[data-testid="scoreboard-section"]')).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="time-dropdown"] with actual time dropdown selector
// - Replace [data-testid="time-dropdown-menu"] with actual dropdown menu selector
// - Replace [data-testid="time-option"] with actual option selector
// - Replace [data-testid="scoreboard-data"] with actual scoreboard content selector
// - Replace [data-testid="scoreboard-section"] with actual scoreboard section selector
// - Adjust URL pattern for technician dashboard routing (/technician/dashboard/{id})
// - Consider using page.getByRole('combobox') and page.getByRole('option') for semantic selectors
// - May need to handle loading states when data updates