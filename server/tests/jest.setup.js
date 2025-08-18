// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? '';

// Mock Prisma so tests never touch a real DB
jest.mock('@prisma/client', () => {
  const mock = {};
  return { PrismaClient: jest.fn(() => mock) };
});

// Mock Clerk
jest.mock('@clerk/clerk-sdk-node', () => ({
  clerkClient: {
    users: {
      getUser: jest.fn(() => Promise.resolve({ id: 'test-user', emailAddresses: [{ emailAddress: 'test@example.com' }] })),
    },
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Global test timeout
jest.setTimeout(10000);
