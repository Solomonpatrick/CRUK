# Cancer Research UK Donation Tests

This project tests the online donation system for Cancer Research UK to make sure everything works correctly.

## What This Does

These automated tests check that:
- ✅ People can make £10 donations online
- ✅ All form fields work properly  
- ✅ Payment processing works
- ✅ Transaction references match between the system and confirmation page
- ✅ The donation form works in different web browsers

## 📋 Prerequisites

Before running the tests, make sure you have:

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Internet connection** - Tests run against live environment
- **Modern web browsers** - Chrome, Firefox, Safari (automatically installed by Playwright)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Verify Installation
```bash
npx playwright --version
```

## How to Run the Tests

### Run All Tests
```bash
npx playwright test
```

### Run Tests with Live Browser (Non-Headless)
```bash
HEADED=true npx playwright test
```

### See Detailed Output
```bash
npx playwright test --reporter=list
```

### Test Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Single Test File
```bash
npx playwright test tests/donation.spec.js
```

### Run Specific Test
```bash
npx playwright test -g "Make a £10 donation"
```

### Debug Mode (Step Through Tests)
```bash
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

### Report Files Generated:
- `playwright-report/index.html` - Visual HTML report
- `test-results.json` - Machine-readable test results
- `results.xml` - JUnit format for CI/CD integration


## Important Assumptions & Notes

### Test Data Assumptions
1. **Fixed Test Data**: Tests use predefined test data from `test-data/donation-data.js`
2. **Test Card Details**: Uses Visa test card `4000000000001000` with CVV `123` and expiry `12/25`
3. **Test Address**: Uses a fixed UK address in Woking
4. **Test Amount**: Always tests £10 donations

### Environment Assumptions
1. **Internet Access**: Tests require connection to CRUK's internal test environment
2. **Test Environment Availability**: Assumes `app.pws.int.cruk.org` is accessible and functional
3. **Payment Processing**: Assumes test payment gateway is configured and working
4. **HTTPS**: Ignores HTTPS certificate errors for testing environment

### Browser Assumptions
1. **Automated Installation**: Playwright will download required browser versions
2. **Permissions**: Tests may require permissions for file downloads/screenshots
3. **Cross-Browser**: Same test logic works across Chrome, Firefox, and Safari

### Network Assumptions
1. **API Responses**: Tests expect specific API response formats for transaction references
2. **Page Load Times**: Assumes reasonable network speeds for page loading
3. **External Dependencies**: May depend on third-party services (payment processors, analytics)


## 📁 Project Structure

```
CRUK_Task/
├── config/               # Test configuration files
├── pages/               # Page Object Model classes
├── tests/               # Test specification files
├── test-data/           # Test data and constants
├── utils/               # Helper functions and utilities
├── reports/             # Test reports and results
├── playwright.config.js # Playwright configuration
└── README.md           # This file
```
