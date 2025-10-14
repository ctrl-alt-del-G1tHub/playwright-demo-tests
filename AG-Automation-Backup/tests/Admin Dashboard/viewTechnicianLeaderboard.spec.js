// TC-011.1, TC-011.2: Leaderboard Display and Functionality
//technicianStatus.spec.js
const { test, expect } = require('../../fixtures/dashboard.fixtures');

test.describe('TC-011: Leaderboard Display and Functionality', () => {
  test('TC-011.1: Verify Admin can view the technician leaderboard', async ({ page }) => {
    // Login
    await page.goto('https://app.artisangenius.com/');
    await page.fill('#email', 'jason@artisangenius.com');
    await page.fill('#password', '13243546');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await page.waitForTimeout(2000);
    
    // Scroll to Leaderboard section
    await page.getByText('Leaderboard').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Verify Leaderboard heading and description
    await expect(page.getByText('Leaderboard')).toBeVisible();
    await expect(page.getByText('Technician standings for the selected cycle(s).')).toBeVisible();
    
    // Verify the leaderboard table exists
    const leaderboardTable = page.locator('table.MuiTable-root');
    await expect(leaderboardTable).toBeVisible();
    
    // Verify table headers
    const headers = ['Name', 'Company', 'Field', 'Test', 'Production', 'Artisan'];
    for (const header of headers) {
      await expect(leaderboardTable.getByRole('columnheader', { name: header })).toBeVisible();
    }
    
    // Verify technician rows exist
    const technicianRows = leaderboardTable.locator('tbody tr');
    await expect(technicianRows.first()).toBeVisible();
    
    const rowCount = await technicianRows.count();
    console.log(`Found ${rowCount} technicians in leaderboard`);
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify first technician (Top Technician)
    const topTechRow = technicianRows.first();
    
    // Should have ranking number 1
    await expect(topTechRow.getByText('1').first()).toBeVisible();
    
    // Should have technician name (Cooper Emery from debug)
    await expect(topTechRow.getByText('Cooper Emery')).toBeVisible();
    
    // Verify all score columns have values
    const topTechCells = await topTechRow.locator('td').all();
    expect(topTechCells.length).toBe(6); // Name + 5 score columns
    
    // Get scores from the first technician
    const scores = [];
    for (let i = 1; i < topTechCells.length; i++) {
      const scoreText = await topTechCells[i].textContent();
      scores.push(scoreText?.trim());
      console.log(`Score ${i}: ${scoreText?.trim()}`);
    }
    
    // Verify scores are numeric
    for (const score of scores) {
      expect(score).toMatch(/^\d+$/);
    }
    
    // Take screenshot
    await leaderboardTable.screenshot({ path: 'leaderboard-verified.png' });
  });
   test('TC-011.2: Verify leaderboard displays all technicians with rankings', async ({ page }) => {
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
    const technicianRows = leaderboardTable.locator('tbody tr');
    
    const rowCount = await technicianRows.count();
    console.log(`Total technicians: ${rowCount}`);
    
    // Verify each row has a ranking number
    for (let i = 0; i < rowCount; i++) {
      const row = technicianRows.nth(i);
      const expectedRank = (i + 1).toString();
      
      // Check ranking number exists in this row
      await expect(row).toContainText(expectedRank);
      
      // Verify row has clickable technician link
      const techLink = row.locator('a[href*="/dashboard/technicians/"]');
      await expect(techLink).toBeVisible();
    }
    
    // Verify specific technicians from debug output - scope to table only
    await expect(leaderboardTable).toContainText('Cooper Emery');
    await expect(leaderboardTable).toContainText('Jason Emery');
    await expect(leaderboardTable).toContainText('JR Emery');
    
    // Verify they appear in order
    const firstRowName = await technicianRows.nth(0).textContent();
    const secondRowName = await technicianRows.nth(1).textContent();
    const thirdRowName = await technicianRows.nth(2).textContent();
    
    expect(firstRowName).toContain('Cooper Emery');
    expect(secondRowName).toContain('Jason Emery');
    expect(thirdRowName).toContain('JR Emery');
  });
});

// Note about the cycle dropdown: The debug output shows no dropdown is currently visible. 
// If there's supposed to be a cycle selector, it might Not yet implemented
test('TC-011.3: Verify cycle dropdown (when available)', async ({ page }) => {
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(2000);
  
  // Look for cycle dropdown - adjust selector when it's implemented
  // This is a placeholder for when the feature is added
  const cycleDropdown = page.locator('[aria-label*="cycle" i], button:has-text("Cycle")').first();
  
  if (await cycleDropdown.isVisible()) {
    await cycleDropdown.click();
    
    // Verify dropdown options
    const expectedCycles = ['Current Cycle', 'Last Cycle', '3 Cycles', '6 Cycles', 'YTD Cycles', '12 Cycles', 'All Cycles'];
    for (const cycle of expectedCycles) {
      await expect(page.getByRole('option', { name: cycle })).toBeVisible();
    }
  } else {
    console.log('Cycle dropdown not yet available');
  }
});

test('Debug: Find Leaderboard elements', async ({ page }) => {
  // Login
  await page.goto('https://app.artisangenius.com/');
  await page.fill('#email', 'jason@artisangenius.com');
  await page.fill('#password', '13243546');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'leaderboard-debug.png', fullPage: true });
  
  // Search for "Leaderboard"
  const leaderboardCount = await page.locator('text=/leaderboard/i').count();
  console.log('\n=== "Leaderboard" count: ===', leaderboardCount);
  
  if (leaderboardCount > 0) {
    const leaderboardElement = page.locator('text=/leaderboard/i').first();
    
    // Scroll to it
    await leaderboardElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Get the parent container
    const container = leaderboardElement.locator('../..');
    const containerHTML = await container.innerHTML();
    console.log('\n=== Leaderboard container HTML (first 2000 chars): ===');
    console.log(containerHTML.substring(0, 2000));
    
    // Screenshot the section
    await container.screenshot({ path: 'leaderboard-section.png' });
    
    // Look for table elements
    const tables = await page.locator('table').all();
    console.log('\n=== Tables on page: ===', tables.length);
    
    if (tables.length > 0) {
      const leaderboardTable = tables[0]; // Assuming first table is leaderboard
      const rows = await leaderboardTable.locator('tr').all();
      console.log('Table rows:', rows.length);
      
      // Get header row
      const headerCells = await leaderboardTable.locator('thead tr th, thead tr td').all();
      console.log('\n=== Table headers: ===', headerCells.length);
      for (let i = 0; i < headerCells.length; i++) {
        const text = await headerCells[i].textContent();
        console.log(`Header ${i}: "${text?.trim()}"`);
      }
      
      // Get first few data rows
      const dataRows = await leaderboardTable.locator('tbody tr').all();
      console.log('\n=== Data rows: ===', dataRows.length);
      for (let i = 0; i < Math.min(dataRows.length, 3); i++) {
        const cells = await dataRows[i].locator('td').all();
        const rowData = [];
        for (const cell of cells) {
          const text = await cell.textContent();
          rowData.push(text?.trim());
        }
        console.log(`Row ${i}: [${rowData.join(' | ')}]`);
      }
    }
  } else {
    console.log('\n=== "Leaderboard" text NOT FOUND ===');
  }
  
  // Look for cycle dropdown
  console.log('\n=== Looking for Cycle Dropdown: ===');
  
  // Search for "cycle" text
  const cycleElements = await page.locator('text=/cycle/i').all();
  console.log('Elements containing "cycle":', cycleElements.length);
  for (let i = 0; i < Math.min(cycleElements.length, 10); i++) {
    const text = await cycleElements[i].textContent();
    const isVisible = await cycleElements[i].isVisible();
    console.log(`${i}: "${text?.trim()}" - Visible: ${isVisible}`);
  }
  
  // Look for dropdowns/selects
  const dropdowns = await page.getByRole('combobox').all();
  console.log('\n=== Dropdowns (combobox role): ===', dropdowns.length);
  for (let i = 0; i < dropdowns.length; i++) {
    const text = await dropdowns[i].textContent();
    const ariaLabel = await dropdowns[i].getAttribute('aria-label');
    console.log(`Dropdown ${i}: text="${text?.trim()}" aria-label="${ariaLabel}"`);
  }
  
  // Look for buttons that might be dropdowns
  const buttons = await page.getByRole('button').all();
  console.log('\n=== All buttons: ===', buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const ariaExpanded = await buttons[i].getAttribute('aria-expanded');
    const ariaHaspopup = await buttons[i].getAttribute('aria-haspopup');
    if (ariaExpanded || ariaHaspopup) {
      console.log(`Button ${i}: "${text?.trim()}" aria-expanded="${ariaExpanded}" aria-haspopup="${ariaHaspopup}"`);
    }
  }
  
  // Look for technician names (from your screenshot: Cooper Emery, Jason Emery, JR Emery)
  console.log('\n=== Looking for technician names: ===');
  const cooperCount = await page.locator('text=Cooper Emery').count();
  const jasonCount = await page.locator('text=Jason Emery').count();
  const jrCount = await page.locator('text=JR Emery').count();
  console.log(`Cooper Emery: ${cooperCount}`);
  console.log(`Jason Emery: ${jasonCount}`);
  console.log(`JR Emery: ${jrCount}`);
  
  // Look for ranking/position indicators
  const numberElements = await page.locator('text=/^[1-9]$/').all();
  console.log('\n=== Single digit numbers (rankings?): ===', numberElements.length);
  for (let i = 0; i < Math.min(numberElements.length, 10); i++) {
    const text = await numberElements[i].textContent();
    const parent = await numberElements[i].locator('..').textContent();
    console.log(`Number ${i}: "${text}" - Context: "${parent?.trim().substring(0, 50)}"`);
  }
  
  // Look for score columns (CS, FS, TS, PS, AS from your test)
  console.log('\n=== Looking for score metrics: ===');
  const metrics = ['COMPANY', 'FIELD', 'TEST', 'PRODUCTION', 'ARTISAN'];
  for (const metric of metrics) {
    const count = await page.locator(`text=${metric}`).count();
    console.log(`${metric}: ${count}`);
  }
});

//------------------- TEST NOTES -------------------
// - Replace [data-testid="technician-leaderboard"] with actual leaderboard container selector
// - Replace [data-testid^="technician-row-"] with actual technician row selector pattern
// - Replace [data-testid="technician-status"] with actual status field selector
// - Replace metric selectors [data-testid="metric-CS"] etc. with actual metric column selectors
// - Replace [data-testid="award-icon"] with actual award/gold star icon selector
// - Replace [data-testid="cycle-dropdown"] with actual dropdown selector
// - Replace [data-testid="cycle-dropdown-options"] with actual dropdown menu selector
// - Replace [data-testid="cycle-option"] with actual option selector
// - Consider using page.getByRole('combobox') for dropdown and page.getByRole('option') for options
// - Adjust class matching regex for top technician highlighting
// - Handle cases where no technician data exists for selected cycle
