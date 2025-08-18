import { TaskService } from '../services/taskService.js';
import { prisma } from '../__mocks__/db/client.js';

// Mock Prisma before importing TaskService
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prisma),
}));

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create TaskService instance with mocked Prisma
    taskService = new TaskService(prisma as any);
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

      prisma.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getUserTasks('user123');

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        include: { subtasks: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      prisma.task.findMany.mockRejectedValue(error);

      await expect(taskService.getUserTasks('user123')).rejects.toThrow('Failed to fetch tasks');
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

      prisma.task.findFirst.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('1', 'user123');

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
        include: { subtasks: true },
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null when task not found', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

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

      prisma.task.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          userId: 'user123',
        },
        include: { subtasks: true },
      });
      expect(result).toEqual(mockCreatedTask);
    });

    it('should handle database errors during creation', async () => {
      const taskData = { title: 'New Task', userId: 'user123' };
      const error = new Error('Database error');
      prisma.task.create.mockRejectedValue(error);

      await expect(taskService.createTask(taskData)).rejects.toThrow('Failed to create task');
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

      // Mock the findFirst call to return existing task
      prisma.task.findFirst.mockResolvedValue({
        id: '1',
        title: 'Original Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask('1', 'user123', updateData);

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
      });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: { subtasks: true },
      });
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should return null when task not found', async () => {
      const updateData = { title: 'Updated Task' };
      prisma.task.findFirst.mockResolvedValue(null);

      const result = await taskService.updateTask('999', 'user123', updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      prisma.task.deleteMany.mockResolvedValue({ count: 1 });

      const result = await taskService.deleteTask('1', 'user123');

      expect(prisma.task.deleteMany).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user123' },
      });
      expect(result).toBe(true);
    });

    it('should return false when task not found', async () => {
      prisma.task.deleteMany.mockResolvedValue({ count: 0 });

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
      prisma.task.findFirst.mockResolvedValue({
        id: 'task1',
        title: 'Parent Task',
        userId: 'user123',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.subtask.create.mockResolvedValue(mockCreatedSubtask);

      const result = await taskService.createSubtask(subtaskData, 'user123');

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: 'task1', userId: 'user123' },
      });
      expect(prisma.subtask.create).toHaveBeenCalledWith({
        data: {
          title: 'New Subtask',
          taskId: 'task1',
        },
      });
      expect(result).toEqual(mockCreatedSubtask);
    });

    it('should throw error when parent task not found', async () => {
      const subtaskData = { title: 'New Subtask', taskId: 'task1' };
      prisma.task.findFirst.mockResolvedValue(null);

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
      prisma.subtask.findFirst.mockResolvedValue(mockUpdatedSubtask);
      prisma.subtask.update.mockResolvedValue(mockUpdatedSubtask);

      const result = await taskService.updateSubtask('1', 'user123', updateData);

      expect(prisma.subtask.findFirst).toHaveBeenCalledWith({
        where: {
          id: '1',
          task: { userId: 'user123' },
        },
      });
      expect(prisma.subtask.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedSubtask);
    });

    it('should return null when subtask not found', async () => {
      const updateData = { title: 'Updated Subtask' };
      prisma.subtask.findFirst.mockResolvedValue(null);

      const result = await taskService.updateSubtask('999', 'user123', updateData);

      expect(result).toBeNull();
    });

    it('should return null when subtask belongs to different user', async () => {
      const updateData = { title: 'Updated Subtask' };
      // Mock that the subtask exists but belongs to a different user
      prisma.subtask.findFirst.mockResolvedValue(null);

      const result = await taskService.updateSubtask('1', 'user123', updateData);

      expect(result).toBeNull();
    });
  });

  describe('deleteSubtask', () => {
    it('should delete subtask successfully', async () => {
      prisma.subtask.deleteMany.mockResolvedValue({ count: 1 });

      const result = await taskService.deleteSubtask('1', 'user123');

      expect(prisma.subtask.deleteMany).toHaveBeenCalledWith({
        where: {
          id: '1',
          task: { userId: 'user123' },
        },
      });
      expect(result).toBe(true);
    });

    it('should return false when subtask not found', async () => {
      prisma.subtask.deleteMany.mockResolvedValue({ count: 0 });

      const result = await taskService.deleteSubtask('999', 'user123');

      expect(result).toBe(false);
    });
  });
});
