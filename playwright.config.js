// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',       // Where your test files live
  timeout: 30 * 1000,       // Each test can run up to 30 seconds
  retries: 0,               // Number of retries on failure
  reporter: [['list'], ['html']],  // Console + HTML report
  use: {
    headless: false,        // Show browser window when tests run
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
  },
});
