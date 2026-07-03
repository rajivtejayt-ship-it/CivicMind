"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CivicIssue } from "@/types/civic";
import { getBadge } from "@/agents/BadgeAgent";
import { useAuth } from "@/context/AuthContext";
import {
  BaseCard,
  SecondaryButton,
  PrimaryButton,
  StatusBadge,
  EmptyState,
  CardSkeleton,
  SectionHeader,
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
  ),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting(name: string | null): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = name ? name.split(" ")[0] : null;
  return firstName ? `${timeGreeting}, ${firstName} 👋` : `${timeGreeting} 👋`;
}

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

function getTrustColor(score: number): string {
  if (score > 70) return "text-status-success";
  if (score > 40) return "text-status-warning";
  return "text-status-danger";
}

function getTrustBarColor(score: number): string {
  if (score > 70) return "bg-status-success";
  if (score > 40) return "bg-status-warning";
  return "bg-status-danger";
}

function getImpactColor(score: number): string {
  if (score > 70) return "text-status-danger";
  if (score > 40) return "text-status-warning";
  return "text-status-success";
}

function getImpactBarColor(score: number): string {
  if (score > 70) return "bg-status-danger";
  if (score > 40) return "bg-status-warning";
  return "bg-status-success";
}


// ── Page ──────────────────────────────────────────────────────────────────────

export default function IssuesPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const isDemo =
          typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("civicmind-demo-active") === "true";
        let data: CivicIssue[] = [];

        if (isDemo) {
          const raw = sessionStorage.getItem("civicmind-demo-data");
          if (raw) data = JSON.parse(raw);
        }

        if (!data || data.length === 0) {
          const { getIssues } = await import("@/lib/firebase/issues");
          data = await getIssues();
        }

        setIssues(
          [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error("Failed to load issues:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="space-y-6 page-enter">

      {/* ── Welcome Header ─────────────────────────────────────────────── */}
      <SectionHeader
        title={getGreeting(user?.displayName ?? null)}
        subtitle="Here's what's happening in your community right now."
        level={1}
      />

      {/* ── Loading skeletons ──────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Error state ────────────────────────────────────────────────── */}
      {hasError && (
        <BaseCard className="border-status-danger bg-status-danger/5 p-8 text-center flex flex-col items-center">
          <svg className="mx-auto h-10 w-10 text-status-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-3 text-sm font-bold text-ink">Unable to load issues</h3>
          <p className="mt-1 text-sm text-ink-muted">Check your connection and try refreshing the page.</p>
        </BaseCard>
      )}

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {!isLoading && !hasError && issues.length === 0 && (
        <EmptyState
          title="No reports yet"
          description="Be the first to report a civic issue in your community. Your voice matters."
          action={
            <Link href="/report">
              <PrimaryButton>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Report an Issue
              </PrimaryButton>
            </Link>
          }
        />
      )}

      {/* ── Feed toolbar ───────────────────────────────────────────────── */}
      {!isLoading && !hasError && issues.length > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-ink">
              Recent Reports
            </h2>
            <p className="text-caption text-ink-muted mt-0.5">
              {issues.length} report{issues.length !== 1 ? "s" : ""} in your community
            </p>
          </div>
          <SecondaryButton onClick={() => setShowMap((v) => !v)}>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {showMap ? "Hide Map" : "Show Map"}
          </SecondaryButton>
        </div>
      )}

      {/* ── Map ────────────────────────────────────────────────────────── */}
      {showMap && !isLoading && !hasError && issues.length > 0 && (
        <div className="h-[380px] w-full rounded-2xl overflow-hidden shadow-cm-sm border border-border-subtle relative z-0">
          <IssueMap issues={issues} />
        </div>
      )}

      {/* ── Issue cards grid ───────────────────────────────────────────── */}
      {!isLoading && !hasError && issues.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {issues.map((issue) => {
            const isArchived = issue.status === "archived" && issue.severity !== "critical";
            const isCritical = issue.severity === "critical";
            const trust = issue.trustScore ?? 0;
            const impact = issue.impactScore ?? 0;

            return (
              <BaseCard
                key={issue.id}
                interactive={!isArchived}
                className={`flex flex-col gap-4 ${
                  isArchived
                    ? "opacity-60 saturate-50 border-border-subtle/50"
                    : isCritical
                    ? "border-status-danger/40"
                    : ""
                }`}
              >
                {/* ── Top row: category + severity ── */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge label={issue.category} type="info" />
                    {issue.evidenceCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-ink-muted border border-border-subtle">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {issue.evidenceCount}
                      </span>
                    )}
                  </div>
                  <StatusBadge label={issue.severity} type={getSeverityBadgeType(issue.severity)} />
                </div>

                {/* ── Title + description ── */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-h3 font-bold text-ink leading-snug line-clamp-1 group-hover:text-brand transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-body text-ink-muted line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* ── Scores ── */}
                <div className="space-y-2">
                  {/* Trust */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80">Trust</span>
                      <span className={`text-xs font-bold tabular-nums ${getTrustColor(trust)}`} title={issue.trustExplainer?.reason}>{trust}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-canvas border border-border-subtle overflow-hidden">
                      <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${getTrustBarColor(trust)}`} style={{ width: `${Math.min(100, Math.max(0, trust))}%` }} />
                    </div>
                  </div>
                  {/* Impact */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted/80">Impact</span>
                      <span className={`text-xs font-bold tabular-nums ${getImpactColor(impact)}`} title={issue.impactExplainer?.reason}>{impact}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-canvas border border-border-subtle overflow-hidden">
                      <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${getImpactBarColor(impact)}`} style={{ width: `${Math.min(100, Math.max(0, impact))}%` }} />
                    </div>
                  </div>
                </div>

                {/* ── Footer: status badge + timestamp ── */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
                  <StatusBadge label={issue.status} type={getStatusBadgeType(issue.status)} />

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas border border-border-subtle px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {getBadge((issue.title.length * 27) % 600)}
                    </span>
                    <span className="text-xs text-ink-muted">{formatRelativeTime(issue.createdAt)}</span>
                  </div>
                </div>

                {/* ── Explainer disclosures ── */}
                {issue.trustExplainer && (
                  <details className="group/d rounded-xl border border-border-subtle bg-canvas overflow-hidden text-xs">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 font-semibold text-ink-muted hover:bg-border-subtle/45 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/30">
                      <span>Why this trust score?</span>
                      <svg className="h-3 w-3 transition-transform group-open/d:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-3 pt-1 pb-3 space-y-1.5 border-t border-border-subtle bg-surface">
                      {([
                        { label: "Reputation", value: issue.trustExplainer.reporterCivicCredContribution },
                        { label: "Evidence",   value: issue.trustExplainer.evidenceMultiplier },
                        { label: "Community",  value: issue.trustExplainer.verificationWeight },
                        { label: "Penalty",    value: -issue.trustExplainer.anomalyPenalty },
                      ] as { label: string; value: number }[]).map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between text-[10px]">
                          <span className="text-ink-muted">{label}</span>
                          <span className={`font-bold tabular-nums ${value > 0 ? "text-status-success" : value < 0 ? "text-status-danger" : "text-ink-muted/50"}`}>{value > 0 ? `+${value}` : value}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-border-subtle flex justify-between text-[10px]">
                        <span className="font-semibold text-ink-muted">Base score</span>
                        <span className="font-bold text-ink">{issue.trustExplainer.baseScore}</span>
                      </div>
                    </div>
                  </details>
                )}

                {issue.impactExplainer && (
                  <details className="group/d rounded-xl border border-border-subtle bg-canvas overflow-hidden text-xs">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 font-semibold text-ink-muted hover:bg-border-subtle/45 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/30">
                      <span>Why this impact score?</span>
                      <svg className="h-3 w-3 transition-transform group-open/d:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className="px-3 pt-1 pb-3 space-y-1.5 border-t border-border-subtle bg-surface">
                      {([
                        { label: "Severity",  value: issue.impactExplainer.severityMultiplier },
                        { label: "Trust",     value: issue.impactExplainer.baseWeight },
                        { label: "Community", value: issue.impactExplainer.densityFactor },
                        { label: "Age",       value: issue.impactExplainer.durationDaysFactor },
                      ] as { label: string; value: number }[]).map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between text-[10px]">
                          <span className="text-ink-muted">{label}</span>
                          <span className={`font-bold tabular-nums ${value > 0 ? "text-status-success" : value < 0 ? "text-status-danger" : "text-ink-muted/50"}`}>{value > 0 ? `+${value}` : value}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-border-subtle flex justify-between text-[10px]">
                        <span className="font-semibold text-ink-muted">Final score</span>
                        <span className="font-bold text-ink">{issue.impactExplainer.finalScore}</span>
                      </div>
                    </div>
                  </details>
                )}
              </BaseCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
