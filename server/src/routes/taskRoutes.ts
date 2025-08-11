import { Router, Request, Response } from 'express';
import { TaskController } from '../controllers/taskController.js';

const router = Router();
const taskController = new TaskController();

// Type for requests that include Clerk-authenticated userId
type AuthenticatedRequest = Request & { userId: string };

// Task routes
router.get('/', (req: Request, res: Response) =>
  taskController.getUserTasks(req as AuthenticatedRequest, res)
);

router.get('/:taskId', (req: Request, res: Response) =>
  taskController.getTaskById(req as AuthenticatedRequest, res)
);

router.post('/', (req: Request, res: Response) =>
  taskController.createTask(req as AuthenticatedRequest, res)
);

router.put('/:taskId', (req: Request, res: Response) =>
  taskController.updateTask(req as AuthenticatedRequest, res)
);

router.delete('/:taskId', (req: Request, res: Response) =>
  taskController.deleteTask(req as AuthenticatedRequest, res)
);

// Subtask routes
router.post('/:taskId/subtasks', (req: Request, res: Response) =>
  taskController.createSubtask(req as AuthenticatedRequest, res)
);

router.put('/subtasks/:subtaskId', (req: Request, res: Response) =>
  taskController.updateSubtask(req as AuthenticatedRequest, res)
);

router.delete('/subtasks/:subtaskId', (req: Request, res: Response) =>
  taskController.deleteSubtask(req as AuthenticatedRequest, res)
);

export default router;
