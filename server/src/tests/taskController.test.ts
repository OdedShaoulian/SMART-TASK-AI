import { TaskController } from '../controllers/taskController.js';
import { TaskService } from '../services/taskService.js';
import { Request, Response } from 'express';
import type { Task, Subtask, AuthenticatedRequest } from '../types/index.js';

// Mock the TaskService
jest.mock('../services/taskService');

describe('TaskController', () => {
  let taskController: TaskController;
  let mockTaskService: jest.Mocked<TaskService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    // Create a mock TaskService
    mockTaskService = {
      getUserTasks: jest.fn(),
      getTaskById: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      createSubtask: jest.fn(),
      updateSubtask: jest.fn(),
      deleteSubtask: jest.fn(),
    } as any;

    // Create controller with mocked service
    taskController = new TaskController(mockTaskService);

    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson, send: mockSend });
    
    mockResponse = {
      json: mockJson,
      status: mockStatus,
      send: mockSend,
    } as Partial<Response>;
  });

  describe('getUserTasks', () => {
    it('should return user tasks successfully', async () => {
      const mockTasks: Task[] = [
        { id: '1', title: 'Test Task 1', userId: 'user123', completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Test Task 2', userId: 'user123', completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockTaskService.getUserTasks.mockResolvedValue(mockTasks);
      mockRequest = { userId: 'user123' };

      await taskController.getUserTasks(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockTaskService.getUserTasks).toHaveBeenCalledWith('user123');
      expect(mockJson).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors when getting user tasks', async () => {
      const error = new Error('Database error');
      mockTaskService.getUserTasks.mockRejectedValue(error);
      mockRequest = { userId: 'user123' };

      await taskController.getUserTasks(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getTaskById', () => {
    it('should return task by id successfully', async () => {
      const mockTask: Task = { 
        id: '1', 
        title: 'Test Task', 
        userId: 'user123', 
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.getTaskById.mockResolvedValue(mockTask);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '1' }
      };

      await taskController.getTaskById(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.getTaskById).toHaveBeenCalledWith('1', 'user123');
      expect(mockJson).toHaveBeenCalledWith(mockTask);
    });

    it('should return 400 when taskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {}
      };

      await taskController.getTaskById(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should return 404 when task is not found', async () => {
      mockTaskService.getTaskById.mockResolvedValue(null);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '999' }
      };

      await taskController.getTaskById(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const mockTask: Task = { 
        id: '1', 
        title: 'New Task', 
        userId: 'user123', 
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.createTask.mockResolvedValue(mockTask);
      mockRequest = { 
        userId: 'user123',
        body: { title: 'New Task' }
      };

      await taskController.createTask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        userId: 'user123',
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTask);
    });

    it('should return 400 when title is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        body: {}
      };

      await taskController.createTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Title is required' });
    });

    it('should return 400 when title is empty string', async () => {
      mockRequest = { 
        userId: 'user123',
        body: { title: '' }
      };

      await taskController.createTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Title is required' });
    });

    it('should trim whitespace from title', async () => {
      const mockTask: Task = { 
        id: '1', 
        title: 'Trimmed Task', 
        userId: 'user123', 
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.createTask.mockResolvedValue(mockTask);
      mockRequest = { 
        userId: 'user123',
        body: { title: '  Trimmed Task  ' }
      };

      await taskController.createTask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.createTask).toHaveBeenCalledWith({
        title: 'Trimmed Task',
        userId: 'user123',
      });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const mockTask: Task = { 
        id: '1', 
        title: 'Updated Task', 
        userId: 'user123', 
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.updateTask.mockResolvedValue(mockTask);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '1' },
        body: { title: 'Updated Task', completed: true }
      };

      await taskController.updateTask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', 'user123', {
        title: 'Updated Task',
        completed: true
      });
      expect(mockJson).toHaveBeenCalledWith(mockTask);
    });

    it('should return 400 when taskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {},
        body: { title: 'Updated Task' }
      };

      await taskController.updateTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should return 404 when task is not found', async () => {
      mockTaskService.updateTask.mockResolvedValue(null);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '999' },
        body: { title: 'Updated Task' }
      };

      await taskController.updateTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTaskService.deleteTask.mockResolvedValue(true);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '1' }
      };

      await taskController.deleteTask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1', 'user123');
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should return 400 when taskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {}
      };

      await taskController.deleteTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should return 404 when task is not found', async () => {
      mockTaskService.deleteTask.mockResolvedValue(false);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: '999' }
      };

      await taskController.deleteTask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('createSubtask', () => {
    it('should create subtask successfully', async () => {
      const mockSubtask: Subtask = { 
        id: '1', 
        title: 'New Subtask', 
        taskId: 'task1', 
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.createSubtask.mockResolvedValue(mockSubtask);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: 'task1' },
        body: { title: 'New Subtask' }
      };

      await taskController.createSubtask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.createSubtask).toHaveBeenCalledWith({
        title: 'New Subtask',
        taskId: 'task1'
      }, 'user123');
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockSubtask);
    });

    it('should return 400 when taskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {},
        body: { title: 'New Subtask' }
      };

      await taskController.createSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task ID is required' });
    });

    it('should return 400 when title is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: { taskId: 'task1' },
        body: {}
      };

      await taskController.createSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Title is required' });
    });

    it('should return 404 when parent task is not found', async () => {
      const error = new Error('Task not found or access denied');
      mockTaskService.createSubtask.mockRejectedValue(error);
      mockRequest = { 
        userId: 'user123',
        params: { taskId: 'task1' },
        body: { title: 'New Subtask' }
      };

      await taskController.createSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Task not found' });
    });
  });

  describe('updateSubtask', () => {
    it('should update subtask successfully', async () => {
      const mockSubtask: Subtask = { 
        id: '1', 
        title: 'Updated Subtask', 
        taskId: 'task1', 
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTaskService.updateSubtask.mockResolvedValue(mockSubtask);
      mockRequest = { 
        userId: 'user123',
        params: { subtaskId: '1' },
        body: { title: 'Updated Subtask', completed: true }
      };

      await taskController.updateSubtask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.updateSubtask).toHaveBeenCalledWith('1', 'user123', {
        title: 'Updated Subtask',
        completed: true
      });
      expect(mockJson).toHaveBeenCalledWith(mockSubtask);
    });

    it('should return 400 when subtaskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {},
        body: { title: 'Updated Subtask' }
      };

      await taskController.updateSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Subtask ID is required' });
    });

    it('should return 404 when subtask is not found', async () => {
      mockTaskService.updateSubtask.mockResolvedValue(null);
      mockRequest = { 
        userId: 'user123',
        params: { subtaskId: '999' },
        body: { title: 'Updated Subtask' }
      };

      await taskController.updateSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Subtask not found' });
    });
  });

  describe('deleteSubtask', () => {
    it('should delete subtask successfully', async () => {
      mockTaskService.deleteSubtask.mockResolvedValue(true);
      mockRequest = { 
        userId: 'user123',
        params: { subtaskId: '1' }
      };

      await taskController.deleteSubtask(mockRequest as any, mockResponse as Response);

      expect(mockTaskService.deleteSubtask).toHaveBeenCalledWith('1', 'user123');
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should return 400 when subtaskId is missing', async () => {
      mockRequest = { 
        userId: 'user123',
        params: {}
      };

      await taskController.deleteSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Subtask ID is required' });
    });

    it('should return 404 when subtask is not found', async () => {
      mockTaskService.deleteSubtask.mockResolvedValue(false);
      mockRequest = { 
        userId: 'user123',
        params: { subtaskId: '999' }
      };

      await taskController.deleteSubtask(mockRequest as any, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Subtask not found' });
    });
  });
});
