// TC-023.1: Pay Scale Toggle
const { test, expect } = require('../../fixtures/technicianDashboard.fixtures');
  test('TC-023.1: Verify Admin can toggle between Technician hour avg. and total pay scale', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify Technician Pay Scale section is visible with default (Hour Average) view
    const payScaleSection = page.locator('[data-testid="technician-pay-scale"]');
    await expect(payScaleSection).toBeVisible();
    
    // Verify default state shows Hour Average scale with Base Pay, Max Pay, Earned Pay, Unpaid
    await expect(payScaleSection.locator('[data-testid="base-pay"]')).toBeVisible();
    await expect(payScaleSection.locator('[data-testid="max-pay"]')).toBeVisible();
    await expect(payScaleSection.locator('[data-testid="earned-pay"]')).toBeVisible();
    await expect(payScaleSection.locator('[data-testid="unpaid"]')).toBeVisible();
    
    // Verify Hour Average is the default (active state)
    const hourAverageButton = payScaleSection.locator('[data-testid="hour-average-button"]');
    const totalButton = payScaleSection.locator('[data-testid="total-button"]');
    
    await expect(hourAverageButton).toHaveClass(/.*active.*|.*selected.*/);
    
    // Store initial values for comparison
    const initialBasePay = await payScaleSection.locator('[data-testid="base-pay-value"]').textContent();
    const initialMaxPay = await payScaleSection.locator('[data-testid="max-pay-value"]').textContent();
    const initialEarnedPay = await payScaleSection.locator('[data-testid="earned-pay-value"]').textContent();
    const initialUnpaid = await payScaleSection.locator('[data-testid="unpaid-value"]').textContent();
    
    // TC-023.1: Click on the 'Total' button (Chip group)
    await expect(totalButton).toBeVisible();
    await totalButton.click();
    
    // Expected Result: Total of a Technician's Base Pay, Max Pay, Earned Pay, and Unpaid will be displayed
    await expect(totalButton).toHaveClass(/.*active.*|.*selected.*/);
    await expect(hourAverageButton).not.toHaveClass(/.*active.*|.*selected.*/);
    
    // Wait for data to update
    await page.waitForTimeout(1000);
    
    // Verify values have changed (totals should be different from averages)
    const totalBasePay = await payScaleSection.locator('[data-testid="base-pay-value"]').textContent();
    const totalMaxPay = await payScaleSection.locator('[data-testid="max-pay-value"]').textContent();
    const totalEarnedPay = await payScaleSection.locator('[data-testid="earned-pay-value"]').textContent();
    const totalUnpaidPay = await payScaleSection.locator('[data-testid="unpaid-value"]').textContent();
    
    // Values should be different when viewing totals vs averages
    expect(totalBasePay).not.toBe(initialBasePay);
    expect(totalMaxPay).not.toBe(initialMaxPay);
    expect(totalEarnedPay).not.toBe(initialEarnedPay);
    expect(totalUnpaidPay).not.toBe(initialUnpaid);
    
    // Test toggling back to Hour Average
    await hourAverageButton.click();
    await expect(hourAverageButton).toHaveClass(/.*active.*|.*selected.*/);
    await expect(totalButton).not.toHaveClass(/.*active.*|.*selected.*/);
    
    // Verify values return to original hour average values
    await page.waitForTimeout(1000);
    const returnedBasePay = await payScaleSection.locator('[data-testid="base-pay-value"]').textContent();
    expect(returnedBasePay).toBe(initialBasePay);
  });

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-pay-scale"] with actual pay scale section selector
// - Replace [data-testid="base-pay"], [data-testid="max-pay"], [data-testid="earned-pay"], [data-testid="unpaid"] 
//   with actual pay component selectors
// - Replace [data-testid="hour-average-button"] and [data-testid="total-button"] with actual toggle button selectors
// - Replace [data-testid="base-pay-value"] etc. with actual value display selectors
// - Adjust class matching for active/selected state based on your actual CSS classes
// - Consider using page.getByRole('button', { name: 'Total' }) for semantic selectors
// - May need to handle currency formatting in value comparisons
// - Verify the toggle behavior matches your actual chip group/button group implementation
