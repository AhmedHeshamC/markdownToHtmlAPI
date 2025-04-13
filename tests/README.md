# Testing Documentation

This directory contains tests for the Markdown Notes API. The testing stack includes:

- **Mocha**: Test runner
- **Chai**: Assertion library
- **Sinon**: For stubs, spies, and mocks
- **Supertest**: For HTTP testing

## Test Structure

- **/unit**: Unit tests for individual components
- **/integration**: Integration tests for API endpoints
- **/utils**: Helper utilities for testing
- **test.config.js**: Test environment configuration

## Setup for Testing

1. Create test database:
   ```
   mysql -u root -p < tests/db_test_schema.sql
   ```

2. Run tests:
   ```
   npm test
   ```

## Writing Tests

### Unit Tests
Unit tests should focus on testing individual functions or modules in isolation.

### Integration Tests
Integration tests verify that different parts of the application work together correctly.

### Best Practices
- Keep tests independent
- Clean up test data after tests
- Use descriptive test names
- Test both positive and negative cases
