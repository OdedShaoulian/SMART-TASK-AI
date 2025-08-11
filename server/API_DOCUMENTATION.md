# SmartTask AI API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Currently using `x-user-id` header for user identification.

## Endpoints

### Tasks

#### Get All Tasks
- **Method:** `GET`
- **URL:** `/tasks`
- **Headers:** 
  - `x-user-id: your-user-id`
- **Response:** Array of tasks with subtasks

#### Get Single Task
- **Method:** `GET`
- **URL:** `/tasks/:taskId`
- **Headers:** 
  - `x-user-id: your-user-id`
- **Response:** Single task with subtasks

#### Create Task
- **Method:** `POST`
- **URL:** `/tasks`
- **Headers:** 
  - `x-user-id: your-user-id`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Your task title"
  }
  ```
- **Response:** Created task

#### Update Task
- **Method:** `PUT`
- **URL:** `/tasks/:taskId`
- **Headers:** 
  - `x-user-id: your-user-id`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```
- **Response:** Updated task

#### Delete Task
- **Method:** `DELETE`
- **URL:** `/tasks/:taskId`
- **Headers:** 
  - `x-user-id: your-user-id`
- **Response:** 204 No Content

### Subtasks

#### Create Subtask
- **Method:** `POST`
- **URL:** `/tasks/:taskId/subtasks`
- **Headers:** 
  - `x-user-id: your-user-id`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Your subtask title"
  }
  ```
- **Response:** Created subtask

#### Update Subtask
- **Method:** `PUT`
- **URL:** `/subtasks/:subtaskId`
- **Headers:** 
  - `x-user-id: your-user-id`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Updated subtask title",
    "completed": true
  }
  ```
- **Response:** Updated subtask

#### Delete Subtask
- **Method:** `DELETE`
- **URL:** `/subtasks/:subtaskId`
- **Headers:** 
  - `x-user-id: your-user-id`
- **Response:** 204 No Content

## Example Postman Collection

### Test User ID
Use any string as user ID for testing: `test-user-123`

### Sample Requests

1. **Create a task:**
   ```
   POST http://localhost:3000/api/tasks
   Headers: x-user-id: test-user-123
   Body: { "title": "Learn TypeScript" }
   ```

2. **Get all tasks:**
   ```
   GET http://localhost:3000/api/tasks
   Headers: x-user-id: test-user-123
   ```

3. **Create a subtask:**
   ```
   POST http://localhost:3000/api/tasks/{taskId}/subtasks
   Headers: x-user-id: test-user-123
   Body: { "title": "Study interfaces" }
   ```

## Error Responses

- **401 Unauthorized:** Missing or invalid user ID
- **400 Bad Request:** Invalid request data (e.g., missing title)
- **404 Not Found:** Task or subtask not found
- **500 Internal Server Error:** Server error 