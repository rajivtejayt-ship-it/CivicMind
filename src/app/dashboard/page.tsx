import React from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Navigation / Header Banner */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              CivicMind
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Your community engagement portal
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/report"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Report Issue
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Live Connection
              </span>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition-all dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome Citizen
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Thank you for contributing to your local neighborhood. Here is your profile status.
              </p>
            </div>

            {/* Badge Indicator */}
            <div className="inline-flex items-center gap-2.5 self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-400/20">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>Badge: New Neighbor</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* CivicCred Card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    CivicCred Balance
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    25
                  </p>
                </div>
              </div>
            </div>

            {/* Reports Filed Card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Reports Filed
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    0
                  </p>
                </div>
              </div>
            </div>

            {/* My Reports Card */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    My Reports
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Trust Overview Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trust Overview
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
                  {/* Placeholder until user-specific trust metrics are available */}
                <span className="text-2xl font-black">68</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-700/10 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-400/20">
                    Trusted Neighbor
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    Based on your active contributions, validation history, and 25 CivicCred balance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Overview Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Impact Overview
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shrink-0">
                  {/* Placeholder — will be computed from live Firestore data */}
                  <span className="text-2xl font-black">78</span>
                </div>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-700/10 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-400/20">
                    Avg Impact Score
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-black px-2 py-0.5">
                      {/* Placeholder — replace with live count */}
                      5
                    </span>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      High Priority Issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Feed / Navigation Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Community Feed
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Browse recently reported issues, verify local reports, and see how your community is working together to resolve problems.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/issues"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600 w-full text-center"
              >
                View Reports
              </Link>
            </div>
          </div>

          {/* Civic Operations Center Card */}
          <div className="rounded-2xl border border-violet-200/80 bg-white p-6 shadow-md dark:border-violet-900/40 dark:bg-zinc-900 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40">
                  <svg
                    className="h-4 w-4 text-violet-600 dark:text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Operations
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Analytics, impact rankings, trust metrics, and decision support for community issue management.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/operations"
                className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-500/10 transition-all hover:bg-violet-700 active:scale-98 dark:bg-violet-500 dark:hover:bg-violet-600 w-full text-center"
              >
                View Operations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
