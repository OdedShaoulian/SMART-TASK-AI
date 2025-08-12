import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiService } from '../api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../../types';

// Mock fetch globally
const mockFetch = vi.fn();
(window as any).fetch = mockFetch;

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks: Task[] = [
        { 
          id: '1', 
          title: 'Task 1', 
          completed: false, 
          subtasks: [],
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: '2', 
          title: 'Task 2', 
          completed: true, 
          subtasks: [],
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockTasks),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getTasks();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getTasks()).rejects.toThrow('Failed to fetch tasks. Status: 500');
    });

    it('should throw error when fetch fails', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValue(error);

      await expect(apiService.getTasks()).rejects.toThrow('Network error');
    });
  });

  describe('getTask', () => {
    it('should fetch single task successfully', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'Task 1',
        completed: false,
        subtasks: [],
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockTask),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.getTask('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks/1', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error when task not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.getTask('999')).rejects.toThrow('Failed to fetch task with ID: 999. Status: 404');
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData: CreateTaskRequest = { title: 'New Task' };
      const mockTask: Task = {
        id: '1',
        title: 'New Task',
        completed: false,
        subtasks: [],
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockTask),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.createTask(taskData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(taskData),
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error when creation fails', async () => {
      const taskData: CreateTaskRequest = { title: 'New Task' };
      const mockResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.createTask(taskData)).rejects.toThrow('Failed to create task. Status: 400');
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = '1';
      const updateData: UpdateTaskRequest = { title: 'Updated Task', completed: true };
      const mockTask: Task = {
        id: '1',
        title: 'Updated Task',
        completed: true,
        subtasks: [],
        userId: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockTask),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.updateTask(taskId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error when update fails', async () => {
      const taskId = '1';
      const updateData: UpdateTaskRequest = { title: 'Updated Task' };
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.updateTask(taskId, updateData)).rejects.toThrow('Failed to update task with ID: 1. Status: 404');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = '1';
      const mockResponse = {
        ok: true,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiService.deleteTask(taskId);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should throw error when deletion fails', async () => {
      const taskId = '1';
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await expect(apiService.deleteTask(taskId)).rejects.toThrow('Failed to delete task with ID: 1. Status: 404');
    });
  });

  describe('createSubtask', () => {
    it('should create subtask successfully', async () => {
      const taskId = '1';
      const subtaskData = { title: 'New Subtask' };
      const mockSubtask = {
        id: '1',
        title: 'New Subtask',
        taskId: '1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockSubtask),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.createSubtask(taskId, subtaskData);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(subtaskData),
      });
      expect(result).toEqual(mockSubtask);
    });
  });

  describe('updateSubtask', () => {
    it('should update subtask successfully', async () => {
      const subtaskId = '1';
      const updateData = { title: 'Updated Subtask', completed: true };
      const mockSubtask = {
        id: '1',
        title: 'Updated Subtask',
        taskId: '1',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockSubtask),
      };

      mockFetch.mockResolvedValue(mockResponse);

      const result = await apiService.updateSubtask(subtaskId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/tasks/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockSubtask);
    });
  });

  describe('deleteSubtask', () => {
    it('should delete subtask successfully', async () => {
      const subtaskId = '1';
      const mockResponse = {
        ok: true,
      };

      mockFetch.mockResolvedValue(mockResponse);

      await apiService.deleteSubtask(subtaskId);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:3000/api/tasks/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });
  });
});
