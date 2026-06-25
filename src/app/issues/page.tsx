"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CivicIssue } from "@/types/civic";

export default function IssuesPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Dynamically import to bypass server-side Firebase build-time errors
        const { getIssues } = await import("@/lib/firebase/issues");
        const data = await getIssues();
        
        // Sort by createdAt DESC
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setIssues(sorted);
      } catch (error) {
        console.error("Failed to load issues:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  const getSeverityStyles = (severity: string) => {
    const s = severity.toLowerCase();
    switch (s) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40";
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800/40";
    }
  };

  const getTrustStyles = (score: number) => {
    if (score <= 40) return "text-rose-600 dark:text-rose-400";
    if (score <= 70) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Community Feed
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Browse recently reported issues.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </header>

        {/* States Section */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <svg
              className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
              Loading issues...
            </span>
          </div>
        )}

        {hasError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
            <svg
              className="mx-auto h-10 w-10 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Unable to load issues.
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Please check your connection and try refreshing the page.
            </p>
          </div>
        )}

        {!isLoading && !hasError && issues.length === 0 && (
          <div className="rounded-2xl border border-slate-200 border-dashed p-16 text-center dark:border-zinc-800">
            <svg
              className="mx-auto h-12 w-12 text-slate-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No issues reported yet.
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Be the first to file a civic issue in your neighborhood.
            </p>
            <div className="mt-6">
              <Link
                href="/report"
                className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-xs hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Report Issue
              </Link>
            </div>
          </div>
        )}

        {/* Issue Cards Grid */}
        {!isLoading && !hasError && issues.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top tags row */}
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-400/20">
                      {issue.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getSeverityStyles(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400 line-clamp-3">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Details Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/60 space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-400 dark:text-zinc-500">
                        Status:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-zinc-300 capitalize">
                        {issue.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-400 dark:text-zinc-500">
                        Trust:
                      </span>
                      <span
                        className={`font-black ${getTrustStyles(
                          issue.trustScore
                        )}`}
                      >
                        {issue.trustScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>Badge: New Neighbor</span>
                    </div>
                    <span className="text-slate-400 dark:text-zinc-500 font-medium">
                      {formatRelativeTime(issue.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
