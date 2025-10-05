// TC-010.1: Company Hours Utilization
//viewCompanyHoursUtilization.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');
  test('TC-010.2: Verify hours data when available', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  await page.getByText('Company Hours Utilization').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  const hoursSection = page.locator('div').filter({ hasText: /^Company Hours UtilizationSubtitle text/ }).first();
  
  // Get all text in the section
  const sectionText = await hoursSection.textContent();
  console.log('Hours section text:', sectionText);
  
  // Check if hours are displayed (look for patterns like "8h", "40 hours", etc.)
  const hourMatches = sectionText?.match(/(\d+\.?\d*)\s*(h|hr|hrs|hour|hours)/gi);
  
  if (hourMatches && hourMatches.length >= 2) {
    console.log('Found hours data:', hourMatches);
    
    // If we have scheduled and completed hours, verify the calculation
    // This is for when actual data exists
    const scheduledHours = parseFloat(hourMatches[0].match(/[\d.]+/)?.[0] || '0');
    const completedHours = parseFloat(hourMatches[1].match(/[\d.]+/)?.[0] || '0');
    
    const percentageText = await hoursSection.locator('text=/%/').textContent();
    const percentage = parseFloat(percentageText?.match(/[\d.]+/)?.[0] || '0');
    
    if (scheduledHours > 0) {
      const expectedPercentage = Math.round((completedHours / scheduledHours) * 100);
      expect(Math.abs(percentage - expectedPercentage)).toBeLessThan(2); // 2% tolerance for rounding
    }
  } else {
    console.log('No hour data displayed - showing 0% utilization');
    const percentageText = await hoursSection.locator('text=/%/').textContent();
    expect(percentageText).toContain('0%');
  }
});

test('Debug: Find Company Hours Utilization elements', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'hours-utilization-debug.png', fullPage: true });
  
  // Search for "Company Hours Utilization"
  const hoursUtilizationCount = await page.locator('text=/company.*hours.*utilization/i').count();
  console.log('\n=== "Company Hours Utilization" count: ===', hoursUtilizationCount);
  
  if (hoursUtilizationCount > 0) {
    const hoursElement = page.locator('text=/company.*hours.*utilization/i').first();
    
    // Scroll to it
    await hoursElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Get the parent container
    const container = hoursElement.locator('../..');
    const containerHTML = await container.innerHTML();
    console.log('\n=== Company Hours Utilization container HTML: ===');
    console.log(containerHTML.substring(0, 1500));
    
    // Screenshot just that section
    await container.screenshot({ path: 'hours-utilization-section.png' });
    
    // Look for percentage text
    const percentageInContainer = await container.locator('text=/%/').all();
    console.log('\n=== Percentages in Hours Utilization: ===', percentageInContainer.length);
    for (let i = 0; i < percentageInContainer.length; i++) {
      const text = await percentageInContainer[i].textContent();
      console.log(`${i}: "${text?.trim()}"`);
    }
    
    // Look for hour values (numbers followed by hour indicators)
    const hourElements = await container.locator('text=/\\d+.*h(ou)?r/i').all();
    console.log('\n=== Hour elements: ===', hourElements.length);
    for (let i = 0; i < hourElements.length; i++) {
      const text = await hourElements[i].textContent();
      console.log(`${i}: "${text?.trim()}"`);
    }
    
    // Look for any SVG (might be the percentage ring)
    const svgs = await container.locator('svg').all();
    console.log('\n=== SVGs in container: ===', svgs.length);
    for (let i = 0; i < svgs.length; i++) {
      const classes = await svgs[i].getAttribute('class');
      const viewBox = await svgs[i].getAttribute('viewBox');
      console.log(`SVG ${i}: class="${classes}" viewBox="${viewBox}"`);
    }
    
    // Look for all text content in the container
    const allText = await container.textContent();
    console.log('\n=== All text in container: ===');
    console.log(allText);
    
    // Find all direct children
    const children = await container.locator('> *').all();
    console.log('\n=== Direct children: ===', children.length);
    for (let i = 0; i < children.length; i++) {
      const tag = await children[i].evaluate(el => el.tagName);
      const classes = await children[i].getAttribute('class');
      const text = await children[i].textContent();
      console.log(`${i}: <${tag}> class="${classes}" text="${text?.trim().substring(0, 60)}"`);
    }
  } else {
    console.log('\n=== Company Hours Utilization NOT FOUND ===');
    
    // Search for just "hours"
    const hoursElements = await page.locator('text=/hours/i').all();
    console.log('\n=== Elements containing "hours": ===', hoursElements.length);
    for (let i = 0; i < Math.min(hoursElements.length, 10); i++) {
      const text = await hoursElements[i].textContent();
      const isVisible = await hoursElements[i].isVisible();
      console.log(`${i}: "${text?.trim()}" - Visible: ${isVisible}`);
    }
    
    // Search for "utilization"
    const utilizationElements = await page.locator('text=/utilization/i').all();
    console.log('\n=== Elements containing "utilization": ===', utilizationElements.length);
    for (let i = 0; i < utilizationElements.length; i++) {
      const text = await utilizationElements[i].textContent();
      console.log(`${i}: "${text?.trim()}"`);
    }
  }
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="company-hours-utilization-card"] with actual hours card selector
// - Replace [data-testid="scheduled-hours"], [data-testid="completed-hours"] with actual hours display selectors
// - Replace [data-testid="hours-percentage-ring"] with actual percentage ring/chart selector
// - Replace [data-testid="hours-percentage"] with actual percentage text selector
// - Adjust regex patterns based on your actual hours format (may include "hrs", "hours", etc.)
// - Consider edge cases like division by zero when scheduled hours = 0
// - May need to handle different time formats (decimal hours vs HH:MM)
// - Verify the percentage ring visual matches the calculated percentage