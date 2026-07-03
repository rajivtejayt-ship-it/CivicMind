"use client";
import React from "react";

export type BadgeType =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "civicCred"
  | "trust"
  | "reputation"
  | "verified";

interface StatusBadgeProps {
  label: string;
  type?: BadgeType;
  className?: string;
}

export function StatusBadge({ label, type = "info", className = "" }: StatusBadgeProps) {
  const styles: Record<BadgeType, string> = {
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
    danger: "bg-status-danger/10 text-status-danger border-status-danger/20",
    info: "bg-status-info/10 text-status-info border-status-info/20",
    civicCred: "bg-civic-cred/10 text-civic-cred border-civic-cred/20",
    trust: "bg-trust/10 text-trust border-trust/20",
    reputation: "bg-reputation/10 text-reputation border-reputation/20",
    verified: "bg-verified/10 text-verified border-verified/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-1 text-caption font-semibold border ${styles[type]} ${className}`}
    >
      {label}
    </span>
  );
}
