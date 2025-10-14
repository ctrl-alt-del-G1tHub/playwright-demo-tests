// TC-012.1: Technician Dashboard Access
//openTechnicianDashboard.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
 test('TC-012.1: Verify Admin can select a tech to open their technician dashboard', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  
  // Scroll to Leaderboard
  await page.getByText('Leaderboard').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Get the leaderboard table
  const leaderboardTable = page.locator('table.MuiTable-root');
  await expect(leaderboardTable).toBeVisible();
  
  // Get first technician row
  const firstTechRow = leaderboardTable.locator('tbody tr').first();
  await expect(firstTechRow).toBeVisible();
  
  // Get the technician name before clicking
  const technicianName = await firstTechRow.textContent();
  console.log('Clicking on technician:', technicianName);
  
  // Find the clickable link in the row (from debug: href="/dashboard/technicians/...")
  const technicianLink = firstTechRow.locator('a[href*="/dashboard/technicians/"]');
  await expect(technicianLink).toBeVisible();
  
  // Click the technician link
  await technicianLink.click();
  
  // Expected Result: Navigate to technician dashboard page
  await expect(page).toHaveURL(/.*\/dashboard\/technicians\/.*/, { timeout: 10000 });
  
  // Verify we're on a technician dashboard page
  // The page should load with technician-specific content
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of technician dashboard
  await page.screenshot({ path: 'technician-dashboard.png' });
  
  console.log('Successfully navigated to technician dashboard');
});

test('TC-012.2: Verify technician dashboard displays correctly', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  await page.getByText('Leaderboard').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  const leaderboardTable = page.locator('table.MuiTable-root');
  const firstTechRow = leaderboardTable.locator('tbody tr').first();
  
  // Get technician name
  const nameCell = await firstTechRow.locator('td').first().textContent();
  const techName = nameCell?.replace(/^\d+/, '').trim(); // Remove ranking number
  
  // Click technician
  const technicianLink = firstTechRow.locator('a[href*="/dashboard/technicians/"]');
  await technicianLink.click();
  
  // Wait for navigation
  await expect(page).toHaveURL(/.*\/dashboard\/technicians\/.*/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  
  // Verify technician-specific content appears
  // This will depend on what's on the technician dashboard
  // Common elements might include:
  
  // Check if technician name appears on the dashboard
  if (techName) {
    const nameCount = await page.locator(`text=${techName}`).count();
    console.log(`Technician name "${techName}" appears ${nameCount} times on dashboard`);
    expect(nameCount).toBeGreaterThan(0);
  }
  
  // You can also navigate back and verify
  await page.goBack();
  await expect(page).toHaveURL(/.*\/dashboard$/);
  await expect(leaderboardTable).toBeVisible();
});
//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-name"] with actual technician name selector
// - Replace [data-testid="open-leaderboard-button"] with actual button selector
// - Replace [data-testid="technician-dashboard-modal"] with actual modal selector (if modal implementation)
// - Replace [data-testid="technician-dashboard-page"] with actual page selector (if page navigation)
// - Replace [data-testid="technician-name-header"] with actual header selector containing technician name
// - Adjust class matching for expanded row state
// - Consider using page.getByRole('button', { name: 'Open Leaderboard' })
// - Handle both modal and page navigation implementations
// - May need different URL pattern matching based on your routing
