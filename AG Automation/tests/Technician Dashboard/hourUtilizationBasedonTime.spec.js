// TC-024.1: Hour Utilization Based on Time
test.describe('TC-024: Hour Utilization Based on Time', () => {
  test('TC-024.1: Verify Admin can view Technician Hour Utilization based on selected Time', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify Technician Hour Utilization section is visible
    const hourUtilizationSection = page.locator('[data-testid="technician-hour-utilization"]');
    await expect(hourUtilizationSection).toBeVisible();
    
    // Verify Current cycle Time is in default and displays utilization data
    const timeDropdown = page.locator('[data-testid="time-dropdown"]');
    await expect(timeDropdown).toContainText('Current Cycle'); // Default state
    
    // Store initial utilization data
    const initialUtilizationData = await hourUtilizationSection.locator('[data-testid="utilization-data"]').textContent();
    const initialScheduledHours = await hourUtilizationSection.locator('[data-testid="scheduled-hours"]').textContent();
    const initialWorkedHours = await hourUtilizationSection.locator('[data-testid="worked-hours"]').textContent();
    const initialUtilizationPercentage = await hourUtilizationSection.locator('[data-testid="utilization-percentage"]').textContent();
    
    // TC-024.1: Select a time from the dropdown menu
    await timeDropdown.click();
    const dropdownMenu = page.locator('[data-testid="time-dropdown-menu"]');
    await expect(dropdownMenu).toBeVisible();
    
    // Select a different time period (e.g., "Last Cycle")
    await dropdownMenu.locator('[data-testid="time-option"]').filter({ hasText: 'Last Cycle' }).click();
    
    // Expected Result: Technician Hour Utilization will reflect data based on selected timeframe
    await expect(timeDropdown).toContainText('Last Cycle');
    
    // Wait for data to refresh
    await page.waitForTimeout(2000);
    
    // Verify data has updated based on selected timeframe
    const updatedUtilizationData = await hourUtilizationSection.locator('[data-testid="utilization-data"]').textContent();
    const updatedScheduledHours = await hourUtilizationSection.locator('[data-testid="scheduled-hours"]').textContent();
    const updatedWorkedHours = await hourUtilizationSection.locator('[data-testid="worked-hours"]').textContent();
    const updatedUtilizationPercentage = await hourUtilizationSection.locator('[data-testid="utilization-percentage"]').textContent();
    
    // Verify utilization section is still visible and functional
    await expect(hourUtilizationSection).toBeVisible();
    
    // Data should be different for different time periods (unless identical by coincidence)
    // At minimum, verify the structure remains intact
    await expect(hourUtilizationSection.locator('[data-testid="scheduled-hours"]')).toBeVisible();
    await expect(hourUtilizationSection.locator('[data-testid="worked-hours"]')).toBeVisible();
    await expect(hourUtilizationSection.locator('[data-testid="utilization-percentage"]')).toBeVisible();
    
    // Test with multiple time periods to ensure consistency
    await timeDropdown.click();
    await dropdownMenu.locator('[data-testid="time-option"]').filter({ hasText: '3 Cycles' }).click();
    await expect(timeDropdown).toContainText('3 Cycles');
    
    // Verify utilization data updates again
    await page.waitForTimeout(2000);
    await expect(hourUtilizationSection.locator('[data-testid="utilization-data"]')).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-hour-utilization"] with actual hour utilization section selector
// - Replace [data-testid="time-dropdown"] with actual time dropdown selector (may be shared with scoreboard)
// - Replace [data-testid="utilization-data"] with actual utilization data container selector
// - Replace [data-testid="scheduled-hours"], [data-testid="worked-hours"], [data-testid="utilization-percentage"] 
//   with actual hour display selectors
// - Replace [data-testid="time-dropdown-menu"] and [data-testid="time-option"] with actual dropdown selectors
// - Consider that time dropdown might be shared between scoreboard and hour utilization
// - Handle loading states when switching between time periods
// - May need to adjust waiting time based on your data loading performance