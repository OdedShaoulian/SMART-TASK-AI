# Testing Guide for SmartTask AI

This document provides comprehensive information about the testing setup for the SmartTask AI project, including unit tests, end-to-end tests, and CI/CD pipeline configuration.

## Table of Contents

- [Overview](#overview)
- [Unit Tests](#unit-tests)
- [End-to-End Tests](#end-to-end-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Running Tests Locally](#running-tests-locally)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)

## Overview

The SmartTask AI project uses a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test API endpoints and database interactions
- **End-to-End Tests**: Test complete user workflows using Playwright
- **CI/CD Pipeline**: Automated testing and deployment using GitHub Actions

## Unit Tests

### Server Tests

The server uses Jest as the testing framework with TypeScript support.

#### Test Structure

```
server/
├── src/
│   ├── tests/
│   │   ├── taskApi.test.ts      # API endpoint tests
│   │   ├── taskController.test.ts # Controller unit tests
│   │   └── taskService.test.ts  # Service layer tests
│   ├── controllers/
│   ├── services/
│   └── routes/
└── jest.config.js
```

#### Running Server Tests

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- taskController.test.ts
```

#### Test Categories

1. **Controller Tests** (`taskController.test.ts`)
   - Test HTTP request/response handling
   - Validate input validation
   - Test error handling
   - Mock service layer dependencies

2. **Service Tests** (`taskService.test.ts`)
   - Test business logic
   - Mock database operations
   - Test data transformation
   - Validate error scenarios

3. **API Tests** (`taskApi.test.ts`)
   - Test complete API endpoints
   - Validate HTTP status codes
   - Test request/response formats
   - Integration with Express middleware

### Client Tests

The client uses Vitest with React Testing Library for component testing.

#### Test Structure

```
client/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       └── Dashboard.test.tsx
│   ├── services/
│   │   └── __tests__/
│   │       └── api.test.ts
│   └── test/
│       └── setup.ts
├── vitest.config.ts
└── package.json
```

#### Running Client Tests

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

#### Test Categories

1. **Component Tests** (`Dashboard.test.tsx`)
   - Test component rendering
   - Test user interactions
   - Test state management
   - Test API integration
   - Test error handling

2. **Service Tests** (`api.test.ts`)
   - Test API service methods
   - Mock fetch requests
   - Test error handling
   - Validate request/response formats

## End-to-End Tests

E2E tests use Playwright to test complete user workflows across multiple browsers.

### Test Structure

```
e2e/
├── tests/
│   ├── auth.spec.ts      # Authentication flows
│   └── dashboard.spec.ts # Dashboard functionality
├── playwright.config.ts
└── package.json
```

### Running E2E Tests

```bash
# Navigate to e2e directory
cd e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test auth.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium
```

### Test Categories

1. **Authentication Tests** (`auth.spec.ts`)
   - Test sign up flow
   - Test sign in flow
   - Test sign out flow
   - Test authentication state management
   - Test responsive design

2. **Dashboard Tests** (`dashboard.spec.ts`)
   - Test dashboard loading
   - Test task management
   - Test statistics display
   - Test navigation
   - Test error handling

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

### Workflow Files

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push to main/develop and pull requests
   - Executes server tests, client tests, linting, and builds
   - Includes security scanning and type checking
   - Runs E2E tests with database setup

2. **Deployment** (`.github/workflows/deploy.yml`)
   - Deploys to staging on develop branch
   - Deploys to production on main branch
   - Includes rollback functionality
   - Supports manual deployment triggers

3. **Test Coverage** (`.github/workflows/test-coverage.yml`)
   - Generates coverage reports
   - Uploads to Codecov
   - Comments coverage on pull requests
   - Enforces coverage thresholds

### Pipeline Stages

1. **Server Tests**
   - Unit tests with Jest
   - Integration tests with database
   - Coverage reporting

2. **Client Tests**
   - Component tests with Vitest
   - Service tests
   - Coverage reporting

3. **Linting**
   - ESLint for code quality
   - TypeScript type checking

4. **Build**
   - Server build
   - Client build
   - Artifact upload

5. **E2E Tests**
   - Playwright tests
   - Multiple browser testing
   - Screenshot and video capture

6. **Security Scan**
   - npm audit for vulnerabilities
   - Dependency scanning

## Running Tests Locally

### Prerequisites

1. **Node.js 18+**
2. **MySQL 8.0+** (for server tests)
3. **Git**

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-ai
   ```

2. **Install dependencies**
   ```bash
   # Server dependencies
   cd server
   npm install

   # Client dependencies
   cd ../client
   npm install

   # E2E dependencies
   cd ../e2e
   npm install
   ```

3. **Setup database**
   ```bash
   cd ../server
   npm run db:generate
   npm run db:push
   ```

4. **Install Playwright browsers**
   ```bash
   cd ../e2e
   npx playwright install
   ```

### Running All Tests

```bash
# Start the development server
cd server
npm run dev &

# In another terminal, run server tests
cd server
npm test

# Run client tests
cd client
npm test

# Run E2E tests
cd e2e
npm test
```

## Test Coverage

### Coverage Requirements

- **Line Coverage**: 80% minimum
- **Function Coverage**: 80% minimum
- **Branch Coverage**: 70% minimum

### Coverage Reports

Coverage reports are generated automatically and available:

1. **Local Coverage**
   - Server: `server/coverage/`
   - Client: `client/coverage/`

2. **CI Coverage**
   - Codecov integration
   - PR comments with coverage
   - Coverage thresholds enforcement

### Viewing Coverage

```bash
# Server coverage
cd server
npm test -- --coverage
open coverage/lcov-report/index.html

# Client coverage
cd client
npm run test:coverage
open coverage/lcov-report/index.html
```

## Best Practices

### Writing Tests

1. **Test Structure**
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)
   - Keep tests focused and isolated
   - Use meaningful assertions

2. **Mocking**
   - Mock external dependencies
   - Use realistic test data
   - Avoid over-mocking
   - Test error scenarios

3. **Coverage**
   - Aim for high coverage but focus on quality
   - Test edge cases and error conditions
   - Don't test implementation details
   - Test user-facing functionality

### Test Data

1. **Fixtures**
   - Use consistent test data
   - Create reusable fixtures
   - Clean up test data after tests

2. **Factories**
   - Use factory functions for test objects
   - Generate realistic test data
   - Support customization for specific tests

### Performance

1. **Test Speed**
   - Use parallel test execution
   - Minimize database operations
   - Use in-memory databases for tests
   - Mock slow operations

2. **Resource Management**
   - Clean up resources after tests
   - Use test containers for external services
   - Implement proper teardown

### Maintenance

1. **Test Maintenance**
   - Keep tests up to date with code changes
   - Refactor tests when needed
   - Remove obsolete tests
   - Document test requirements

2. **CI/CD Integration**
   - Monitor test failures
   - Set up notifications for test failures
   - Maintain test environment consistency
   - Regular dependency updates

## Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Ensure MySQL is running
   sudo service mysql start

   # Check database URL
   echo $DATABASE_URL
   ```

2. **Test Failures**
   ```bash
   # Clear Jest cache
   npm test -- --clearCache

   # Clear Vitest cache
   npm test -- --clearCache
   ```

3. **Playwright Issues**
   ```bash
   # Reinstall browsers
   npx playwright install

   # Update Playwright
   npm update @playwright/test
   ```

### Getting Help

1. **Documentation**
   - Jest: https://jestjs.io/docs/getting-started
   - Vitest: https://vitest.dev/guide/
   - Playwright: https://playwright.dev/docs/intro
   - React Testing Library: https://testing-library.com/docs/react-testing-library/intro/

2. **Community**
   - GitHub Issues
   - Stack Overflow
   - Discord/Slack channels

## Contributing

When contributing to the project:

1. **Write tests** for new features
2. **Update tests** when modifying existing code
3. **Ensure tests pass** before submitting PRs
4. **Maintain test coverage** above thresholds
5. **Follow testing best practices**

For more information about contributing, see the main README.md file.
