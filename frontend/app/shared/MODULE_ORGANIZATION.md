# Module Organization Guide

## 📋 Overview

This document outlines the standardized module organization system for the AI-BOS application. All modules are organized in the `frontend/app/` directory following Next.js App Router conventions and our custom shared component architecture.

## 🏗️ Architecture

### Directory Structure

```
frontend/app/
├── shared/                    # Shared components and utilities
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Basic UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   ├── data/            # Data display components
│   │   └── feedback/        # Loading, error, success components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── constants/           # Application constants
│   └── templates/           # Module templates
├── dashboard/               # Dashboard module
├── employees/               # Employee management module
├── tasks/                   # Task management module
├── chats/                   # Chat/messaging module
├── approvals/               # Approval workflow module
├── documents/               # Document management module
├── notifications/           # Notification center module
└── [future-modules]/        # Additional modules
```

## 🎯 Module Guidelines

### 1. **Naming Conventions**

- **Directories**: Use kebab-case (`employee-management`)
- **Files**: Use kebab-case (`employee-list.tsx`)
- **Components**: Use PascalCase (`EmployeeList`)
- **Functions**: Use camelCase (`fetchEmployees`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### 2. **File Structure**

Each module should follow this structure:

```
module-name/
├── page.tsx                 # Main module page
├── [id]/
│   ├── page.tsx            # Detail page
│   ├── edit/
│   │   └── page.tsx        # Edit page
│   └── components/         # Module-specific components
├── new/
│   └── page.tsx            # Create new item page
├── components/             # Module-specific components
├── hooks/                  # Module-specific hooks
├── utils/                  # Module-specific utilities
├── types.ts                # Module-specific types
└── README.md               # Module documentation
```

### 3. **Component Organization**

#### Shared Components (`shared/components/`)

- **UI Components**: Basic building blocks (Button, Card, Input)
- **Layout Components**: Page structure (Header, Sidebar, Footer)
- **Form Components**: Form handling and validation
- **Data Components**: Data display (Table, Chart, List)
- **Feedback Components**: Loading, error, success states

#### Module-Specific Components

- Keep module-specific components in the module directory
- Only move to shared if used by multiple modules
- Use descriptive names that indicate the module context

### 4. **TypeScript Requirements**

- All components must be fully typed
- Use interfaces for props and data structures
- Export types from `shared/types/index.ts` for common types
- Create module-specific types in `module-name/types.ts`

### 5. **State Management**

- Use React hooks for local state
- Use shared hooks for common functionality
- Implement proper loading and error states
- Use local storage for user preferences

## 🚀 Creating a New Module

### Step 1: Use the Template

1. Copy `shared/templates/module-template.tsx`
2. Rename to your module name
3. Update the component name and functionality
4. Replace placeholder data with your actual data structure

### Step 2: Set Up the Directory

```bash
mkdir frontend/app/your-module
cd frontend/app/your-module
```

### Step 3: Create Required Files

```typescript
// page.tsx - Main module page
export default function YourModulePage() {
  // Implementation
}

// types.ts - Module-specific types
export interface YourModuleItem {
  id: string;
  title: string;
  // ... other fields
}

// README.md - Module documentation
# Your Module

Description of what this module does...
```

### Step 4: Add to Navigation

Update `frontend/app/layout.tsx` to include your module in the navigation.

## 📦 Shared Components Usage

### Basic Usage

```typescript
import { Button } from '@/app/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Loading } from '@/app/shared/components/feedback/loading';
```

### Advanced Usage

```typescript
import { useLocalStorage } from '@/app/shared/hooks/use-local-storage';
import { formatCurrency, formatDate } from '@/app/shared/utils/format';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/app/shared/constants';
import { Task, Employee } from '@/app/shared/types';
```

## 🔧 Best Practices

### 1. **Error Handling**

- Always implement try-catch blocks for async operations
- Use shared error messages from constants
- Provide user-friendly error messages
- Implement retry mechanisms where appropriate

### 2. **Loading States**

- Show loading indicators for all async operations
- Use skeleton components for better UX
- Implement progressive loading for large datasets

### 3. **Data Fetching**

- Use Supabase client for database operations
- Implement proper pagination
- Add filtering and sorting capabilities
- Cache data when appropriate

### 4. **Form Handling**

- Use proper form validation
- Implement real-time validation
- Show clear error messages
- Use shared form components

### 5. **Responsive Design**

- Use Tailwind CSS for styling
- Ensure mobile-first design
- Test on different screen sizes
- Use responsive grid layouts

### 6. **Performance**

- Implement proper memoization
- Use React.memo for expensive components
- Optimize bundle size
- Implement lazy loading

## 🧪 Testing Guidelines

### 1. **Unit Tests**

- Test all utility functions
- Test component rendering
- Test user interactions
- Mock external dependencies

### 2. **Integration Tests**

- Test module workflows
- Test data flow
- Test error scenarios
- Test loading states

### 3. **E2E Tests**

- Test complete user journeys
- Test cross-module interactions
- Test responsive behavior
- Test accessibility

## 📚 Documentation

### 1. **Module Documentation**

Each module should include:

- Purpose and functionality
- API endpoints used
- Data structures
- Dependencies
- Usage examples

### 2. **Component Documentation**

- Props interface
- Usage examples
- Accessibility considerations
- Performance notes

### 3. **API Documentation**

- Endpoint descriptions
- Request/response formats
- Error codes
- Authentication requirements

## 🔄 Migration from Legacy Modules

### From `src/modules/` to `frontend/app/`

1. **Analyze the legacy module**
   - Identify functionality
   - Map data structures
   - List dependencies

2. **Create new module structure**
   - Use the module template
   - Implement TypeScript types
   - Add proper error handling

3. **Migrate functionality**
   - Convert HTML/JS to React components
   - Implement proper state management
   - Add loading and error states

4. **Test thoroughly**
   - Verify all functionality works
   - Test error scenarios
   - Ensure responsive design

5. **Update navigation**
   - Add to layout.tsx
   - Update any hardcoded links
   - Test navigation flow

## 🛠️ Development Workflow

### 1. **Feature Development**

1. Create feature branch
2. Use module template as starting point
3. Implement functionality
4. Add tests
5. Update documentation
6. Create pull request

### 2. **Code Review**

- Check TypeScript compliance
- Verify error handling
- Test responsive design
- Review accessibility
- Check performance

### 3. **Deployment**

- Run all tests
- Check bundle size
- Verify production build
- Test on staging environment
- Deploy to production

## 🎨 Design System

### Colors

- Primary: `#007AFF` (Blue)
- Secondary: `#6B7280` (Gray)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Yellow)
- Error: `#EF4444` (Red)

### Typography

- Font Family: Inter
- Headings: Font weights 600-700
- Body: Font weight 400
- Captions: Font weight 500

### Spacing

- Base unit: 4px
- Common spacing: 4, 8, 12, 16, 20, 24, 32, 48, 64

### Border Radius

- Small: 4px
- Medium: 8px
- Large: 12px
- Extra Large: 16px

## 🔗 Useful Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Supabase Documentation](https://supabase.com/docs)

## 📞 Support

For questions about module organization:

1. Check this documentation first
2. Review existing modules for examples
3. Use the module template as reference
4. Ask in team discussions
5. Create an issue for complex problems

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: AI-BOS Development Team 