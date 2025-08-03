const { BasePage } = require('./base-page');
const { TestConfig } = require('../config/test-config');

class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
    this.initializeSelectors();
  }

  initializeSelectors() {
    // Payment method - using exact working selectors
    this.cardRadio = this.page.getByRole('radio', { name: /Credit.*Debit card/i });
    
    // Card details - using specific IDs from iframe structure
    this.cardholderNameInput = this.page.getByLabel(/Cardholder name/i);
    this.cardNumberFrame = this.page.frameLocator('iframe').first();
    this.cardNumberInput = this.cardNumberFrame.locator('#credit-card-number');
    this.expiryFrame = this.page.frameLocator('iframe').nth(1);
    this.expiryInput = this.expiryFrame.locator('#expiration');
    this.cvvFrame = this.page.frameLocator('iframe').nth(2);
    this.cvvInput = this.cvvFrame.locator('#cvv');
    
    // Gift Aid - using exact working selector
    this.giftAidCheckbox = this.page.getByRole('checkbox', { 
      name: /claim Gift Aid on my donation/i 
    });
    
    // Submit button - using exact working selector
    this.completeButton = this.page.getByRole('button', { name: /Complete.*donation/i });
    
    // Error selectors
    this.paymentErrorAlert = this.page.locator('[role="alert"]').filter({ 
      hasText: TestConfig.errorMessages.paymentBlocked 
    });
  }

  async selectCardPayment() {
    await this.retryAction(async () => {
      await this.waitForElement(this.cardRadio);
      await this.clickElement(this.cardRadio);
    }, 3);
    

  }

  async fillCardDetails(paymentData, personalData) {
    await this.selectCardPayment();
    await this.page.waitForTimeout(1000);
    
    // Fill in card details using EXACT working approach from original
    await this.cardNumberInput.fill(paymentData.cardNumber);
    
    // Cardholder name should match the billing name; here we combine first and last name
    const fullName = `${personalData.firstname} ${personalData.lastname}`;
    await this.cardholderNameInput.fill(fullName);
    
    await this.expiryInput.fill(paymentData.cardExpiry);
    await this.cvvInput.fill(paymentData.cvv);
    

  }

  async setGiftAid(giftAid) {
    const shouldBeChecked = giftAid.toLowerCase() === 'yes';
    const isChecked = await this.giftAidCheckbox.isChecked();
    
    if (shouldBeChecked !== isChecked) {
      await this.clickElement(this.giftAidCheckbox);
    }
    

  }

  async completePayment(paymentData, personalData) {
    await this.fillCardDetails(paymentData, personalData);
    await this.setGiftAid(paymentData.giftaid);

  }

  setupApiMonitoring() {
    const capturedResponses = [];
    
    const responseListener = (response) => {
      const url = response.url();
      const method = response.request().method();
      const status = response.status();
      
      capturedResponses.push(response);
    };
    
    this.page.on('response', responseListener);
    
    return {
      cleanup: () => this.page.off('response', responseListener),
      responses: capturedResponses
    };
  }

  async waitForTransactionApi() {
    return this.page.waitForResponse(response => {
      const url = response.url().toLowerCase();
      const isSuccessful = response.ok();
      
      const isCrukTransactionApi = url.includes(TestConfig.api.crukDomain) && 
                                  url.includes(TestConfig.api.transactionEndpoint);
      
      const isDonationApi = isSuccessful && 
                           url.includes('donation') && 
                           !url.includes(TestConfig.api.braintreePattern) && 
                           !url.includes(TestConfig.api.analyticsPattern);
      
      if (isCrukTransactionApi || isDonationApi) {
        return true;
      }
      
      return false;
    }, { timeout: TestConfig.timeouts.long });
  }

  async submitDonation() {

    
    const monitoring = this.setupApiMonitoring();
    
    try {
      // Set up API monitoring
      const transactionApiPromise = this.waitForTransactionApi().catch(() => null);
      
      // Click submit button

      await this.clickElement(this.completeButton);
      
      // Wait for processing
      await this.page.waitForTimeout(3000);
      
      // Check for payment errors
      const hasPaymentError = await this.isElementVisible(this.paymentErrorAlert, TestConfig.timeouts.short);
      
      // Wait for either API response or navigation
      const result = await Promise.race([
        transactionApiPromise.then(response => ({ type: 'transaction', response })),
        this.page.waitForURL(TestConfig.urls.thanks, { timeout: TestConfig.timeouts.long })
                 .then(() => ({ type: 'navigation' })),
        this.paymentErrorAlert.waitFor({ state: 'visible', timeout: TestConfig.timeouts.short })
                             .then(() => ({ type: 'error' }))
      ]).catch(() => ({ type: 'timeout' }));
      

      
      if (result.type === 'error' || hasPaymentError) {
        const errorText = await this.paymentErrorAlert.textContent().catch(() => 'Unknown error');

        throw new Error(`Payment was rejected: ${errorText}`);
      }
      
      // If we navigated to thanks page, look for relevant API response
      if (result.type === 'navigation') {

        
        for (const response of monitoring.responses) {
          const url = response.url();
          if (url.includes(TestConfig.api.crukDomain) && url.includes(TestConfig.api.transactionEndpoint)) {

            return response;
          }
        }
      }
      
      return result.response || null;
      
    } finally {
      monitoring.cleanup();
    }
  }
}

module.exports = { PaymentPage };