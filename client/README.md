# SmartTask AI - Frontend

A modern React application for the SmartTask AI productivity platform with user authentication and task management.

## 🚀 Features

- **User Authentication** - Secure login/signup with Clerk
- **Task Management** - Create, edit, delete, and complete tasks
- **Subtask Support** - Organize tasks with subtasks
- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Real-time Updates** - Instant task status updates
- **Dashboard** - Overview of tasks and productivity stats

## 🛠️ Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first CSS framework
- **Clerk** - Authentication and user management
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Clerk:**
   - Create a Clerk account at [clerk.com](https://clerk.com)
   - Get your publishable key
   - Update `CLERK_PUBLISHABLE_KEY` in `src/App.tsx`

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Clerk Setup
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key
4. Replace `pk_test_YOUR_CLERK_KEY` in `src/App.tsx`

### Backend Connection
The frontend connects to the backend at `http://localhost:3000/api`. Make sure your backend server is running.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── Dashboard.tsx   # Dashboard with stats
│   ├── TaskList.tsx    # Task list with CRUD
│   └── CreateTask.tsx  # Task creation form
├── services/           # API services
│   └── api.ts         # Backend API communication
├── types/              # TypeScript type definitions
│   └── index.ts       # API and component types
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## 🎨 UI Components

### Custom CSS Classes
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card container styling
- `.input-field` - Form input styling

### Color Scheme
- Primary: Blue (`primary-600`)
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Gray

## 🔌 API Integration

The frontend communicates with the backend through the `apiService`:

```typescript
// Example API calls
await apiService.getTasks(userId);
await apiService.createTask({ title: "New Task" }, userId);
await apiService.updateTask(taskId, { completed: true }, userId);
await apiService.deleteTask(taskId, userId);
```

## 🚀 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Workflow
1. Start the backend server (`cd ../server && npm run dev`)
2. Start the frontend (`npm run dev`)
3. Open `http://localhost:5173` in your browser
4. Sign up/sign in with Clerk
5. Start creating and managing tasks!

## 🎯 Features in Development

- **AI Task Breakdown** - Automatic subtask generation
- **Task Categories** - Organize tasks by category
- **Due Dates** - Set deadlines for tasks
- **Progress Tracking** - Visual progress indicators
- **Export/Import** - Backup and restore tasks
- **Mobile App** - React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
