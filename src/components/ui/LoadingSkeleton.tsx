"use client";
import React from "react";

interface SkeletonProps {
  className?: string;
}

/** Single skeleton line/block with shimmer animation */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`rounded skeleton-shimmer ${className}`} aria-hidden="true" />;
}

/** Preset composite skeleton for an issue/activity card */
export function LoadingSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-4 w-full ${className}`} aria-busy="true" aria-label="Loading content" role="status">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/** Card-shaped skeleton for grid layouts */
export function CardSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`rounded-2xl border border-border-subtle bg-surface p-6 space-y-4 ${className}`}
      aria-busy="true"
      role="status"
      aria-label="Loading"
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
}
