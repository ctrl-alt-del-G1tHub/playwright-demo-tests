// TC-013.1: Active Technicians Only
test.describe('TC-013: Active Technicians Only', () => {
  test('TC-013.1: Verify only Active Techs are in the leaderboard', async ({ page }) => {
    // Test Setup - This test requires pre-setup of archived/deleted technician
    // Navigate to Company Profile to archive a technician first
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/admin/company-profile');
    await expect(page.locator('[data-testid="company-profile-page"]')).toBeVisible();
    
    // Find a technician to archive (store their name for later verification)
    const technicianList = page.locator('[data-testid="technician-management-list"]');
    await expect(technicianList).toBeVisible();
    
    const technicianRows = technicianList.locator('[data-testid^="technician-row-"]');
    const firstTech = technicianRows.first();
    const technicianToArchive = await firstTech.locator('[data-testid="technician-name"]').textContent();
    
    // TC-013.1: Follow the archive or delete a technician workflow
    const archiveButton = firstTech.locator('[data-testid="archive-technician-button"]');
    await expect(archiveButton).toBeVisible();
    await archiveButton.click();
    
    // Confirm archive action (may involve confirmation dialog)
    const confirmArchive = page.locator('[data-testid="confirm-archive-button"]');
    if (await confirmArchive.isVisible()) {
      await confirmArchive.click();
    }
    
    // Wait for archive process to complete
    await page.waitForTimeout(2000);
    
    // Navigate back to dashboard to check leaderboard
    await page.goto('/admin/dashboard');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Expected Result: Technician will be removed from the leaderboard 
    // AND only Active Technicians will be displayed
    const leaderboard = page.locator('[data-testid="technician-leaderboard"]');
    await expect(leaderboard).toBeVisible();
    
    const leaderboardRows = leaderboard.locator('[data-testid^="technician-row-"]');
    const rowCount = await leaderboardRows.count();
    
    // Verify the archived technician is not in the leaderboard
    for (let i = 0; i < rowCount; i++) {
      const row = leaderboardRows.nth(i);
      const techName = await row.locator('[data-testid="technician-name"]').textContent();
      expect(techName).not.toBe(technicianToArchive);
    }
    
    // Verify all remaining technicians are Active
    for (let i = 0; i < rowCount; i++) {
      const row = leaderboardRows.nth(i);
      const status = await row.locator('[data-testid="technician-status"]').textContent();
      expect(status.toLowerCase()).toContain('active');
    }
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="company-profile-page"] with actual company profile page selector
// - Replace [data-testid="technician-management-list"] with actual technician list selector
// - Replace [data-testid="archive-technician-button"] with actual archive button selector
// - Replace [data-testid="confirm-archive-button"] with actual confirmation button selector
// - This test requires proper test data setup and teardown
// - Consider creating a dedicated test technician for archiving
// - May need to handle different archive/delete workflows (modal, inline, etc.)
// - Consider using page.getByRole('button', { name: 'Archive' }) for semantic selectors
// - Add cleanup to restore archived technician after test if needed