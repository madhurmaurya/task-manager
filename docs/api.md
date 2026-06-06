# Task Manager API Reference

**Base URL**: `http://localhost:3001`

**API Version**: v1

**Response Format**: All responses follow the standard format: `{ "success": boolean, "data|error": any }`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Get All Tasks](#get-all-tasks)
3. [Get Single Task](#get-single-task)
4. [Create Task](#create-task)
5. [Update Task](#update-task)
6. [Delete Task](#delete-task)

---

## Health Check

Verify that the API server is running and responsive.

### Request

```
GET /health
```

### Description

Returns a simple response to confirm the server is operational. This endpoint requires no authentication and can be used to check server availability.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Request Body

None

### Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Error Responses

N/A - This endpoint does not return errors under normal circumstances.

---

## Get All Tasks

Retrieve all tasks with optional pagination support.

### Request

```
GET /api/v1/tasks
```

### Description

Fetches a paginated list of all tasks in the system. Use query parameters to control pagination. If no parameters are provided, defaults to the first 10 tasks.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 10 | Maximum number of tasks to return |
| `offset` | integer | No | 0 | Number of tasks to skip (for pagination) |

### Request Body

None

### Example Request

```bash
curl -X GET "http://localhost:3001/api/v1/tasks?limit=5&offset=0" \
  -H "Content-Type: application/json"
```

### Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "priority": "medium",
      "status": "todo",
      "created_at": "2026-06-06T08:49:49.392Z",
      "updated_at": "2026-06-06T08:49:49.392Z"
    },
    {
      "id": 2,
      "title": "Complete project documentation",
      "description": "Write API documentation and setup guide",
      "priority": "high",
      "status": "in-progress",
      "created_at": "2026-06-06T10:30:15.123Z",
      "updated_at": "2026-06-06T10:35:22.456Z"
    }
  ]
}
```

### Error Responses

#### 500 Internal Server Error

Returned when the server encounters an error while retrieving tasks (e.g., database connection failure).

```json
{
  "success": false,
  "error": "Failed to retrieve tasks"
}
```

---

## Get Single Task

Retrieve a specific task by its ID.

### Request

```
GET /api/v1/tasks/:id
```

### Description

Fetches a single task from the database by its unique ID. Returns a 404 error if the task does not exist.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Unique task ID |

### Request Body

None

### Example Request

```bash
curl -X GET "http://localhost:3001/api/v1/tasks/1" \
  -H "Content-Type: application/json"
```

### Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "status": "todo",
    "created_at": "2026-06-06T08:49:49.392Z",
    "updated_at": "2026-06-06T08:49:49.392Z"
  }
}
```

### Error Responses

#### 400 Bad Request

Returned when the task ID is not a valid integer.

```json
{
  "success": false,
  "error": "Validation failed: Task ID must be an integer"
}
```

#### 404 Not Found

Returned when no task with the specified ID exists in the database.

```json
{
  "success": false,
  "error": "Task with ID 999 not found"
}
```

#### 500 Internal Server Error

Returned when the server encounters an error while retrieving the task.

```json
{
  "success": false,
  "error": "Failed to retrieve task"
}
```

---

## Create Task

Create a new task in the system.

### Request

```
POST /api/v1/tasks
```

### Description

Creates a new task with the provided data. The `title` field is required; all other fields are optional. Default priority is `medium` and default status is `todo`.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | Yes | Non-empty, max 255 chars | Task title |
| `description` | string | No | Max 1000 chars | Task description |
| `priority` | string | No | Enum: low, medium, high | Task priority level (default: medium) |
| `status` | string | No | Enum: todo, in-progress, done | Task status (default: todo) |

### Request Body Example

```json
{
  "title": "Complete project documentation",
  "description": "Write API documentation and setup guide for developers",
  "priority": "high",
  "status": "todo"
}
```

### Minimal Request Body Example

```json
{
  "title": "Buy milk"
}
```

### Example Request

```bash
curl -X POST "http://localhost:3001/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write API documentation and setup guide",
    "priority": "high"
  }'
```

### Success Response

**Status Code**: `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Complete project documentation",
    "description": "Write API documentation and setup guide",
    "priority": "high",
    "status": "todo",
    "created_at": "2026-06-06T11:20:30.789Z",
    "updated_at": "2026-06-06T11:20:30.789Z"
  }
}
```

### Error Responses

#### 400 Bad Request

Returned when validation fails (e.g., missing title, invalid priority).

```json
{
  "success": false,
  "error": "Validation failed: Title is required"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Title must be at most 255 characters"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Description must be at most 1000 characters"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Priority must be low, medium, or high"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Status must be todo, in-progress, or done"
}
```

#### 500 Internal Server Error

Returned when the server encounters an error while creating the task.

```json
{
  "success": false,
  "error": "Failed to create task"
}
```

---

## Update Task

Update an existing task's details.

### Request

```
PUT /api/v1/tasks/:id
```

### Description

Updates one or more fields of an existing task. All fields are optional, so you can update just the fields you need. The task must exist; a 404 error is returned if it does not.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Unique task ID |

### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | No | Non-empty (if provided), max 255 chars | New task title |
| `description` | string | No | Max 1000 chars | New task description |
| `priority` | string | No | Enum: low, medium, high | New priority level |
| `status` | string | No | Enum: todo, in-progress, done | New status |

### Request Body Examples

Update only the status:
```json
{
  "status": "in-progress"
}
```

Update multiple fields:
```json
{
  "title": "Buy groceries (urgent)",
  "priority": "high",
  "status": "done"
}
```

### Example Request

```bash
curl -X PUT "http://localhost:3001/api/v1/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "high"
  }'
```

### Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "high",
    "status": "in-progress",
    "created_at": "2026-06-06T08:49:49.392Z",
    "updated_at": "2026-06-06T11:30:45.123Z"
  }
}
```

### Error Responses

#### 400 Bad Request

Returned when validation fails (e.g., invalid task ID, invalid priority/status values).

```json
{
  "success": false,
  "error": "Validation failed: Task ID must be an integer"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Title cannot be empty"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Title must be at most 255 characters"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Priority must be low, medium, or high"
}
```

```json
{
  "success": false,
  "error": "Validation failed: Status must be todo, in-progress, or done"
}
```

#### 404 Not Found

Returned when the task with the specified ID does not exist.

```json
{
  "success": false,
  "error": "Task with ID 999 not found"
}
```

#### 500 Internal Server Error

Returned when the server encounters an error while updating the task.

```json
{
  "success": false,
  "error": "Failed to update task"
}
```

---

## Delete Task

Delete an existing task from the system.

### Request

```
DELETE /api/v1/tasks/:id
```

### Description

Permanently deletes a task from the database. The task must exist; a 404 error is returned if it does not. This operation cannot be undone.

### Headers

No authentication required.

```
Content-Type: application/json
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Unique task ID |

### Request Body

None

### Example Request

```bash
curl -X DELETE "http://localhost:3001/api/v1/tasks/1" \
  -H "Content-Type: application/json"
```

### Success Response

**Status Code**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

### Error Responses

#### 400 Bad Request

Returned when the task ID is not a valid integer.

```json
{
  "success": false,
  "error": "Validation failed: Task ID must be an integer"
}
```

#### 404 Not Found

Returned when the task with the specified ID does not exist.

```json
{
  "success": false,
  "error": "Task with ID 999 not found"
}
```

#### 500 Internal Server Error

Returned when the server encounters an error while deleting the task.

```json
{
  "success": false,
  "error": "Failed to delete task"
}
```

---

## Global Error Handling

### 404 Not Found (Route Not Found)

Returned when a request is made to a path that does not exist.

```
GET /api/v1/invalid-endpoint
```

Response:
```json
{
  "success": false,
  "error": "Route not found"
}
```

### 500 Internal Server Error (Unhandled Exception)

Returned when an unexpected error occurs on the server.

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Standard Response Format

### Success Response Structure

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response Structure

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE request |
| 201 | Created | Successful POST request (resource created) |
| 400 | Bad Request | Validation error or malformed request body |
| 404 | Not Found | Resource does not exist or route not found |
| 500 | Internal Server Error | Unexpected server error |

---

## Validation Rules

### Task Title
- **Required** for create operations
- **Non-empty string** (whitespace is trimmed)
- **Maximum 255 characters**

### Task Description
- **Optional**
- **Whitespace is trimmed**
- **Maximum 1000 characters**

### Task Priority
- **Optional** (defaults to `medium` on create)
- **Must be one of**: `low`, `medium`, `high`

### Task Status
- **Optional** (defaults to `todo` on create)
- **Must be one of**: `todo`, `in-progress`, `done`

### Task ID
- **Must be an integer**
- **Must exist in the database** for read, update, and delete operations

---

## Rate Limiting

Currently, no rate limiting is implemented. Clients should implement their own throttling if needed.

---

## Authentication & Authorization

Currently, no authentication is required for any endpoint. Future versions may require API keys or tokens.

---

## Pagination

The `GET /api/v1/tasks` endpoint supports pagination via query parameters:

- **`limit`**: Number of results to return (default: 10)
- **`offset`**: Number of results to skip (default: 0)

**Example**: `GET /api/v1/tasks?limit=20&offset=40` returns tasks 41-60.

---

## Example Usage Scenarios

### Scenario 1: Create a Task and Update Its Status

```bash
# Create a new task
curl -X POST "http://localhost:3001/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Review code", "priority": "high"}'

# Response contains: {"id": 4, ...}

# Update the status to in-progress
curl -X PUT "http://localhost:3001/api/v1/tasks/4" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

### Scenario 2: Get Tasks with Pagination

```bash
# Get first 10 tasks
curl -X GET "http://localhost:3001/api/v1/tasks?limit=10&offset=0"

# Get next 10 tasks
curl -X GET "http://localhost:3001/api/v1/tasks?limit=10&offset=10"
```

### Scenario 3: Complete and Delete a Task

```bash
# Mark task as done
curl -X PUT "http://localhost:3001/api/v1/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete the task
curl -X DELETE "http://localhost:3001/api/v1/tasks/1"
```

---

## Troubleshooting

### Connection Refused

**Error**: `curl: (7) Failed to connect to localhost port 3001`

**Solution**: Ensure the backend server is running with `npm start` in the `backend/` directory.

### Invalid JSON Response

**Error**: `curl: (56) Received HTTP/0.9 when not allowed`

**Solution**: Ensure the server is running and responding. Check that `http://localhost:3001/health` returns a valid response.

### Validation Failed Errors

**Error**: `Validation failed: ...`

**Solution**: Check request body against the validation rules in this document. Ensure all required fields are provided and values match the specified constraints.

### Task Not Found

**Error**: `Task with ID 999 not found`

**Solution**: Ensure the task ID is correct. Use `GET /api/v1/tasks` to list all tasks and find the correct ID.

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-06-06 | Initial API release |

---

**Last Updated**: June 6, 2026

**API Documentation Generator**: GitHub Copilot

For questions or issues, refer to the main [README.md](../README.md) or check the backend logs.
