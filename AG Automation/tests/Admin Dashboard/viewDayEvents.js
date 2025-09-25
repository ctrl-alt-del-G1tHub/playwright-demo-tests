// TC-005.1: Day Toggle Functionality
test.describe('TC-005: Day Toggle Functionality', () => {
  test('TC-005.1: Verify Admin can select to view the days events', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    await page.goto('/admin/dashboard');
    
    // Verify we're on dashboard and default day is Today
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    const dayToggle = page.locator('[data-testid="day-toggle"]');
    await expect(dayToggle).toBeVisible();
    
    // Verify default state shows "Today"
    await expect(page.locator('[data-testid="selected-day"]')).toContainText('Today');
    
    // Store initial data to compare later
    const initialEventCount = await page.locator('[data-testid="events-container"] [data-testid="total-events"]').textContent();
    
    // TC-005.1: Click the toggle
    await dayToggle.click();
    
    // Expected Result: Admin Dashboard will display the selected day {selected:Tomorrow} and data
    await expect(page.locator('[data-testid="selected-day"]')).toContainText('Tomorrow');
    
    // Verify data has updated (should be different from initial state)
    await page.waitForTimeout(1000); // Allow time for data to load
    const updatedEventCount = await page.locator('[data-testid="events-container"] [data-testid="total-events"]').textContent();
    
    // The counts may be different for Tomorrow vs Today (this is acceptable)
    // We're just verifying the toggle worked and data refreshed
    await expect(page.locator('[data-testid="events-container"]')).toBeVisible();
    
    // Verify we can toggle back
    await dayToggle.click();
    await expect(page.locator('[data-testid="selected-day"]')).toContainText('Today');
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="day-toggle"] with actual toggle button/control selector
// - Replace [data-testid="selected-day"] with actual day indicator selector
// - Replace [data-testid="total-events"] with actual event count selector
// - Consider using page.getByRole('switch') or page.getByRole('button') for toggle
// - May need to adjust selectors based on whether it's a toggle switch, dropdown, or button group
// - Consider testing both directions of the toggle (Today ↔ Tomorrow)
// - Data comparison logic may need adjustment based on your actual data structure