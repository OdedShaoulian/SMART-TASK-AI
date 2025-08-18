import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateSubtaskRequest,
  UpdateSubtaskRequest,
} from '../types/index';

type AuthenticatedRequest = Request & { userId: string };

export class TaskController {
  private taskService: TaskService;

  constructor(taskService?: TaskService) {
    this.taskService = taskService || new TaskService();
  }

  async getUserTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await this.taskService.getUserTasks(req.userId);
      res.json(tasks);
    } catch (error) {
      console.error('Error getting user tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      const task = await this.taskService.getTaskById(taskId, req.userId);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Error getting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { title } = req.body as CreateTaskRequest;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const task = await this.taskService.createTask({
        title: title.trim(),
        userId: req.userId,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const updateData = req.body as UpdateTaskRequest;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      const task = await this.taskService.updateTask(taskId, req.userId, updateData);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      const deleted = await this.taskService.deleteTask(taskId, req.userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createSubtask(req: AuthenticatedRequest, res: Response) {
    try {
      const { title } = req.body as CreateSubtaskRequest;
      const { taskId } = req.params;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required' });
      }

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const subtask = await this.taskService.createSubtask(
        { title: title.trim(), taskId },
        req.userId
      );

      res.status(201).json(subtask);
    } catch (error) {
      console.error('Error creating subtask:', error);
      if (error instanceof Error && error.message === 'Task not found or access denied') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSubtask(req: AuthenticatedRequest, res: Response) {
    try {
      const { subtaskId } = req.params;
      const updateData = req.body as UpdateSubtaskRequest;

      if (!subtaskId || typeof subtaskId !== 'string') {
        return res.status(400).json({ error: 'Subtask ID is required' });
      }

      const subtask = await this.taskService.updateSubtask(subtaskId, req.userId, updateData);

      if (!subtask) {
        return res.status(404).json({ error: 'Subtask not found' });
      }

      res.json(subtask);
    } catch (error) {
      console.error('Error updating subtask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteSubtask(req: AuthenticatedRequest, res: Response) {
    try {
      const { subtaskId } = req.params;

      if (!subtaskId || typeof subtaskId !== 'string') {
        return res.status(400).json({ error: 'Subtask ID is required' });
      }

      const deleted = await this.taskService.deleteSubtask(subtaskId, req.userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Subtask not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting subtask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
