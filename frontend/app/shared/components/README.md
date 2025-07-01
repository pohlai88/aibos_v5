# Shared Components Library

This directory contains reusable UI components and utilities that are shared across all modules in the AI-BOS application.

## 📁 Directory Structure

```
shared/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Footer, etc.)
│   ├── forms/          # Form components and validation
│   ├── data/           # Data display components (Table, Chart, etc.)
│   └── feedback/       # Feedback components (Loading, Error, Success, etc.)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## 🎯 Component Guidelines

### **Naming Convention**
- Use PascalCase for component names: `UserCard.tsx`
- Use kebab-case for file names: `user-card.tsx`
- Use descriptive, semantic names

### **Component Structure**
```typescript
// Component template
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  return (
    // JSX
  );
}
```

### **TypeScript Requirements**
- All components must be fully typed
- Use proper interfaces for props
- Export types when needed by other components

### **Styling Guidelines**
- Use Tailwind CSS for styling
- Use `cn()` utility for conditional classes
- Follow design system tokens
- Ensure responsive design

### **Error Handling**
- Include proper error boundaries
- Handle loading states
- Provide fallback UI

## 📦 Available Components

### UI Components (`ui/`)
- `Button` - Primary, secondary, and variant buttons
- `Card` - Content containers with shadows and borders
- `Input` - Form input fields with validation
- `Modal` - Overlay dialogs and popups
- `Badge` - Status indicators and labels

### Layout Components (`layout/`)
- `Header` - Application header with navigation
- `Sidebar` - Navigation sidebar
- `Footer` - Application footer
- `Container` - Content wrapper with max-width

### Form Components (`forms/`)
- `Form` - Form wrapper with validation
- `Field` - Form field with label and error handling
- `Select` - Dropdown selection component
- `Checkbox` - Checkbox input component

### Data Components (`data/`)
- `Table` - Data table with sorting and pagination
- `Chart` - Chart components (using Chart.js)
- `List` - List components with virtualization
- `Card` - Data display cards

### Feedback Components (`feedback/`)
- `Loading` - Loading spinners and skeletons
- `Error` - Error message components
- `Success` - Success message components
- `Toast` - Toast notification system

## 🔧 Usage Examples

### Basic Component Usage
```typescript
import { Button } from '@/app/shared/components/ui/button';
import { Card } from '@/app/shared/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

### With Custom Hooks
```typescript
import { useLocalStorage } from '@/app/shared/hooks/use-local-storage';
import { formatCurrency } from '@/app/shared/utils/format';

export function PriceDisplay({ amount }: { amount: number }) {
  const [currency] = useLocalStorage('currency', 'USD');
  return <span>{formatCurrency(amount, currency)}</span>;
}
```

## 🚀 Development Workflow

### Creating New Components
1. Create component file in appropriate directory
2. Add TypeScript interfaces
3. Implement component with proper styling
4. Add JSDoc comments for documentation
5. Create story in Storybook (if applicable)
6. Add tests

### Testing Requirements
- Unit tests for all components
- Integration tests for complex components
- Accessibility testing
- Visual regression testing

### Documentation
- JSDoc comments for all exported functions
- Usage examples in README
- Storybook stories for visual documentation
- TypeScript interfaces for all props

## 🔗 Dependencies

### Required Packages
- `react` - React framework
- `tailwindcss` - Styling framework
- `clsx` - Conditional class names
- `@types/react` - TypeScript types

### Optional Packages
- `framer-motion` - Animations
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `lucide-react` - Icons

## 📝 Contributing

1. Follow the component guidelines
2. Add proper TypeScript types
3. Include error handling
4. Write tests for new components
5. Update documentation
6. Ensure accessibility compliance

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