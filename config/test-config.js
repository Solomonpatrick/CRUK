// Test configuration and constants
const TestConfig = {
  // URLs
  urls: {
    donation: 'https://app.pws.int.cruk.org/support-us/your-donation',
    thanks: /thanks/i,
    payment: /payment/i
  },

  // Timeouts (in milliseconds)
  timeouts: {
    default: 30000,
    long: 45000,
    short: 5000,
    element: 10000,
    navigation: 30000
  },

  // API patterns
  api: {
    crukDomain: 'cruk.org',
    transactionEndpoint: '/transaction',
    braintreePattern: 'braintree',
    analyticsPattern: 'analytics'
  },

  // Reference patterns
  referencePatterns: {
    general: /[A-Z0-9]{6,}/,
    eightChar: /\b[A-Z0-9]{8}\b/,
    sevenCharWithOne: /\b1[A-Z0-9]{7}\b/
  },

  // Error messages
  errorMessages: {
    paymentBlocked: /sorry.*can't process.*payment/i,
    validationError: /please|required|invalid/i
  },

  // Test data keys
  testDataKeys: {
    reference: 'reference',
    transactionReference: 'transactionReference', 
    donationReference: 'donationReference',
    id: 'id',
    transactionId: 'transactionId'
  }
};

module.exports = { TestConfig };