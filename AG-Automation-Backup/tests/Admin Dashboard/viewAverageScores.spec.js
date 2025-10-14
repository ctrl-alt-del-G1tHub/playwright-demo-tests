// TC-007.1: Team Scores Display
// viewAverageScores.spec.js
const { test, expect } = require('@playwright/test');

test('TC-007.1: Verify Admin can view the average scores', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Wait for dashboard to load
  await page.waitForTimeout(2000);
  
  // Verify "This Cycle's Team Average Scores" section is visible
  const teamScoresSection = page.getByText("This Cycle's Team Average Scores");
  await expect(teamScoresSection).toBeVisible();
  
  // Verify all score types are displayed in Team Average Scores
  await expect(page.getByText('Production Score').first()).toBeVisible();
  await expect(page.getByText('Company Score').first()).toBeVisible();
  await expect(page.getByText('Field Score').first()).toBeVisible();
  await expect(page.getByText('Test Score').first()).toBeVisible();
  await expect(page.getByText('Artisan Score').first()).toBeVisible();
  
  // Verify "Top Technician Scores" section is visible
  const topTechSection = page.getByText('Top Technician Scores');
  await expect(topTechSection).toBeVisible();
  
  // Verify technician entries are displayed (Cooper Emery in the screenshot)
  await expect(page.getByText('Cooper Emery').first()).toBeVisible();
  await expect(page.getByText('Field Tech').first()).toBeVisible();
  
  // Verify score values are displayed in Top Technician section
  const topTechContainer = page.locator('text=Top Technician Scores').locator('..');
  await expect(topTechContainer.getByText('Production Score')).toBeVisible();
  await expect(topTechContainer.getByText('Company Score')).toBeVisible();
  await expect(topTechContainer.getByText('Field Score')).toBeVisible();
  await expect(topTechContainer.getByText('Test Score')).toBeVisible();
  await expect(topTechContainer.getByText('Artisan Score')).toBeVisible();
  
  // Verify score numbers are displayed (checking for numeric values)
  await expect(topTechContainer.locator('text=/^\\d+$/')).toHaveCount(5, { timeout: 5000 });
});
// Additional verification for gold star/ranking indicator
test('TC-007.2: Verify top technician has ranking indicator', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  
  // Look for trophy/star icon (you'll need to inspect to find the actual selector)
  // Option 1: SVG icon
  const rankingIcon = page.locator('svg[class*="trophy"], svg[class*="star"], svg[class*="medal"]').first();
  await expect(rankingIcon).toBeVisible();
  
  // Option 2: Or look for numbered ranking badges (🏆 0, 🏆 33, etc. from screenshot)
  const rankingBadges = page.locator('text=/🏆/');
  await expect(rankingBadges.first()).toBeVisible();
});