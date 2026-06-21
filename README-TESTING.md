# NEXORA TECH Testing Strategy & Architecture

## Overview
Nexora Tech's testing strategy follows the testing pyramid principles, ensuring the system is robust, secure, and ready for enterprise scale. 

We utilize a comprehensive suite of tools spanning from backend unit testing to full end-to-end automation.

### Tools Stack
* **Unit & Integration (Backend):** Jest + Supertest
* **Component Testing (Frontend):** React Testing Library + Jest (jsdom)
* **End-to-End (E2E):** Cypress
* **API Testing:** Postman & Newman
* **CI/CD:** GitHub Actions

---

## 1. Directory Structure

\`\`\`text
nexora/
├── tests/
│   ├── backend/            # Backend unit & integration tests
│   │   ├── auth.test.ts
│   │   ├── api.test.ts
│   │   └── security.test.ts
│   ├── frontend/           # React Component Tests
│   │   └── PortalDashboard.test.tsx
│   ├── postman/            # Postman Collections for API
│   └── setupTests.ts       # RTL Global Setup
├── cypress/
│   ├── e2e/                # End to End test specifications
│   │   └── auth.cy.ts
│   ├── fixtures/           # Mock data
│   └── support/            # Custom cypress commands
├── jest.config.js          # Shared Jest config
├── cypress.config.ts       # Cypress Config
└── .github/workflows/      
    └── test.yml            # CI/CD Pipeline
\`\`\`

## 2. Test Environments

### Unit and Integration Tests (Jest)
Run backend and component tests easily:
\`npm run test\` - Runs the full suite
\`npm run test:watch\` - Auto-reruns tests on save
\`npm run test:coverage\` - Generates an HTML coverage report in \`/coverage\`

*Goal:* Minimum 85% Code Coverage.

### End-To-End Tests (Cypress)
Cypress validates critical user journeys in a real browser.
\`npm run cypress:open\` - Opens the Cypress UI runner
\`npm run cypress:run\` - Runs headless (used in CI)

## 3. Best Practices Supported

* **Isolate Secrets:** Tests use a separate \`nexora_test_db\` database inside Docker during CI/CD to prevent modifying actual databases.
* **Component Isolation:** Frontend tests use \`@testing-library/react\` to verify user interactions instead of internal component state, ensuring UI changes don't unnecessarily break tests.
* **Secure API Coverage:** Using Supertest, backend endpoints are verified for schema structure and error handling (401 Unauthorized, 400 Bad Request, etc.). No real emails or Stripe charges are executed during test scenarios.
* **Security Validation:** API Tests check for the presence of proper Helmet security headers and validate boundary logic (e.g., payload size limits to mitigate DoS).

## 4. CI/CD Integration
GitHub Actions (\`.github/workflows/test.yml\`) automatically provisions a Postgres container and triggers on every Push or Pull Request to \`main\` and \`develop\`.

It ensures:
1. Linting & build step validation
2. 100% test scenario passes
3. Schema migrations execute successfully on the mock database before moving to staging.
