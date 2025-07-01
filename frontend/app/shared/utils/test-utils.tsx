/**
 * Testing Infrastructure for AI-BOS Application
 * 
 * Comprehensive test utilities for unit testing, integration testing,
 * and test data management across all modules.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

// Test environment configuration
export interface TestConfig {
  mockSupabase?: boolean;
  mockAuth?: boolean;
  mockApi?: boolean;
  testData?: Record<string, any>;
}

/**
 * Setup test environment with common configurations
 */
export const setupTestEnvironment = (config: TestConfig = {}) => {
  const {
    mockSupabase = true,
    mockAuth = true,
    mockApi = true,
    testData = {}
  } = config;

  // Mock Supabase client
  if (mockSupabase) {
    jest.mock('@/lib/supabaseClient', () => ({
      getSupabaseClient: jest.fn(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: testData.user, error: null })),
              order: jest.fn(() => ({
                limit: jest.fn(() => Promise.resolve({ data: testData.users || [], error: null }))
              }))
            })),
            insert: jest.fn(() => Promise.resolve({ data: testData.createdItem, error: null })),
            update: jest.fn(() => Promise.resolve({ data: testData.updatedItem, error: null })),
            delete: jest.fn(() => Promise.resolve({ error: null }))
          })),
          auth: {
            getUser: jest.fn(() => Promise.resolve({ data: { user: testData.authUser }, error: null })),
            signIn: jest.fn(() => Promise.resolve({ data: { user: testData.authUser }, error: null })),
            signOut: jest.fn(() => Promise.resolve({ error: null }))
          }
        }))
      }))
    }));
  }

  // Mock authentication
  if (mockAuth) {
    jest.mock('@/hooks/useAuth', () => ({
      useAuth: () => ({
        user: testData.authUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn()
      })
    }));
  }

  // Mock API calls
  if (mockApi) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testData.apiResponse || {}),
        status: 200
      })
    ) as jest.Mock;
  }

  // Setup test data
  return {
    testData,
    cleanup: () => {
      jest.clearAllMocks();
      jest.resetModules();
    }
  };
};

/**
 * Custom render function with providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-testid="test-provider">
        {children}
      </div>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Test data factories
 */
export const createTestUser = (overrides: Partial<any> = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createTestEmployee = (overrides: Partial<any> = {}) => ({
  id: 'test-employee-id',
  employee_id: 'EMP001',
  full_name: 'Test Employee',
  primary_email: 'employee@example.com',
  user_type: 'employee',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createTestTask = (overrides: Partial<any> = {}) => ({
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test task description',
  status: 'pending',
  priority: 'medium',
  assigned_to: 'test-user-id',
  created_by: 'test-user-id',
  due_date: '2024-12-31',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createTestProject = (overrides: Partial<any> = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  description: 'Test project description',
  created_by: 'test-user-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

/**
 * Mock data collections
 */
export const mockData = {
  users: [
    createTestUser({ id: 'user-1', email: 'user1@example.com' }),
    createTestUser({ id: 'user-2', email: 'user2@example.com' })
  ],
  employees: [
    createTestEmployee({ id: 'emp-1', employee_id: 'EMP001' }),
    createTestEmployee({ id: 'emp-2', employee_id: 'EMP002' })
  ],
  tasks: [
    createTestTask({ id: 'task-1', title: 'Task 1' }),
    createTestTask({ id: 'task-2', title: 'Task 2' })
  ],
  projects: [
    createTestProject({ id: 'proj-1', name: 'Project 1' }),
    createTestProject({ id: 'proj-2', name: 'Project 2' })
  ]
};

/**
 * Async test utilities
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};

/**
 * Form testing utilities
 */
export const fillForm = async (formData: Record<string, string>) => {
  for (const [name, value] of Object.entries(formData)) {
    const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
};

export const submitForm = async (formSelector: string = 'form') => {
  const form = document.querySelector(formSelector) as HTMLFormElement;
  if (form) {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  }
};

/**
 * API testing utilities
 */
export const mockApiResponse = (data: any, status: number = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(data),
      status
    })
  ) as jest.Mock;
};

export const mockApiError = (error: string, status: number = 500) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error }),
      status
    })
  ) as jest.Mock;
};

/**
 * Supabase testing utilities
 */
export const mockSupabaseQuery = (table: string, data: any, error: any = null) => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data, error }))
        }))
      }))
    }))
  };
  
  (getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  return mockSupabase;
};

/**
 * Performance testing utilities
 */
export const measurePerformance = async (fn: () => void | Promise<void>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

export const assertPerformance = async (
  fn: () => void | Promise<void>,
  maxDuration: number
) => {
  const duration = await measurePerformance(fn);
  expect(duration).toBeLessThan(maxDuration);
};

/**
 * Accessibility testing utilities
 */
export const checkA11y = async (container: HTMLElement) => {
  // Basic accessibility checks
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img).toHaveAttribute('alt');
  });

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    expect(button).toHaveAttribute('aria-label');
  });

  const inputs = container.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.type !== 'hidden') {
      expect(input).toHaveAttribute('aria-label');
    }
  });
};

/**
 * Test cleanup utilities
 */
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks();
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
  document.body.innerHTML = '';
};

/**
 * Test configuration presets
 */
export const testConfigs = {
  unit: {
    mockSupabase: true,
    mockAuth: true,
    mockApi: true
  },
  integration: {
    mockSupabase: false,
    mockAuth: false,
    mockApi: false
  },
  e2e: {
    mockSupabase: false,
    mockAuth: false,
    mockApi: false
  }
};

/**
 * Export all utilities for easy importing
 */
export default {
  setupTestEnvironment,
  renderWithProviders,
  createTestUser,
  createTestEmployee,
  createTestTask,
  createTestProject,
  mockData,
  waitFor,
  waitForElementToBeRemoved,
  fillForm,
  submitForm,
  mockApiResponse,
  mockApiError,
  mockSupabaseQuery,
  measurePerformance,
  assertPerformance,
  checkA11y,
  cleanupTestEnvironment,
  testConfigs
}; 