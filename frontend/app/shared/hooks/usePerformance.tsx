/**
 * Performance Monitoring Hook for AI-BOS Application
 *
 * Comprehensive performance tracking with metrics collection,
 * performance budgets, and real-time monitoring capabilities.
 */

import { useEffect, useRef, useState, useCallback } from "react";

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  fcp?: number; // First Contentful Paint

  // Custom metrics
  moduleLoadTime?: number;
  apiResponseTime?: number;
  renderTime?: number;
  memoryUsage?: number;

  // User interaction metrics
  clickToResponse?: number;
  formSubmissionTime?: number;
  navigationTime?: number;

  // Error tracking
  errors: string[];
  warnings: string[];
}

// Performance budget configuration
export interface PerformanceBudget {
  lcp: number; // 2.5s
  fid: number; // 100ms
  cls: number; // 0.1
  ttfb: number; // 600ms
  fcp: number; // 1.8s
  moduleLoadTime: number; // 1s
  apiResponseTime: number; // 500ms
  renderTime: number; // 100ms
}

// Default performance budgets (Web Vitals thresholds)
const DEFAULT_BUDGET: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  ttfb: 600,
  fcp: 1800,
  moduleLoadTime: 1000,
  apiResponseTime: 500,
  renderTime: 100,
};

// Performance monitoring options
export interface PerformanceOptions {
  budget?: Partial<PerformanceBudget>;
  enableRealTime?: boolean;
  enableReporting?: boolean;
  reportEndpoint?: string;
  sampleRate?: number; // 0-1, percentage of sessions to monitor
}

/**
 * Performance monitoring hook
 */
export const usePerformanceTracking = (
  moduleName: string,
  options: PerformanceOptions = {}
) => {
  const {
    budget = DEFAULT_BUDGET,
    enableRealTime = true,
    enableReporting = true,
    reportEndpoint = "/api/performance",
    sampleRate = 1.0,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    errors: [],
    warnings: [],
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);

  const startTime = useRef<number>(Date.now());
  const moduleLoadStart = useRef<number>(performance.now());
  const observerRef = useRef<PerformanceObserver | null>(null);
  const reportQueue = useRef<PerformanceMetrics[]>([]);

  /**
   * Initialize performance monitoring
   */
  const initializeMonitoring = useCallback(() => {
    if (!enableRealTime || Math.random() > sampleRate) return;

    setIsMonitoring(true);

    // Track module load time
    const moduleLoadEnd = performance.now();
    const loadTime = moduleLoadEnd - moduleLoadStart.current;

    setMetrics((prev) => ({
      ...prev,
      moduleLoadTime: loadTime,
    }));

    // Track Core Web Vitals if supported
    if ("PerformanceObserver" in window) {
      try {
        // Observe LCP
        if ("LargestContentfulPaint" in window) {
          observerRef.current = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            if (lastEntry) {
              setMetrics((prev) => ({
                ...prev,
                lcp: lastEntry.startTime,
              }));
            }
          });
          observerRef.current.observe({
            entryTypes: ["largest-contentful-paint"],
          });
        }

        // Observe FID
        if ("FirstInputDelay" in window) {
          observerRef.current = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const firstEntry = entries[0] as any;
            if (firstEntry) {
              setMetrics((prev) => ({
                ...prev,
                fid: firstEntry.processingStart - firstEntry.startTime,
              }));
            }
          });
          observerRef.current.observe({ entryTypes: ["first-input"] });
        }

        // Observe CLS
        if ("LayoutShift" in window) {
          let clsValue = 0;
          observerRef.current = new PerformanceObserver((list) => {
            const entries = list.getEntries() as any[];
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            setMetrics((prev) => ({
              ...prev,
              cls: clsValue,
            }));
          });
          observerRef.current.observe({ entryTypes: ["layout-shift"] });
        }
      } catch (error) {
        console.warn("Performance monitoring initialization failed:", error);
      }
    }

    // Track memory usage if available
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
      }));
    }

    // Track TTFB and FCP
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as any;
    if (navigationEntry) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        fcp:
          navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
      }));
    }
  }, [enableRealTime, sampleRate]);

  /**
   * Track API response time
   */
  const trackApiCall = useCallback(
    async <T,>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
      const start = performance.now();
      try {
        const result = await apiCall();
        const end = performance.now();
        const responseTime = end - start;

        setMetrics((prev) => ({
          ...prev,
          apiResponseTime: responseTime,
        }));

        if (responseTime > budget.apiResponseTime!) {
          const violation = `API response time (${responseTime}ms) exceeded budget (${budget.apiResponseTime}ms) for ${endpoint}`;
          setViolations((prev) => [...prev, violation]);
          setMetrics((prev) => ({
            ...prev,
            warnings: [...prev.warnings, violation],
          }));
        }

        return result;
      } catch (error) {
        const end = performance.now();
        const responseTime = end - start;

        setMetrics((prev) => ({
          ...prev,
          apiResponseTime: responseTime,
          errors: [...prev.errors, `API call failed: ${error}`],
        }));

        throw error;
      }
    },
    [budget.apiResponseTime]
  );

  /**
   * Track render performance
   */
  const trackRender = useCallback(
    (componentName: string) => {
      return () => {
        const end = performance.now();
        const renderTime = end - moduleLoadStart.current;

        setMetrics((prev) => ({
          ...prev,
          renderTime,
        }));

        if (renderTime > budget.renderTime!) {
          const violation = `Render time (${renderTime}ms) exceeded budget (${budget.renderTime}ms) for ${componentName}`;
          setViolations((prev) => [...prev, violation]);
          setMetrics((prev) => ({
            ...prev,
            warnings: [...prev.warnings, violation],
          }));
        }
      };
    },
    [budget.renderTime]
  );

  /**
   * Track user interaction
   */
  const trackInteraction = useCallback((interactionType: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;

      setMetrics((prev) => ({
        ...prev,
        clickToResponse: duration,
      }));
    };
  }, []);

  /**
   * Track form submission
   */
  const trackFormSubmission = useCallback(
    async <T,>(formSubmit: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      try {
        const result = await formSubmit();
        const end = performance.now();
        const submissionTime = end - start;

        setMetrics((prev) => ({
          ...prev,
          formSubmissionTime: submissionTime,
        }));

        return result;
      } catch (error) {
        const end = performance.now();
        const submissionTime = end - start;

        setMetrics((prev) => ({
          ...prev,
          formSubmissionTime: submissionTime,
          errors: [...prev.errors, `Form submission failed: ${error}`],
        }));

        throw error;
      }
    },
    []
  );

  /**
   * Track navigation
   */
  const trackNavigation = useCallback((from: string, to: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const navigationTime = end - start;

      setMetrics((prev) => ({
        ...prev,
        navigationTime,
      }));
    };
  }, []);

  /**
   * Report performance data
   */
  const reportPerformance = useCallback(async () => {
    if (!enableReporting) return;

    const reportData = {
      moduleName,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem("sessionId") || "unknown",
      userAgent: navigator.userAgent,
      metrics,
      violations,
      budget,
    };

    try {
      await fetch(reportEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });
    } catch (error) {
      console.warn("Failed to report performance data:", error);
      // Queue for retry
      reportQueue.current.push(metrics);
    }
  }, [
    moduleName,
    metrics,
    violations,
    budget,
    enableReporting,
    reportEndpoint,
  ]);

  /**
   * Get performance summary
   */
  const getPerformanceSummary = useCallback(() => {
    const summary = {
      moduleName,
      isMonitoring,
      totalViolations: violations.length,
      hasErrors: metrics.errors.length > 0,
      hasWarnings: metrics.warnings.length > 0,
      coreMetrics: {
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
        fcp: metrics.fcp,
      },
      customMetrics: {
        moduleLoadTime: metrics.moduleLoadTime,
        apiResponseTime: metrics.apiResponseTime,
        renderTime: metrics.renderTime,
        memoryUsage: metrics.memoryUsage,
      },
    };

    return summary;
  }, [moduleName, isMonitoring, violations, metrics]);

  /**
   * Check budget compliance
   */
  const checkBudgetCompliance = useCallback(() => {
    const compliance = {
      lcp: !metrics.lcp || metrics.lcp <= budget.lcp,
      fid: !metrics.fid || metrics.fid <= budget.fid,
      cls: !metrics.cls || metrics.cls <= budget.cls,
      ttfb: !metrics.ttfb || metrics.ttfb <= budget.ttfb,
      fcp: !metrics.fcp || metrics.fcp <= budget.fcp,
      moduleLoadTime:
        !metrics.moduleLoadTime ||
        metrics.moduleLoadTime <= budget.moduleLoadTime,
      apiResponseTime:
        !metrics.apiResponseTime ||
        metrics.apiResponseTime <= budget.apiResponseTime,
      renderTime:
        !metrics.renderTime || metrics.renderTime <= budget.renderTime,
    };

    return {
      ...compliance,
      overall: Object.values(compliance).every(Boolean),
    };
  }, [metrics, budget]);

  /**
   * Cleanup performance monitoring
   */
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    setIsMonitoring(false);
  }, []);

  // Initialize monitoring on mount
  useEffect(() => {
    initializeMonitoring();

    // Report performance data on unmount
    return () => {
      if (enableReporting) {
        reportPerformance();
      }
      cleanup();
    };
  }, [initializeMonitoring, enableReporting, reportPerformance, cleanup]);

  // Periodic reporting
  useEffect(() => {
    if (!enableReporting) return;

    const interval = setInterval(() => {
      if (reportQueue.current.length > 0) {
        // Retry failed reports
        reportQueue.current.forEach(async (queuedMetrics) => {
          try {
            await fetch(reportEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                moduleName,
                timestamp: new Date().toISOString(),
                metrics: queuedMetrics,
                retry: true,
              }),
            });
          } catch (error) {
            console.warn("Failed to retry performance report:", error);
          }
        });
        reportQueue.current = [];
      }
    }, 30000); // Retry every 30 seconds

    return () => clearInterval(interval);
  }, [enableReporting, reportEndpoint, moduleName]);

  return {
    // State
    metrics,
    isMonitoring,
    violations,

    // Tracking methods
    trackApiCall,
    trackRender,
    trackInteraction,
    trackFormSubmission,
    trackNavigation,

    // Analysis methods
    getPerformanceSummary,
    checkBudgetCompliance,

    // Control methods
    reportPerformance,
    cleanup,

    // Budget configuration
    budget,
  };
};

/**
 * Performance monitoring decorator for components
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  moduleName: string,
  options: PerformanceOptions = {}
) => {
  const WrappedComponent = (props: P) => {
    const performance = usePerformanceTracking(moduleName, options);

    return <Component {...props} performance={performance} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

/**
 * Performance monitoring context
 */
export const usePerformanceContext = () => {
  const [globalMetrics, setGlobalMetrics] = useState<
    Record<string, PerformanceMetrics>
  >({});

  const addModuleMetrics = useCallback(
    (moduleName: string, metrics: PerformanceMetrics) => {
      setGlobalMetrics((prev) => ({
        ...prev,
        [moduleName]: metrics,
      }));
    },
    []
  );

  const getGlobalSummary = useCallback(() => {
    const modules = Object.keys(globalMetrics);
    const totalViolations = modules.reduce(
      (sum, module) => sum + (globalMetrics[module].errors?.length || 0),
      0
    );

    return {
      modules,
      totalViolations,
      averageLoadTime:
        modules.reduce(
          (sum, module) => sum + (globalMetrics[module].moduleLoadTime || 0),
          0
        ) / modules.length,
    };
  }, [globalMetrics]);

  return {
    globalMetrics,
    addModuleMetrics,
    getGlobalSummary,
  };
};

export default usePerformanceTracking;
