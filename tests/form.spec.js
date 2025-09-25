const { test, expect } = require('@playwright/test');

test('Simple form fill', async ({ page }) => {
  await page.goto('https://www.w3schools.com/html/html_forms.asp');
  await page.fill('input[name="firstname"]', 'Mary');
  await page.fill('input[name="lastname"]', 'Gray');
  await page.click('input[type="submit"]');
});
