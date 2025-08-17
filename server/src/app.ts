import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

// Middleware
app.use(express.json());

// Auth middleware for all routes
app.use(authMiddleware);

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

