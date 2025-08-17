// Jest setup file for server tests
// Jest globals are automatically available in test environment

// Set required environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.NODE_ENV = 'test';

// Silence Prisma warnings in tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (args[0]?.includes?.('Prisma') || args[0]?.includes?.('prisma')) {
    return;
  }
  originalWarn(...args);
};

// Silence console.error for expected test errors
const originalError = console.error;
console.error = (...args: any[]) => {
  // Allow specific error messages that are expected in tests
  const message = args[0];
  if (typeof message === 'string' && (
    message.includes('prisma.task.findFirst is not a function') ||
    message.includes('prisma.task.deleteMany is not a function') ||
    message.includes('prisma.subtask.findFirst is not a function') ||
    message.includes('prisma.subtask.deleteMany is not a function')
  )) {
    return;
  }
  originalError(...args);
};
