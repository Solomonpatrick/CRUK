const { BasePage } = require('./base-page');
const { TestConfig } = require('../config/test-config');

class PersonalDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    this.initializeSelectors();
  }

  initializeSelectors() {
    // Personal information - using exact working selectors
    this.firstNameInput = this.page.getByLabel(/First name/i);
    this.lastNameInput = this.page.getByLabel(/Last name/i);
    this.emailInput = this.page.getByLabel(/Email address/i);
    this.phoneInput = this.page.getByLabel(/Phone number/i);
    
    // Address section - using exact working selectors
    this.enterAddressManuallyButton = this.page.getByRole('button', { name: /Enter address manually/i });
    this.addressLine1Input = this.page.getByLabel(/Address line 1/i);
    this.addressLine2Input = this.page.getByLabel(/Address line 2/i);
    this.addressLine3Input = this.page.getByLabel(/Address line 3/i);
    this.townInput = this.page.getByLabel(/Town\/?City/i);
    this.postcodeInput = this.page.getByLabel(/Postcode/i);
    this.countrySelect = this.page.getByLabel(/Country/i);
    
    // Email preferences
    this.emailPreferenceGroup = this.page.getByRole('group', { name: 'Email' });
    this.emailYesRadio = this.emailPreferenceGroup.getByRole('radio', { name: 'Yes' });
    this.emailNoRadio = this.emailPreferenceGroup.getByRole('radio', { name: 'No' });
    
    // Navigation
    this.continueButton = this.page.getByRole('button', { name: /Continue/i });
  }

  async fillPersonalInfo(personalData) {
    // Wait for the page to load and form to be ready
    await this.waitForElement(this.firstNameInput);
    
    await this.fillElement(this.firstNameInput, personalData.firstname);
    await this.fillElement(this.lastNameInput, personalData.lastname);
    await this.fillElement(this.emailInput, personalData.email);
    await this.fillElement(this.phoneInput, personalData.phone);
    

  }

  async fillAddress(addressData) {
    // Check if manual address entry is needed
    if (await this.isElementVisible(this.enterAddressManuallyButton)) {
      await this.clickElement(this.enterAddressManuallyButton);
      await this.page.waitForTimeout(1000);
    }
    
    await this.fillElement(this.addressLine1Input, addressData.address1);
    
    if (addressData.address2) {
      await this.fillElement(this.addressLine2Input, addressData.address2);
    }
    
    if (addressData.address3) {
      await this.fillElement(this.addressLine3Input, addressData.address3);
    }
    
    await this.fillElement(this.townInput, addressData.town);
    await this.fillElement(this.postcodeInput, addressData.postcode);
    
    if (addressData.country && addressData.country !== 'United Kingdom') {
      await this.selectOption(this.countrySelect, addressData.country);
    }
    

  }

  async setEmailPreference(preference) {
    const wantsEmail = preference.toLowerCase() === 'yes';
    const radio = wantsEmail ? this.emailYesRadio : this.emailNoRadio;
    
    await this.retryAction(async () => {
      await this.clickElement(radio);
    });
    

  }

  async fillPersonalDetails(personalData) {
    await this.fillPersonalInfo(personalData);
    await this.fillAddress(personalData.homeAddress);
    await this.setEmailPreference(personalData.emailOptIn);
    

  }

  async continueToPayment() {
    await this.clickElement(this.continueButton);
    await this.waitForPageLoad();

  }
}

module.exports = { PersonalDetailsPage };