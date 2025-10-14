// TC-008.1: Company Pay Toggle
//viewCompanyPayout.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
 
test('TC-008.1: Verify Admin can view the company pay out', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  
  // Scroll to Company Pay section
  await page.getByText('Company Pay').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Verify Company Pay section is visible
  await expect(page.getByText('Company Pay').first()).toBeVisible();
  
  // Use text locators instead of getByRole('link')
  const hourlyAvgLink = page.locator('text=Hourly Avg.').first();
  const totalLink = page.locator('text=Total').first();
  
  await expect(hourlyAvgLink).toBeVisible({ timeout: 10000 });
  await expect(totalLink).toBeVisible();
  
  // Click "Total" link
  await totalLink.click();
  await page.waitForTimeout(500);
  
  // Verify all pay fields are visible
  await expect(page.getByText('Base Pay').first()).toBeVisible();
  await expect(page.getByText('Max Pay').first()).toBeVisible();
  await expect(page.getByText('Earned Pay').first()).toBeVisible();
  await expect(page.getByText('Unpaid').first()).toBeVisible();
  
  // Verify dollar amounts are displayed
  const dollarAmounts = page.locator('text=/\\$\\d+\\.\\d{2}/');
  expect(await dollarAmounts.count()).toBeGreaterThanOrEqual(4);
  
  // Click back to "Hourly Avg."
  await hourlyAvgLink.click();
  await page.waitForTimeout(500);
  
  // Take final screenshot
  await page.screenshot({ path: 'company-pay-final.png' });
});

test('Debug: Find Company Pay elements', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'full-dashboard.png', fullPage: true });
  
  // Check if "Company Pay" text exists
  const companyPayExists = await page.getByText('Company Pay').count();
  console.log('Company Pay count:', companyPayExists);
  
  // Find all buttons on the page
  const allButtons = await page.getByRole('button').all();
  console.log('All buttons found:', allButtons.length);
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    console.log(`Button ${i}: "${text}"`);
  }
  
  // Check for any text containing "Hourly" or "Total"
  const hourlyElements = await page.locator('text=/hourly/i').count();
  const totalElements = await page.locator('text=/total/i').count();
  console.log('Elements with "Hourly":', hourlyElements);
  console.log('Elements with "Total":', totalElements);
  
  // Get HTML of the area around "Company Pay"
  if (companyPayExists > 0) {
    const companyPaySection = page.getByText('Company Pay').first().locator('../..');
    const html = await companyPaySection.innerHTML();
    console.log('Company Pay section HTML:', html.substring(0, 1000));
  }
  
  // Check if we need to scroll to see the Company Pay section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'after-scroll.png', fullPage: true });
});
test('Debug: Check Company Pay links', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Scroll to Company Pay
  await page.getByText('Company Pay').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({ path: 'company-pay-area.png' });
  
  // Check all links
  const allLinks = await page.getByRole('link').all();
  console.log('Total links:', allLinks.length);
  for (let i = 0; i < allLinks.length; i++) {
    const text = await allLinks[i].textContent();
    const isVisible = await allLinks[i].isVisible();
    console.log(`Link ${i}: "${text}" - Visible: ${isVisible}`);
  }
  
  // Check by text content instead
  const hourlyAvg = await page.locator('text=Hourly Avg.').count();
  const total = await page.locator('text=Total').count();
  console.log('Hourly Avg count:', hourlyAvg);
  console.log('Total count:', total);
});