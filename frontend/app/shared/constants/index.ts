/**
 * Application constants for the AI-BOS system
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: [
    '.pdf', '.doc', '.docx', '.txt',
    '.jpg', '.jpeg', '.png', '.gif',
    '.xlsx', '.xls', '.csv',
    '.zip', '.rar'
  ],
  MAX_FILES_PER_UPLOAD: 10,
} as const;

// Task Status Options
export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'gray' },
] as const;

// Task Priority Options
export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
] as const;

// Employee Status Options
export const EMPLOYEE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'pre-boarding', label: 'Pre-boarding', color: 'blue' },
  { value: 'left-company', label: 'Left Company', color: 'red' },
] as const;

// User Type Options
export const USER_TYPE_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'vendor', label: 'Vendor' },
] as const;

// Approval Status Options
export const APPROVAL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  APPROVAL_REQUESTED: 'approval_requested',
  APPROVAL_DECIDED: 'approval_decided',
  DOCUMENT_UPLOADED: 'document_uploaded',
  COMMENT_ADDED: 'comment_added',
  MESSAGE_RECEIVED: 'message_received',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  ORANGE: '#F97316',
  TEAL: '#14B8A6',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
  RELATIVE: 'relative',
} as const;

// Currency Options
export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  CURRENCY: 'currency',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_PREFERENCES: 'table_preferences',
  DASHBOARD_LAYOUT: 'dashboard_layout',
} as const;

// Route Paths
export const ROUTES = {
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  TASKS: '/tasks',
  CHATS: '/chats',
  APPROVALS: '/approvals',
  DOCUMENTS: '/documents',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Item created successfully.',
  UPDATED: 'Item updated successfully.',
  DELETED: 'Item deleted successfully.',
  UPLOADED: 'File uploaded successfully.',
  SENT: 'Message sent successfully.',
  APPROVED: 'Approval granted successfully.',
  REJECTED: 'Approval rejected successfully.',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address.',
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  },
  PHONE: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number.',
  },
  URL: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://',
  },
} as const;

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const; 