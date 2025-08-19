// Import necessary modules and types from Express
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import clerkRoutes from './routes/clerkRoutes.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import { clerkMiddleware } from '@clerk/express'; // Add Clerk's middleware

// Load environment variables from .env file
dotenv.config();  // Loads environment variables such as PORT, Clerk API keys, etc.
console.log('Clerk Secret Key:', process.env.CLERK_SECRET_KEY);
console.log('Database URL:', process.env.DATABASE_URL);
console.log('Clerk Publishable Key:', process.env.CLERK_PUBLISHABLE_KEY);


// Create an instance of Express application
const app = express();
const PORT = process.env.PORT || 3000;  // Set port to environment variable value or default to 3000

// CORS Configuration
// Allows the frontend to communicate with this server while passing credentials (cookies, authentication tokens)
app.use(cors({
  origin: ['http://localhost:5173'], // Frontend development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true  // Allow sending cookies in cross-origin requests
}));

// Enable preflight requests for all routes (CORS setup for OPTIONS requests)
app.options('*', cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Apply clerkMiddleware to handle Clerk's session before any route
app.use(clerkMiddleware()); // Ensure this is applied first for Clerk session handling

// Middleware to parse incoming JSON requests
app.use(express.json());  // This will automatically parse JSON bodies of incoming requests

/**
 * Public routes (No authentication required)
 * Example: Clerk webhook or testing endpoints
 */
app.use('/api', clerkRoutes);  // Public routes that do not require authentication (Clerk-related routes)

/**
 * Protected routes (Authentication required)
 * All task routes require the user to be authenticated via Clerk
 */
app.use('/api/tasks', authenticateUser, taskRoutes);  // Protected routes that require Clerk authentication

/**
 * Health check route (Ping route)
 * This route is used to verify that the API is up and running
 */
app.get('/api/ping', (req: Request, res: Response) => {
  res.send({ msg: 'pong 🏓' });  // Send a simple "pong" response to verify server is working
});

/**
 * Global error handler
 * This middleware catches all errors and formats them as JSON responses
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);  // Log the full error stack for debugging purposes
  res.status(500).json({ error: 'Something went wrong!' });  // Return a 500 status with a generic error message
});

/**
 * 404 handler
 * This middleware catches all requests that do not match an existing route
 * and returns a 404 error with a "Route not found" message
 */
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });  // Send a 404 error if route is not found
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`🚀 SmartTask AI Server running at http://localhost:${PORT}`);  // Log the server URL once it's up
});
