// TC-025.1, TC-025.2: Edit Technician Profile
test.describe('TC-025: Edit Technician Profile', () => {
  test('TC-025.1, TC-025.2: Verify Admin can select to edit Technician Profile', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/technician/dashboard/tech-001');
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // TC-025.1: Click on the 'Edit Tech' Button
    const editTechButton = page.locator('[data-testid="edit-tech-button"]');
    await expect(editTechButton).toBeVisible();
    await expect(editTechButton).toContainText('Edit Tech');
    await editTechButton.click();
    
    // Expected Result: Admin will be directed to the Technician Profile screen for that Technician
    await expect(page).toHaveURL(/.*technician.*profile/);
    await expect(page.locator('[data-testid="technician-profile-screen"]')).toBeVisible();
    await expect(page.locator('[data-testid="technician-profile-title"]')).toContainText('Technician Profile');
    
    // Verify profile form fields are available for editing
    const profileForm = page.locator('[data-testid="technician-profile-form"]');
    await expect(profileForm).toBeVisible();
    
    // Common profile fields that might be editable
    const nameField = profileForm.locator('[data-testid="technician-name-field"]');
    const emailField = profileForm.locator('[data-testid="technician-email-field"]');
    const phoneField = profileForm.locator('[data-testid="technician-phone-field"]');
    const roleField = profileForm.locator('[data-testid="technician-role-field"]');
    
    // Verify at least some profile fields are present and editable
    const editableFields = await Promise.all([
      nameField.isVisible(),
      emailField.isVisible(),
      phoneField.isVisible(),
      roleField.isVisible()
    ]);
    
    const hasEditableFields = editableFields.some(field => field);
    expect(hasEditableFields).toBe(true);
    
    // Store original values for comparison
    const originalName = await nameField.inputValue().catch(() => '');
    const originalEmail = await emailField.inputValue().catch(() => '');
    
    // TC-025.2: Edit desired data AND click 'Save All' button
    
    // Edit some profile data (adjust based on what fields are actually editable)
    if (await nameField.isVisible()) {
      await nameField.clear();
      await nameField.fill('Updated Tech Name');
    }
    
    if (await emailField.isVisible()) {
      await emailField.clear();
      await emailField.fill('updated.tech@company.com');
    }
    
    if (await phoneField.isVisible()) {
      await phoneField.clear();
      await phoneField.fill('555-0123');
    }
    
    // Click 'Save All' button
    const saveAllButton = page.locator('[data-testid="save-all-button"]');
    await expect(saveAllButton).toBeVisible();
    await expect(saveAllButton).toContainText('Save All');
    await saveAllButton.click();
    
    // Expected Result: Admin will be returned to the Technician Dashboard screen 
    // AND the Technician Profile will be updated
    await expect(page).toHaveURL(/.*technician.*dashboard/);
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify profile updates are reflected on the dashboard
    const dashboardName = await page.locator('[data-testid="technician-dashboard-name"]').textContent();
    if (originalName !== '' && await nameField.isVisible()) {
      expect(dashboardName).toContain('Updated Tech Name');
    }
    
    // Verify success indication (toast message or similar)
    const successMessage = page.locator('[data-testid="toast-confirmation"]');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toContainText(/updated|success|saved/i);
    }
    
    // Verify technician profile data persistence by navigating back to profile
    await page.locator('[data-testid="edit-tech-button"]').click();
    await expect(page.locator('[data-testid="technician-profile-screen"]')).toBeVisible();
    
    // Verify saved changes are still there
    if (await nameField.isVisible()) {
      await expect(nameField).toHaveValue('Updated Tech Name');
    }
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="edit-tech-button"] with actual Edit Tech button selector
// - Replace [data-testid="technician-profile-screen"] with actual profile screen selector
// - Replace [data-testid="technician-profile-title"] with actual profile title selector
// - Replace [data-testid="technician-profile-form"] with actual profile form selector
// - Replace profile field selectors ([data-testid="technician-name-field"] etc.) with actual field selectors
// - Replace [data-testid="save-all-button"] with actual Save All button selector
// - Replace [data-testid="technician-dashboard-name"] with actual dashboard name display selector
// - Adjust URL patterns for your actual routing structure
// - Consider using page.getByRole('button', { name: 'Edit Tech' }) for semantic selectors
// - Handle form validation and required fields based on your actual profile form
// - Add error handling for fields that might not be editable
// - Consider adding tests for cancel functionality if available on profile screen