import { describe, it, expect, beforeEach } from '@jest/globals';
import { prisma } from '../__mocks__/db/client';

// Mock Prisma before importing app
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prisma),
}));

import request from 'supertest';
import app from '../app';

// Mock the auth middleware to inject user ID
jest.mock('../middleware/authMiddleware', () => ({
  authenticateUser: (req: any, res: any, next: any) => {
    // Simulate authentication by adding userId to request
    // Only set userId if x-user-id header is present
    if (req.headers['x-user-id']) {
      req.userId = req.headers['x-user-id'];
      next();
    } else {
      // Return 401 if no user ID header
      res.status(401).json({ error: 'User ID required' });
    }
  },
}));

describe('Task API Endpoints', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return 401 when no user ID is provided', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);
      
      expect(response.body.error).toBe('User ID required');
    });

    it('should return empty array when user ID is provided', async () => {
      // Mock the service to return empty array
      prisma.task.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/tasks')
        .set('x-user-id', testUserId)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 401 when no user ID is provided', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task' })
        .expect(401);
      
      expect(response.body.error).toBe('User ID required');
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('x-user-id', testUserId)
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('x-user-id', testUserId)
        .send({ title: '' })
        .expect(400);
      
      expect(response.body.error).toBe('Title is required');
    });

    it('should create task successfully', async () => {
      const mockTask = {
        id: '1',
        title: 'New Task',
        userId: testUserId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
      };

      prisma.task.create.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/api/tasks')
        .set('x-user-id', testUserId)
        .send({ title: 'New Task' })
        .expect(201);
      
      expect(response.body).toEqual(mockTask);
    });
  });

  describe('GET /api/tasks/:taskId', () => {
    it('should return 400 when taskId is invalid', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .set('x-user-id', testUserId)
        .expect(404);
      
      expect(response.body.error).toBe('Task not found');
    });

    it('should return task when found', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        userId: testUserId,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
      };

      prisma.task.findFirst.mockResolvedValue(mockTask);

      const response = await request(app)
        .get('/api/tasks/1')
        .set('x-user-id', testUserId)
        .expect(200);
      
      expect(response.body).toEqual(mockTask);
    });
  });

  describe('PUT /api/tasks/:taskId', () => {
    it('should return 400 when taskId is invalid', async () => {
      const response = await request(app)
        .put('/api/tasks/invalid-id')
        .set('x-user-id', testUserId)
        .send({ title: 'Updated Task' })
        .expect(404);
      
      expect(response.body.error).toBe('Task not found');
    });

    it('should update task successfully', async () => {
      const mockTask = {
        id: '1',
        title: 'Updated Task',
        userId: testUserId,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: [],
      };

      // Mock the findFirst call to return existing task
      prisma.task.findFirst.mockResolvedValue({
        id: '1',
        title: 'Original Task',
        userId: testUserId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.task.update.mockResolvedValue(mockTask);

      const response = await request(app)
        .put('/api/tasks/1')
        .set('x-user-id', testUserId)
        .send({ title: 'Updated Task', completed: true })
        .expect(200);
      
      expect(response.body).toEqual(mockTask);
    });
  });

  describe('DELETE /api/tasks/:taskId', () => {
    it('should return 404 when taskId is invalid', async () => {
      // Mock that the delete operation returns 0 deleted items (task not found)
      prisma.task.deleteMany.mockResolvedValue({ count: 0 });
      
      const response = await request(app)
        .delete('/api/tasks/invalid-id')
        .set('x-user-id', testUserId)
        .expect(404);
      
      expect(response.body.error).toBe('Task not found');
    });

    it('should delete task successfully', async () => {
      prisma.task.deleteMany.mockResolvedValue({ count: 1 });

      const response = await request(app)
        .delete('/api/tasks/1')
        .set('x-user-id', testUserId)
        .expect(204);
      
      expect(response.body).toEqual({});
    });
  });

  describe('POST /api/tasks/:taskId/subtasks', () => {
    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks/task1/subtasks')
        .set('x-user-id', testUserId)
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Title is required');
    });

    it('should create subtask successfully', async () => {
      const mockSubtask = {
        id: '1',
        title: 'New Subtask',
        taskId: 'task1',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock that the parent task exists
      prisma.task.findFirst.mockResolvedValue({
        id: 'task1',
        title: 'Parent Task',
        userId: testUserId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prisma.subtask.create.mockResolvedValue(mockSubtask);

      const response = await request(app)
        .post('/api/tasks/task1/subtasks')
        .set('x-user-id', testUserId)
        .send({ title: 'New Subtask' })
        .expect(201);
      
      expect(response.body).toEqual(mockSubtask);
    });
  });

  describe('PUT /api/tasks/subtasks/:subtaskId', () => {
    it('should return 404 when subtaskId is invalid', async () => {
      const response = await request(app)
        .put('/api/tasks/subtasks/invalid-id')
        .set('x-user-id', testUserId)
        .send({ title: 'Updated Subtask' })
        .expect(404);
      
      expect(response.body.error).toBe('Subtask not found');
    });

    it('should update subtask successfully', async () => {
      const mockSubtask = {
        id: '1',
        title: 'Updated Subtask',
        taskId: 'task1',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock that the subtask exists and belongs to user's task
      prisma.subtask.findFirst.mockResolvedValue(mockSubtask);
      prisma.subtask.update.mockResolvedValue(mockSubtask);

      const response = await request(app)
        .put('/api/tasks/subtasks/1')
        .set('x-user-id', testUserId)
        .send({ title: 'Updated Subtask', completed: true })
        .expect(200);
      
      expect(response.body).toEqual(mockSubtask);
    });
  });

  describe('DELETE /api/tasks/subtasks/:subtaskId', () => {
    it('should return 404 when subtaskId is invalid', async () => {
      // Mock that the delete operation returns 0 deleted items (subtask not found)
      prisma.subtask.deleteMany.mockResolvedValue({ count: 0 });
      
      const response = await request(app)
        .delete('/api/tasks/subtasks/invalid-id')
        .set('x-user-id', testUserId)
        .expect(404);
      
      expect(response.body.error).toBe('Subtask not found');
    });

    it('should delete subtask successfully', async () => {
      prisma.subtask.deleteMany.mockResolvedValue({ count: 1 });

      const response = await request(app)
        .delete('/api/tasks/subtasks/1')
        .set('x-user-id', testUserId)
        .expect(204);
      
      expect(response.body).toEqual({});
    });
  });
}); 