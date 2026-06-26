"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { calculateCivicCredProgress } from "@/agents/BadgeAgent";
import { CivicUser } from "@/types/civic";

// ── Default new-user values ──────────────────────────────────────────────────
const NEW_USER_DEFAULTS: Pick<
  CivicUser,
  "civicCred" | "badge" | "reportsFiled" | "reportsConfirmed" | "reportsRejected" | "displayName"
> = {
  displayName: "Citizen",
  civicCred: 25,
  badge: "New Neighbor",
  reportsFiled: 0,
  reportsConfirmed: 0,
  reportsRejected: 0,
};

export default function DashboardPage() {
  const [userData, setUserData] = useState(NEW_USER_DEFAULTS);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Check for demo mode first
        if (typeof sessionStorage !== "undefined") {
          const demoActive = sessionStorage.getItem("civicmind-demo-active") === "true";
          if (demoActive) {
            setIsDemo(true);
            const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
            if (demoDataStr) {
              // Use summary stats derived from demo issues
              const demoIssues = JSON.parse(demoDataStr);
              setUserData({
                displayName: "Demo Citizen",
                civicCred: 312,
                badge: "Guardian",
                reportsFiled: demoIssues.length,
                reportsConfirmed: Math.floor(demoIssues.length * 0.6),
                reportsRejected: Math.floor(demoIssues.length * 0.1),
              });
              setIsLoading(false);
              return;
            }
          }
        }

        // 2. Fetch real Firestore user
        const { getCurrentCivicUser } = await import("@/lib/firebase/users");
        const civicUser = await getCurrentCivicUser();

        if (civicUser) {
          setUserData({
            displayName: civicUser.displayName,
            civicCred: civicUser.civicCred,
            badge: civicUser.badge,
            reportsFiled: civicUser.reportsFiled,
            reportsConfirmed: civicUser.reportsConfirmed,
            reportsRejected: civicUser.reportsRejected,
          });
        }
        // If null (not signed in), keep NEW_USER_DEFAULTS
      } catch (err) {
        console.error("Dashboard: failed to load user data", err);
        // Keep defaults on error — better than crashing
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const { currentBadge, nextBadge, progressPercent } = calculateCivicCredProgress(userData.civicCred);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              CivicMind
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Your community engagement portal
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
            {isDemo && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-400/20">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Demo Dataset Active
              </span>
            )}
            <Link
              href="/report"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Report Issue
            </Link>
          </div>
        </header>

        {/* ── Welcome / Profile Card ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg duration-300 dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <span className="inline-block h-7 w-40 animate-pulse rounded-md bg-slate-200 dark:bg-zinc-800" />
                ) : (
                  <>Welcome, {userData.displayName}</>
                )}
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Thank you for contributing to your local neighborhood. Here is your profile status.
              </p>
            </div>

            {/* Badge & Progress */}
            <div className="flex flex-col gap-2 w-full max-w-xs shrink-0">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-400/20">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  {isLoading ? "—" : currentBadge}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  {isLoading ? "—" : `${userData.civicCred} CivicCred`}
                </span>
              </div>

              {!isLoading && nextBadge && (
                <div className="space-y-1.5 mt-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    <span>Progress to {nextBadge}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats Grid ──────────────────────────────────────────────────── */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* CivicCred */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    CivicCred Balance
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    {isLoading ? <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" /> : userData.civicCred}
                  </p>
                </div>
              </div>
            </div>

            {/* Reports Filed */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Reports Filed
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    {isLoading ? <span className="inline-block h-7 w-8 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" /> : userData.reportsFiled}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmed / Rejected */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Confirmed / Rejected
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
                    {isLoading ? (
                      <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200 dark:bg-zinc-800" />
                    ) : (
                      <span>
                        <span className="text-emerald-600 dark:text-emerald-400">{userData.reportsConfirmed}</span>
                        <span className="mx-1 text-slate-300 dark:text-zinc-600">/</span>
                        <span className="text-rose-500 dark:text-rose-400">{userData.reportsRejected}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation Cards ─────────────────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">

          {/* Community Feed */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Community Feed</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Browse recently reported issues, verify local reports, and see how your community is working together.
              </p>
            </div>
            <Link
              href="/issues"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600 w-full text-center"
            >
              View Reports
            </Link>
          </div>

          {/* Community Insights */}
          <div className="rounded-2xl border border-violet-200/80 bg-white p-6 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 dark:border-violet-900/40 dark:bg-zinc-900 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40">
                  <svg className="h-4 w-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Community Insights</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Trends, trust metrics, impact rankings, and issue activity across your community.
              </p>
            </div>
            <Link
              href="/operations"
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/10 transition-all hover:bg-violet-700 active:scale-95 dark:bg-violet-500 dark:hover:bg-violet-600 w-full text-center"
            >
              View Insights
            </Link>
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              File New Report
            </Link>
            <Link
              href="/issues"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 active:scale-95 transition-all dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Browse Feed
            </Link>
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 active:scale-95 transition-all dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              Community Insights
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
