/**
 * Utility functions for formatting data consistently across the application
 */

/**
 * Format currency values
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format date values
 * @param date - Date to format (Date object or string)
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format phone number
 * @param phoneNumber - Phone number string
 * @param format - Format type ('US', 'international', 'simple')
 * @returns Formatted phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  format: 'US' | 'international' | 'simple' = 'US'
): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (format === 'US' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (format === 'international' && cleaned.length >= 10) {
    return `+${cleaned}`;
  } else {
    return cleaned;
  }
}

/**
 * Format percentage
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format number with thousands separator
 * @param num - Number to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export function formatNumber(
  num: number,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
} 