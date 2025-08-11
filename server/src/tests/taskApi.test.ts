import request from 'supertest';
import express from 'express';
import taskRoutes from '../routes/taskRoutes';

const app = express();
app.use(express.json());
app.use('/api', taskRoutes);

describe('Task API Endpoints', () => {
  const testUserId = 'test-user-123';

  describe('GET /api/tasks', () => {
    it('should return 401 when no user ID is provided', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);
      
      expect(response.body.error).toBe('User ID required');
    });

    it('should return empty array when user ID is provided', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('x-user-id', testUserId)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
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
  });
}); 