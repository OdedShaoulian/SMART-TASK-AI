import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'; // Import Clerk components for authentication
import { Routes, Route, Navigate } from 'react-router-dom'; // For routing in the app
import Layout from './components/Layout'; // Main layout of the app
import Dashboard from './components/Dashboard'; // Dashboard page after login
import TaskList from './components/TaskList'; // Tasks listing page
import CreateTask from './components/CreateTask'; // Page for creating a new task

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Routes and views for authenticated users */}
      <SignedIn>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/new" element={<CreateTask />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SignedIn>

      {/* Content shown to unauthenticated users */}
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="max-w-md w-full mx-auto p-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to SmartTask AI
              </h1>
              <p className="text-gray-600 mb-8">Your AI-powered productivity companion for breaking down tasks and achieving more.</p>

              <div className="space-y-4">
                <SignUpButton mode="modal">
                  <button className="w-full btn-primary">Get Started</button>
                </SignUpButton>

                <div className="text-center">
                  <span className="text-gray-500">Already have an account? </span>
                  <SignInButton mode="modal">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">Sign in</button>
                  </SignInButton>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-900 mb-2">✨ Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-powered task breakdown</li>
                  <li>• Smart subtask generation</li>
                  <li>• Progress tracking</li>
                  <li>• User-specific task management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

export default App;
