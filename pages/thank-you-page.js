const { BasePage } = require('./base-page');
const { TestConfig } = require('../config/test-config');
const { expect } = require('@playwright/test');

class ThankYouPage extends BasePage {
  constructor(page) {
    super(page);
    this.initializeSelectors();
  }

  initializeSelectors() {
    // Reference selectors
    this.referenceText = this.page.getByText(/your reference number is/i);
    this.referenceElement = this.page.locator('text=/Your reference number is [A-Z0-9]{6,}/i');
    
    // Page elements
    this.thankYouMessage = this.page.getByRole('heading', { name: /thank you/i });
    this.donationAmount = this.page.locator('.donation-amount, [data-cy*="amount"]');
  }

  async waitForPageLoad() {
    await expect(this.page).toHaveURL(TestConfig.urls.thanks, { 
      timeout: TestConfig.timeouts.navigation 
    });
    await this.waitForElement(this.thankYouMessage);

  }

  async getTransactionReference() {
    await this.waitForPageLoad();
    
    try {
      const text = await this.referenceText.textContent();
      const match = text && text.match(TestConfig.referencePatterns.general);
      
      if (match) {
  
        return match[0];
      }
      

      return null;
      
    } catch (error) {

      return null;
    }
  }

  async getDonationAmount() {
    try {
      const amountElement = this.donationAmount.first();
      if (await this.isElementVisible(amountElement)) {
        return await amountElement.textContent();
      }
    } catch (error) {

    }
    return null;
  }

  async verifyPageElements() {
    await this.waitForPageLoad();
    
    const checks = [
      { element: this.thankYouMessage, name: 'Thank you message' },
      { element: this.referenceText, name: 'Reference number' }
    ];
    
    const results = {};
    
    for (const check of checks) {
      try {
        results[check.name] = await this.isElementVisible(check.element);
      } catch (error) {
        results[check.name] = false;
      }
    }
    
    return results;
  }
}

module.exports = { ThankYouPage };