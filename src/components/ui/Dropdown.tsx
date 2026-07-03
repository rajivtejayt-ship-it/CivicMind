"use client";
import React, { forwardRef } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, hint, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-label text-ink font-semibold">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-lg border bg-surface pl-3 pr-10 py-2 text-body text-ink transition-cm hover:border-brand/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:bg-disabled disabled:text-ink-muted/60 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? "border-status-danger focus-visible:border-status-danger focus-visible:ring-status-danger/20"
                : "border-border-subtle focus-visible:border-brand focus-visible:ring-brand/20"
            } ${className}`}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted/60">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {hint && !error && (
          <span id={`${selectId}-hint`} className="text-caption text-ink-muted">
            {hint}
          </span>
        )}
        {error && (
          <span
            id={`${selectId}-error`}
            role="alert"
            className="text-caption text-status-danger font-medium"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";
