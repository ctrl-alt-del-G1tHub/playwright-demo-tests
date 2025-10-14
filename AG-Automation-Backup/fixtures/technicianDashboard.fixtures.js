const { test: base } = require('@playwright/test');
const { AuthHelper, TechnicianDashboardPage, LeaderboardHelper } = require('../utils/helpers');

const test = base.extend({
  techDashboard: async ({ page }, use) => {
    const auth = new AuthHelper(page);
    await auth.loginAsAdmin();
    
    const leaderboard = new LeaderboardHelper(page);
    await leaderboard.openTechnicianDashboard('tech-001');
    
    const dashboard = new TechnicianDashboardPage(page);
    await dashboard.waitForLoad();
    
    await use(dashboard); // provide this object to tests
  }
});

module.exports = { test };
