const { test: baseTest, expect } = require('@playwright/test');
const { DonationPage } = require('../pages/donation-page');

// Create custom test with donation-specific fixtures
const test = baseTest.extend({
  // Fixture for a donation page that's already navigated
  donationPage: async ({ page }, use) => {
    const donationPage = new DonationPage(page);
    await donationPage.navigateTo();
    await use(donationPage);
    // Cleanup happens automatically - no need for manual browser closure
  },

  // Fixture for a logged-in user (if needed)
  loggedInPage: async ({ page }, use) => {
    // Login logic here
    await page.goto('/login');
    // ... login steps ...
    await use(page);
    // Automatic cleanup
  }
});

module.exports = { test, expect };