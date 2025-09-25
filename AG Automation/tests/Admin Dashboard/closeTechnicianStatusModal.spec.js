test('Verify closing the Technician Status modal', async ({ page }) => {
  // --- Precondition: Modal is already open ---
  await page.goto('https://your-app-url.com/admin/dashboard');
  await page.locator('[data-testid="technician-status-container"]').click();

  const modal = page.locator('[data-testid="technician-status-modal"]');
  await expect(modal).toBeVisible();

  // --- Step 1: Click the "X" close button ---
  await modal.locator('[data-testid="modal-close-button"]').click();

  // --- Expected Result ---
  await expect(modal).toBeHidden(); // modal is closed
  await expect(page).toHaveURL(/.*admin\/dashboard/); // still on Admin Dashboard
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="..."] with your actual selectors (getByRole, getByText, etc.) 
//   if you don’t have test IDs yet.