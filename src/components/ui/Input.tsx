"use client";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-label text-ink font-semibold">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-surface px-3 py-2 text-body text-ink placeholder:text-ink-muted/50 transition-cm hover:border-brand/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:bg-disabled disabled:text-ink-muted/60 disabled:cursor-not-allowed ${
            error
              ? "border-status-danger focus-visible:border-status-danger focus-visible:ring-status-danger/20"
              : "border-border-subtle focus-visible:border-brand focus-visible:ring-brand/20"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <span id={`${inputId}-hint`} className="text-caption text-ink-muted">
            {hint}
          </span>
        )}
        {error && (
          <span
            id={`${inputId}-error`}
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

Input.displayName = "Input";
