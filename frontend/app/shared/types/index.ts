/**
 * Common TypeScript type definitions for the AI-BOS application
 */

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by: string;
  project_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Employee Types
export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  primary_email: string;
  recovery_email?: string;
  user_type: UserType;
  status: EmployeeStatus;
  department_id?: string;
  position?: string;
  date_joined?: string;
  date_left?: string;
  created_at: string;
  updated_at: string;
}

export type UserType = 'employee' | 'candidate' | 'contractor' | 'vendor';
export type EmployeeStatus = 'active' | 'inactive' | 'pre-boarding' | 'left-company';

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by: string;
  project_id?: string;
  created_at: string;
}

// Approval Types
export interface Approval {
  id: string;
  task_id?: string;
  document_id?: string;
  requester_id: string;
  status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// Chat and Message Types
export interface Chat {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author_id: string;
  parent_id?: string;
  task_id?: string;
  document_id?: string;
  discussion_id?: string;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  source_type: NotificationSourceType;
  source_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type NotificationSourceType = 'task' | 'approval' | 'document' | 'chat' | 'comment';

// Department Types
export interface Department {
  id: string;
  name: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// UI Component Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  projectId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  created_at: string;
} 