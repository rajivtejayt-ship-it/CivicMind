"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { calculateCivicCredProgress } from "@/agents/BadgeAgent";
import { CivicUser } from "@/types/civic";
import {
  BaseCard,
  StatusBadge,
} from "@/components/ui";

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

// ── Sub-components ────────────────────────────────────────────────────────────

function TrustPlaceholderCard() {
  return (
    <BaseCard className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">Trust Score</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-ink-muted/30">—</span>
          <span className="text-xs font-semibold text-ink-muted">Not yet established</span>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Build trust by contributing to your community. Submit reports, add evidence, and gain confirmations to increase your trust score.
        </p>
      </div>
      <Link href="/report" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand/5 px-4 py-2 text-xs font-bold text-brand ring-1 ring-brand/10 hover:bg-brand/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        File Your First Report
      </Link>
    </BaseCard>
  );
}

function ImpactPlaceholderCard() {
  return (
    <BaseCard className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-status-danger/10">
            <svg className="h-4 w-4 text-status-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">Impact Score</h2>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-ink-muted/30">—</span>
          <span className="text-xs font-semibold text-ink-muted">No activity yet</span>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Your impact grows as your reports help communities and gain engagement from citizens around you.
        </p>
      </div>
      <Link href="/issues" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-status-danger/5 px-4 py-2 text-xs font-bold text-status-danger ring-1 ring-status-danger/10 hover:bg-status-danger/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/40">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Browse Community Feed
      </Link>
    </BaseCard>
  );
}

function TrustActiveCard({ badge, civicCred }: { badge: string; civicCred: number }) {
  return (
    <BaseCard className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
            <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">Trust Overview</h2>
        </div>
        <div className="self-start">
          <StatusBadge label={badge} type="reputation" />
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Based on your active contributions, validation history, and {civicCred} CivicCred balance.
        </p>
      </div>
      <Link href="/issues" className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-hover transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
        View Community Feed
      </Link>
    </BaseCard>
  );
}

function ImpactActiveCard({ reportsFiled }: { reportsFiled: number }) {
  return (
    <BaseCard className="flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-status-danger/10">
            <svg className="h-4 w-4 text-status-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-ink">Impact Overview</h2>
        </div>
        <div className="self-start">
          <StatusBadge label={`${reportsFiled} report${reportsFiled !== 1 ? "s" : ""} contributing`} type="warning" />
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Your reports are being evaluated by the community. Impact scores reflect severity, engagement, and community priority.
        </p>
      </div>
      <Link href="/operations" className="inline-flex items-center justify-center rounded-xl bg-status-danger px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-status-danger/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-danger/40">
        View Community Insights
      </Link>
    </BaseCard>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [userData, setUserData] = useState(NEW_USER_DEFAULTS);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (typeof sessionStorage !== "undefined") {
          const demoActive = sessionStorage.getItem("civicmind-demo-active") === "true";
          if (demoActive) {
            setIsDemo(true);
            const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
            if (demoDataStr) {
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
      } catch (err) {
        console.error("Dashboard: failed to load user data", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const { currentBadge, nextBadge, progressPercent } = calculateCivicCredProgress(userData.civicCred);
  const isNewUser = !isDemo && userData.reportsFiled === 0;

  return (
    <div className="space-y-6 max-w-4xl page-enter">

      {/* ── Page heading ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-ink">
            My Profile
          </h1>
          <p className="text-caption text-ink-muted mt-0.5">
            Your CivicCred, reputation, and contribution history.
          </p>
        </div>
        {isDemo && !isLoading && (
          <span className="self-start inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-caption font-bold text-brand border border-brand/20">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Demo Dataset Active
          </span>
        )}
      </div>

      {/* ── Welcome / Profile Card ──────────────────────────────────── */}
      <BaseCard className="sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h2 className="text-h2 font-semibold text-ink">
              {isLoading ? (
                <span className="inline-block h-7 w-40 skeleton-shimmer rounded-md" />
              ) : (
                <>Welcome, {userData.displayName}</>
              )}
            </h2>
            <p className="text-body text-ink-muted">
              {isLoading ? (
                <span className="inline-block h-4 w-72 skeleton-shimmer rounded" />
              ) : isNewUser
                ? "You're just getting started. File your first report to begin building your civic reputation."
                : "Thank you for contributing to your local neighborhood. Here is your profile status."}
            </p>
          </div>

          {/* Badge & Progress */}
          <div className="flex flex-col gap-2 w-full max-w-xs shrink-0">
            <div className="flex items-center justify-between">
              <div className="self-start">
                <StatusBadge label={isLoading ? "—" : currentBadge} type="trust" />
              </div>
              <span className="text-label font-bold text-ink">
                {isLoading ? "—" : `${userData.civicCred} CivicCred`}
              </span>
            </div>

            {!isLoading && nextBadge && (
              <div className="space-y-1.5 mt-1">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  <span>Progress to {nextBadge}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-border-subtle overflow-hidden">
                  <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border-subtle bg-canvas p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">CivicCred Balance</p>
                <p className="mt-0.5 text-h2 font-bold text-ink">
                  {isLoading ? <span className="inline-block h-7 w-12 skeleton-shimmer rounded" /> : userData.civicCred}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-canvas p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Reports Filed</p>
                <p className="mt-0.5 text-h2 font-bold text-ink">
                  {isLoading ? <span className="inline-block h-7 w-8 skeleton-shimmer rounded" /> : userData.reportsFiled}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-canvas p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Confirmed / Rejected</p>
                <div className="mt-0.5 text-h2 font-bold text-ink">
                  {isLoading ? (
                    <span className="inline-block h-7 w-16 skeleton-shimmer rounded" />
                  ) : (
                    <span>
                      <span className="text-status-success">{userData.reportsConfirmed}</span>
                      <span className="mx-1 text-ink-muted/30">/</span>
                      <span className="text-status-danger">{userData.reportsRejected}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      {/* ── Trust & Impact Cards ─────────────────────────────────────── */}
      {!isLoading && (
        <div className="grid gap-6 sm:grid-cols-2">
          {isNewUser ? (
            <>
              <TrustPlaceholderCard />
              <ImpactPlaceholderCard />
            </>
          ) : (
            <>
              <TrustActiveCard badge={currentBadge} civicCred={userData.civicCred} />
              <ImpactActiveCard reportsFiled={userData.reportsFiled} />
            </>
          )}
        </div>
      )}

      {/* ── Achievements placeholder (new users only) ────────────────── */}
      {!isLoading && isNewUser && (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-white/60 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas">
              <svg className="h-4 w-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-ink">Achievements</h2>
          </div>
          <p className="text-sm text-ink-muted">
            No achievements yet. Contribute to your community to unlock milestones.
          </p>
        </div>
      )}

      {/* ── Navigation Cards ─────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Link href="/issues" className="group rounded-2xl border border-border-subtle bg-surface p-6 shadow-cm-sm hover:shadow-cm-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink group-hover:text-brand transition-colors">Community Feed</h2>
            <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">Browse and verify local reports.</p>
          </div>
        </Link>

        <Link href="/operations" className="group rounded-2xl border border-border-subtle bg-surface p-6 shadow-cm-sm hover:shadow-cm-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink group-hover:text-brand transition-colors">Community Insights</h2>
            <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">Trends, rankings, and activity.</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
