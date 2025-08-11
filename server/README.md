# SmartTask AI - Backend Server

A Node.js/Express backend for the SmartTask AI productivity application with user-specific task management.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📋 API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
- `GET /api/tasks/:taskId` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:taskId` - Update a task
- `DELETE /api/tasks/:taskId` - Delete a task

### Subtasks

- `POST /api/tasks/:taskId/subtasks` - Create a subtask for a task
- `PUT /api/subtasks/:subtaskId` - Update a subtask
- `DELETE /api/subtasks/:subtaskId` - Delete a subtask

## 🔐 Authentication

Currently using `x-user-id` header for user identification. This will be replaced with Clerk authentication in the future.

## 📊 Database Schema

### Task
- `id` (String, cuid)
- `title` (String)
- `completed` (Boolean, default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `userId` (String - Clerk user ID)

### Subtask
- `id` (String, cuid)
- `title` (String)
- `completed` (Boolean, default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `taskId` (String - Foreign key to Task)

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Architecture

- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic layer
- **Routes** - API endpoint definitions
- **Types** - TypeScript type definitions
- **Prisma** - Database ORM and schema management 