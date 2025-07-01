/**
 * Shared Utilities Index
 * 
 * Centralized exports for all shared utilities, components, and helpers
 * to provide clean and organized imports across the application.
 */

// Core utilities
export * from './format';
export * from './test-utils';
export * from './accessibility';

// Performance monitoring
export { default as usePerformanceTracking } from '../hooks/usePerformance';

// Local storage hook
export { default as useLocalStorage } from '../hooks/use-local-storage';

// UI Components
export { default as Button } from '../components/ui/button';
export { default as Card } from '../components/ui/card';

// Feedback Components
export { default as Loading } from '../components/feedback/loading';
export { 
  default as Skeleton, 
  SkeletonGroup, 
  SkeletonLayouts, 
  SkeletonWrapper 
} from '../components/feedback/Skeleton';

// Types
export * from '../types';

// Constants
export * from '../constants';

// Re-export commonly used utilities for convenience
export const utils = {
  format: require('./format'),
  test: require('./test-utils'),
  a11y: require('./accessibility'),
  performance: require('../hooks/usePerformance'),
  storage: require('../hooks/use-local-storage')
};

// Default export for easy importing
export default {
  // Utilities
  format: require('./format'),
  test: require('./test-utils'),
  a11y: require('./accessibility'),
  
  // Hooks
  usePerformanceTracking: require('../hooks/usePerformance').default,
  useLocalStorage: require('../hooks/use-local-storage').default,
  
  // Components
  Button: require('../components/ui/button').default,
  Card: require('../components/ui/card').default,
  Loading: require('../components/feedback/loading').default,
  Skeleton: require('../components/feedback/Skeleton').default,
  
  // Types
  ...require('../types'),
  
  // Constants
  ...require('../constants')
}; 