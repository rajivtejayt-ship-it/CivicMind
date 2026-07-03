"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/nav/AppNav";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// ── Inner shell (consumes AuthContext) ────────────────────────────────────────
function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show full-screen loader while Firebase resolves auth state.
  // This prevents any protected content from flashing before redirect.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <svg
          className="h-8 w-8 animate-spin text-brand"
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
      </div>
    );
  }

  // Do not render protected content while redirect is in flight.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <AppNav />

      {/* ── Extension point: Global Toast Portal (future) ── */}
      {/* Mount a toast provider here when the notification system is built */}

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* ── Extension point: Command Palette / Search (future) ─ */}
      {/* Mount global search overlay here */}

      {/* ── Extension point: Notification Drawer (future) ──── */}
      {/* Mount notification panel here */}
    </div>
  );
}

// ── Layout export ─────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </AuthProvider>
  );
}
