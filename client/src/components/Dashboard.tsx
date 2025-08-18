import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook to get the current user's information
import { useState, useEffect } from 'react'; // Import React's useState and useEffect hooks
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom for navigation
import { Plus, CheckSquare, Clock, TrendingUp, Brain } from 'lucide-react'; // Import icons from lucide-react
import type { Task } from '../types'; // Import Task type for TypeScript type checking
import { apiService } from '../services/api'; // Import the API service for making requests

export default function Dashboard() {
  // Get the currently signed-in user from Clerk
  const { user } = useUser();

  // State for tasks, loading, and error handling
  const [tasks, setTasks] = useState<Task[]>([]);  // State to hold the list of tasks
  const [loading, setLoading] = useState(true);  // Loading state to show spinner while tasks are being fetched
  const [error, setError] = useState<string | null>(null);  // Error state to display an error message if fetching tasks fails

  // Load tasks when the user is available (user changes or component mounts)
  useEffect(() => {
    if (user && user.id) {  // Ensure user is available and has an ID
      // Log the userId from Clerk to verify it's correctly passed
      console.log('User ID from Clerk:', user.id);  // Log the userId to ensure it's being passed correctly
      loadTasks(user.id);  // Pass userId to the loadTasks function to fetch tasks
    }
  }, [user]);  // Only reload tasks if user changes

  // Fetch tasks from the backend using the logged-in user's ID
  const loadTasks = async (userId: string) => {
    try {
      // Log the userId before making the API request
      console.log('Making API request with user ID:', userId);  // Log userId before calling API
      setLoading(true);  // Set loading state to true while fetching tasks
      const fetchedTasks = await apiService.getTasks();  // Fetch tasks using the userId
      setTasks(fetchedTasks);  // Set the fetched tasks to the state
    } catch (err) {
      setError('Failed to load tasks');  // If an error occurs, set the error state
      console.error('Error loading tasks:', err);  // Log the error to the console for debugging
    } finally {
      setLoading(false);  // Set loading state to false after the task fetch is complete
    }
  };

  // Derive statistics from the tasks list
  const completedTasks = (tasks || []).filter(task => task.completed);  // Filter completed tasks
  const pendingTasks = (tasks || []).filter(task => !task.completed);  // Filter pending tasks
  const totalSubtasks = (tasks || []).reduce((sum, task) => sum + (task.subtasks?.length || 0), 0);  // Calculate total subtasks

  // Loading state UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" data-testid="loading-spinner"></div>  // Spinner for loading state
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>  // Show error message if tasks failed to load
        <button onClick={() => loadTasks(user?.id as string)} className="btn-primary">  // Retry button
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Let's make today productive with SmartTask AI</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <CheckSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Subtasks</p>
              <p className="text-2xl font-semibold text-gray-900">{totalSubtasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/tasks/new" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plus className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Create New Task</span>
          </Link>
          <Link to="/tasks" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <CheckSquare className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">View All Tasks</span>
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      {tasks.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async () => {
                      try {
                        const userId = user?.id;  // This safely gets user.id or undefined if user is null or undefined
                        if (userId) {
                          await apiService.updateTask(task.id, { completed: !task.completed },);  // Pass userId to updateTask
                          loadTasks(userId); // Reload tasks after updating
                        } else {
                          console.error('User ID is not available');
                        }
                      } catch (err) {
                        console.error('Error updating task:', err);
                      }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {task.subtasks?.length || 0} subtasks
                </div>
              </div>
            ))}
          </div>
          {tasks.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium">
                View all {tasks.length} tasks →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first task</p>
          <Link to="/tasks/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Task
          </Link>
        </div>
      )}
    </div>
  );
}
