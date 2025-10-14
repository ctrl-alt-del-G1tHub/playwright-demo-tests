const { test, expect } = require('@playwright/test');

test('Google search works', async ({ page }) => {
  await page.goto('https://google.com');
  await page.fill('textarea[name="q"]', 'Playwright testing');
  await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/Playwright/);
});
