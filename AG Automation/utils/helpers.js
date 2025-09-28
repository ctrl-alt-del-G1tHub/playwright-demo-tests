// helpers classes only
const { expect } = require('@playwright/test');

// Authentication helper for test setup
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
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await expect(this.page.locator('[data-testid="login-page"]')).toBeVisible();
  }
}

// Dashboard page object model
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
    await this.page.waitForTimeout(1000);
  }

  async selectCycle(cycleName) {
    await this.cycleDropdown.click();
    await this.page.locator('[data-testid="cycle-option"]').filter({ hasText: cycleName }).click();
    await this.page.waitForTimeout(1000);
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

// Modal interaction helpers
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

// Test data management
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
    await page.evaluate(() => {
      window.testNotifications = {
        cycleEnd: true,
        endOfCycle: false
      };
    });
  }

  async cleanupTestData(page) {
    await page.evaluate(() => {
      if (window.testNotifications) {
        window.testNotifications = {};
      }
    });
  }
}

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
    await this.page.waitForTimeout(2000);
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
    
    const techDropdown = modal.locator('[data-testid="technician-dropdown"]');
    await techDropdown.click();
    await this.page.locator('[data-testid="technician-option"]').first().click();
    
    const pointsField = modal.locator('[data-testid="modify-points-field"]');
    await pointsField.clear();
    await pointsField.fill(points.toString());
    
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
    await this.page.waitForTimeout(1000);
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
    
    const techRow = techRows.filter({
      has: this.page.locator('[data-testid="technician-name"]').filter({ hasText: technicianName })
    });
    
    await expect(techRow).toBeVisible();
    
    await techRow.click();
    await expect(techRow).toHaveClass(/.*expanded.*|.*open.*/);
    
    const openDashboardLink = techRow.locator('[data-testid="open-dashboard-link"]');
    await expect(openDashboardLink).toBeVisible();
    await openDashboardLink.click();
    
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
  AuthHelper,
  DashboardPage,
  ModalHelper,
  TestDataManager,
  TechnicianDashboardPage,
  EditCompanyScorePage,
  TechnicianProfilePage,
  LeaderboardHelper
};