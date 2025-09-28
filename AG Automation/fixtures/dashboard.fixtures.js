// tests/fixtures/dashboard.fixtures.js

const { test: base, expect } = require('@playwright/test');

const { 
  AuthHelper,
  DashboardPage,
  ModalHelper,
  TestDataManager,
  TechnicianDashboardPage,
  EditCompanyScorePage,
  TechnicianProfilePage,
  LeaderboardHelper,
  ProductionMetricsPage,
  ProductionMetricModal,
  DeleteConfirmationModal,
  ProductionMetricsTestData
} = require('../utils/helpers');

// Extend Playwright base test with our helpers
const test = base.extend({
  auth: async ({ page }, use) => {
    await use(new AuthHelper(page));
  },
  dashboard: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  modal: async ({ page }, use) => {
    await use(new ModalHelper(page));
  },
  testData: async ({}, use) => {
    await use(new TestDataManager());
  },
  techDashboard: async ({ page }, use) => {
    await use(new TechnicianDashboardPage(page));
  },
  editCompanyScore: async ({ page }, use) => {
    await use(new EditCompanyScorePage(page));
  },
  techProfile: async ({ page }, use) => {
    await use(new TechnicianProfilePage(page));
  },
  leaderboard: async ({ page }, use) => {
    await use(new LeaderboardHelper(page));
  },
  productionMetrics: async ({ page }, use) => {
    await use(new ProductionMetricsPage(page));
  },
  productionMetricModal: async ({ page }, use) => {
    await use(new ProductionMetricModal(page));
  },
  deleteConfirmation: async ({ page }, use) => {
    await use(new DeleteConfirmationModal(page));
  },
  productionMetricsTestData: async ({}, use) => {
    await use(new ProductionMetricsTestData());
  }
});

module.exports = { test, expect };
