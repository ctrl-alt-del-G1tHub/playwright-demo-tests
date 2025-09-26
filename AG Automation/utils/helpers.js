// tests/helpers/auth.js - Authentication helper for test setup
const { expect } = require('@playwright/test');

class AuthHelper {
  constructor(page) {
    this.page = page;
  }

  async loginAsAdmin(username = 'admin@company.com', password = 'admin_password') {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="username"]', username);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for successful login
    await expect(this.page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
  }

  async logout() {
    // Implement logout logic based on your app
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await expect(this.page.locator('[data-testid="login-page"]')).toBeVisible();
  }
}

module.exports = { AuthHelper };

// =============================================================================

// tests/helpers/dashboard.js - Dashboard page object model
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Main containers
    this.dashboard = page.locator('[data-testid="admin-dashboard"]');
    this.eventsContainer = page.locator('[data-testid="events-container"]');
    this.techStatusContainer = page.locator('[data-testid="technician-status-container"]');
    this.cycleTestContainer = page.locator('[data-testid="cycle-test-container"]');
    this.leaderboard = page.locator('[data-testid="technician-leaderboard"]');
    this.companyPayCard = page.locator('[data-testid="company-pay-card"]');
    this.hoursCard = page.locator('[data-testid="company-hours-utilization-card"]');
    
    // Controls
    this.dayToggle = page.locator('[data-testid="day-toggle"]');
    this.cycleDropdown = page.locator('[data-testid="cycle-dropdown"]');
    
    // Notifications
    this.cycleNotifications = page.locator('[data-testid="cycle-notifications-container"]');
  }

  async goto() {
    await this.page.goto('/admin/dashboard');
    await expect(this.dashboard).toBeVisible();
  }

  async waitForLoad() {
    await expect(this.dashboard).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async toggleDay() {
    await this.dayToggle.click();
    await this.page.waitForTimeout(1000); // Allow data to refresh
  }

  async selectCycle(cycleName) {
    await this.cycleDropdown.click();
    await this.page.locator('[data-testid="cycle-option"]').filter({ hasText: cycleName }).click();
    await this.page.waitForTimeout(1000); // Allow data to refresh
  }

  async getEventCounts() {
    const scheduled = await this.eventsContainer.locator('[data-testid="scheduled-events"]').textContent();
    const inProgress = await this.eventsContainer.locator('[data-testid="in-progress-events"]').textContent();
    const completed = await this.eventsContainer.locator('[data-testid="completed-events"]').textContent();
    
    return {
      scheduled: parseInt(scheduled.match(/\d+/)?.[0] || '0'),
      inProgress: parseInt(inProgress.match(/\d+/)?.[0] || '0'),
      completed: parseInt(completed.match(/\d+/)?.[0] || '0')
    };
  }

  async clickEventContainer() {
    await this.eventsContainer.click();
  }

  async clickTechStatusContainer() {
    await this.techStatusContainer.click();
  }

  async clickCycleTestContainer() {
    await this.cycleTestContainer.click();
  }

  async getLeaderboardTechnicians() {
    const rows = this.leaderboard.locator('[data-testid^="technician-row-"]');
    const count = await rows.count();
    const technicians = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const name = await row.locator('[data-testid="technician-name"]').textContent();
      const status = await row.locator('[data-testid="technician-status"]').textContent();
      technicians.push({ name, status });
    }
    
    return technicians;
  }

  async toggleCompanyPay() {
    const toggle = this.companyPayCard.locator('[data-testid="company-pay-toggle"]');
    await toggle.click();
    return await toggle.isChecked();
  }

  async getHoursUtilization() {
    const scheduledText = await this.hoursCard.locator('[data-testid="scheduled-hours"]').textContent();
    const completedText = await this.hoursCard.locator('[data-testid="completed-hours"]').textContent();
    const percentageText = await this.hoursCard.locator('[data-testid="hours-percentage"]').textContent();
    
    return {
      scheduled: parseFloat(scheduledText.match(/[\d.]+/)?.[0] || '0'),
      completed: parseFloat(completedText.match(/[\d.]+/)?.[0] || '0'),
      percentage: parseFloat(percentageText.match(/[\d.]+/)?.[0] || '0')
    };
  }
}

module.exports = { DashboardPage };

// =============================================================================

// tests/helpers/modals.js - Modal interaction helpers
const { expect } = require('@playwright/test');

class ModalHelper {
  constructor(page) {
    this.page = page;
  }

  async waitForModal(selector) {
    const modal = this.page.locator(selector);
    await expect(modal).toBeVisible();
    return modal;
  }

  async closeModal(modalSelector, closeButtonSelector = '[data-testid="modal-close-button"]') {
    const modal = this.page.locator(modalSelector);
    await modal.locator(closeButtonSelector).click();
    await expect(modal).not.toBeVisible();
  }

  async fillChecklist(checklistSelector) {
    const checklist = this.page.locator(checklistSelector);
    const checkboxes = checklist.locator('[data-testid^="checklist-item-"]');
    const count = await checkboxes.count();
    
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
    
    return count;
  }

  async waitForToast(message) {
    const toast = this.page.locator('[data-testid="toast-confirmation"]');
    await expect(toast).toBeVisible();
    if (message) {
      await expect(toast).toContainText(message);
    }
    return toast;
  }
}

module.exports = { ModalHelper };

// =============================================================================

// tests/setup/test-data.js - Test data management
class TestDataManager {
  constructor() {
    this.testUsers = {
      admin: {
        username: 'admin@company.com',
        password: 'admin_password',
        role: 'admin'
      },
      technician: {
        username: 'tech@company.com',
        password: 'tech_password',
        role: 'technician'
      }
    };

    this.testTechnicians = [
      {
        id: 'tech-001',
        name: 'John Smith',
        status: 'active',
        scheduledHours: 8,
        actualHours: 7.5,
        scores: { CS: 95, FS: 88, TS: 92, PS: 90, AS: 94 }
      },
      {
        id: 'tech-002',
        name: 'Jane Doe',
        status: 'active',
        scheduledHours: 8,
        actualHours: 8,
        scores: { CS: 92, FS: 95, TS: 89, PS: 93, AS: 91 }
      }
    ];
  }

  getAdminCredentials() {
    return this.testUsers.admin;
  }

  getTechnicianCredentials() {
    return this.testUsers.technician;
  }

  createTestTechnician(overrides = {}) {
    return {
      id: `tech-${Date.now()}`,
      name: `Test Tech ${Date.now()}`,
      status: 'active',
      scheduledHours: 8,
      actualHours: Math.random() * 8,
      scores: {
        CS: Math.floor(Math.random() * 20) + 80,
        FS: Math.floor(Math.random() * 20) + 80,
        TS: Math.floor(Math.random() * 20) + 80,
        PS: Math.floor(Math.random() * 20) + 80,
        AS: Math.floor(Math.random() * 20) + 80
      },
      ...overrides
    };
  }

  async setupCycleEndNotification(page) {
    // Mock or trigger cycle end notification for testing
    // This would typically involve API calls or test data setup
    await page.evaluate(() => {
      // Example: Inject test notification into the DOM
      // This depends on your application's notification system
      window.testNotifications = {
        cycleEnd: true,
        endOfCycle: false
      };
    });
  }

  async cleanupTestData(page) {
    // Clean up any test data created during tests
    await page.evaluate(() => {
      // Reset test notifications
      if (window.testNotifications) {
        window.testNotifications = {};
      }
    });
  }
}

module.exports = { TestDataManager };

// =============================================================================

// tests/fixtures/dashboard-fixtures.js - Playwright fixtures for dashboard tests
const { test as base } = require('@playwright/test');
const { AuthHelper } = require('../helpers/auth');
const { DashboardPage } = require('../helpers/dashboard');
const { ModalHelper } = require('../helpers/modals');
const { TestDataManager } = require('../setup/test-data');

const test = base.extend({
  authHelper: async ({ page }, use) => {
    const authHelper = new AuthHelper(page);
    await use(authHelper);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  modalHelper: async ({ page }, use) => {
    const modalHelper = new ModalHelper(page);
    await use(modalHelper);
  },

  testDataManager: async ({}, use) => {
    const testDataManager = new TestDataManager();
    await use(testDataManager);
  },

  authenticatedPage: async ({ page, authHelper }, use) => {
    await authHelper.loginAsAdmin();
    await use(page);
    // Cleanup happens automatically when page is destroyed
  }
});

module.exports = { test };

// =============================================================================

// package.json scripts addition - Add these to your package.json
/*
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:dashboard": "playwright test tests/dashboard --headed",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "test:install": "playwright install"
  }
}
*/

// =============================================================================

// tests/example-usage.spec.js - Example of using the fixtures and helpers
const { test, expect } = require('./fixtures/dashboard-fixtures');

test.describe('Dashboard Tests with Fixtures', () => {
  test('Example: Complete dashboard workflow using fixtures', async ({ 
    page, 
    dashboardPage, 
    modalHelper, 
    authenticatedPage 
  }) => {
    // User is already authenticated via authenticatedPage fixture
    await dashboardPage.goto();
    await dashboardPage.waitForLoad();

    // Test events container
    const eventCounts = await dashboardPage.getEventCounts();
    expect(eventCounts.scheduled).toBeGreaterThanOrEqual(0);

    // Click events and handle modal
    await dashboardPage.clickEventContainer();
    await expect(page).toHaveURL(/.*schedule/);

    // Navigate back to dashboard
    await dashboardPage.goto();

    // Test technician status modal
    await dashboardPage.clickTechStatusContainer();
    const modal = await modalHelper.waitForModal('[data-testid="technician-status-modal"]');
    await modalHelper.closeModal('[data-testid="technician-status-modal"]');

    // Test leaderboard
    const technicians = await dashboardPage.getLeaderboardTechnicians();
    expect(technicians.length).toBeGreaterThan(0);
    expect(technicians.every(tech => tech.status.toLowerCase().includes('active'))).toBe(true);
  });
});

// =============================================================================

// Global test setup and teardown
// tests/global-setup.js
async function globalSetup() {
  // Global setup that runs once before all tests
  console.log('Setting up test environment...');
  
  // You might want to:
  // - Start your application server
  // - Set up test database
  // - Create test users
  // - Configure test environment variables
  
  process.env.NODE_ENV = 'test';
  process.env.API_URL = 'http://localhost:3000/api';
}

module.exports = globalSetup;

// tests/global-teardown.js
async function globalTeardown() {
  // Global cleanup that runs once after all tests
  console.log('Cleaning up test environment...');
  
  // You might want to:
  // - Stop application server
  // - Clean up test database
  // - Remove test files
}

module.exports = globalTeardown;

// =============================================================================

// Running your tests - Command examples:

/* 
# Run all dashboard tests
npm run test:e2e

# Run specific test file
npx playwright test tests/tc001-005.spec.js

# Run tests with UI mode for debugging
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests and generate report
npx playwright test && npx playwright show-report

# Run only smoke tests (if you tag them with @smoke)
npx playwright test --grep @smoke

# Run specific test case
npx playwright test --grep "TC-001"

# Run tests in specific browser
npx playwright test --project chromium

# Debug specific test
npx playwright test tests/tc001-005.spec.js --debug

# Run tests with different baseURL
npx playwright test --config=playwright.config.js

# Generate test code (record actions)
npx playwright codegen localhost:3000
*/

//===============================================================================
//                              IMPLEMENTATION NOTES
//===============================================================================

/*
SELECTOR UPDATES NEEDED:
When you implement these tests, you'll need to update ALL selectors marked with 
[data-testid="..."] to match your actual application. Here's a systematic approach:

1. INSPECT YOUR APPLICATION:
   - Open your app in browser
   - Use Dev Tools to inspect elements
   - Note the actual selectors, IDs, classes, or text content

2. REPLACE TEST SELECTORS:
   Priority order for selector types:
   a) data-testid attributes (most reliable)
   b) role-based selectors: page.getByRole('button', { name: 'Login' })
   c) text-based selectors: page.getByText('Admin Dashboard')
   d) CSS selectors/classes (least reliable, avoid if possible)

3. COMMON REPLACEMENTS NEEDED:
   - [data-testid="admin-dashboard"] → your dashboard container
   - [data-testid="username"] → your username input field
   - [data-testid="events-container"] → your events widget
   - [data-testid="technician-leaderboard"] → your leaderboard table
   - etc.

4. ADD DATA-TESTID ATTRIBUTES:
   If your app doesn't have test IDs, add them:
   <div data-testid="admin-dashboard">...</div>
   <button data-testid="login-button">Login</button>
   
5. URL PATTERNS:
   Update all URL expectations to match your routing:
   - /login → your login path
   - /admin/dashboard → your dashboard path
   - /schedule → your schedule path

6. TEST DATA:
   - Update login credentials
   - Ensure test users exist in your system
   - Set up test technicians and cycles as needed

7. TIMING ADJUSTMENTS:
   - Replace waitForTimeout() with proper waitFor() methods
   - Adjust timeouts based on your app's performance
   - Use page.waitForLoadState('networkidle') for data loading

8. BROWSER CONFIGURATION:
   - Update baseURL in playwright.config.js
   - Adjust webServer command for your app startup
   - Configure proper viewport sizes for your responsive design

TESTING STRATEGY:
1. Start with login test to verify basic functionality
2. Test each TC-001, TC-002, etc. individually
3. Update selectors as you encounter failures
4. Build up test data and fixtures gradually
5. Add proper error handling and retry logic

Remember: These tests are a starting point. You'll need to adapt them to your 
specific application structure, timing, and business logic.*/

const { expect } = require('@playwright/test');

// Technician Dashboard Page Object Model
class TechnicianDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Main containers
    this.dashboard = page.locator('[data-testid="technician-dashboard"]');
    this.techName = page.locator('[data-testid="technician-dashboard-name"]');
    this.techPicture = page.locator('[data-testid="technician-dashboard-picture"]');
    
    // Score Cards
    this.testScoreCard = page.locator('[data-testid="test-score-card"]');
    this.productionScoreCard = page.locator('[data-testid="production-score-card"]');
    this.companyScoreCard = page.locator('[data-testid="company-score-card"]');
    this.fieldScoreCard = page.locator('[data-testid="field-score-card"]');
    
    // Controls
    this.timeDropdown = page.locator('[data-testid="time-dropdown"]');
    this.editTechButton = page.locator('[data-testid="edit-tech-button"]');
    
    // Pay Scale Section
    this.payScaleSection = page.locator('[data-testid="technician-pay-scale"]');
    this.hourAverageButton = page.locator('[data-testid="hour-average-button"]');
    this.totalButton = page.locator('[data-testid="total-button"]');
    
    // Hour Utilization
    this.hourUtilizationSection = page.locator('[data-testid="technician-hour-utilization"]');
  }

  async goto(technicianId = 'tech-001') {
    await this.page.goto(`/technician/dashboard/${technicianId}`);
    await expect(this.dashboard).toBeVisible();
  }

  async waitForLoad() {
    await expect(this.dashboard).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async selectTimeframe(timeframe) {
    await this.timeDropdown.click();
    const dropdownMenu = this.page.locator('[data-testid="time-dropdown-menu"]');
    await expect(dropdownMenu).toBeVisible();
    await dropdownMenu.locator('[data-testid="time-option"]').filter({ hasText: timeframe }).click();
    await expect(this.timeDropdown).toContainText(timeframe);
    await this.page.waitForTimeout(2000); // Allow data to refresh
  }

  async getScoreCardValues() {
    const scores = {};
    
    if (await this.testScoreCard.isVisible()) {
      scores.testScore = await this.testScoreCard.locator('[data-testid="test-score-value"]').textContent().catch(() => 'N/A');
    }
    
    if (await this.productionScoreCard.isVisible()) {
      scores.productionScore = await this.productionScoreCard.locator('[data-testid="production-score-value"]').textContent().catch(() => 'N/A');
    }
    
    if (await this.companyScoreCard.isVisible()) {
      scores.companyScore = await this.companyScoreCard.locator('[data-testid="company-score-value"]').textContent().catch(() => 'N/A');
    }
    
    if (await this.fieldScoreCard.isVisible()) {
      scores.fieldScore = await this.fieldScoreCard.locator('[data-testid="field-score-value"]').textContent().catch(() => 'N/A');
    }
    
    return scores;
  }

  async editTestScore(newScore, shouldSave = true) {
    await this.testScoreCard.locator('[data-testid="edit-test-score-icon"]').click();
    
    const modal = this.page.locator('[data-testid="edit-test-score-modal"]');
    await expect(modal).toBeVisible();
    
    const scoreField = modal.locator('[data-testid="cycle-test-score-total"]');
    await scoreField.clear();
    await scoreField.fill(newScore.toString());
    
    if (shouldSave) {
      await modal.locator('[data-testid="save-button"]').click();
      await expect(modal).not.toBeVisible();
      
      // Wait for and verify toast
      const toast = this.page.locator('[data-testid="toast-confirmation"]');
      await expect(toast).toBeVisible();
      
      return true;
    } else {
      await modal.locator('[data-testid="cancel-button"]').click();
      await expect(modal).not.toBeVisible();
      return false;
    }
  }

  async editProductionScore(points, note, shouldSave = true) {
    await this.productionScoreCard.locator('[data-testid="edit-production-score-icon"]').click();
    
    const modal = this.page.locator('[data-testid="edit-production-score-modal"]');
    await expect(modal).toBeVisible();
    
    // Select technician (first option)
    const techDropdown = modal.locator('[data-testid="technician-dropdown"]');
    await techDropdown.click();
    await this.page.locator('[data-testid="technician-option"]').first().click();
    
    // Enter points
    const pointsField = modal.locator('[data-testid="modify-points-field"]');
    await pointsField.clear();
    await pointsField.fill(points.toString());
    
    // Enter note
    const noteField = modal.locator('[data-testid="note-field"]');
    await noteField.fill(note);
    
    if (shouldSave) {
      await modal.locator('[data-testid="save-button"]').click();
      await expect(modal).not.toBeVisible();
      
      const toast = this.page.locator('[data-testid="toast-confirmation"]');
      await expect(toast).toBeVisible();
      return true;
    } else {
      await modal.locator('[data-testid="cancel-button"]').click();
      await expect(modal).not.toBeVisible();
      return false;
    }
  }

  async navigateToCompanyScoreEdit() {
    await this.companyScoreCard.locator('[data-testid="edit-company-score-icon"]').click();
    await expect(this.page).toHaveURL(/.*edit.*company.*score/);
    await expect(this.page.locator('[data-testid="edit-company-score-screen"]')).toBeVisible();
  }

  async navigateToFieldScoreEdit() {
    await this.fieldScoreCard.locator('[data-testid="edit-field-score-icon"]').click();
    await expect(this.page).toHaveURL(/.*edit.*field.*score/);
    await expect(this.page.locator('[data-testid="edit-field-score-screen"]')).toBeVisible();
  }

  async togglePayScale(viewType = 'total') {
    const button = viewType === 'total' ? this.totalButton : this.hourAverageButton;
    await button.click();
    await expect(button).toHaveClass(/.*active.*|.*selected.*/);
    await this.page.waitForTimeout(1000); // Allow data to update
  }

  async getPayScaleValues() {
    const payScale = {};
    payScale.basePay = await this.payScaleSection.locator('[data-testid="base-pay-value"]').textContent();
    payScale.maxPay = await this.payScaleSection.locator('[data-testid="max-pay-value"]').textContent();
    payScale.earnedPay = await this.payScaleSection.locator('[data-testid="earned-pay-value"]').textContent();
    payScale.unpaid = await this.payScaleSection.locator('[data-testid="unpaid-value"]').textContent();
    return payScale;
  }

  async getHourUtilizationData() {
    const utilization = {};
    utilization.scheduledHours = await this.hourUtilizationSection.locator('[data-testid="scheduled-hours"]').textContent();
    utilization.workedHours = await this.hourUtilizationSection.locator('[data-testid="worked-hours"]').textContent();
    utilization.percentage = await this.hourUtilizationSection.locator('[data-testid="utilization-percentage"]').textContent();
    return utilization;
  }

  async navigateToProfile() {
    await this.editTechButton.click();
    await expect(this.page).toHaveURL(/.*technician.*profile/);
    await expect(this.page.locator('[data-testid="technician-profile-screen"]')).toBeVisible();
  }
}

// Edit Company Score Page Object Model
class EditCompanyScorePage {
  constructor(page) {
    this.page = page;
    this.screen = page.locator('[data-testid="edit-company-score-screen"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    this.techTalliesList = page.locator('[data-testid="tech-tallies-list"]');
  }

  async waitForLoad() {
    await expect(this.screen).toBeVisible();
  }

  async goBack() {
    await this.backButton.click();
    await expect(this.page).toHaveURL(/.*technician.*dashboard/);
  }

  async editTechTally(tallyIndex = 0, tallyData = {}) {
    const tallyRows = this.techTalliesList.locator('[data-testid^="tech-tally-row-"]');
    const tallyRow = tallyRows.nth(tallyIndex);
    
    await tallyRow.locator('[data-testid="edit-tech-tally-icon"]').click();
    
    const modal = this.page.locator('[data-testid="tech-tally-modal"]');
    await expect(modal).toBeVisible();
    
    if (tallyData.companyScore) {
      const scoreField = modal.locator('[data-testid="company-score-field"]');
      await scoreField.clear();
      await scoreField.fill(tallyData.companyScore.toString());
    }
    
    if (tallyData.policyMetric) {
      const policyDropdown = modal.locator('[data-testid="company-policy-metric-dropdown"]');
      await policyDropdown.click();
      await this.page.locator('[data-testid="policy-metric-option"]').filter({ hasText: tallyData.policyMetric }).click();
    }
    
    if (tallyData.technician) {
      const techDropdown = modal.locator('[data-testid="technician-dropdown"]');
      await techDropdown.click();
      await this.page.locator('[data-testid="technician-option"]').filter({ hasText: tallyData.technician }).click();
    }
    
    if (tallyData.tallyDate) {
      const dateField = modal.locator('[data-testid="tally-date-field"]');
      await dateField.fill(tallyData.tallyDate);
    }
    
    if (tallyData.notes) {
      const notesField = modal.locator('[data-testid="notes-field"]');
      await notesField.fill(tallyData.notes);
    }
    
    if (tallyData.shouldSave !== false) {
      await modal.locator('[data-testid="save-button"]').click();
      await expect(modal).not.toBeVisible();
      
      // Verify toast confirmation
      const toast = this.page.locator('[data-testid="toast-confirmation"]');
      await expect(toast).toBeVisible();
      return true;
    } else {
      await modal.locator('[data-testid="cancel-button"]').click();
      await expect(modal).not.toBeVisible();
      return false;
    }
  }
}

// Technician Profile Page Object Model
class TechnicianProfilePage {
  constructor(page) {
    this.page = page;
    this.screen = page.locator('[data-testid="technician-profile-screen"]');
    this.form = page.locator('[data-testid="technician-profile-form"]');
    this.saveAllButton = page.locator('[data-testid="save-all-button"]');
    
    // Common profile fields
    this.nameField = this.form.locator('[data-testid="technician-name-field"]');
    this.emailField = this.form.locator('[data-testid="technician-email-field"]');
    this.phoneField = this.form.locator('[data-testid="technician-phone-field"]');
    this.roleField = this.form.locator('[data-testid="technician-role-field"]');
  }

  async waitForLoad() {
    await expect(this.screen).toBeVisible();
    await expect(this.form).toBeVisible();
  }

  async updateProfile(profileData) {
    if (profileData.name && await this.nameField.isVisible()) {
      await this.nameField.clear();
      await this.nameField.fill(profileData.name);
    }
    
    if (profileData.email && await this.emailField.isVisible()) {
      await this.emailField.clear();
      await this.emailField.fill(profileData.email);
    }
    
    if (profileData.phone && await this.phoneField.isVisible()) {
      await this.phoneField.clear();
      await this.phoneField.fill(profileData.phone);
    }
    
    if (profileData.role && await this.roleField.isVisible()) {
      await this.roleField.selectOption(profileData.role);
    }
    
    await this.saveAllButton.click();
    
    // Should return to technician dashboard
    await expect(this.page).toHaveURL(/.*technician.*dashboard/);
    await expect(this.page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    return true;
  }

  async getProfileData() {
    const profile = {};
    
    if (await this.nameField.isVisible()) {
      profile.name = await this.nameField.inputValue();
    }
    
    if (await this.emailField.isVisible()) {
      profile.email = await this.emailField.inputValue();
    }
    
    if (await this.phoneField.isVisible()) {
      profile.phone = await this.phoneField.inputValue();
    }
    
    if (await this.roleField.isVisible()) {
      profile.role = await this.roleField.inputValue();
    }
    
    return profile;
  }
}

// Leaderboard Helper for accessing technician dashboards
class LeaderboardHelper {
  constructor(page) {
    this.page = page;
    this.leaderboard = page.locator('[data-testid="technician-leaderboard"]');
  }

  async openTechnicianDashboard(technicianName) {
    const techRows = this.leaderboard.locator('[data-testid^="technician-row-"]');
    
    // Find the technician by name
    const techRow = techRows.filter({
      has: this.page.locator('[data-testid="technician-name"]').filter({ hasText: technicianName })
    });
    
    await expect(techRow).toBeVisible();
    
    // Click to expand row
    await techRow.click();
    await expect(techRow).toHaveClass(/.*expanded.*|.*open.*/);
    
    // Click Open Dashboard link
    const openDashboardLink = techRow.locator('[data-testid="open-dashboard-link"]');
    await expect(openDashboardLink).toBeVisible();
    await openDashboardLink.click();
    
    // Should navigate to technician dashboard
    await expect(this.page).toHaveURL(/.*technician.*dashboard/);
    await expect(this.page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
    
    return technicianName;
  }

  async getTechnicianInfo(technicianIndex = 0) {
    const techRows = this.leaderboard.locator('[data-testid^="technician-row-"]');
    const techRow = techRows.nth(technicianIndex);
    
    const name = await techRow.locator('[data-testid="technician-name"]').textContent();
    const pictureVisible = await techRow.locator('[data-testid="technician-picture"]').isVisible();
    
    return { name, pictureVisible };
  }
}

// Export all classes
module.exports = {
  TechnicianDashboardPage,
  EditCompanyScorePage,
  TechnicianProfilePage,
  LeaderboardHelper
};

//===============================================================================
//                              USAGE EXAMPLES
//===============================================================================

/*
// Example usage in your test files:

const { test, expect } = require('@playwright/test');
const { 
  TechnicianDashboardPage, 
  EditCompanyScorePage,
  TechnicianProfilePage,
  LeaderboardHelper,
  AuthHelper 
} = require('./helpers');

test('Complete technician dashboard workflow', async ({ page }) => {
  // Setup
  const auth = new AuthHelper(page);
  await auth.loginAsAdmin();

  // Access technician dashboard from leaderboard
  const leaderboard = new LeaderboardHelper(page);
  await page.goto('/admin/dashboard');
  const techName = await leaderboard.openTechnicianDashboard('John Smith');

  // Use technician dashboard
  const techDashboard = new TechnicianDashboardPage(page);
  await techDashboard.waitForLoad();
  
  // Change timeframe and verify data updates
  await techDashboard.selectTimeframe('Last Cycle');
  
  // Edit test score
  await techDashboard.editTestScore(95, true);
  
  // Edit production score
  await techDashboard.editProductionScore(10, 'Quality improvement', true);
  
  // Toggle pay scale view
  await techDashboard.togglePayScale('total');
  const payScale = await techDashboard.getPayScaleValues();
  console.log('Pay scale totals:', payScale);
  
  // Check hour utilization
  const utilization = await techDashboard.getHourUtilizationData();
  console.log('Hour utilization:', utilization);
  
  // Navigate to company score editing
  await techDashboard.navigateToCompanyScoreEdit();
  
  const companyScorePage = new EditCompanyScorePage(page);
  await companyScorePage.waitForLoad();
  
  // Edit a tech tally
  await companyScorePage.editTechTally(0, {
    companyScore: 88,
    policyMetric: 'Safety Compliance',
    notes: 'Improved safety protocol adherence',
    tallyDate: '2025-09-15'
  });
  
  // Go back to dashboard
  await companyScorePage.goBack();
  
  // Navigate to profile editing
  await techDashboard.navigateToProfile();
  
  const profilePage = new TechnicianProfilePage(page);
  await profilePage.waitForLoad();
  
  // Update profile
  await profilePage.updateProfile({
    name: 'John Smith Updated',
    email: 'john.smith.updated@company.com',
    phone: '555-0199'
  });
  
  // Verify back on dashboard with updates
  await expect(page.locator('[data-testid="technician-dashboard"]')).toBeVisible();
});

// Example test using fixtures:
test('Technician score editing workflow', async ({ page }) => {
  const auth = new AuthHelper(page);
  const techDashboard = new TechnicianDashboardPage(page);
  
  await auth.loginAsAdmin();
  await techDashboard.goto('tech-001');
  
  // Get initial scores
  const initialScores = await techDashboard.getScoreCardValues();
  console.log('Initial scores:', initialScores);
  
  // Edit test score and verify update
  await techDashboard.editTestScore(92, true);
  
  const updatedScores = await techDashboard.getScoreCardValues();
  expect(updatedScores.testScore).toContain('92');
  
  // Test cancel functionality
  await techDashboard.editTestScore(85, false); // false = cancel
  
  // Score should remain 92
  const cancelledScores = await techDashboard.getScoreCardValues();
  expect(cancelledScores.testScore).toContain('92');
});
*/

//===============================================================================
//                              IMPLEMENTATION NOTES
//===============================================================================

/*
INTEGRATION WITH YOUR EXISTING helpers.js:

1. ADD these classes to your existing AG Automation/helpers.js file:
   - Copy all the classes above (TechnicianDashboardPage, EditCompanyScorePage, etc.)
   - Add them to your existing module.exports

2. UPDATE your existing module.exports to include the new classes:
   module.exports = {
     // Your existing classes...
     AuthHelper,
     DashboardPage,
     ModalHelper,
     TestDataManager,
     
     // NEW Technician Dashboard classes
     TechnicianDashboardPage,
     EditCompanyScorePage,
     TechnicianProfilePage,
     LeaderboardHelper
   };

3. SELECTOR UPDATES NEEDED:
   Replace ALL [data-testid="..."] selectors with your actual application selectors:
   
   PRIORITY SELECTORS TO UPDATE:
   - [data-testid="technician-dashboard"] → your main dashboard container
   - [data-testid="technician-dashboard-name"] → tech name display
   - [data-testid="technician-dashboard-picture"] → tech picture/avatar
   - [data-testid="test-score-card"] → test score widget/card
   - [data-testid="production-score-card"] → production score widget/card
   - [data-testid="company-score-card"] → company score widget/card
   - [data-testid="field-score-card"] → field score widget/card
   - [data-testid="edit-test-score-icon"] → edit icons (pen/pencil icons)
   - [data-testid="time-dropdown"] → timeframe selection dropdown
   - [data-testid="technician-pay-scale"] → pay scale section
   - [data-testid="hour-average-button"] → pay scale toggle buttons
   - [data-testid="total-button"] → pay scale toggle buttons
   - [data-testid="edit-tech-button"] → Edit Tech button

4. MODAL SELECTORS:
   - [data-testid="edit-test-score-modal"] → test score edit modal
   - [data-testid="edit-production-score-modal"] → production score edit modal  
   - [data-testid="tech-tally-modal"] → tech tally edit modal
   - [data-testid="cycle-test-score-total"] → score input fields
   - [data-testid="modify-points-field"] → points input field
   - [data-testid="note-field"] → notes input field

5. NAVIGATION SELECTORS:
   - Update URL patterns for your routing structure:
     * /technician/dashboard/{id} → your technician dashboard route
     * /edit/company/score → your company score edit route  
     * /edit/field/score → your field score edit route
     * /technician/profile → your profile edit route

6. DROPDOWN HANDLING:
   - Update dropdown interaction patterns based on your UI library
   - Handle dropdown options with proper wait strategies
   - Consider using semantic selectors like getByRole('option')

7. FORM HANDLING:
   - Adjust form field interactions based on your form library
   - Handle validation messages and error states
   - Add proper wait strategies for form submissions

8. TEST DATA:
   - Create test technicians with predictable IDs (tech-001, tech-002, etc.)
   - Set up test cycles and scoring data
   - Consider database seeding for consistent test data

9. ERROR HANDLING:
   - Add try-catch blocks for optional UI elements
   - Handle cases where certain score cards might not be visible
   - Add fallback selectors for different UI states

10. PERFORMANCE:
    - Replace waitForTimeout() with proper wait strategies
    - Use page.waitForResponse() for API calls
    - Implement proper loading state detection

TESTING STRATEGY:
1. Start with basic navigation tests (TC-016)
2. Test timeframe selection functionality (TC-017)  
3. Test score editing workflows (TC-018, TC-019)
4. Test complex navigation flows (TC-020, TC-021)
5. Test profile editing (TC-025)
6. Integrate with your existing dashboard tests

Remember: These helpers provide a clean abstraction layer but will need 
selector updates to match your actual application structure!
*/