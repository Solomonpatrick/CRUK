const { TestConfig } = require('../config/test-config');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // Common actions
  async waitForPageLoad(timeout = TestConfig.timeouts.default) {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async clickElement(locator, options = {}) {
    const defaultOptions = { force: true, timeout: TestConfig.timeouts.element };
    await locator.click({ ...defaultOptions, ...options });
  }

  async fillElement(locator, value, options = {}) {
    const defaultOptions = { timeout: TestConfig.timeouts.element };
    await locator.fill(value, { ...defaultOptions, ...options });
  }

  async selectOption(locator, value, options = {}) {
    const defaultOptions = { timeout: TestConfig.timeouts.element };
    await locator.selectOption({ label: value }, { ...defaultOptions, ...options });
  }

  async waitForElement(locator, options = {}) {
    const defaultOptions = { state: 'visible', timeout: TestConfig.timeouts.element };
    await locator.waitFor({ ...defaultOptions, ...options });
  }

  async retryAction(action, maxAttempts = 3, delay = 1000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;

        await this.page.waitForTimeout(delay * (attempt + 1));
      }
    }
  }

  async isElementVisible(locator, timeout = TestConfig.timeouts.short) {
    try {
      return await locator.isVisible({ timeout });
    } catch {
      return false;
    }
  }
}

module.exports = { BasePage };