import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Loading({ 
  variant = 'spinner', 
  size = 'md', 
  text = 'Loading...',
  className 
}: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <svg
          className={cn('animate-spin text-primary', sizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)}>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  return null;
}

export function Skeleton({ className, height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        height,
        width,
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
} 