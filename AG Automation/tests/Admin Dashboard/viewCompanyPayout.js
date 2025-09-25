// TC-008.1: Company Pay Toggle
test.describe('TC-008: Company Pay Toggle', () => {
  test('TC-008.1: Verify Admin can view the company pay out', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    await page.goto('/admin/dashboard');
    
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Verify Company Pay card is displayed
    const companyPayCard = page.locator('[data-testid="company-pay-card"]');
    await expect(companyPayCard).toBeVisible();
    
    // TC-008.1: Click the Company Pay toggle
    const companyPayToggle = companyPayCard.locator('[data-testid="company-pay-toggle"]');
    await expect(companyPayToggle).toBeVisible();
    
    // Store initial state
    const initialState = await companyPayToggle.isChecked();
    
    await companyPayToggle.click();
    
    // Expected Result: Total Company Pay will display
    const totalCompanyPay = companyPayCard.locator('[data-testid="total-company-pay"]');
    await expect(totalCompanyPay).toBeVisible();
    
    // Verify the pay amount is displayed with proper formatting
    const payAmount = await totalCompanyPay.textContent();
    expect(payAmount).toMatch(/\$[\d,]+\.?\d*/); // Matches currency format like $1,234.56
    
    // Test toggle off (if it was initially off, or toggle back)
    await companyPayToggle.click();
    
    // Verify toggle state changed
    const finalState = await companyPayToggle.isChecked();
    expect(finalState).toBe(initialState);
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="company-pay-card"] with actual Company Pay card container selector
// - Replace [data-testid="company-pay-toggle"] with actual toggle control selector
// - Replace [data-testid="total-company-pay"] with actual pay amount display selector
// - Consider using page.getByRole('switch') for toggle if it's a switch element
// - Adjust currency regex based on your actual formatting (may include different currencies)
// - May need to handle cases where toggle shows/hides the pay amount vs just enables it
// - Consider testing both toggle states (on/off)
