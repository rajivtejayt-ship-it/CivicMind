"use client";
import React from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, alt = "", name = "", size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-caption",
    md: "h-10 w-10 text-label",
    lg: "h-14 w-14 text-h3",
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-canvas border border-border-subtle select-none shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-semibold text-ink-muted">{getInitials(name)}</span>
      )}
    </div>
  );
}
