import { PrismaClient } from '@prisma/client';
import {
  Task,
  Subtask,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
} from '../types/index.js';

// Lazy-loaded default Prisma client instance
let defaultPrisma: PrismaClient | null = null;

const getDefaultPrisma = () => {
  if (!defaultPrisma) {
    defaultPrisma = new PrismaClient();
  }
  return defaultPrisma;
};

export class TaskService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || getDefaultPrisma();
  }

  // Retrieve all tasks for a specific user, including subtasks
  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({
        where: { userId },
        include: { subtasks: true }, // Include subtasks with the task
        orderBy: { createdAt: 'desc' }, // Order by creation date, descending
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error getting user tasks:', error.message);
        throw new Error('Failed to fetch tasks'); // Provide a clear error message
      } else {
        console.error('Unknown error getting user tasks:', error);
        throw new Error('An unknown error occurred while fetching tasks');
      }
    }
  }

  // Retrieve a single task by ID and validate it belongs to the user
  async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    try {
      return await this.prisma.task.findFirst({
        where: { id: taskId, userId }, // Ensure the task belongs to the user
        include: { subtasks: true }, // Include subtasks with the task
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error getting task:', error.message);
        throw new Error('Failed to fetch task'); // Provide a clear error message
      } else {
        console.error('Unknown error getting task:', error);
        throw new Error('An unknown error occurred while fetching the task');
      }
    }
  }

  // Create a new task for the user
  async createTask(data: CreateTaskRequest): Promise<Task> {
    try {
      return await this.prisma.task.create({
        data: {
          title: data.title, // Task title
          userId: data.userId, // Task creator userId
        },
        include: { subtasks: true }, // Include subtasks with the task
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error creating task:', error.message);
        throw new Error('Failed to create task'); // Provide a clear error message
      } else {
        console.error('Unknown error creating task:', error);
        throw new Error('An unknown error occurred while creating the task');
      }
    }
  }

  // Update a task only if it belongs to the user
  async updateTask(taskId: string, userId: string, data: UpdateTaskRequest): Promise<Task | null> {
    try {
      // First, check if the task belongs to the user
      const task = await this.prisma.task.findFirst({
        where: { id: taskId, userId }, // Ensure the task belongs to the user
      });

      if (!task) return null; // Return null if the task does not exist or is not owned by the user

      // Update the task if it exists and belongs to the user
      return await this.prisma.task.update({
        where: { id: taskId },
        data, // The updated task data
        include: { subtasks: true }, // Include subtasks with the task
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error updating task:', error.message);
        throw new Error('Failed to update task'); // Provide a clear error message
      } else {
        console.error('Unknown error updating task:', error);
        throw new Error('An unknown error occurred while updating the task');
      }
    }
  }

  // Delete a task if it belongs to the user
  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.prisma.task.deleteMany({
        where: { id: taskId, userId }, // Ensure the task belongs to the user
      });
      return result.count > 0; // Return true if the task was deleted, false if not found
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error deleting task:', error.message);
        throw new Error('Failed to delete task'); // Provide a clear error message
      } else {
        console.error('Unknown error deleting task:', error);
        throw new Error('An unknown error occurred while deleting the task');
      }
    }
  }

  // Create a subtask only if the parent task belongs to the user
  async createSubtask(data: CreateSubtaskRequest, userId: string): Promise<Subtask> {
    try {
      // Check if the task exists and belongs to the user
      const task = await this.prisma.task.findFirst({
        where: { id: data.taskId, userId },
      });

      if (!task) throw new Error('Task not found or access denied'); // If task is not found or access denied

      // Create the subtask
      return await this.prisma.subtask.create({
        data: {
          title: data.title, // Subtask title
          taskId: data.taskId, // Parent task ID
        },
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error creating subtask:', error.message);
        throw new Error(error.message || 'Failed to create subtask'); // Provide a clear error message
      } else {
        console.error('Unknown error creating subtask:', error);
        throw new Error('An unknown error occurred while creating the subtask');
      }
    }
  }

  // Update a subtask if it belongs to a task owned by the user
  async updateSubtask(subtaskId: string, userId: string, data: UpdateSubtaskRequest): Promise<Subtask | null> {
    try {
      // Verify user ownership via related task
      const subtask = await this.prisma.subtask.findFirst({
        where: {
          id: subtaskId,
          task: { userId }, // Ensure the task's user matches
        },
      });

      if (!subtask) return null; // Return null if the subtask is not found or not owned by the user

      // Update the subtask
      return await this.prisma.subtask.update({
        where: { id: subtaskId },
        data, // The updated subtask data
      });
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error updating subtask:', error.message);
        throw new Error('Failed to update subtask'); // Provide a clear error message
      } else {
        console.error('Unknown error updating subtask:', error);
        throw new Error('An unknown error occurred while updating the subtask');
      }
    }
  }

  // Delete a subtask if it belongs to a task owned by the user
  async deleteSubtask(subtaskId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.prisma.subtask.deleteMany({
        where: {
          id: subtaskId,
          task: { userId }, // Ensure the task's user matches
        },
      });
      return result.count > 0; // Return true if the subtask was deleted, false if not found
    } catch (error: unknown) {
      // Catch any errors and log the error message
      if (error instanceof Error) {
        console.error('Error deleting subtask:', error.message);
        throw new Error('Failed to delete subtask'); // Provide a clear error message
      } else {
        console.error('Unknown error deleting subtask:', error);
        throw new Error('An unknown error occurred while deleting the subtask');
      }
    }
  }
}
