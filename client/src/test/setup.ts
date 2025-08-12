import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
    isLoaded: true,
    isSignedIn: true,
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  SignedOut: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  SignInButton: ({ children }: { children: React.ReactNode }) => React.createElement('button', null, children),
  SignUpButton: ({ children }: { children: React.ReactNode }) => React.createElement('button', null, children),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock API service
vi.mock('../services/api', () => ({
  apiService: {
    getTasks: vi.fn(),
    getTask: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    createSubtask: vi.fn(),
    updateSubtask: vi.fn(),
    deleteSubtask: vi.fn(),
  },
}));
