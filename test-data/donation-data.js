// Test data constants
const DonationConstants = {
  amounts: {
    valid: '10.00',
    belowMinimum: '0.50'
  },
  
  donationTypes: {
    ownMoney: 'Yes, this donation is my own money',
    fundraising: 'No, I am fundraising'
  },
  
  motivations: {
    inMemory: 'In memory of someone',
    celebration: 'In celebration',
    general: 'I just want to support your work'
  },
  
  cancerTypes: {
    bowel: 'Bowel cancer',
    breast: 'Breast cancer',
    lung: 'Lung cancer'
  },
  
  cards: {
    validVisa: '4000000000001000',
    invalidCard: '4000000000000000'
  },
  
  expiry: {
    valid: '12/25', // December 2025 (MM/YY format)
    expired: '12/20' // December 2020
  }
};

const donationTestData = {
  validDonation: {
    amount: DonationConstants.amounts.valid,
    donationType: DonationConstants.donationTypes.ownMoney,
    motivation: DonationConstants.motivations.inMemory,
    cancerType: DonationConstants.cancerTypes.bowel,
    firstname: 'Tester',
    lastname: "O'Doh-erty",
    email: 'auto-pws@cancer.org.uk',
    phone: '07999999999',
    homeAddress: {
      address1: '37 The Rowans',
      address2: '',
      address3: '',
      town: 'Woking',
      postcode: 'GU22 7SS',
      country: 'United Kingdom',
    },
    emailOptIn: 'no',
    cardNumber: DonationConstants.cards.validVisa,
    cvv: '123',
    cardExpiry: DonationConstants.expiry.valid,
    giftaid: 'yes',
  },
  
  invalidDonation: {
    amount: DonationConstants.amounts.belowMinimum,
    email: 'invalid-email',
    cardNumber: DonationConstants.cards.invalidCard,
  }
};

module.exports = { donationTestData, DonationConstants };
