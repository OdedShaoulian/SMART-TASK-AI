// src/types/index.ts

import { Request } from 'express'; // Required for extending Express Request

// Represents a Task entity with optional subtasks
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  subtasks?: Subtask[]; // Optional: present only when included in queries
}

// Represents a Subtask entity
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
}

// Payload for creating a new task
export interface CreateTaskRequest {
  title: string;
  userId: string;
}

// Payload for updating an existing task
export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}

// Payload for creating a new subtask
export interface CreateSubtaskRequest {
  title: string;
  taskId: string;
}

// Payload for updating an existing subtask
export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
}

// Extends Express Request to include userId from Clerk authentication
export interface AuthenticatedRequest extends Request {
  userId: string;
}
