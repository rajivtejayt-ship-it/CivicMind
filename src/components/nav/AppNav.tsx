"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";

interface NavUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// ── Logo ────────────────────────────────────────────────────────────────────
function CivicMindLogo() {
  return (
    <Link href="/issues" className="flex items-center gap-2.5 shrink-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <span className="text-base font-black tracking-tight text-ink">
        CivicMind
      </span>
    </Link>
  );
}

// ── Nav Link ─────────────────────────────────────────────────────────────────
function NavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand/10 text-brand"
          : "text-ink-muted hover:bg-canvas hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

// ── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown({
  user,
  onSignOut,
}: {
  user: NavUser;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full p-0.5 ring-2 ring-transparent hover:ring-brand/20 focus:outline-none focus-visible:ring-brand/40 transition-all cursor-pointer"
      >
        <Avatar
          src={user.photoURL}
          name={user.displayName ?? undefined}
          size="sm"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border-subtle bg-surface py-1.5 shadow-cm-lg z-50">
          {/* User identity */}
          <div className="px-4 py-3 border-b border-border-subtle">
            <p className="text-sm font-bold text-ink truncate">
              {user.displayName ?? "Citizen"}
            </p>
            <p className="text-xs text-ink-muted truncate mt-0.5">
              {user.email ?? ""}
            </p>
          </div>

          {/* Navigation items */}
          <div className="py-1">
            <DropdownLink href="/issues" onClick={() => setOpen(false)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              Community Feed
            </DropdownLink>
            <DropdownLink href="/operations" onClick={() => setOpen(false)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Community Insights
            </DropdownLink>
            <DropdownLink href="/report" onClick={() => setOpen(false)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report Issue
            </DropdownLink>
          </div>

          <div className="border-t border-border-subtle py-1">
            <DropdownLink href="/dashboard" onClick={() => setOpen(false)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </DropdownLink>
          </div>

          <div className="border-t border-border-subtle py-1">
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
    >
      {children}
    </Link>
  );
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function MobileMenu({
  open,
  pathname,
  onClose,
  onSignOut,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
  onSignOut: () => void;
}) {
  if (!open) return null;
  return (
    <div className="border-t border-border-subtle bg-white md:hidden">
      <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
        <MobileNavLink href="/issues" active={pathname === "/issues"} onClick={onClose}>
          Community Feed
        </MobileNavLink>
        <MobileNavLink href="/operations" active={pathname === "/operations"} onClick={onClose}>
          Community Insights
        </MobileNavLink>
        <MobileNavLink href="/dashboard" active={pathname === "/dashboard"} onClick={onClose}>
          My Profile
        </MobileNavLink>
        <div className="pt-2 border-t border-border-subtle">
          <Link
            href="/report"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-hover transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Report Issue
          </Link>
        </div>
        <div className="pt-1">
          <button
            onClick={() => { onClose(); onSignOut(); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand/10 text-brand"
          : "text-ink-muted hover:bg-canvas"
      }`}
    >
      {children}
    </Link>
  );
}

// ── AppNav (main export) ──────────────────────────────────────────────────────
export default function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Consume the single auth listener provided by AuthContext.
  // This replaces the previous per-component onAuthStateChanged subscription.
  const { user: firebaseUser } = useAuth();
  const user: NavUser | null = firebaseUser
    ? {
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      }
    : null;

  const handleSignOut = async () => {
    try {
      const { signOutUser } = await import("@/lib/firebase/auth");
      await signOutUser();
      window.location.href = "/signin";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left — Logo */}
          <CivicMindLogo />

          {/* Center — Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink href="/issues" active={pathname === "/issues"}>
              Community Feed
            </NavLink>
            <NavLink href="/operations" active={pathname === "/operations"}>
              Community Insights
            </NavLink>
          </nav>

          {/* Right — CTA + Avatar + Mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Report Issue CTA — always visible on desktop */}
            <Link
              href="/report"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-sm font-bold text-white shadow-sm hover:bg-brand-hover active:scale-95 transition-all"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Report Issue
            </Link>

            {/* Avatar / profile dropdown */}
            {user ? (
              <ProfileDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              /* Placeholder skeleton while auth loads */
              <div className="h-8 w-8 rounded-full bg-border-subtle animate-pulse" />
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Open mobile menu"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-1.5 text-ink-muted hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <MobileMenu
        open={mobileOpen}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
        onSignOut={handleSignOut}
      />
    </header>
  );
}
