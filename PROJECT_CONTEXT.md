# 📌 SmartTask AI – Project Context

## 🧠 Project Purpose
An AI-powered web app that helps users break down large tasks into smaller, manageable subtasks.  
It uses prompt-based AI agents (Cursor Agentic) to enhance task understanding, and includes full user authentication, database management, and automation tools.

---

## 🧱 Tech Stack

### 🖥️ Frontend
- React (with Vite) + TypeScript
- Clerk for user authentication
- Unit testing with React Testing Library / Vitest

### 🛠️ Backend
- Node.js + Express (TypeScript)
- Prisma ORM
- Railway for database hosting
- MySQL / PostgreSQL (flexible via env var)
- Unit testing with Jest & Supertest

### 🤖 AI
- Cursor Basic for code generation
- Cursor Agentic for task breakdown / prompt workflows

### 🧪 Dev Tools
- Cypress (E2E Testing)
- Postman (manual API testing)
- GitHub Actions (CI/CD)
- Security agent checks for vulnerabilities
- `.env` for secrets & config

---

## 🔐 Authentication
Using **Clerk** with:
- Email + Username login
- Prebuilt `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`
- Wrapped with `<ClerkProvider>` in `main.tsx`
- Env key: `VITE_CLERK_PUBLISHABLE_KEY`

---

## 🗃️ Database

### ORM:
Using **Prisma**

### Environment Variables:
```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
DATABASE_URL=...
