// Debug utilities for Next.js frontend
import React from "react";

/**
 * Debug utility class for client-side debugging
 */
export class ClientDebug {
  private static isDebugMode =
    typeof window !== "undefined" &&
    (localStorage.getItem("debug") === "true" ||
      new URLSearchParams(window.location.search).has("debug"));

  static log(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[CLIENT DEBUG ${timestamp}]`, ...args);
    }
  }

  static warn(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.warn(`[CLIENT DEBUG ${timestamp}]`, ...args);
    }
  }

  static error(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.error(`[CLIENT DEBUG ${timestamp}]`, ...args);
    }
  }

  static table(data: any, label = ""): void {
    if (this.isDebugMode) {
      if (label) console.log(`[CLIENT DEBUG] ${label}`);
      console.table(data);
    }
  }

  static inspect(obj: any, label = "Object"): void {
    if (this.isDebugMode) {
      console.log(`[CLIENT DEBUG] ${label}:`, JSON.stringify(obj, null, 2));
    }
  }

  static toggle(): void {
    if (typeof window === "undefined") return;

    const current = localStorage.getItem("debug") === "true";
    localStorage.setItem("debug", (!current).toString());
    console.log(`Debug mode ${!current ? "enabled" : "disabled"}`);
    window.location.reload();
  }

  static init(): void {
    if (typeof window === "undefined") return;

    if (this.isDebugMode) {
      console.log(
        "%c🐛 Next.js Debug Mode Enabled",
        "color: #0070f3; font-size: 16px; font-weight: bold;"
      );

      // Add global debug utilities
      (window as any).debug = this;
      (window as any).debugToggle = () => this.toggle();
    }
  }
}

/**
 * Server-side debug utilities
 */
export class ServerDebug {
  private static isDebugMode =
    process.env.NODE_ENV === "development" || process.env.DEBUG === "true";

  static log(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[SERVER DEBUG ${timestamp}]`, ...args);
    }
  }

  static warn(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.warn(`[SERVER DEBUG ${timestamp}]`, ...args);
    }
  }

  static error(...args: any[]): void {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.error(`[SERVER DEBUG ${timestamp}]`, ...args);
    }
  }

  static inspect(obj: any, label = "Object"): void {
    if (this.isDebugMode) {
      console.log(`[SERVER DEBUG] ${label}:`, JSON.stringify(obj, null, 2));
    }
  }
}

/**
 * React component debug wrapper
 */
export function withDebug<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return function DebugWrapper(props: P) {
    ClientDebug.log(`Rendering component: ${componentName}`, props);

    return React.createElement(Component, props);
  };
}

/**
 * API route debug wrapper
 */
export function withApiDebug<T extends (...args: any[]) => any>(
  handler: T,
  routeName: string
): T {
  return ((...args: Parameters<T>) => {
    ServerDebug.log(`API Route called: ${routeName}`, { args });

    try {
      const result = handler(...args);

      if (result instanceof Promise) {
        return result
          .then((data) => {
            ServerDebug.log(`API Route success: ${routeName}`, data);
            return data;
          })
          .catch((error) => {
            ServerDebug.error(`API Route error: ${routeName}`, error);
            throw error;
          });
      }

      ServerDebug.log(`API Route success: ${routeName}`, result);
      return result;
    } catch (error) {
      ServerDebug.error(`API Route error: ${routeName}`, error);
      throw error;
    }
  }) as T;
}

// Auto-initialize client debug
if (typeof window !== "undefined") {
  ClientDebug.init();
}
