import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ 
    isSignedIn: true, 
    user: { id: 'test-user', emailAddresses: [{ emailAddress: 'test@example.com' }] },
    isLoaded: true 
  }),
  SignedIn: ({ children: _children }: { children: React.ReactNode }) => _children,
  SignedOut: ({ children: _children }: { children: React.ReactNode }) => null,
  useClerk: () => ({
    signOut: vi.fn(),
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
  }),
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
  };
});

// Mock fetch
(global as any).fetch = vi.fn();



// Set test environment
(process as any).env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Suppress specific console warnings in tests
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('componentWillReceiveProps has been renamed')
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};
