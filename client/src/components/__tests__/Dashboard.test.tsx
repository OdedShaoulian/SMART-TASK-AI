import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { apiService } from '../../services/api';
import type { Task } from '../../types';

// Mock the API service
const mockApiService = apiService as any;

// Wrapper component to provide router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when tasks are being fetched', async () => {
      mockApiService.getTasks.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithRouter(<Dashboard />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when API call fails', async () => {
      mockApiService.getTasks.mockRejectedValue(new Error('Failed to fetch'));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
      });
    });

    it('should show retry button when error occurs', async () => {
      mockApiService.getTasks.mockRejectedValue(new Error('Failed to fetch'));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should retry loading tasks when retry button is clicked', async () => {
      mockApiService.getTasks
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce([]);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /retry/i }));

      await waitFor(() => {
        expect(mockApiService.getTasks).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Success State', () => {
    it('should display welcome message with user name', async () => {
      const mockTasks: Task[] = [];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument();
      });
    });

    it('should display statistics cards with correct data', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [] },
        { id: '2', title: 'Task 2', completed: true, subtasks: [{ id: '1', title: 'Subtask 1' }] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [{ id: '2', title: 'Subtask 2' }] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Total Tasks: 3
        expect(screen.getByText('3')).toBeInTheDocument();
        
        // Pending: 2
        expect(screen.getByText('2')).toBeInTheDocument();
        
        // Completed: 1
        expect(screen.getByText('1')).toBeInTheDocument();
        
        // Subtasks: 2
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('should display quick action buttons', async () => {
      const mockTasks: any[] = [];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Create New Task')).toBeInTheDocument();
        expect(screen.getByText('View All Tasks')).toBeInTheDocument();
      });
    });

    it('should display recent tasks when tasks exist', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [] },
        { id: '2', title: 'Task 2', completed: true, subtasks: [{ id: '1', title: 'Subtask 1' }] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [] },
        { id: '4', title: 'Task 4', completed: false, subtasks: [] },
        { id: '5', title: 'Task 5', completed: false, subtasks: [] },
        { id: '6', title: 'Task 6', completed: false, subtasks: [] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
        expect(screen.getByText('Task 4')).toBeInTheDocument();
        expect(screen.getByText('Task 5')).toBeInTheDocument();
        
        // Should show "View all 6 tasks" link
        expect(screen.getByText('View all 6 tasks →')).toBeInTheDocument();
      });
    });

    it('should display empty state when no tasks exist', async () => {
      const mockTasks: any[] = [];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('No tasks yet')).toBeInTheDocument();
        expect(screen.getByText('Get started by creating your first task')).toBeInTheDocument();
        expect(screen.getByText('Create Your First Task')).toBeInTheDocument();
      });
    });
  });

  describe('Task Interactions', () => {
    it('should toggle task completion when checkbox is clicked', async () => {
      const mockTasks: any[] = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);
      mockApiService.updateTask.mockResolvedValue({ ...mockTasks[0], completed: true });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(mockApiService.updateTask).toHaveBeenCalledWith('1', { completed: true });
      });
    });

    it('should show subtask count for each task', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [{ id: '1', title: 'Subtask 1' }] },
        { id: '2', title: 'Task 2', completed: false, subtasks: [] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [{ id: '2', title: 'Subtask 2' }, { id: '3', title: 'Subtask 3' }] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('1 subtask')).toBeInTheDocument();
        expect(screen.getByText('0 subtasks')).toBeInTheDocument();
        expect(screen.getByText('2 subtasks')).toBeInTheDocument();
      });
    });

    it('should show completed tasks with strikethrough', async () => {
      const mockTasks = [
        { id: '1', title: 'Completed Task', completed: true, subtasks: [] },
        { id: '2', title: 'Pending Task', completed: false, subtasks: [] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const completedTask = screen.getByText('Completed Task');
        const pendingTask = screen.getByText('Pending Task');
        
        expect(completedTask).toHaveClass('line-through');
        expect(pendingTask).not.toHaveClass('line-through');
      });
    });
  });

  describe('Navigation', () => {
    it('should have correct links for quick actions', async () => {
      const mockTasks: any[] = [];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const createTaskLink = screen.getByText('Create New Task').closest('a');
        const viewTasksLink = screen.getByText('View All Tasks').closest('a');
        
        expect(createTaskLink).toHaveAttribute('href', '/tasks/new');
        expect(viewTasksLink).toHaveAttribute('href', '/tasks');
      });
    });

    it('should have correct link for viewing all tasks', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [] },
        { id: '2', title: 'Task 2', completed: false, subtasks: [] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [] },
        { id: '4', title: 'Task 4', completed: false, subtasks: [] },
        { id: '5', title: 'Task 5', completed: false, subtasks: [] },
        { id: '6', title: 'Task 6', completed: false, subtasks: [] },
      ];
      mockApiService.getTasks.mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const viewAllLink = screen.getByText('View all 6 tasks →').closest('a');
        expect(viewAllLink).toHaveAttribute('href', '/tasks');
      });
    });
  });
});
