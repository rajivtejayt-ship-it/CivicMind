"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-brand selection:text-white">
      {/* Navigation Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <Link
                href="/"
                className="text-xl font-black tracking-tight text-ink"
              >
                CivicMind
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                Features
              </a>
              <Link
                href="/signin"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink cursor-pointer"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-b border-border-subtle bg-white px-4 py-3 md:hidden">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-ink hover:bg-canvas"
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-ink hover:bg-canvas"
              >
                Features
              </a>
              <Link
                href="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg bg-brand px-4 py-2 text-center text-base font-bold text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Tag / Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand ring-1 ring-brand/10">
              <span>Next-Gen Civic Action</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
              <span className="bg-gradient-to-r from-brand to-brand-hover bg-clip-text text-transparent">
                CivicMind
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              AI-powered civic engagement platform helping communities identify, report, and resolve
              local issues collaboratively.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signin"
                className="w-full sm:w-auto rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-hover hover:shadow-cm-md active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Get Started
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto rounded-lg border border-border-subtle bg-surface px-8 py-4 text-base font-bold text-ink-muted shadow-cm-sm transition-all hover:bg-canvas active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border-subtle bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Platform Features
            </h2>
            <p className="mt-4 text-lg text-ink-muted">
              Empowering communities with smart, cooperative tools.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: AI Classification */}
            <div className="relative rounded-2xl border border-border-subtle bg-canvas p-8 transition-all hover:-translate-y-1 hover:shadow-cm-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-ink">
                AI Classification
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Gemini-powered issue categorization and severity assessment.
              </p>
            </div>

            {/* Feature 2: CivicCred */}
            <div className="relative rounded-2xl border border-border-subtle bg-canvas p-8 transition-all hover:-translate-y-1 hover:shadow-cm-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage/10 text-sage">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-ink">
                CivicCred
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Community trust and reputation system rewarding constructive participation.
              </p>
            </div>

            {/* Feature 3: Community Action */}
            <div className="relative rounded-2xl border border-border-subtle bg-canvas p-8 transition-all hover:-translate-y-1 hover:shadow-cm-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-success/10 text-status-success">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-ink">
                Community Action
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                Citizens collaboratively validate reports and drive local improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 border-t border-border-subtle bg-canvas">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-extrabold text-brand sm:text-5xl">
                500+
              </p>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                Issues Reported
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-brand sm:text-5xl">
                87%
              </p>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                Resolution Rate
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-status-success sm:text-5xl">
                2,000+
              </p>
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                Active Citizens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border-subtle bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Ready to improve your community?
            </h2>
            <div className="mt-10">
              <Link
                href="/signin"
                className="inline-flex rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-brand-hover hover:shadow-cm-md active:scale-98"
              >
                Join CivicMind
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-canvas">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-ink-muted/60">
            &copy; Built for Google Solution Challenge 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
