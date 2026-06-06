---
name: New API Route Scaffold
description: Create a complete Express CRUD route with validation, responses, and tests
---

# New API Route Scaffold

Generate a complete Express CRUD route for the `$RESOURCE_NAME` resource.

## Requirements

### 1. Route File
- **Location**: `backend/src/routes/$RESOURCE_NAME.routes.js`
- **Export**: Default export of the router instance
- **Module System**: ES modules (import/export)

### 2. CRUD Operations
Implement all five CRUD operations with the `/api/v1/$RESOURCE_NAME` prefix:

#### GET All
- **Endpoint**: `GET /api/v1/$RESOURCE_NAME`
- **Purpose**: Retrieve all $RESOURCE_NAME records
- **Query Parameters**: Support optional `limit` and `offset` for pagination
- **Response**: `{ success: true, data: [...] }` with 200 status
- **Error Handling**: Return `{ success: false, error: "..." }` with 500 status on failure

#### GET by ID
- **Endpoint**: `GET /api/v1/$RESOURCE_NAME/:id`
- **Purpose**: Retrieve a single $RESOURCE_NAME by ID
- **Validation**: Validate `id` is a valid integer using `express-validator`
- **Response**: `{ success: true, data: {...} }` with 200 status
- **Not Found**: Return `{ success: false, error: "$RESOURCE_NAME with ID X not found" }` with 404 status

#### POST (Create)
- **Endpoint**: `POST /api/v1/$RESOURCE_NAME`
- **Purpose**: Create a new $RESOURCE_NAME
- **Validation**: Use `express-validator` middleware to validate all required and optional fields
- **Response**: `{ success: true, data: {...} }` with 201 status
- **Errors**: Return validation errors with 400 status

#### PUT (Update)
- **Endpoint**: `PUT /api/v1/$RESOURCE_NAME/:id`
- **Purpose**: Update an existing $RESOURCE_NAME
- **Validation**: Validate `id` and body fields using `express-validator`
- **Response**: `{ success: true, data: {...} }` with 200 status
- **Not Found**: Return 404 if $RESOURCE_NAME doesn't exist

#### DELETE
- **Endpoint**: `DELETE /api/v1/$RESOURCE_NAME/:id`
- **Purpose**: Delete a $RESOURCE_NAME by ID
- **Validation**: Validate `id` is a valid integer
- **Response**: `{ success: true, data: { id } }` with 200 status
- **Not Found**: Return 404 if $RESOURCE_NAME doesn't exist

### 3. Input Validation
- **Library**: Always use `express-validator`
- **Middleware**: Create separate validation middleware arrays for each operation
- **Example**:
  ```javascript
  export const validateCreate$RESOURCE_NAME = [
    body('field_name')
      .trim()
      .notEmpty()
      .withMessage('Field name is required'),
    // ... more validations
  ];

  export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed: ' + errors.array().map(e => e.msg).join(', '), 400);
    }
    next();
  };
  ```

### 4. Response Format
Always follow this format:

**Success Response**:
```javascript
{
  "success": true,
  "data": { /* resource object */ }
}
```

**Error Response**:
```javascript
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Use the helper functions:
```javascript
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: message });
};
```

### 5. JSDoc Comments
Every function must have complete JSDoc comments:

```javascript
/**
 * Retrieves all $RESOURCE_NAME records.
 * @async
 * @param {Object} req - Express request object
 * @param {number} [req.query.limit=10] - Maximum number of records to return
 * @param {number} [req.query.offset=0] - Number of records to skip
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with success and data
 * @throws {Error} If database query fails
 */
export async function getAll$RESOURCE_NAME(req, res) {
  // implementation
}
```

### 6. Test File
- **Location**: `backend/src/routes/__tests__/$RESOURCE_NAME.routes.test.js`
- **Framework**: Jest with `supertest`
- **Minimum Coverage**: At least 3 test cases per route (15+ tests total)
- **Test Structure**: Use `describe()` blocks for organization

#### Required Test Cases

**For GET All**:
1. Successfully retrieve all records (200)
2. Successfully retrieve with pagination parameters (200)
3. Handle database error (500)

**For GET by ID**:
1. Successfully retrieve a record by ID (200)
2. Return 404 when record not found (404)
3. Return 400 when ID is invalid (400)

**For POST**:
1. Successfully create a record with valid data (201)
2. Return 400 when required field is missing (400)
3. Return 400 with validation error message (400)

**For PUT**:
1. Successfully update a record (200)
2. Return 404 when record not found (404)
3. Return 400 when update data is invalid (400)

**For DELETE**:
1. Successfully delete a record (200)
2. Return 404 when record not found (404)
3. Return 400 when ID is invalid (400)

#### Test Example
```javascript
import request from 'supertest';
import app from '../../app.js';

describe('$RESOURCE_NAME Routes', () => {
  describe('GET /api/v1/$RESOURCE_NAME', () => {
    test('should retrieve all records', async () => {
      const response = await request(app)
        .get('/api/v1/$RESOURCE_NAME');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should handle database error', async () => {
      // Mock database error
      const response = await request(app)
        .get('/api/v1/$RESOURCE_NAME');
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/$RESOURCE_NAME', () => {
    test('should create a new record with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/$RESOURCE_NAME')
        .send({ /* valid data */ });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    test('should return 400 when required field is missing', async () => {
      const response = await request(app)
        .post('/api/v1/$RESOURCE_NAME')
        .send({ /* missing required field */ });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });
});
```

## Code Quality Standards

- **No `console.log()`** in production code (use proper logging library if needed)
- **No raw SQL concatenation** — Always use parameterized queries with `better-sqlite3`
- **No `var` declarations** — Use `const` and `let`
- **No hardcoded values** — Use environment variables for configuration
- **Error handling** — Wrap all async operations in try/catch blocks
- **Database operations** — Keep in separate model/service layer, not in route handlers

## Checklist

- [ ] Route file created at `backend/src/routes/$RESOURCE_NAME.routes.js`
- [ ] All 5 CRUD operations implemented
- [ ] All endpoints use `/api/v1/` prefix
- [ ] `express-validator` middleware created for validation
- [ ] All responses use `{ success, data/error }` format
- [ ] All functions have JSDoc comments
- [ ] HTTP status codes are correct (201 for POST, 404 for not found, etc.)
- [ ] Error handling with try/catch blocks
- [ ] Test file created at `backend/src/routes/__tests__/$RESOURCE_NAME.routes.test.js`
- [ ] At least 3 test cases per route (15+ total)
- [ ] Tests cover success, error, and edge cases
- [ ] No `console.log()` statements in production code
- [ ] No raw SQL concatenation
- [ ] Code passes ESLint
- [ ] All tests pass: `npm test`
