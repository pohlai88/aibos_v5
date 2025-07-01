/**
 * Skeleton Loading Component
 * 
 * Provides animated skeleton placeholders for content loading states
 * with accessibility support and customizable styling.
 */

import React from 'react';
import { ariaHelpers } from '@/shared/utils/accessibility';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

/**
 * Individual skeleton element
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  ariaLabel = 'Loading...',
  children
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    none: ''
  };

  const skeletonClasses = [
    baseClasses,
    variantClasses[variant],
    animationClasses[animation],
    className
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={skeletonClasses}
      style={style}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {children}
    </div>
  );
};

/**
 * Skeleton group for multiple elements
 */
interface SkeletonGroupProps {
  count?: number;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 1,
  spacing = 'md',
  className = '',
  children
}) => {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  };

  const groupClasses = [
    spacingClasses[spacing],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} role="status" aria-label="Loading content...">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {children}
        </div>
      ))}
    </div>
  );
};

/**
 * Predefined skeleton layouts
 */
export const SkeletonLayouts = {
  /**
   * Card skeleton layout
   */
  Card: () => (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
      <Skeleton variant="rectangular" height={24} width="60%" className="mb-4" />
      <Skeleton variant="text" height={16} width="100%" className="mb-2" />
      <Skeleton variant="text" height={16} width="80%" className="mb-2" />
      <Skeleton variant="text" height={16} width="90%" />
    </div>
  ),

  /**
   * List item skeleton layout
   */
  ListItem: () => (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton variant="text" height={16} width="70%" className="mb-2" />
        <Skeleton variant="text" height={14} width="50%" />
      </div>
      <Skeleton variant="rectangular" width={60} height={32} />
    </div>
  ),

  /**
   * Table row skeleton layout
   */
  TableRow: () => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4">
        <Skeleton variant="text" height={16} width="80%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="text" height={16} width="60%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="text" height={16} width="40%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="rounded" width={80} height={24} />
      </td>
    </tr>
  ),

  /**
   * Form skeleton layout
   */
  Form: () => (
    <div className="space-y-6">
      <div>
        <Skeleton variant="text" height={16} width="30%" className="mb-2" />
        <Skeleton variant="rectangular" height={40} width="100%" />
      </div>
      <div>
        <Skeleton variant="text" height={16} width="25%" className="mb-2" />
        <Skeleton variant="rectangular" height={40} width="100%" />
      </div>
      <div>
        <Skeleton variant="text" height={16} width="35%" className="mb-2" />
        <Skeleton variant="rectangular" height={100} width="100%" />
      </div>
      <div className="flex space-x-4">
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={80} height={40} />
      </div>
    </div>
  ),

  /**
   * Dashboard skeleton layout
   */
  Dashboard: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" height={32} width="200px" />
        <Skeleton variant="rectangular" width={120} height={40} />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Skeleton variant="text" height={16} width="60%" className="mb-2" />
            <Skeleton variant="text" height={24} width="40%" />
          </div>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton variant="text" height={24} width="150px" className="mb-4" />
          <Skeleton variant="rectangular" height={300} width="100%" />
        </div>
        <div>
          <Skeleton variant="text" height={24} width="120px" className="mb-4" />
          <Skeleton variant="rectangular" height={300} width="100%" />
        </div>
      </div>
    </div>
  )
};

/**
 * Skeleton wrapper for async content
 */
interface SkeletonWrapperProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  loading,
  error,
  children,
  skeleton,
  errorComponent
}) => {
  if (loading) {
    return skeleton ? <>{skeleton}</> : <SkeletonLayouts.Card />;
  }

  if (error) {
    return errorComponent ? (
      <>{errorComponent}</>
    ) : (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="font-medium">Error loading content</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default Skeleton; 