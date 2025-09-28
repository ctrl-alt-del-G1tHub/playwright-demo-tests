// TC-016.1, TC-016.2: Technician Dashboard Access from Leaderboard
const { test, expect } = require('@playwright/test');

test.describe('TC-016: Technician Dashboard Access from Leaderboard', () => {
  test('TC-016.1, TC-016.2: Verify Admin can access Technician Dashboard from leaderboard', async ({ page }) => {
    // Test Setup - Login as Admin
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin@company.com');
    await page.fill('[data-testid="password"]', 'admin_password');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to Admin Dashboard
    await page.goto('/admin/dashboard');
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    
    // Verify technician leaderboard is visible with tech names and pictures
    const leaderboard = page.locator('[data-testid="technician-leaderboard"]');
    await expect(leaderboard).toBeVisible();
    
    const technicianRows = leaderboard.locator('[data-testid^="technician-row-"]');
    await expect(technicianRows.first()).toBeVisible();
    
    // Verify first technician has name and picture displayed
    const firstTechRow = technicianRows.first();
    await expect(firstTechRow.locator('[data-testid="technician-name"]')).toBeVisible();
    await expect(firstTechRow.locator('[data-testid="technician-picture"]')).toBeVisible();
    
    // Store technician name for later verification
    const technicianName = await firstTechRow.locator('[data-testid="technician-name"]').textContent();
    
    // TC-016.1: Click on the desired technician row
    await firstTechRow.click();
    
    // Expected Result: Row expands
    await expect(firstTechRow).toHaveClass(/.*expanded.*|.*open.*/);
    
    // TC-016.2: Click on the 'Open Dashboard' hyperlink
    const openDashboardLink = firstTechRow.locator('[data-testid="open-dashboard-link"]');
    await expect(openDashboardLink).toBeVisible();
    await expect(openDashboardLink).toContainText('Open Dashboard');
    await openDashboardLink.click();
    
    // Expected Result: Admin will be directed to the Technician Dashboard screen
    await expect(page).toHaveURL(/.*technician.*dashboard/);
    await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    // Verify technician name and picture are displayed on the dashboard
    await expect(page.locator('[data-testid="technician-dashboard-name"]')).toContainText(technicianName);
    await expect(page.locator('[data-testid="technician-dashboard-picture"]')).toBeVisible();
  });
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-leaderboard"] with actual leaderboard selector
// - Replace [data-testid^="technician-row-"] with actual technician row selector pattern
// - Replace [data-testid="technician-name"] and [data-testid="technician-picture"] with actual selectors
// - Replace [data-testid="open-dashboard-link"] with actual Open Dashboard link selector
// - Replace [data-testid="technician-dashboard"] with actual dashboard page selector
// - Replace [data-testid="technician-dashboard-name"] and [data-testid="technician-dashboard-picture"] 
//   with actual dashboard header selectors
// - Adjust URL pattern matching for technician dashboard routing
// - Consider using page.getByRole('link', { name: 'Open Dashboard' }) for semantic selector