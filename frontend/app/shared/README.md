# Shared Components & Utilities

This directory contains reusable components, utilities, and hooks that are shared across the AI-BOS application. All components are built with TypeScript, accessibility in mind, and follow consistent patterns.

## 🏗️ Architecture Overview

```
shared/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, etc.)
│   └── feedback/       # Loading states and user feedback
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── templates/          # Module templates and patterns
```

## 🧩 Components

### UI Components

#### Button
```tsx
import { Button } from '@/shared/components/ui/button';

<Button variant="primary" size="md" disabled={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode (optional)

#### Card
```tsx
import { Card } from '@/shared/components/ui/card';

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description</Card.Description>
  </Card.Header>
  <Card.Content>
    Card content goes here
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Feedback Components

#### Loading
```tsx
import { Loading } from '@/shared/components/feedback/loading';

<Loading size="md" text="Loading data..." />
```

#### Skeleton
```tsx
import { Skeleton, SkeletonLayouts } from '@/shared/components/feedback/Skeleton';

// Basic skeleton
<Skeleton variant="text" width="100%" height={20} />

// Predefined layouts
<SkeletonLayouts.Card />
<SkeletonLayouts.ListItem />
<SkeletonLayouts.Dashboard />

// Skeleton wrapper for async content
<SkeletonWrapper loading={isLoading} error={error}>
  <YourContent />
</SkeletonWrapper>
```

## 🪝 Hooks

### useLocalStorage
```tsx
import { useLocalStorage } from '@/shared/hooks/use-local-storage';

const [value, setValue] = useLocalStorage('key', defaultValue);
```

### usePerformanceTracking
```tsx
import { usePerformanceTracking } from '@/shared/hooks/usePerformance';

const performance = usePerformanceTracking('ModuleName', {
  budget: { lcp: 2500, fid: 100 },
  enableRealTime: true,
  enableReporting: true
});

// Track API calls
const data = await performance.trackApiCall(
  () => fetchData(),
  '/api/endpoint'
);

// Track render performance
useEffect(() => {
  return performance.trackRender('ComponentName');
}, []);
```

## 🛠️ Utilities

### Formatting Utilities
```tsx
import { formatDate, formatCurrency, formatPhone } from '@/shared/utils/format';

formatDate(new Date()); // "Jan 1, 2024"
formatCurrency(1234.56); // "$1,234.56"
formatPhone('1234567890'); // "(123) 456-7890"
```

### Testing Infrastructure
```tsx
import { 
  setupTestEnvironment, 
  renderWithProviders, 
  createTestUser,
  mockData 
} from '@/shared/utils/test-utils';

// Setup test environment
const { testData, cleanup } = setupTestEnvironment({
  mockSupabase: true,
  mockAuth: true,
  testData: { user: createTestUser() }
});

// Render with providers
const { getByText } = renderWithProviders(<YourComponent />);

// Use mock data
const testUser = createTestUser({ email: 'test@example.com' });
```

### Accessibility Framework
```tsx
import { 
  a11yHelpers, 
  ariaHelpers, 
  keyboardHelpers,
  a11yTesting 
} from '@/shared/utils/accessibility';

// Check color contrast
const isAccessible = a11yHelpers.checkColorContrast('#000000', '#ffffff');

// Setup ARIA relationships
ariaHelpers.setupAriaRelationships(element, 'Label', 'Description');

// Handle keyboard navigation
const cleanup = keyboardHelpers.handleListNavigation(items, onSelect);

// Run accessibility tests
const violations = a11yTesting.runBasicChecks(container);
const report = a11yTesting.generateReport(violations);
```

## 🎯 Performance Monitoring

The application includes comprehensive performance monitoring with:

- **Core Web Vitals** tracking (LCP, FID, CLS, TTFB, FCP)
- **Custom metrics** for module loading, API responses, render times
- **Performance budgets** with automatic violation detection
- **Real-time reporting** to your analytics endpoint
- **Memory usage** monitoring
- **User interaction** tracking

### Performance Budgets
```tsx
const performance = usePerformanceTracking('ModuleName', {
  budget: {
    lcp: 2500,        // Largest Contentful Paint (2.5s)
    fid: 100,         // First Input Delay (100ms)
    cls: 0.1,         // Cumulative Layout Shift (0.1)
    ttfb: 600,        // Time to First Byte (600ms)
    fcp: 1800,        // First Contentful Paint (1.8s)
    moduleLoadTime: 1000,    // Module load time (1s)
    apiResponseTime: 500,    // API response time (500ms)
    renderTime: 100          // Render time (100ms)
  }
});
```

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Color contrast** validation and suggestions
- **ARIA attributes** management
- **Keyboard navigation** support
- **Screen reader** announcements
- **Focus management** utilities
- **Automated testing** tools

### Accessibility Testing
```tsx
// Run automated accessibility checks
const violations = a11yTesting.runBasicChecks(container);

// Generate detailed reports
const report = a11yTesting.generateReport(violations);

// Check specific WCAG compliance
const compliance = a11yTesting.checkWCAGCompliance(container, WCAGLevel.AA);
```

## 🧪 Testing Infrastructure

### Comprehensive Testing Support
- **Unit testing** utilities with mocked dependencies
- **Integration testing** with real API calls
- **E2E testing** support
- **Performance testing** with budget assertions
- **Accessibility testing** with automated checks
- **Test data factories** for consistent test data

### Test Utilities
```tsx
// Setup test environment
const { testData, cleanup } = setupTestEnvironment({
  mockSupabase: true,
  mockAuth: true,
  testData: mockData
});

// Custom render with providers
const { getByText } = renderWithProviders(<Component />);

// Test data factories
const user = createTestUser({ email: 'test@example.com' });
const employee = createTestEmployee({ status: 'active' });
const task = createTestTask({ priority: 'high' });

// Performance testing
await assertPerformance(async () => {
  await loadComponent();
}, 1000); // Must complete within 1 second
```

## 📦 Usage Examples

### Complete Module Example
```tsx
import { 
  Button, 
  Card, 
  Loading, 
  Skeleton,
  usePerformanceTracking,
  useLocalStorage,
  formatDate,
  a11yTesting 
} from '@/shared';

const MyModule = () => {
  const performance = usePerformanceTracking('MyModule');
  const [data, setData] = useLocalStorage('my-data', null);
  
  const loadData = async () => {
    const result = await performance.trackApiCall(
      () => fetch('/api/data'),
      '/api/data'
    );
    setData(result);
  };
  
  // Accessibility testing
  useEffect(() => {
    const violations = a11yTesting.runBasicChecks(document.body);
    if (violations.length > 0) {
      console.warn('Accessibility violations:', violations);
    }
  }, []);
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>My Module</Card.Title>
      </Card.Header>
      <Card.Content>
        {data ? (
          <div>Last updated: {formatDate(data.updatedAt)}</div>
        ) : (
          <Skeleton variant="text" width="100%" height={20} />
        )}
      </Card.Content>
      <Card.Footer>
        <Button onClick={loadData}>Load Data</Button>
      </Card.Footer>
    </Card>
  );
};
```

## 🚀 Best Practices

1. **Always use TypeScript** for type safety
2. **Include accessibility attributes** (aria-label, role, etc.)
3. **Test performance** with realistic budgets
4. **Use skeleton loading** for better UX
5. **Handle errors gracefully** with proper feedback
6. **Follow consistent naming** conventions
7. **Document complex logic** with JSDoc comments
8. **Test accessibility** with automated tools
9. **Monitor performance** in production
10. **Use semantic HTML** elements

## 🔧 Development

### Adding New Components
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Include accessibility attributes
4. Add comprehensive tests
5. Update this README
6. Export from index files

### Testing New Components
```bash
# Run unit tests
npm test

# Run accessibility tests
npm run test:a11y

# Run performance tests
npm run test:perf

# Run all tests
npm run test:all
```

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance](https://web.dev/performance/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

This shared library provides a solid foundation for building accessible, performant, and maintainable React applications. All components are thoroughly tested and documented for easy integration. 