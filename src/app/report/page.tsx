"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ReportIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [severity, setSeverity] = useState("Medium");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Infrastructure");
      setSeverity("Medium");
      setLat("");
      setLng("");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Report an Issue
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Help improve your neighborhood.
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

        {/* Success Alert */}
        {submitSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/30 dark:text-emerald-400 transition-all">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Report submitted successfully.</span>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="ml-auto text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                >
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pothole on Maple Street"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the issue..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              {/* Dropdowns row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option>Infrastructure</option>
                    <option>Safety</option>
                    <option>Sanitation</option>
                    <option>Mobility</option>
                    <option>Environment</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label
                    htmlFor="severity"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Severity
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Coordinates row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Latitude */}
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g., 37.7749"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g., -122.4194"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/80 pb-3 dark:border-zinc-800/80 mb-4">
                AI Preview Score
              </h3>

              <div className="space-y-6">
                {/* Estimated Trust Score */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                      Estimated Trust Score
                    </span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-500">
                      75
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[75%] rounded-full bg-blue-600 dark:bg-blue-500" />
                  </div>
                </div>

                {/* Badge Indicator */}
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                    Badge status
                  </span>
                  <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-700/10 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-400/20">
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
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Community Verified Candidate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
