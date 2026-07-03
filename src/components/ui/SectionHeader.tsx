"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  level = 2,
  className = "",
}: SectionHeaderProps) {
  const HeadingTag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  const typographyClass =
    level === 1 ? "text-h1 font-bold" : level === 2 ? "text-h2 font-semibold" : "text-h3 font-semibold";

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 ${className}`}>
      <div className="flex flex-col gap-1">
        <HeadingTag className={`${typographyClass} text-ink tracking-tight`}>
          {title}
        </HeadingTag>
        {subtitle && <p className="text-caption text-ink-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center shrink-0">{action}</div>}
    </div>
  );
}
