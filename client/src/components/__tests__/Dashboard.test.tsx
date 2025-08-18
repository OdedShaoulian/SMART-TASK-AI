import { render } from '@testing-library/react';
import { screen, waitFor, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import type { Task } from '../../types';

// Mock the API service module
vi.mock('../../services/api', () => ({
  apiService: {
    getTasks: vi.fn(),
    getTask: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    createSubtask: vi.fn(),
    updateSubtask: vi.fn(),
    deleteSubtask: vi.fn(),
  },
}));

// Import the mocked service
import { apiService } from '../../services/api';

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
      (apiService.getTasks as any).mockImplementation(() => new Promise(() => {})); // Never resolves

      renderWithRouter(<Dashboard />);

      // The component uses a div with animate-spin class, be more specific
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when API call fails', async () => {
      (apiService.getTasks as any).mockRejectedValue(new Error('Failed to fetch'));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
      });
    });

    it('should show retry button when error occurs', async () => {
      (apiService.getTasks as any).mockRejectedValue(new Error('Failed to fetch'));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should retry loading tasks when retry button is clicked', async () => {
      // Reset the mock to track calls properly
      (apiService.getTasks as any).mockReset();
      (apiService.getTasks as any)
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce([]);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      // Get the current call count before clicking retry
      const callsBeforeRetry = (apiService.getTasks as any).mock.calls.length;

      fireEvent.click(screen.getByRole('button', { name: /retry/i }));

      await waitFor(() => {
        // Check that at least one more call was made after clicking retry
        expect((apiService.getTasks as any).mock.calls.length).toBeGreaterThan(callsBeforeRetry);
      });
    });
  });

  describe('Success State', () => {
    it('should display welcome message with user name', async () => {
      const mockTasks: Task[] = [];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // The Clerk mock doesn't include firstName, so it shows "User" as fallback
        expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument();
      });
    });

    it('should display statistics cards with correct data', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [] },
        { id: '2', title: 'Task 2', completed: true, subtasks: [{ id: '1', title: 'Subtask 1' }] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [{ id: '2', title: 'Subtask 2' }] },
      ];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // Use more specific selectors to avoid conflicts
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Subtasks')).toBeInTheDocument();
        
        // Check the actual values in the cards
        const totalTasksCard = screen.getByText('Total Tasks').closest('.card');
        const pendingCard = screen.getByText('Pending').closest('.card');
        const completedCard = screen.getByText('Completed').closest('.card');
        const subtasksCard = screen.getByText('Subtasks').closest('.card');
        
        expect(totalTasksCard).toHaveTextContent('3');
        expect(pendingCard).toHaveTextContent('2');
        expect(completedCard).toHaveTextContent('1');
        expect(subtasksCard).toHaveTextContent('2');
      });
    });

    it('should display quick action buttons', async () => {
      const mockTasks: any[] = [];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

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
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

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
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

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
      (apiService.getTasks as any).mockResolvedValue(mockTasks);
      (apiService.updateTask as any).mockResolvedValue({ ...mockTasks[0], completed: true });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(apiService.updateTask).toHaveBeenCalledWith('1', { completed: true });
      });
    });

    it('should show subtask count for each task', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, subtasks: [{ id: '1', title: 'Subtask 1' }] },
        { id: '2', title: 'Task 2', completed: false, subtasks: [] },
        { id: '3', title: 'Task 3', completed: false, subtasks: [{ id: '2', title: 'Subtask 2' }, { id: '3', title: 'Subtask 3' }] },
      ];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        // The component shows "X subtasks" (plural) for all cases
        expect(screen.getByText('1 subtasks')).toBeInTheDocument();
        expect(screen.getByText('0 subtasks')).toBeInTheDocument();
        expect(screen.getByText('2 subtasks')).toBeInTheDocument();
      });
    });

    it('should show completed tasks with strikethrough', async () => {
      const mockTasks = [
        { id: '1', title: 'Completed Task', completed: true, subtasks: [] },
        { id: '2', title: 'Pending Task', completed: false, subtasks: [] },
      ];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const completedTask = screen.getByText('Completed Task');
        const pendingTask = screen.getByText('Pending Task');
        
        // The component uses a single class string with both classes
        expect(completedTask).toHaveClass('line-through text-gray-500');
        expect(pendingTask).toHaveClass('text-gray-900');
        expect(pendingTask).not.toHaveClass('line-through');
      });
    });
  });

  describe('Navigation', () => {
    it('should have correct links for quick actions', async () => {
      const mockTasks: any[] = [];
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

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
      (apiService.getTasks as any).mockResolvedValue(mockTasks);

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const viewAllLink = screen.getByText('View all 6 tasks →').closest('a');
        expect(viewAllLink).toHaveAttribute('href', '/tasks');
      });
    });
  });
});
