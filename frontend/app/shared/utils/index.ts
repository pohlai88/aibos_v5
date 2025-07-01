/**
 * Shared Utilities Index
 *
 * Centralized exports for all shared utilities, components, and helpers
 * to provide clean and organized imports across the application.
 */

// Core utilities
export * from "./format";
export * from "./test-utils";
export * from "./accessibility";

// Performance monitoring
export { default as usePerformanceTracking } from "../hooks/usePerformance";

// Local storage hook
export { default as useLocalStorage } from "../hooks/use-local-storage";

// UI Components
export { default as Button } from "../components/ui/button";
export { default as Card } from "../components/ui/card";

// Feedback Components
export { default as Loading } from "../components/feedback/loading";
export {
  default as Skeleton,
  SkeletonGroup,
  SkeletonLayouts,
  SkeletonWrapper,
} from "../components/feedback/Skeleton";

// Types
export * from "../types";

// Constants
export * from "../constants";

// Import utilities for re-export
import * as formatUtils from "./format";
import * as testUtils from "./test-utils";
import * as a11yUtils from "./accessibility";
import usePerformanceTracking from "../hooks/usePerformance";
import useLocalStorage from "../hooks/use-local-storage";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Loading from "../components/feedback/loading";
import Skeleton from "../components/feedback/Skeleton";
import * as types from "../types";
import * as constants from "../constants";

// Re-export commonly used utilities for convenience
export const utils = {
  format: formatUtils,
  test: testUtils,
  a11y: a11yUtils,
  performance: usePerformanceTracking,
  storage: useLocalStorage,
};

// Default export for easy importing
const sharedUtils = {
  // Utilities
  format: formatUtils,
  test: testUtils,
  a11y: a11yUtils,

  // Hooks
  usePerformanceTracking,
  useLocalStorage,

  // Components
  Button,
  Card,
  Loading,
  Skeleton,

  // Types
  ...types,

  // Constants
  ...constants,
};

export default sharedUtils;
