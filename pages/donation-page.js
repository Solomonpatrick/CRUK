const { BasePage } = require('./base-page');
const { TestConfig } = require('../config/test-config');
const { expect } = require('@playwright/test');

class DonationPage extends BasePage {
  constructor(page) {
    super(page);
    this.initializeSelectors();
  }

  initializeSelectors() {
    // Amount section - using exact working selectors
    this.amountButtons = this.page.locator('[data-testid="amount-button"], button[role="button"]:has-text("£")');
    this.otherAmountInput = this.page.getByLabel(/Other amount/i);
    
    // Donation type section - using exact working selectors
    this.ownMoneyRadio = this.page.getByRole('radio', { name: /own money/i });
    this.fundraisingRadio = this.page.getByRole('radio', { name: /fundraising/i });
    
    // Motivation section - using exact working selectors
    this.motivationSelect = this.page.getByRole('combobox').first();
    
    // Cancer type section - using exact working approach from original
    this.cancerTypeRadio = this.page.getByRole('radio', { name: /choose a cancer type/i });
    
    // Navigation
    this.continueButton = this.page.getByRole('button', { name: /Continue/i }).and(this.page.locator('button[type="submit"]'));
    
    // Cookie consent selectors - comprehensive list for OneTrust
    this.cookieSelectors = [
      'button:has-text("OK, continue to site")',
      'button:has-text("Accept All")',
      'button:has-text("Accept all cookies")',
      'button:has-text("I accept")',
      'button:has-text("Accept")',
      'button:has-text("Continue")',
      '[data-cy="accept-cookies"]',
      '#accept-cookies',
      '#onetrust-accept-btn-handler',
      '.ot-sdk-show-settings',
      'button[aria-label*="accept"]',
      '.onetrust-close-btn-handler'
    ];
  }

  async navigateTo() {
    await this.page.goto(TestConfig.urls.donation);
    await expect(this.page).toHaveTitle(/Support us.*Cancer Research UK/i);
    await this.handleCookieConsent();
  }

  async handleCookieConsent() {
    // Wait a bit for cookie popup to appear
    await this.page.waitForTimeout(2000);
    
    for (const selector of this.cookieSelectors) {
      try {
        const button = this.page.locator(selector);
        if (await this.isElementVisible(button, TestConfig.timeouts.short)) {
          await this.clickElement(button);
  
          
          // Wait for overlay to disappear
          await this.page.waitForTimeout(1000);
          
          // Check if overlay is gone
          const overlay = this.page.locator('#onetrust-consent-sdk, .onetrust-pc-dark-filter');
          await overlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          
          return;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
    
    // Force close any remaining overlays
    try {
      const overlay = this.page.locator('#onetrust-consent-sdk');
      if (await this.isElementVisible(overlay, 2000)) {
        await this.page.evaluate(() => {
          const sdk = document.getElementById('onetrust-consent-sdk');
          if (sdk) sdk.style.display = 'none';
        });

        return;
      }
    } catch (error) {
      // Ignore
    }
    

  }

  async selectAmount(amount) {
    // Try to find a predefined amount button first
    const amountButton = this.amountButtons.filter({ hasText: `£${amount}` });
    
    if (await this.isElementVisible(amountButton)) {
      await this.clickElement(amountButton);
    } else {
      // Use other amount input
      await this.fillElement(this.otherAmountInput, amount);
    }
    

  }

  async selectDonationType(donationType) {
    // Use the EXACT working code from the original donation.spec.js but with force due to overlay interception
    if (/own money/i.test(donationType)) {
      await this.ownMoneyRadio.check({ force: true });
    } else {
      await this.fundraisingRadio.check({ force: true });
    }
    

  }

  async selectMotivation(motivation) {
    // Use the EXACT working code from the original donation.spec.js
    await this.motivationSelect.scrollIntoViewIfNeeded();
    await this.motivationSelect.selectOption({ label: motivation });
    

  }

  async selectCancerType(cancerType) {
    // Use the EXACT working code from the original donation.spec.js but with force due to overlay interception
    await this.cancerTypeRadio.check({ force: true });
    
    
    // Use the exact selectOptionByLabel approach from the original - the combobox label is unique
    const combo = this.page.getByRole('combobox', { name: /Select a cancer type or research area/i });
    await combo.waitFor({ state: 'visible', timeout: 5000 });
    await combo.selectOption({ label: cancerType });
    

  }

  async fillDonationDetails(donationData) {
    await this.selectAmount(donationData.amount);
    await this.selectDonationType(donationData.donationType);
    await this.selectMotivation(donationData.motivation);
    await this.selectCancerType(donationData.cancerType);
    

  }

  async continueToNextStep() {
    await this.clickElement(this.continueButton);
    await this.waitForPageLoad();
  }

  async hasValidationErrors() {
    // Check for various types of validation error messages
    const errorLocator = this.page.locator('[role="alert"]')
      .or(this.page.getByText(/required/i))
      .or(this.page.getByText(/minimum/i));
    
    return await errorLocator.count() > 0;
  }
}

module.exports = { DonationPage };