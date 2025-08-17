# Smart Task AI

A modern task management application built with React 19, Node.js, and Azure cloud services.

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Prisma + MySQL
- **Hosting**: Azure Static Web Apps (Frontend) + Azure App Service (Backend)
- **Database**: Azure Database for MySQL

## 🚀 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment with three main workflows:

### 1. CI (`ci.yml`)
**Triggers**: All pushes and pull requests to `main` and `develop` branches

**Purpose**: Quality gates and testing
- **Server Tests**: Unit tests with MySQL database integration
- **Client Tests**: Unit tests with coverage reporting
- **Linting**: Code quality checks for both client and server
- **Type Checking**: TypeScript compilation verification
- **Build**: Application compilation and artifact creation
- **E2E Tests**: End-to-end testing with Playwright
- **Security Scan**: npm audit for vulnerability detection

**Coverage**: Integrated test coverage reporting via Codecov

### 2. Frontend Deployment (`azure-static-web-apps-gentle-plant-04645f703.yml`)
**Triggers**: Push to `main` branch with changes in `client/**` directory

**Purpose**: Deploy frontend to Azure Static Web Apps
- Automatic build and deployment
- Pull request preview environments
- Path-based triggering (only runs when frontend changes)
- Concurrency control to prevent multiple deployments

### 3. Backend Deployment (`deploy-backend.yml`)
**Triggers**: Push to `main` branch with changes in `server/**` directory

**Purpose**: Deploy backend to Azure App Service
- **Production Environment**: Direct deployment to production
- **Prisma Migrations**: Automatic database schema updates using `db:migrate:deploy`
- **Azure Publish Profile**: Secure deployment using existing Azure credentials
- **Path-based triggering**: Only runs when backend changes
- **Concurrency control**: Prevents deployment conflicts
- **Health Check**: Automatic verification after deployment
- **Staging Environment**: Will be added later for staging→production pipeline

## 🔧 Local Development

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ../e2e && npm install

# Setup database
cd server
npm run db:generate
npm run db:push

# Start development servers
cd ../server && npm run dev
cd ../client && npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run specific test suites
cd server && npm test
cd client && npm test
cd e2e && npx playwright test
```

## 📁 Project Structure

```
smart-task-ai/
├── client/                 # React frontend application
├── server/                 # Node.js backend API
├── e2e/                   # End-to-end tests
├── .github/workflows/     # GitHub Actions CI/CD
└── README.md             # This file
```

## 🔐 Environment Variables

### Frontend
- `VITE_API_URL`: Backend API endpoint

### Backend
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: JWT signing secret
- `PORT`: Server port (default: 3000)

### CI/CD Secrets
- `AZURE_STATIC_WEB_APPS_API_TOKEN_GENTLE_PLANT_04645F703`: Frontend deployment token
- `AZUREAPPSERVICE_PUBLISHPROFILE_3648A7C097704B079741BF447BA6A912`: Backend deployment publish profile
- `PRODUCTION_DATABASE_URL`: Production database connection (required for Prisma migrations)
- `STAGING_DATABASE_URL`: Staging database connection (will be added later)

## 🚀 Deployment

### Frontend
Automatically deployed to Azure Static Web Apps on push to `main` with client changes.

### Backend
1. **Staging**: Automatically deployed on push to `main` with server changes
2. **Production**: Deployed after successful staging deployment
3. **Database**: Prisma migrations run automatically after each deployment

## 📊 Monitoring

- **Test Coverage**: Integrated coverage reporting via Codecov
- **Health Checks**: Automatic health verification after deployments
- **Notifications**: Deployment status notifications (configurable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
