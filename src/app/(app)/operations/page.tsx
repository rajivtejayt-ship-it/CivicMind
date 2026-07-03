"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CivicIssue, IssueCategory } from "@/types/civic";
import { getBadge } from "@/agents/BadgeAgent";
import { DEMO_ISSUES } from "@/lib/demoData";
import {
  BaseCard,
  MetricCard,
  SecondaryButton,
  PrimaryButton,
  StatusBadge,
  SectionHeader,
  Toast,
  ToastType,
} from "@/components/ui";

const IssueMap = dynamic(() => import("@/components/maps/IssueMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-canvas border border-border-subtle rounded-2xl">
      <svg className="h-8 w-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  )
});

// ─── Helpers ────────────────────────────────────────────────────────────────


function formatRelativeTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60_000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  infrastructure: "Infrastructure",
  safety: "Safety",
  sanitation: "Sanitation",
  mobility: "Mobility",
  environment: "Environment",
  other: "Other",
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  infrastructure: "bg-brand",
  safety: "bg-status-danger",
  sanitation: "bg-status-warning",
  mobility: "bg-status-info",
  environment: "bg-status-success",
  other: "bg-ink-muted/50",
};

function getSeverityBadgeType(severity: string): "success" | "warning" | "danger" | "info" {
  switch (severity.toLowerCase()) {
    case "low":      return "success";
    case "medium":   return "warning";
    case "high":     return "warning";
    case "critical": return "danger";
    default:         return "info";
  }
}

function getStatusBadgeType(status: string): "success" | "warning" | "danger" | "info" | "verified" | "reputation" {
  switch (status.toLowerCase()) {
    case "reported":      return "info";
    case "classified":    return "reputation";
    case "investigating": return "warning";
    case "addressing":    return "warning";
    case "resolved":      return "success";
    case "archived":      return "verified";
    default:              return "info";
  }
}


// ─── Page ────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const demoActive = typeof sessionStorage !== "undefined" && sessionStorage.getItem("civicmind-demo-active") === "true";
        setIsDemo(demoActive);
        
        let data: CivicIssue[] = [];
        
        if (demoActive) {
          const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
          if (demoDataStr) data = JSON.parse(demoDataStr);
        }
        
        if (!data || data.length === 0) {
          const { getIssues } = await import("@/lib/firebase/issues");
          data = await getIssues();
        }
        setIssues(data);
      } catch (err) {
        console.error("Operations: failed to load issues", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleGenerateDemoData = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("civicmind-demo-active", "true");
      sessionStorage.setItem("civicmind-demo-data", JSON.stringify(DEMO_ISSUES));
      setIssues(DEMO_ISSUES);
      setIsDemo(true);
      setToast({ message: "Demo Data Loaded", type: "success" });
    }
  };
  
  const handleClearDemoData = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("civicmind-demo-active");
      sessionStorage.removeItem("civicmind-demo-data");
      setIsDemo(false);
      setToast({ message: "Demo Data Cleared", type: "success" });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // ── Derived metrics ────────────────────────────────────────────────────────
  const totalReports = issues.length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const investigatingCount = issues.filter((i) => i.status === "investigating").length;
  const addressingCount = issues.filter((i) => i.status === "addressing").length;

  // ── Category breakdown ─────────────────────────────────────────────────────
  const categoryCounts = issues.reduce<Partial<Record<IssueCategory, number>>>(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const sortedCategories = (Object.keys(categoryCounts) as IssueCategory[]).sort(
    (a, b) => (categoryCounts[b] ?? 0) - (categoryCounts[a] ?? 0)
  );

  const maxCategoryCount = Math.max(
    1,
    ...Object.values(categoryCounts).map((v) => v ?? 0)
  );

  // ── Top 5 by impact ────────────────────────────────────────────────────────
  const topImpact = [...issues]
    .sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0))
    .slice(0, 5);

  // ── Top 5 by trust ─────────────────────────────────────────────────────────
  const topTrust = [...issues]
    .sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0))
    .slice(0, 5);

  // ── Top 5 Documented ────────────────────────────────────────────────────────
  const topDocumented = [...issues]
    .sort((a, b) => (b.evidenceCount ?? 0) - (a.evidenceCount ?? 0))
    .slice(0, 5);

  // ── Recent 5 ──────────────────────────────────────────────────────────────
  const recent = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ── Mock Top Contributors ──────────────────────────────────────────────────
  const topContributors = [
    { name: "Sarah J.", cred: 642 },
    { name: "Michael T.", cred: 315 },
    { name: "Elena R.", cred: 180 },
    { name: "David L.", cred: 95 },
    { name: "James M.", cred: 45 },
  ];

  // ── Render states ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 gap-4 flex-col">
        <svg className="h-8 w-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-ink-muted">Loading insights…</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <BaseCard className="flex items-center justify-center py-32 gap-4 flex-col text-center border-status-danger bg-status-danger/5 max-w-lg mx-auto">
        <svg className="h-10 w-10 text-status-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-base font-bold text-ink">Unable to load insights.</p>
        <p className="text-sm text-ink-muted">Check your connection and refresh.</p>
      </BaseCard>
    );
  }

  return (
    <div className="space-y-8 page-enter">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Live Data{isDemo && <span className="ml-2 text-brand">· Demo</span>}
            </span>
          </div>
          <SectionHeader
            title="Community Insights"
            subtitle="Trends, trust metrics, impact rankings, and activity across your community."
            level={1}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {process.env.NODE_ENV === "development" && !isDemo && (
            <PrimaryButton onClick={handleGenerateDemoData}>
              Generate Demo Data
            </PrimaryButton>
          )}
          {process.env.NODE_ENV === "development" && isDemo && (
            <PrimaryButton onClick={handleClearDemoData} className="bg-status-danger hover:bg-status-danger/90">
              Clear Demo Data
            </PrimaryButton>
          )}
        </div>
      </div>

        {/* ── City Issues Map (collapsible) ─────────────────────────────── */}
        {issues.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-muted">
                {showMap ? "Map view active" : "Geographic overview"}
              </span>
              <SecondaryButton onClick={() => setShowMap(!showMap)}>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMap ? "Hide Map" : "Show Map"}
              </SecondaryButton>
            </div>
            {showMap && (
              <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-cm-sm border border-border-subtle relative z-0 transition-all">
                <IssueMap issues={issues} />
              </div>
            )}
          </section>
        )}

        {/* ── Metrics ─────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-h3 font-semibold text-ink">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Reports"
              value={totalReports}
              trend="All time"
            />
            <MetricCard
              title="Resolved Issues"
              value={resolvedCount}
              trend="Status: Resolved"
              trendType="success"
            />
            <MetricCard
              title="Investigating"
              value={investigatingCount}
              trend="Status: Investigating"
              trendType="warning"
            />
            <MetricCard
              title="Addressing"
              value={addressingCount}
              trend="Status: Addressing"
              trendType="warning"
            />
          </div>
        </section>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left column — Category breakdown + Recent Activity */}
          <div className="lg:col-span-1 space-y-8">

            {/* Trending Categories */}
            <BaseCard className="space-y-4">
              <h2 className="text-h3 font-semibold text-ink">📈 Trending Categories</h2>
              {sortedCategories.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No data yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sortedCategories.map((cat) => {
                    const count = categoryCounts[cat] ?? 0;
                    const pct = Math.round((count / maxCategoryCount) * 100);
                    return (
                      <li key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ink">
                            {CATEGORY_LABELS[cat]}
                          </span>
                          <span className="font-bold text-ink-muted">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-canvas border border-border-subtle overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[cat]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </BaseCard>

            {/* Recent Activity */}
            <BaseCard className="space-y-4">
              <h2 className="text-h3 font-semibold text-ink">🕐 Recent Activity</h2>
              {recent.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No activity yet.
                </p>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {recent.map((issue) => (
                    <li
                      key={issue.id}
                      className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusBadge label={issue.status} type={getStatusBadgeType(issue.status)} />
                        </div>
                      </div>
                      <span className="shrink-0 text-caption text-ink-muted whitespace-nowrap mt-0.5">
                        {formatRelativeTime(issue.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </BaseCard>
          </div>

          {/* Right column — Top Impact + Top Trust */}
          <div className="lg:col-span-2 space-y-8">

            {/* Highest Impact Reports */}
            <BaseCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 font-semibold text-ink">⚡ Highest Impact Reports</h2>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topImpact.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topImpact.map((issue, idx) => {
                    const score = issue.impactScore ?? 0;
                    const scoreColor =
                      score > 70
                        ? "text-status-danger"
                        : score > 40
                        ? "text-status-warning"
                        : "text-status-success";

                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-border-subtle bg-canvas px-4 py-3"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border-subtle text-xs font-black text-ink-muted">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {issue.title}
                          </p>
                          <p className="text-xs text-ink-muted capitalize mt-0.5">
                            {CATEGORY_LABELS[issue.category]}
                          </p>
                        </div>

                        {/* Severity badge */}
                        <StatusBadge label={issue.severity} type={getSeverityBadgeType(issue.severity)} />

                        {/* Impact score */}
                        <span className={`shrink-0 text-xl font-black ${scoreColor}`}>
                          {score}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </BaseCard>

            {/* Most Trusted Reports */}
            <BaseCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 font-semibold text-ink">🏆 Most Trusted Reports</h2>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topTrust.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  No reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topTrust.map((issue, idx) => {
                    const score = issue.trustScore ?? 0;
                    const scoreColor =
                      score > 70
                        ? "text-status-success"
                        : score > 40
                        ? "text-status-warning"
                        : "text-status-danger";

                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-border-subtle bg-canvas px-4 py-3"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border-subtle text-xs font-black text-ink-muted">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {issue.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <StatusBadge label="Verified" type="verified" />
                          </div>
                        </div>

                        {/* Trust progress mini-bar */}
                        <div className="hidden sm:flex flex-col items-end gap-1 w-20 shrink-0">
                          <div className="h-1.5 w-full rounded-full bg-canvas border border-border-subtle overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        {/* Trust score */}
                        <span className={`shrink-0 text-xl font-black ${scoreColor}`}>
                          {score}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </BaseCard>

            {/* Most Documented Reports */}
            <BaseCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 font-semibold text-ink">📷 Most Documented Reports</h2>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topDocumented.length === 0 || (topDocumented[0]?.evidenceCount || 0) === 0 ? (
                <p className="text-sm text-ink-muted">
                  No documented reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topDocumented.filter(i => (i.evidenceCount || 0) > 0).map((issue, idx) => {
                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-border-subtle bg-canvas px-4 py-3"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border-subtle text-xs font-black text-ink-muted">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {issue.title}
                          </p>
                          <p className="text-xs text-ink-muted capitalize mt-0.5">
                            {CATEGORY_LABELS[issue.category]}
                          </p>
                        </div>

                        {/* Evidence count */}
                        <div className="flex items-center gap-1.5 shrink-0 text-ink">
                          <svg className="h-4 w-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xl font-black">
                            {issue.evidenceCount}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </BaseCard>

            {/* Top Contributors */}
            <BaseCard className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h3 font-semibold text-ink">Top Contributors</h2>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              <ol className="space-y-3">
                {topContributors.map((contributor, idx) => {
                  const badge = getBadge(contributor.cred);
                  return (
                    <li
                      key={contributor.name}
                      className="flex items-center gap-4 rounded-xl border border-border-subtle bg-canvas px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-border-subtle text-xs font-black text-ink-muted">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {contributor.name}
                        </p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {badge}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xl font-black text-brand">
                          {contributor.cred}
                        </span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mt-0.5">
                          CivicCred
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </BaseCard>
          </div>
        </div>

        {totalReports === 0 && (
          <div className="rounded-2xl border border-dashed border-border-subtle p-16 text-center bg-surface">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-canvas p-3 border border-border-subtle">
                <svg className="h-10 w-10 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-bold text-ink">
              No reports in the system yet.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Once citizens file reports, analytics will appear here.
            </p>
          </div>
        )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
