# API Documentation

## Base URL
- Development: `http://localhost:5000/api/v1`
- Production: `https://your-app.netlify.app/api/v1`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/profile
Get current user profile. (Protected)

**Response:**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2023-10-15T10:30:00.000Z"
    }
  }
}
```

### Task Endpoints

#### GET /tasks
Get tasks (users see their own, admins see all). (Protected)

**Query Parameters:**
- `status`: Filter by status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term

**Response:**
```json
{
  "status": "success",
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project",
        "description": "Finish the task management system",
        "status": "in_progress",
        "priority": "high",
        "user_id": 1,
        "username": "johndoe",
        "created_at": "2023-10-15T10:30:00.000Z",
        "updated_at": "2023-10-15T10:30:00.000Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### POST /tasks
Create a new task. (Protected)

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "pending", // optional
  "priority": "medium" // optional
}
```

#### GET /tasks/:id
Get task by ID. (Protected)

#### PUT /tasks/:id
Update task. (Protected)

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "high"
}
```

#### DELETE /tasks/:id
Delete task. (Protected)

#### GET /tasks/stats
Get task statistics. (Protected)

**Response:**
```json
{
  "status": "success",
  "message": "Task statistics retrieved successfully",
  "data": {
    "stats": {
      "total": 10,
      "byStatus": {
        "pending": 3,
        "in_progress": 4,
        "completed": 3
      },
      "byPriority": {
        "low": 2,
        "medium": 5,
        "high": 3
      }
    }
  }
}
```

### Admin Endpoints

#### GET /auth/users
Get all users. (Admin only)

**Response:**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "role": "user",
        "created_at": "2023-10-15T10:30:00.000Z"
      }
    ],
    "stats": {
      "total": 5,
      "admins": 1,
      "users": 4
    }
  }
}
```

#### DELETE /auth/users/:id
Delete user. (Admin only)

## Error Responses

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error messages"] // optional
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error
