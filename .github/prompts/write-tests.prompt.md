---
name: Write Tests
description: Create comprehensive unit tests for any file with happy paths, edge cases, and error handling
---

# Write Tests

Generate comprehensive unit tests for the file `#file`.

## Pre-Requirements

### 1. Choose Testing Framework

Determine which framework to use based on the file location:

- **Jest**: Backend files in `backend/src/**`
  - Configuration: `backend/jest.config.js`
  - Run: `npm test` from backend directory
  - Test location: `backend/src/__tests__/` (mirror source structure)

- **Vitest**: Frontend files in `frontend/src/**`
  - Configuration: `frontend/vite.config.js`
  - Run: `npm test` from frontend directory
  - Test location: `frontend/src/__tests__/` (mirror source structure)

### 2. Analyze the File

Before writing tests, understand:
- What functions/components exist in the file?
- What are the inputs and outputs?
- What external dependencies does it use (DB, HTTP, filesystem, etc.)?
- What error scenarios can occur?
- What edge cases exist?

## Test Structure Requirements

### Test File Organization

```
src/
├── utils/
│   └── helper-function.js
└── __tests__/
    └── utils/
        └── helper-function.test.js
```

or for components:

```
src/
├── components/
│   └── TaskForm.jsx
└── __tests__/
    └── components/
        └── TaskForm.test.jsx
```

### Describe Blocks & It Blocks

- **One `describe()` block per function/component** — Organize tests logically
- **Multiple `it()` blocks per function** — One per test case
- **Descriptive names** — Clearly state what is being tested

```javascript
describe('calculateTotal', () => {
  describe('happy path', () => {
    it('should calculate correct total for valid items', () => {
      // test
    });
    
    it('should return zero for empty array', () => {
      // test
    });
  });

  describe('edge cases', () => {
    it('should handle negative numbers correctly', () => {
      // test
    });
    
    it('should handle decimal precision', () => {
      // test
    });
  });

  describe('error cases', () => {
    it('should throw error for null input', () => {
      // test
    });
    
    it('should throw error for non-numeric values', () => {
      // test
    });
  });
});
```

## Test Coverage Requirements

### Happy Path Tests (50% of tests)

Test normal, expected usage:
- Valid inputs with expected outputs
- Common use cases
- Standard workflows

```javascript
test('should create a task with valid input', () => {
  const input = { title: 'Buy milk', description: 'From store' };
  const result = createTask(input);
  
  expect(result).toHaveProperty('id');
  expect(result.title).toBe('Buy milk');
  expect(result.completed).toBe(false);
});
```

### Edge Case Tests (30% of tests)

Test boundary conditions and unusual but valid inputs:
- Empty strings or arrays
- Null/undefined values
- Maximum/minimum values
- Special characters
- Very large datasets
- Zero values
- Negative numbers (if applicable)

```javascript
test('should handle empty title string', () => {
  const input = { title: '', description: 'Description' };
  const result = createTask(input);
  
  expect(result.title).toBe('');
});

test('should handle very long titles (10,000+ chars)', () => {
  const longTitle = 'x'.repeat(10000);
  const input = { title: longTitle, description: 'Desc' };
  const result = createTask(input);
  
  expect(result.title.length).toBe(10000);
});

test('should handle null description (optional field)', () => {
  const input = { title: 'Task', description: null };
  const result = createTask(input);
  
  expect(result.description).toBeNull();
});
```

### Error Case Tests (20% of tests)

Test error handling and invalid inputs:
- Missing required fields
- Invalid data types
- Network failures
- Database errors
- Permission errors
- Validation failures

```javascript
test('should throw error when title is missing', () => {
  const input = { description: 'No title' };
  
  expect(() => createTask(input)).toThrow('Title is required');
});

test('should throw error when database connection fails', async () => {
  // Mock database to fail
  db.insert = jest.fn().mockRejectedValue(new Error('DB connection failed'));
  
  const input = { title: 'Task', description: 'Desc' };
  
  await expect(createTask(input)).rejects.toThrow('DB connection failed');
});

test('should throw error for invalid email format', () => {
  const input = { email: 'not-an-email' };
  
  expect(() => validateEmail(input)).toThrow('Invalid email format');
});
```

## Mocking Requirements

### External Dependencies to Mock

Always mock:
- **Database calls** (`db.prepare()`, `db.query()`, etc.)
- **HTTP requests** (`fetch()`, `axios()`, etc.)
- **Filesystem operations** (`fs.readFile()`, `fs.writeFile()`, etc.)
- **Third-party APIs** (external services)
- **Date/Time** (use `vi.useFakeTimers()` or `jest.useFakeTimers()`)
- **Environment variables** (override in test setup)

### Mocking Patterns

#### Jest (Backend)

```javascript
import { jest } from '@jest/globals';

// Mock a module
jest.mock('../database.js');

// Mock a function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Setup mock before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, title: 'Task' })
  });
});

// Test with mock
test('should fetch task from API', async () => {
  const result = await getTask(1);
  
  expect(mockFetch).toHaveBeenCalledWith('/api/v1/tasks/1');
  expect(result.id).toBe(1);
});

// Test mock error
test('should handle API error', async () => {
  mockFetch.mockRejectedValueOnce(new Error('Network error'));
  
  await expect(getTask(1)).rejects.toThrow('Network error');
});
```

#### Vitest (Frontend)

```javascript
import { vi } from 'vitest';

// Mock a module
vi.mock('../api.js');

// Mock fetch globally
global.fetch = vi.fn();

// Setup mock before each test
beforeEach(() => {
  vi.clearAllMocks();
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, title: 'Task' })
  });
});

// Test with mock
test('should fetch task from API', async () => {
  const result = await getTask(1);
  
  expect(fetch).toHaveBeenCalledWith('/api/v1/tasks/1');
  expect(result.id).toBe(1);
});
```

#### Mocking Database (better-sqlite3)

```javascript
import Database from 'better-sqlite3';

jest.mock('better-sqlite3');

beforeEach(() => {
  const mockDb = {
    prepare: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({ id: 1, title: 'Task' }),
      all: jest.fn().mockReturnValue([{ id: 1, title: 'Task' }]),
      run: jest.fn().mockReturnValue({ changes: 1 })
    })
  };
  
  Database.mockImplementation(() => mockDb);
});

test('should retrieve task from database', () => {
  const result = getTask(1);
  expect(result.id).toBe(1);
});
```

## Backend Testing (Jest) Example

```javascript
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import * as taskModel from '../../models/task-model.js';

jest.mock('../../models/task-model.js');

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/tasks', () => {
    it('should retrieve all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true }
      ];
      
      taskModel.getAllTasks.mockResolvedValue(mockTasks);
      
      const response = await request(app).get('/api/v1/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTasks);
      expect(taskModel.getAllTasks).toHaveBeenCalled();
    });

    it('should handle empty task list', async () => {
      taskModel.getAllTasks.mockResolvedValue([]);
      
      const response = await request(app).get('/api/v1/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should handle database error', async () => {
      taskModel.getAllTasks.mockRejectedValue(new Error('DB Error'));
      
      const response = await request(app).get('/api/v1/tasks');
      
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('DB Error');
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task with valid input', async () => {
      const newTask = { id: 3, title: 'New Task', completed: false };
      taskModel.createTask.mockResolvedValue(newTask);
      
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'New Task' });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(3);
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ description: 'No title' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('title');
    });

    it('should return 400 when title is too long', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({ title: 'x'.repeat(256) });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

## Frontend Testing (Vitest + React Testing Library) Example

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import TaskForm from '../TaskForm.jsx';

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render form with all fields', () => {
      render(<TaskForm onSubmit={vi.fn()} />);
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render with default values when editing', () => {
      const task = { id: 1, title: 'Test Task', description: 'Test Desc' };
      render(<TaskForm task={task} onSubmit={vi.fn()} />);
      
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Desc')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should call onSubmit with form data', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<TaskForm onSubmit={handleSubmit} />);
      
      const titleInput = screen.getByLabelText('Title');
      const descInput = screen.getByLabelText('Description');
      
      await user.type(titleInput, 'New Task');
      await user.type(descInput, 'Task Description');
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(handleSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task Description'
      });
    });

    it('should handle form submission errors', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'));
      
      render(<TaskForm onSubmit={handleSubmit} />);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Submit failed/)).toBeInTheDocument();
      });
    });
  });

  describe('validation', () => {
    it('should not submit with empty title', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<TaskForm onSubmit={handleSubmit} />);
      
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should trim whitespace from inputs', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<TaskForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByLabelText('Title'), '  Task Title  ');
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Task Title' })
      );
    });
  });
});
```

## Code Coverage

### Coverage Thresholds

- **Target**: 80%+ overall code coverage
- **Minimum**: 75% for any new code
- **Critical paths**: 90%+ for security/data operations

### Check Coverage

**Backend (Jest)**:
```bash
npm test -- --coverage
```

**Frontend (Vitest)**:
```bash
npm test -- --coverage
```

### Coverage Report Interpretation

- **Statements**: Percentage of individual statements executed
- **Branches**: Percentage of conditional branches tested (if/else, ternary)
- **Functions**: Percentage of functions called in tests
- **Lines**: Percentage of lines executed

## Test Naming Best Practices

### Descriptive Names

```javascript
// ✅ Good - Clear about what is tested
it('should return 200 status code when user is authenticated', () => {});
it('should throw validation error when email is invalid', () => {});
it('should update only the modified fields when partial update is sent', () => {});

// ❌ Bad - Too vague
it('should work', () => {});
it('test authentication', () => {});
it('error handling', () => {});
```

### Pattern: "should [action] [when condition]"

```javascript
describe('getUserTasks', () => {
  it('should return array of tasks when user exists', () => {});
  it('should return empty array when user has no tasks', () => {});
  it('should throw error when user does not exist', () => {});
  it('should filter completed tasks when filter is applied', () => {});
});
```

## Checklist

- [ ] Correct test framework chosen (Jest for backend, Vitest for frontend)
- [ ] Test file created in correct `__tests__/` directory
- [ ] One `describe()` block per function/component
- [ ] Multiple `it()` blocks per function (happy path, edge cases, errors)
- [ ] Descriptive test names using "should... when..." pattern
- [ ] Happy path tests cover normal usage (50% of tests)
- [ ] Edge case tests cover boundary conditions (30% of tests)
- [ ] Error case tests cover failure scenarios (20% of tests)
- [ ] External dependencies mocked (DB, HTTP, filesystem)
- [ ] Setup/teardown using `beforeEach()` and `afterEach()`
- [ ] Mocks cleared between tests with `jest.clearAllMocks()` or `vi.clearAllMocks()`
- [ ] Code coverage >= 80%
- [ ] All tests pass: `npm test`
- [ ] Tests are deterministic (no flaky tests, no timing issues)
- [ ] No `console.log()` statements left in tests
- [ ] Tests are isolated (independent of execution order)
