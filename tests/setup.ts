import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATABASE_URL = 'mysql://root:password@localhost:3306/test_dashboard_db';
process.env.NODE_ENV = 'test';

// Increase timeout for database operations
jest.setTimeout(30000);
