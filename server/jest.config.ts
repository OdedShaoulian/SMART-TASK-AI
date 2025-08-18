import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { 
      tsconfig: '<rootDir>/tsconfig.json'
    }],
  },
  reporters: [
    'default',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;
