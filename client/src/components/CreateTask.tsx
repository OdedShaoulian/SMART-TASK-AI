import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Brain } from 'lucide-react';
import { apiService } from '../services/api';

export default function CreateTask() {
  // Getting the currently signed-in user from Clerk
  const { user } = useUser();
  const navigate = useNavigate();

  // State variables to manage the task creation form
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (user) {
        // Pass both task data and userId when creating the task
        await apiService.createTask({ title: title.trim() },); 
      }

      setTitle('');
      navigate('/tasks');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create task. Please try again.');
        console.error('Error creating task:', err);
      } else {
        setError('An unknown error occurred. Please try again.');
        console.error('Unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with navigation back button */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
      </div>

      {/* Form for creating a new task */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your task title..."
              className="input-field"
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Display error message if any error occurs */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* AI Suggestion Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  AI-Powered Task Breakdown
                </h3>
                <p className="text-sm text-blue-700">
                  Coming soon! SmartTask AI will automatically break down your tasks into smaller, manageable subtasks.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons for submitting the form or cancelling */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)} // Go back to the previous page
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !title.trim()}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips for effective task management */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Effective Task Management</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 font-medium">•</span>
            <span>Be specific and clear about what you want to accomplish</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 font-medium">•</span>
            <span>Break large tasks into smaller, manageable subtasks</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 font-medium">•</span>
            <span>Use action verbs to start your task descriptions</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 font-medium">•</span>
            <span>Keep tasks focused on a single outcome</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
