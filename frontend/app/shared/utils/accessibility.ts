/**
 * Accessibility Framework for AI-BOS Application
 * 
 * WCAG compliance utilities, ARIA helpers, keyboard navigation,
 * and accessibility testing tools for inclusive design.
 */

// WCAG 2.1 AA compliance levels
export enum WCAGLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA'
}

// Accessibility violation types
export interface A11yViolation {
  type: 'error' | 'warning' | 'info';
  rule: string;
  element: string;
  message: string;
  wcagLevel: WCAGLevel;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

// Color contrast ratios for WCAG levels
export const CONTRAST_RATIOS = {
  [WCAGLevel.AA]: {
    normal: 4.5,
    large: 3.0
  },
  [WCAGLevel.AAA]: {
    normal: 7.0,
    large: 4.5
  }
};

/**
 * Color contrast calculation utilities
 */
export const a11yHelpers = {
  /**
   * Calculate relative luminance of a color
   */
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (l1: number, l2: number): number => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if color combination meets WCAG requirements
   */
  checkColorContrast: (
    color1: string,
    color2: string,
    level: WCAGLevel = WCAGLevel.AA,
    size: 'normal' | 'large' = 'normal'
  ): boolean => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return false;

    const l1 = a11yHelpers.getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = a11yHelpers.getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    const ratio = a11yHelpers.getContrastRatio(l1, l2);

    return ratio >= CONTRAST_RATIOS[level][size];
  },

  /**
   * Generate accessible color suggestions
   */
  suggestAccessibleColors: (
    baseColor: string,
    level: WCAGLevel = WCAGLevel.AA
  ): string[] => {
    // Implementation for color suggestion algorithm
    // This would analyze the base color and suggest alternatives
    // that meet the specified WCAG level
    return [];
  }
};

/**
 * ARIA (Accessible Rich Internet Applications) utilities
 */
export const ariaHelpers = {
  /**
   * Generate unique ID for ARIA relationships
   */
  generateId: (prefix: string = 'a11y'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Set up ARIA label and description relationships
   */
  setupAriaRelationships: (
    element: HTMLElement,
    label?: string,
    description?: string
  ) => {
    if (label) {
      const labelId = ariaHelpers.generateId('label');
      element.setAttribute('aria-labelledby', labelId);
      
      const labelElement = document.createElement('span');
      labelElement.id = labelId;
      labelElement.className = 'sr-only';
      labelElement.textContent = label;
      element.parentNode?.insertBefore(labelElement, element);
    }

    if (description) {
      const descId = ariaHelpers.generateId('desc');
      element.setAttribute('aria-describedby', descId);
      
      const descElement = document.createElement('span');
      descElement.id = descId;
      descElement.className = 'sr-only';
      descElement.textContent = description;
      element.parentNode?.insertBefore(descElement, element);
    }
  },

  /**
   * Set up ARIA live regions for dynamic content
   */
  setupLiveRegion: (
    element: HTMLElement,
    politeness: 'polite' | 'assertive' | 'off' = 'polite'
  ) => {
    element.setAttribute('aria-live', politeness);
    element.setAttribute('aria-atomic', 'true');
  },

  /**
   * Announce changes to screen readers
   */
  announce: (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Set up ARIA expanded state
   */
  setupExpanded: (trigger: HTMLElement, target: HTMLElement) => {
    const updateExpanded = () => {
      const isExpanded = target.style.display !== 'none';
      trigger.setAttribute('aria-expanded', isExpanded.toString());
    };

    updateExpanded();
    
    // Observe changes to target visibility
    const observer = new MutationObserver(updateExpanded);
    observer.observe(target, { attributes: true, attributeFilter: ['style'] });
    
    return () => observer.disconnect();
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardHelpers = {
  /**
   * Handle keyboard navigation in lists
   */
  handleListNavigation: (
    items: HTMLElement[],
    onSelect?: (index: number) => void
  ) => {
    let currentIndex = -1;

    const focusItem = (index: number) => {
      if (index >= 0 && index < items.length) {
        items[index].focus();
        currentIndex = index;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusItem(currentIndex + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusItem(currentIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusItem(0);
          break;
        case 'End':
          event.preventDefault();
          focusItem(items.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (currentIndex >= 0 && onSelect) {
            onSelect(currentIndex);
          }
          break;
      }
    };

    // Add event listeners
    items.forEach((item, index) => {
      item.addEventListener('keydown', handleKeyDown);
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      item.setAttribute('role', 'listitem');
    });

    // Return cleanup function
    return () => {
      items.forEach(item => {
        item.removeEventListener('keydown', handleKeyDown);
      });
    };
  },

  /**
   * Handle modal keyboard navigation
   */
  handleModalNavigation: (modal: HTMLElement, closeCallback?: () => void) => {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape' && closeCallback) {
        closeCallback();
      }
    };

    modal.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Skip to main content link
   */
  createSkipLink: (targetId: string = 'main-content'): HTMLElement => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
    `;
    
    return skipLink;
  }
};

/**
 * Focus management utilities
 */
export const focusHelpers = {
  /**
   * Trap focus within a container
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Save and restore focus
   */
  saveFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement;
  },

  restoreFocus: (element: HTMLElement | null) => {
    element?.focus();
  },

  /**
   * Focus first focusable element
   */
  focusFirst: (container: HTMLElement) => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    focusable?.focus();
  }
};

/**
 * Accessibility testing utilities
 */
export const a11yTesting = {
  /**
   * Run basic accessibility checks
   */
  runBasicChecks: (container: HTMLElement): A11yViolation[] => {
    const violations: A11yViolation[] = [];

    // Check for alt attributes on images
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        violations.push({
          type: 'error',
          rule: 'WCAG 2.1.1',
          element: img.outerHTML,
          message: 'Image missing alt attribute',
          wcagLevel: WCAGLevel.A,
          impact: 'critical'
        });
      }
    });

    // Check for form labels
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type !== 'hidden' && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
          violations.push({
            type: 'error',
            rule: 'WCAG 2.1.1',
            element: input.outerHTML,
            message: 'Form control missing label',
            wcagLevel: WCAGLevel.A,
            impact: 'critical'
          });
        }
      }
    });

    // Check for heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        violations.push({
          type: 'warning',
          rule: 'WCAG 2.4.6',
          element: heading.outerHTML,
          message: 'Heading level skipped',
          wcagLevel: WCAGLevel.AA,
          impact: 'moderate'
        });
      }
      previousLevel = level;
    });

    // Check for sufficient color contrast (basic check)
    const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // This is a simplified check - in practice, you'd want more sophisticated color analysis
      if (color === backgroundColor) {
        violations.push({
          type: 'error',
          rule: 'WCAG 1.4.3',
          element: element.outerHTML,
          message: 'Insufficient color contrast',
          wcagLevel: WCAGLevel.AA,
          impact: 'serious'
        });
      }
    });

    return violations;
  },

  /**
   * Generate accessibility report
   */
  generateReport: (violations: A11yViolation[]): string => {
    const errorCount = violations.filter(v => v.type === 'error').length;
    const warningCount = violations.filter(v => v.type === 'warning').length;
    const infoCount = violations.filter(v => v.type === 'info').length;

    let report = `Accessibility Report\n`;
    report += `==================\n\n`;
    report += `Summary:\n`;
    report += `- Errors: ${errorCount}\n`;
    report += `- Warnings: ${warningCount}\n`;
    report += `- Info: ${infoCount}\n\n`;

    if (violations.length > 0) {
      report += `Violations:\n`;
      violations.forEach((violation, index) => {
        report += `${index + 1}. ${violation.type.toUpperCase()}: ${violation.rule}\n`;
        report += `   Impact: ${violation.impact}\n`;
        report += `   WCAG Level: ${violation.wcagLevel}\n`;
        report += `   Message: ${violation.message}\n`;
        report += `   Element: ${violation.element.substring(0, 100)}...\n\n`;
      });
    } else {
      report += `No accessibility violations found! 🎉\n`;
    }

    return report;
  }
};

/**
 * Screen reader utilities
 */
export const screenReaderHelpers = {
  /**
   * Announce page changes
   */
  announcePageChange: (pageTitle: string) => {
    ariaHelpers.announce(`Navigated to ${pageTitle}`);
  },

  /**
   * Announce loading states
   */
  announceLoading: (message: string = 'Loading...') => {
    ariaHelpers.announce(message, 'polite');
  },

  /**
   * Announce completion
   */
  announceComplete: (message: string) => {
    ariaHelpers.announce(message, 'polite');
  },

  /**
   * Announce errors
   */
  announceError: (message: string) => {
    ariaHelpers.announce(`Error: ${message}`, 'assertive');
  }
};

/**
 * Export all accessibility utilities
 */
export default {
  a11yHelpers,
  ariaHelpers,
  keyboardHelpers,
  focusHelpers,
  a11yTesting,
  screenReaderHelpers,
  WCAGLevel,
  CONTRAST_RATIOS
}; 