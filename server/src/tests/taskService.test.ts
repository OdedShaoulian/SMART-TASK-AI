import { TaskService } from '../services/taskService';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock Prisma client with proper typing
    mockPrisma = {
      task: {
        findMany: jest.fn() as jest.MockedFunction<any>,
        findUnique: jest.fn() as jest.MockedFunction<any>,
        create: jest.fn() as jest.MockedFunction<any>,
        update: jest.fn() as jest.MockedFunction<any>,
        delete: jest.fn() as jest.MockedFunction<any>,
      },
      subtask: {
        findUnique: jest.fn() as jest.MockedFunction<any>,
        create: jest.fn() as jest.MockedFunction<any>,
        update: jest.fn() as jest.MockedFunction<any>,
        delete: jest.fn() as jest.MockedFunction<any>,
      },
    } as any;

    // Create TaskService instance with mocked Prisma
    taskService = new TaskService();
    (taskService as any).prisma = mockPrisma;
  });

  describe('getUserTasks', () => {
    it('should return user tasks successfully', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task 1',
          userId: 'user123',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          subtasks: [],
        },
        {
          id: '2',
          title: 'Test Task 2',
          userId: 'user123',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          subtasks: [],
        },
      ];

      (mockPrisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getUserTasks('user123');

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        include: { subtasks: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPrisma.task.findMany.mockRejectedValue(error);

      await expect(taskService.getUserTasks('user123')).rejects.toThrow('Database connection failed');
    });
  });

  describe('getTaskById', () => {
    it('should return task by id successfully', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
      };

      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('1', 'user123');

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
        include: { subtasks: true },
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      const result = await taskService.getTaskById('999', 'user123');

      expect(result).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = { title: 'New Task', userId: 'user123' };
      const mockCreatedTask = {
        id: '1',
        title: 'New Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
      };

      mockPrisma.task.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          userId: 'user123',
          completed: false,
        },
        include: { subtasks: true },
      });
      expect(result).toEqual(mockCreatedTask);
    });

    it('should handle database errors during creation', async () => {
      const taskData = { title: 'New Task', userId: 'user123' };
      const error = new Error('Database error');
      mockPrisma.task.create.mockRejectedValue(error);

      await expect(taskService.createTask(taskData)).rejects.toThrow('Database error');
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updateData = { title: 'Updated Task', completed: true };
      const mockUpdatedTask = {
        id: '1',
        title: 'Updated Task',
        userId: 'user123',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
      };

      mockPrisma.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask('1', 'user123', updateData);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
        data: updateData,
        include: { subtasks: true },
      });
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should return null when task not found', async () => {
      const updateData = { title: 'Updated Task' };
      mockPrisma.task.update.mockRejectedValue(new Error('Record not found'));

      const result = await taskService.updateTask('999', 'user123', updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const mockDeletedTask = {
        id: '1',
        title: 'Test Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        subtasks: [],
      };

      mockPrisma.task.delete.mockResolvedValue(mockDeletedTask);

      const result = await taskService.deleteTask('1', 'user123');

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
      });
      expect(result).toBe(true);
    });

    it('should return false when task not found', async () => {
      mockPrisma.task.delete.mockRejectedValue(new Error('Record not found'));

      const result = await taskService.deleteTask('999', 'user123');

      expect(result).toBe(false);
    });
  });

  describe('createSubtask', () => {
    it('should create subtask successfully', async () => {
      const subtaskData = { title: 'New Subtask', taskId: 'task1' };
      const mockCreatedSubtask = {
        id: '1',
        title: 'New Subtask',
        taskId: 'task1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock that the parent task exists
      mockPrisma.task.findUnique.mockResolvedValue({
        id: 'task1',
        title: 'Parent Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.subtask.create.mockResolvedValue(mockCreatedSubtask);

      const result = await taskService.createSubtask(subtaskData, 'user123');

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'task1', userId: 'user123' },
      });
      expect(mockPrisma.subtask.create).toHaveBeenCalledWith({
        data: {
          title: 'New Subtask',
          taskId: 'task1',
          completed: false,
        },
      });
      expect(result).toEqual(mockCreatedSubtask);
    });

    it('should throw error when parent task not found', async () => {
      const subtaskData = { title: 'New Subtask', taskId: 'task1' };
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(taskService.createSubtask(subtaskData, 'user123')).rejects.toThrow(
        'Task not found or access denied'
      );
    });
  });

  describe('updateSubtask', () => {
    it('should update subtask successfully', async () => {
      const updateData = { title: 'Updated Subtask', completed: true };
      const mockUpdatedSubtask = {
        id: '1',
        title: 'Updated Subtask',
        taskId: 'task1',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock that the subtask exists and belongs to user's task
      mockPrisma.subtask.findUnique.mockResolvedValue(mockUpdatedSubtask);
      mockPrisma.subtask.update.mockResolvedValue(mockUpdatedSubtask);

      const result = await taskService.updateSubtask('1', 'user123', updateData);

      expect(mockPrisma.subtask.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { task: true },
      });
      expect(mockPrisma.subtask.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedSubtask);
    });

    it('should return null when subtask not found', async () => {
      const updateData = { title: 'Updated Subtask' };
      mockPrisma.subtask.findUnique.mockResolvedValue(null);

      const result = await taskService.updateSubtask('999', 'user123', updateData);

      expect(result).toBeNull();
    });

    it('should return null when subtask belongs to different user', async () => {
      const updateData = { title: 'Updated Subtask' };
      const mockSubtask = {
        id: '1',
        title: 'Test Subtask',
        taskId: 'task1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 'task1',
          title: 'Parent Task',
          userId: 'different-user',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrisma.subtask.findUnique.mockResolvedValue(mockSubtask);

      const result = await taskService.updateSubtask('1', 'user123', updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteSubtask', () => {
    it('should delete subtask successfully', async () => {
      const mockDeletedSubtask = {
        id: '1',
        title: 'Test Subtask',
        taskId: 'task1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 'task1',
          title: 'Parent Task',
          userId: 'user123',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrisma.subtask.findUnique.mockResolvedValue(mockDeletedSubtask);
      mockPrisma.subtask.delete.mockResolvedValue(mockDeletedSubtask);

      const result = await taskService.deleteSubtask('1', 'user123');

      expect(mockPrisma.subtask.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { task: true },
      });
      expect(mockPrisma.subtask.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(true);
    });

    it('should return false when subtask not found', async () => {
      mockPrisma.subtask.findUnique.mockResolvedValue(null);

      const result = await taskService.deleteSubtask('999', 'user123');

      expect(result).toBe(false);
    });

    it('should return false when subtask belongs to different user', async () => {
      const mockSubtask = {
        id: '1',
        title: 'Test Subtask',
        taskId: 'task1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: {
          id: 'task1',
          title: 'Parent Task',
          userId: 'different-user',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrisma.subtask.findUnique.mockResolvedValue(mockSubtask);

      const result = await taskService.deleteSubtask('1', 'user123');

      expect(result).toBe(false);
    });
  });
});
