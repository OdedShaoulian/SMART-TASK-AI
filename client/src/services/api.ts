import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import type { Subtask, CreateSubtaskRequest, UpdateSubtaskRequest } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';  // API base URL for the server

class ApiService {
  // Private helper function to get headers for the requests
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',  // Set content type for JSON data
    };
  }

  // Task endpoints

  /**
   * Fetches all tasks from the API.
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
   * @throws Will throw an error if the request fails or the response is not ok.
   */
  async getTasks(): Promise<Task[]> {
    try {
      console.log('Making request to get tasks...'); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: this.getHeaders(),  // Send headers without X-User-Id
        credentials: 'include', // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks. Status: ${response.status}`);
      }

      return response.json();  // Parse and return the tasks from the response
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;  // Rethrow for handling in the calling code
    }
  }

  /**
   * Fetches a single task by its ID from the API.
   * @param {string} taskId - The ID of the task to fetch.
   * @returns {Promise<Task>} A promise that resolves to the task object.
   * @throws Will throw an error if the request fails or the response is not ok.
   */
  async getTask(taskId: string): Promise<Task> {
    try {
      console.log(`Making request to get task with ID: ${taskId}`); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: this.getHeaders(),  // Send headers without X-User-Id
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch task with ID: ${taskId}. Status: ${response.status}`);
      }

      return response.json();  // Return the task object from the response
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new task on the API.
   * @param {CreateTaskRequest} task - The task data to be created.
   * @returns {Promise<Task>} A promise that resolves to the created task.
   * @throws Will throw an error if the request fails.
   */
  async createTask(task: CreateTaskRequest): Promise<Task> {
    try {
      console.log('Making request to create task...'); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        body: JSON.stringify(task),  // Convert task data to JSON
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to create task. Status: ${response.status}`);
      }

      return response.json();  // Return the created task from the response
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Updates an existing task by its ID.
   * @param {string} taskId - The ID of the task to update.
   * @param {UpdateTaskRequest} updates - The task updates to apply.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   * @throws Will throw an error if the request fails.
   */
  async updateTask(taskId: string, updates: UpdateTaskRequest): Promise<Task> {
    try {
      console.log(`Making request to update task with ID: ${taskId}`); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        body: JSON.stringify(updates),  // Convert updates to JSON
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to update task with ID: ${taskId}. Status: ${response.status}`);
      }

      return response.json();  // Return the updated task from the response
    } catch (error) {
      console.error(`Error updating task with ID ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a task by its ID.
   * @param {string} taskId - The ID of the task to delete.
   * @returns {Promise<void>} A promise that resolves when the task is deleted.
   * @throws Will throw an error if the request fails.
   */
  async deleteTask(taskId: string): Promise<void> {
    try {
      console.log(`Making request to delete task with ID: ${taskId}`); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task with ID: ${taskId}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
      throw error;
    }
  }

  // Subtask endpoints

  /**
   * Creates a subtask for a task.
   * @param {string} taskId - The ID of the parent task.
   * @param {CreateSubtaskRequest} subtask - The subtask data to create.
   * @returns {Promise<Subtask>} A promise that resolves to the created subtask.
   * @throws Will throw an error if the request fails.
   */
  async createSubtask(taskId: string, subtask: CreateSubtaskRequest): Promise<Subtask> {
    try {
      console.log(`Making request to create subtask for task ${taskId}`); // Log the request initiation
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        body: JSON.stringify(subtask),  // Convert subtask data to JSON
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error('Failed to create subtask');
      }

      return response.json();  // Return the created subtask from the response
    } catch (error) {
      console.error(`Error creating subtask for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Updates an existing subtask by its ID.
   * @param {string} subtaskId - The ID of the subtask to update.
   * @param {UpdateSubtaskRequest} updates - The updates to apply to the subtask.
   * @returns {Promise<Subtask>} A promise that resolves to the updated subtask.
   * @throws Will throw an error if the request fails.
   */
  async updateSubtask(subtaskId: string, updates: UpdateSubtaskRequest): Promise<Subtask> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        body: JSON.stringify(updates),  // Convert updates to JSON
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error('Failed to update subtask');
      }

      return response.json();  // Return the updated subtask from the response
    } catch (error) {
      console.error(`Error updating subtask with ID ${subtaskId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes a subtask by its ID.
   * @param {string} subtaskId - The ID of the subtask to delete.
   * @returns {Promise<void>} A promise that resolves when the subtask is deleted.
   * @throws Will throw an error if the request fails.
   */
  async deleteSubtask(subtaskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),  // Send headers without X-User-Id
        credentials: 'include',  // Important for sending Clerk cookies
      });

      if (!response.ok) {
        throw new Error('Failed to delete subtask');
      }
    } catch (error) {
      console.error(`Error deleting subtask with ID ${subtaskId}:`, error);
      throw error;
    }
  }
}

// Create and export an instance of the ApiService class
export const apiService = new ApiService();
