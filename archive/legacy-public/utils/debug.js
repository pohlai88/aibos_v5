// Debug utility functions for AIBOS v5
// Usage: Include this script in your HTML pages or import in JS modules

class DebugUtil {
  static isDebugMode =
    localStorage.getItem("debug") === "true" ||
    new URLSearchParams(window.location.search).has("debug");

  static log(...args) {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG ${timestamp}]`, ...args);
    }
  }

  static warn(...args) {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.warn(`[DEBUG ${timestamp}]`, ...args);
    }
  }

  static error(...args) {
    if (this.isDebugMode) {
      const timestamp = new Date().toISOString();
      console.error(`[DEBUG ${timestamp}]`, ...args);
    }
  }

  static table(data, label = "") {
    if (this.isDebugMode) {
      if (label) console.log(`[DEBUG] ${label}`);
      console.table(data);
    }
  }

  static group(label, callback) {
    if (this.isDebugMode) {
      console.group(`[DEBUG] ${label}`);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    }
  }

  static time(label) {
    if (this.isDebugMode) {
      console.time(`[DEBUG] ${label}`);
    }
  }

  static timeEnd(label) {
    if (this.isDebugMode) {
      console.timeEnd(`[DEBUG] ${label}`);
    }
  }

  static inspect(obj, label = "Object") {
    if (this.isDebugMode) {
      console.log(`[DEBUG] ${label}:`, JSON.stringify(obj, null, 2));
    }
  }

  static toggle() {
    const current = localStorage.getItem("debug") === "true";
    localStorage.setItem("debug", (!current).toString());
    console.log(`Debug mode ${!current ? "enabled" : "disabled"}`);
    location.reload();
  }

  static supabaseDebug() {
    if (this.isDebugMode && window.supabase) {
      const originalFrom = window.supabase.from;
      window.supabase.from = function (table) {
        DebugUtil.log(`Supabase query on table: ${table}`);
        const query = originalFrom.call(this, table);

        // Wrap common methods
        const originalSelect = query.select;
        query.select = function (...args) {
          DebugUtil.log(`SELECT: ${args.join(", ")}`);
          return originalSelect.apply(this, args);
        };

        const originalInsert = query.insert;
        query.insert = function (data) {
          DebugUtil.log(`INSERT:`, data);
          return originalInsert.call(this, data);
        };

        const originalUpdate = query.update;
        query.update = function (data) {
          DebugUtil.log(`UPDATE:`, data);
          return originalUpdate.call(this, data);
        };

        const originalDelete = query.delete;
        query.delete = function () {
          DebugUtil.log(`DELETE operation`);
          return originalDelete.call(this);
        };

        return query;
      };
    }
  }

  static networkDebug() {
    if (this.isDebugMode) {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const [url, options = {}] = args;
        DebugUtil.log(`FETCH: ${options.method || "GET"} ${url}`, options);

        try {
          const response = await originalFetch.apply(this, args);
          DebugUtil.log(
            `FETCH Response: ${response.status} ${response.statusText}`,
            response
          );
          return response;
        } catch (error) {
          DebugUtil.error(`FETCH Error:`, error);
          throw error;
        }
      };
    }
  }

  static domDebug() {
    if (this.isDebugMode) {
      // Add visual indicators for debug mode
      const debugIndicator = document.createElement("div");
      debugIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ff4444;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
      `;
      debugIndicator.textContent = "DEBUG MODE";
      document.body.appendChild(debugIndicator);

      // Log DOM mutations
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            DebugUtil.log("DOM added:", mutation.addedNodes);
          }
          if (mutation.type === "attributes") {
            DebugUtil.log(
              `Attribute changed: ${mutation.attributeName} on`,
              mutation.target
            );
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }

  static init() {
    if (this.isDebugMode) {
      console.log(
        "%c🐛 Debug Mode Enabled",
        "color: #ff4444; font-size: 16px; font-weight: bold;"
      );
      this.supabaseDebug();
      this.networkDebug();

      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.domDebug());
      } else {
        this.domDebug();
      }

      // Global debug utilities
      window.debug = this;
      window.debugToggle = () => this.toggle();
    }
  }
}

// Auto-initialize
DebugUtil.init();

// Export for ES modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = DebugUtil;
}
