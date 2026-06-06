---
name: New React Component
description: Create a reusable React component with PropTypes validation and tests
---

# New React Component

Generate a new React component for the `$COMPONENT_NAME` resource.

## Requirements

### 1. Component File
- **Location**: `frontend/src/components/$COMPONENT_NAME.jsx`
- **Export**: Default export of the component function
- **Module System**: ES modules (import/export)
- **Function Type**: Use functional component with hooks, never class components

### 2. Component Structure

#### Basic Template
```jsx
import PropTypes from 'prop-types';

/**
 * $COMPONENT_NAME component description.
 * 
 * Displays [brief description of what the component does].
 * 
 * @component
 * @example
 * const item = { id: 1, title: 'Example' };
 * return <$COMPONENT_NAME item={item} onDelete={() => {}} />
 * 
 * @param {Object} props - Component props
 * @param {[type]} props.propName - Description of prop
 * @returns {JSX.Element} The rendered component
 */
export default function $COMPONENT_NAME({ propName, onAction }) {
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
}

$COMPONENT_NAME.propTypes = {
  propName: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};
```

### 3. Styling

- **Framework**: TailwindCSS classes only
- **No inline styles**: Never use `style={}` attribute
- **No CSS files**: All styling through Tailwind classes
- **Responsive**: Include responsive classes (sm:, md:, lg:, xl:)
- **Accessibility**: Include ARIA labels and semantic HTML

#### Styling Example
```jsx
export default function $COMPONENT_NAME() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 sm:p-6 md:p-8 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
        Title
      </h2>
      <p className="text-sm text-gray-600 md:text-base">Description</p>
    </div>
  );
}
```

### 4. PropTypes Validation

- **Validate all props** — Define PropTypes for every prop
- **Mark required props** — Use `.isRequired` for mandatory props
- **Use proper types** — `string`, `number`, `bool`, `array`, `object`, `func`, `element`, `node`
- **Shape objects** — Use `PropTypes.shape()` for object props
- **Array validation** — Use `PropTypes.arrayOf()` with specific type

#### PropTypes Example
```jsx
$COMPONENT_NAME.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  completed: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
  metadata: PropTypes.shape({
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  children: PropTypes.node,
};
```

### 5. Data Fetching & State Management

If the component fetches data:

#### Loading State
- Display a loading spinner or skeleton
- Show user-friendly loading message
- Use React hook (useState/useContext) to manage loading state

```jsx
import { useState, useEffect } from 'react';

export default function $COMPONENT_NAME() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/v1/endpoint');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return <div>{/* component content */}</div>;
}
```

#### Error State
- Display clear error message
- Provide option to retry or go back
- Log error details (use `console.error()` only for debugging)

### 6. JSDoc Comments

Every component and custom hook must have complete JSDoc comments:

```jsx
/**
 * $COMPONENT_NAME component description.
 * 
 * Detailed description of what this component does, including:
 * - Main purpose
 * - Key features
 * - When to use it
 * 
 * @component
 * @example
 * const props = { id: 1, title: 'Example' };
 * return <$COMPONENT_NAME {...props} />
 * 
 * @param {Object} props - Component props
 * @param {number} props.id - Unique identifier
 * @param {string} props.title - Display title
 * @param {Function} props.onUpdate - Callback when item is updated
 * @returns {JSX.Element} Rendered component
 */
```

### 7. Default Export

- Always use **default export** for the component
- No named exports for the component itself
- Can export utilities or constants as named exports if needed

```jsx
// ✅ Good
export default function $COMPONENT_NAME() { }

// ❌ Bad
export function $COMPONENT_NAME() { }

// ✅ Good - Utility constants as named exports
export const COLORS = { primary: 'blue', secondary: 'gray' };
export default function $COMPONENT_NAME() { }
```

### 8. Test File
- **Location**: `frontend/src/components/__tests__/$COMPONENT_NAME.test.jsx`
- **Framework**: Vitest with React Testing Library
- **Minimum Coverage**: At least 3 core test cases
- **Test Structure**: Use `describe()` blocks for organization

#### Required Test Cases

**1. Renders Without Crashing**
```jsx
test('should render without crashing', () => {
  render(<$COMPONENT_NAME propName="value" onAction={() => {}} />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

**2. Renders With Props**
```jsx
test('should render with correct props', () => {
  const testData = { id: 1, title: 'Test Title' };
  render(<$COMPONENT_NAME data={testData} />);
  
  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

**3. Handles Loading State** (if component fetches data)
```jsx
test('should display loading state while fetching', () => {
  render(<$COMPONENT_NAME />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

**4. Handles Error State** (if component fetches data)
```jsx
test('should display error message on fetch failure', async () => {
  // Mock fetch to fail
  global.fetch = vi.fn(() => Promise.reject(new Error('Failed')));
  
  render(<$COMPONENT_NAME />);
  
  await waitFor(() => {
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });
});
```

**5. User Interactions**
```jsx
test('should call onAction when button is clicked', async () => {
  const handleAction = vi.fn();
  render(<$COMPONENT_NAME onAction={handleAction} />);
  
  const button = screen.getByRole('button', { name: /action/i });
  await userEvent.click(button);
  
  expect(handleAction).toHaveBeenCalledTimes(1);
});
```

#### Test Example
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import $COMPONENT_NAME from '../$COMPONENT_NAME.jsx';

describe('$COMPONENT_NAME', () => {
  it('should render without crashing', () => {
    render(<$COMPONENT_NAME propName="test" onAction={() => {}} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should render with correct props', () => {
    const testData = { id: 1, title: 'Example' };
    render(<$COMPONENT_NAME data={testData} />);
    
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<$COMPONENT_NAME onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    render(<$COMPONENT_NAME isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## Accessibility Requirements

- Use **semantic HTML** (button, input, form, nav, etc.)
- Include **ARIA labels** for interactive elements: `aria-label`, `aria-describedby`
- Support **keyboard navigation** (Tab, Enter, Escape)
- Ensure **color contrast** meets WCAG AA standards
- Use **alt text** for images: `alt="description"`

#### Accessibility Example
```jsx
<button
  type="button"
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={onDelete}
  aria-label="Delete this item"
>
  Delete
</button>

<input
  type="text"
  placeholder="Search tasks"
  aria-label="Search for tasks"
  aria-describedby="search-help"
/>
```

## Code Quality Standards

- **No inline styles** — Use TailwindCSS only
- **No hardcoded values** — Use props or constants
- **No console.log()** in production code
- **No unnecessary re-renders** — Use React.memo for performance-critical components
- **No missing keys** in lists — Always add unique `key` prop to list items
- **Type safety** — Use PropTypes for all props

## Checklist

- [ ] Component file created at `frontend/src/components/$COMPONENT_NAME.jsx`
- [ ] Default export used
- [ ] All props have PropTypes validation
- [ ] Required props marked with `.isRequired`
- [ ] TailwindCSS used for all styling (no inline styles)
- [ ] Responsive classes included (sm:, md:, lg:, xl:)
- [ ] JSDoc comments on component and custom hooks
- [ ] Loading state implemented (if fetching data)
- [ ] Error state implemented (if fetching data)
- [ ] Semantic HTML used throughout
- [ ] ARIA labels included for interactive elements
- [ ] Test file created at `frontend/src/components/__tests__/$COMPONENT_NAME.test.jsx`
- [ ] At least 3 core test cases implemented
- [ ] Tests cover rendering, props, and loading/error states
- [ ] All tests pass: `npm test`
- [ ] Component passes ESLint
- [ ] No `console.log()` statements in production code
- [ ] Code is accessible (WCAG AA)
