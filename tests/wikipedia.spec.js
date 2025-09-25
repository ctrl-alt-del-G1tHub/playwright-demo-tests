const { test, expect } = require('@playwright/test');

test('Wikipedia search works', async ({ page }) => {
  await page.goto('https://www.wikipedia.org/');
  await page.fill('input[name="search"]', 'Playwright');
  await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/Playwright/);
});
