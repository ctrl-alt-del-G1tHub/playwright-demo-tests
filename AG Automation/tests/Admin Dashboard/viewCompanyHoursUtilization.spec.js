// TC-010.1: Company Hours Utilization
//viewCompanyHoursUtilization.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
  test('TC-010.1: Verify Admin can view company hours utilization', async ({ page }) => {
    // Test Setup - Login
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    // TC-010.1: Log in or select Dashboard
    await page.goto('/admin/dashboard');
    
    // Expected Result: Admin Dashboard screen will open and display the Company Hours Utilization card
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    const hoursUtilizationCard = page.locator('[data-testid="company-hours-utilization-card"]');
    await expect(hoursUtilizationCard).toBeVisible();
    
    // Verify it shows scheduled hours, completed hours, and percentage ring
    await expect(hoursUtilizationCard.locator('[data-testid="scheduled-hours"]')).toBeVisible();
    await expect(hoursUtilizationCard.locator('[data-testid="completed-hours"]')).toBeVisible();
    await expect(hoursUtilizationCard.locator('[data-testid="hours-percentage-ring"]')).toBeVisible();
    
    // Verify the percentage calculation (Hours Worked/Hours Scheduled)
    const scheduledHoursText = await hoursUtilizationCard.locator('[data-testid="scheduled-hours"]').textContent();
    const completedHoursText = await hoursUtilizationCard.locator('[data-testid="completed-hours"]').textContent();
    const percentageText = await hoursUtilizationCard.locator('[data-testid="hours-percentage"]').textContent();
    
    // Extract numeric values for validation
    const scheduledHours = parseFloat(scheduledHoursText.match(/[\d.]+/)?.[0] || '0');
    const completedHours = parseFloat(completedHoursText.match(/[\d.]+/)?.[0] || '0');
    const percentage = parseFloat(percentageText.match(/[\d.]+/)?.[0] || '0');
    
    // Validate percentage calculation (with tolerance for rounding)
    if (scheduledHours > 0) {
      const expectedPercentage = (completedHours / scheduledHours) * 100;
      expect(Math.abs(percentage - expectedPercentage)).toBeLessThan(1); // 1% tolerance
    }
    
    // Verify hours are non-negative
    expect(scheduledHours).toBeGreaterThanOrEqual(0);
    expect(completedHours).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

//------------------- TEST NOTES -------------------
// - Replace [data-testid="company-hours-utilization-card"] with actual hours card selector
// - Replace [data-testid="scheduled-hours"], [data-testid="completed-hours"] with actual hours display selectors
// - Replace [data-testid="hours-percentage-ring"] with actual percentage ring/chart selector
// - Replace [data-testid="hours-percentage"] with actual percentage text selector
// - Adjust regex patterns based on your actual hours format (may include "hrs", "hours", etc.)
// - Consider edge cases like division by zero when scheduled hours = 0
// - May need to handle different time formats (decimal hours vs HH:MM)
// - Verify the percentage ring visual matches the calculated percentage