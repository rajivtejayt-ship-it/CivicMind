"use client";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** When true, the card lifts on hover (for clickable/interactive cards) */
  interactive?: boolean;
}

export function BaseCard({ children, className = "", interactive = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border-subtle bg-surface p-6 shadow-cm-md ${
        interactive ? "card-interactive cursor-pointer" : "transition-cm hover:shadow-cm-lg"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface MetricCardProps extends Omit<CardProps, "interactive"> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: "success" | "warning" | "danger" | "info";
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  trendType = "info",
  className = "",
  ...props
}: MetricCardProps) {
  const trendColor =
    trendType === "success"
      ? "text-status-success"
      : trendType === "warning"
      ? "text-status-warning"
      : trendType === "danger"
      ? "text-status-danger"
      : "text-status-info";

  return (
    <BaseCard className={`flex flex-col justify-between ${className}`} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption text-ink-muted">{title}</p>
          <h3 className="text-h2 font-semibold text-ink mt-1">{value}</h3>
        </div>
        {icon && <div className="text-brand p-2 bg-canvas rounded-lg">{icon}</div>}
      </div>
      {trend && (
        <div className={`text-caption font-semibold mt-4 ${trendColor}`}>
          {trend}
        </div>
      )}
    </BaseCard>
  );
}

interface IssueCardProps extends Omit<CardProps, "interactive"> {
  title: string;
  description: string;
  statusBadge: React.ReactNode;
  category?: string;
  upvotes?: number;
  commentsCount?: number;
  location?: string;
  onUpvote?: (e: React.MouseEvent) => void;
  footerActions?: React.ReactNode;
}

export function IssueCard({
  title,
  description,
  statusBadge,
  category,
  upvotes = 0,
  commentsCount = 0,
  location,
  onUpvote,
  footerActions,
  className = "",
  ...props
}: IssueCardProps) {
  return (
    <BaseCard interactive className={`flex flex-col gap-4 ${className}`} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {category && (
            <span className="text-caption font-semibold uppercase tracking-wider text-brand">
              {category}
            </span>
          )}
          <h3 className="text-h3 font-semibold text-ink leading-tight">{title}</h3>
        </div>
        {statusBadge}
      </div>

      <p className="text-body text-ink-muted line-clamp-2">{description}</p>

      {location && (
        <div className="flex items-center gap-1.5 text-caption text-ink-muted">
          <svg className="h-4 w-4 text-ink-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-auto">
        <div className="flex items-center gap-4">
          {onUpvote ? (
            <button
              onClick={onUpvote}
              className="flex items-center gap-1.5 rounded-lg bg-canvas px-3 py-1.5 text-caption font-semibold text-ink transition-cm hover:bg-brand hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer"
            >
              ▲ {upvotes}
            </button>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg bg-canvas px-3 py-1.5 text-caption font-semibold text-ink-muted">
              ▲ {upvotes}
            </span>
          )}

          <span className="flex items-center gap-1.5 text-caption text-ink-muted">
            💬 {commentsCount}
          </span>
        </div>

        {footerActions && <div className="flex items-center gap-2">{footerActions}</div>}
      </div>
    </BaseCard>
  );
}
