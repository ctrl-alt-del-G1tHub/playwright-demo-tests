// TC-009.1, TC-009.2, TC-009.3: Cycle Test Statistics and Modal
test.describe('TC-009: Cycle Test Statistics and Modal', () => {
  test('TC-009.1, TC-009.2, TC-009.3: Verify Admin can view cycle tests and modal', async ({ page }) => {
    // Test Setup
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    await page.goto('/admin/dashboard');
    
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Verify Cycle Test container displays the statistics
    const cycleTestContainer = page.locator('[data-testid="cycle-test-container"]');
    await expect(cycleTestContainer).toBeVisible();
    
    // Verify it shows completed/total tests and percentage
    await expect(cycleTestContainer.locator('[data-testid="completed-tests"]')).toBeVisible();
    await expect(cycleTestContainer.locator('[data-testid="total-tests"]')).toBeVisible();
    await expect(cycleTestContainer.locator('[data-testid="completion-percentage"]')).toBeVisible();
    
    // TC-009.1: Click the container
    await cycleTestContainer.click();
    
    // Expected Result: Admin will be redirected to the Tech Tests modal
    const techTestsModal = page.locator('[data-testid="tech-tests-modal"]');
    await expect(techTestsModal).toBeVisible();
    await expect(techTestsModal.locator('[data-testid="modal-title"]')).toContainText('Tech Tests');
    
    // TC-009.2: Verify Tech Tests modal displays correctly
    const technicianList = techTestsModal.locator('[data-testid="technician-list"]');
    await expect(technicianList).toBeVisible();
    
    // Verify Technicians with Incomplete tests at the top and Completed tests after
    const incompleteTechs = technicianList.locator('[data-testid="incomplete-technicians"]');
    const completedTechs = technicianList.locator('[data-testid="completed-technicians"]');
    
    await expect(incompleteTechs).toBeVisible();
    await expect(completedTechs).toBeVisible();
    
    // Verify ordering: incomplete section should appear before completed section
    const incompletePosition = await incompleteTechs.boundingBox();
    const completedPosition = await completedTechs.boundingBox();
    
    if (incompletePosition && completedPosition) {
      expect(incompletePosition.y).toBeLessThan(completedPosition.y);
    }
    
    // TC-009.3: Click the X
    const closeButton = techTestsModal.locator('[data-testid="modal-close-button"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // Expected Result: Modal will close and the Admin will continue on the Admin Dashboard
    await expect(techTestsModal).not.toBeVisible();
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="cycle-test-container"] with actual Cycle Test container selector
// - Replace [data-testid="completed-tests"], [data-testid="total-tests"], [data-testid="completion-percentage"]
//   with actual statistics display selectors
// - Replace [data-testid="tech-tests-modal"] with actual modal selector
// - Replace [data-testid="technician-list"] with actual list container selector
// - Replace [data-testid="incomplete-technicians"], [data-testid="completed-technicians"] 
//   with actual section selectors for different test statuses
// - Consider using page.getByRole('dialog') for modal detection
// - May need to adjust positioning logic based on actual layout (horizontal vs vertical)
// - Handle cases where no test data exists