"use client";
import React, { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  /** Duration in ms before auto-dismiss. Default: 4000 */
  duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 4000 }: ToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const dismiss = setTimeout(() => {
      setLeaving(true);
    }, duration - 300); // start exit animation 300ms before removal

    const remove = setTimeout(onClose, duration);

    return () => {
      clearTimeout(dismiss);
      clearTimeout(remove);
    };
  }, [onClose, duration]);

  const styles =
    type === "success"
      ? "bg-status-success/10 text-status-success border-status-success/20"
      : type === "error"
      ? "bg-status-danger/10 text-status-danger border-status-danger/20"
      : "bg-status-warning/10 text-status-warning border-status-warning/20";

  const icon =
    type === "success" ? (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ) : type === "error" ? (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        animation: leaving
          ? "toast-out 300ms cubic-bezier(0.16,1,0.3,1) forwards"
          : "toast-in 200ms cubic-bezier(0.16,1,0.3,1) both",
      }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-cm-lg max-w-sm ${styles}`}
    >
      {icon}
      <span className="text-sm font-semibold leading-snug">{message}</span>
      <button
        onClick={() => { setLeaving(true); setTimeout(onClose, 300); }}
        aria-label="Dismiss notification"
        className="ml-1 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current cursor-pointer"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
