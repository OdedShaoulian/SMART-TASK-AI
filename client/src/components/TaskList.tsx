import { useUser } from '@clerk/clerk-react';  // Import Clerk's user hook to get the signed-in user
import { useState, useEffect } from 'react';  // React hooks for state and side effects
import { Link } from 'react-router-dom';  // React Router Link for navigation
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, CheckSquare } from 'lucide-react';  // Icons from Lucide
import type { Task, Subtask } from '../types';  // Type definitions for Task and Subtask
import { apiService } from '../services/api';  // API service to interact with the backend

export default function TaskList() {
  const { user } = useUser();  // Get the currently signed-in user from Clerk
  const [tasks, setTasks] = useState<Task[]>([]);  // State to store the list of tasks
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState<string | null>(null);  // State for error handling
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());  // Track expanded tasks for subtasks
  const [editingTask, setEditingTask] = useState<string | null>(null);  // State for tracking the task being edited
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null);  // State for tracking the subtask being edited
  const [editTitle, setEditTitle] = useState('');  // State for the title being edited

  // useEffect hook to load tasks when the user is available
  useEffect(() => {
    if (user?.id) {
      loadTasks(user.id);  // Load tasks if user is authenticated and has an id
    }
  }, [user]);  // Reload tasks if the user changes

  // Function to load tasks from the API
  const loadTasks = async (userId: string) => {
    try {
      setLoading(true);  // Set loading state
      console.log('Making API request with user ID:', userId);  // Log the user ID for debugging
      const fetchedTasks = await apiService.getTasks();  // Pass user ID to fetch tasks
      setTasks(fetchedTasks);  // Set the fetched tasks in the state
    } catch (err) {
      setError('Failed to load tasks');  // Set error state if fetching fails
      console.error('Error loading tasks:', err);  // Log error for debugging
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  // Function to toggle task expansion (show or hide subtasks)
  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);  // Collapse task if already expanded
    } else {
      newExpanded.add(taskId);  // Expand task if collapsed
    }
    setExpandedTasks(newExpanded);  // Update expanded tasks state
  };

  // Function to handle task completion toggle
  const handleTaskToggle = async (task: Task) => {
    try {
      if (user?.id) {  // Ensure user.id exists before making the API call
        await apiService.updateTask(task.id, { completed: !task.completed },);  // Pass user ID to update task
        await loadTasks(user.id);  // Reload tasks after update
      }
    } catch (err) {
      console.error('Error updating task:', err);  // Log error if task update fails
    }
  };

  // Function to handle subtask completion toggle
  const handleSubtaskToggle = async (subtask: Subtask) => {
    try {
      if (user?.id) {  // Ensure user.id exists before making the API call
        await apiService.updateSubtask(subtask.id, { completed: !subtask.completed },);  // Pass user ID to update subtask
        await loadTasks(user.id);  // Reload tasks after update
      }
    } catch (err) {
      console.error('Error updating subtask:', err);  // Log error if subtask update fails
    }
  };

  // Function to start editing a task
  const startEditing = (task: Task) => {
    setEditingTask(task.id);  // Set task as currently being edited
    setEditTitle(task.title);  // Set the task title to be edited
  };

  // Function to start editing a subtask
  const startEditingSubtask = (subtask: Subtask) => {
    setEditingSubtask(subtask.id);  // Set subtask as currently being edited
    setEditTitle(subtask.title);  // Set the subtask title to be edited
  };

  // Function to save the task or subtask edit
  const saveEdit = async () => {
    if (!editingTask && !editingSubtask) return;  // Return if no task or subtask is being edited

    try {
      if (editingTask) {
        if (user?.id) {  // Ensure user.id exists before making the API call
          await apiService.updateTask(editingTask, { title: editTitle },);  // Update task title
        }
        setEditingTask(null);  // Clear editing state for task
      } else if (editingSubtask) {
        if (user?.id) {  // Ensure user.id exists before making the API call
          await apiService.updateSubtask(editingSubtask, { title: editTitle },);  // Update subtask title
        }
        setEditingSubtask(null);  // Clear editing state for subtask
      }
      await loadTasks(user?.id || '');  // Reload tasks after saving edits
    } catch (err) {
      console.error('Error updating:', err);  // Log error if save fails
    }
  };

  // Function to cancel the task or subtask edit
  const cancelEdit = () => {
    setEditingTask(null);  // Clear task editing state
    setEditingSubtask(null);  // Clear subtask editing state
    setEditTitle('');  // Reset the title field
  };

  // Function to delete a task
  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;  // Confirm before deleting

    try {
      if (user?.id) {  // Ensure user.id exists before making the API call
        await apiService.deleteTask(taskId);  // Delete task by ID and user ID
        await loadTasks(user.id);  // Reload tasks after deletion
      }
    } catch (err) {
      console.error('Error deleting task:', err);  // Log error if task deletion fails
    }
  };

  // Function to delete a subtask
  const deleteSubtask = async (subtaskId: string) => {
    if (!confirm('Are you sure you want to delete this subtask?')) return;  // Confirm before deleting

    try {
      if (user?.id) {  // Ensure user.id exists before making the API call
        await apiService.deleteSubtask(subtaskId,);  // Delete subtask by ID and user ID
        await loadTasks(user.id);  // Reload tasks after deletion
      }
    } catch (err) {
      console.error('Error deleting subtask:', err);  // Log error if subtask deletion fails
    }
  };

  // Display loading spinner while tasks are being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Display error message if there's an issue loading tasks
  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => loadTasks(user?.id || '')} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header for Task List */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <Link to="/tasks/new" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Link>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started</p>
          <Link to="/tasks/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Task
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                   {editingTask === task.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-field flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        autoFocus
                      />
                      <button onClick={saveEdit} className="btn-primary text-sm">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn-secondary text-sm">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={`font-medium flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {task.subtasks && task.subtasks.length > 0 && (
                    <button
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedTasks.has(task.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                   <button
                    onClick={() => startEditing(task)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                   <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Subtasks */}
              {expandedTasks.has(task.id) && task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-4 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-3 pl-8">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleSubtaskToggle(subtask)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      {editingSubtask === subtask.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input-field flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                          <button onClick={saveEdit} className="btn-primary text-sm">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="btn-secondary text-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {subtask.title}
                        </span>
                      )}
                       <button
                        onClick={() => startEditingSubtask(subtask)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                       <button
                        onClick={() => deleteSubtask(subtask.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
