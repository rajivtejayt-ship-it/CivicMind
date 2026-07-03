"use client";

import React, { useState } from "react";
import { AIClassification, CivicIssue, CivicUser } from "@/types/civic";
import { calculateTrustScore } from "@/agents/TrustAgent";
import { calculateImpactScore } from "@/agents/ImpactAgent";
import {
  Input,
  Textarea,
  Dropdown,
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
  BaseCard,
  StatusBadge,
} from "@/components/ui";
export default function ReportIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [severity, setSeverity] = useState("Medium");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [textEvidence, setTextEvidence] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [geoError, setGeoError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const [aiResult, setAiResult] = useState<AIClassification | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const handleAnalyzeAI = async () => {
    if (!title || !description) {
      setAnalysisError("Title and description are required for AI analysis.");
      return;
    }
    setAiResult(null);
    setAnalysisError("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Classification failed.");
      const data = await res.json();
      setAiResult({
        category: data.category,
        severity: data.severity,
        confidence: Number(data.confidence),
        reasoning: data.reasoning,
      });
      // Automatically update fields
      if (data.category) setCategory(data.category);
      if (data.severity) setSeverity(data.severity);
    } catch (err: unknown) {
      console.error(err);
      setAnalysisError((err as Error).message || "Failed to analyze issue.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetLocation = () => {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by this browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString());
        setLng(position.coords.longitude.toString());
        setIsDetecting(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Location permission denied.");
        } else {
          setGeoError(error.message || "Failed to retrieve location.");
        }
        setIsDetecting(false);
      }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitError("");
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      // Dynamically import Firebase to prevent build-time static generation errors
      const { auth } = await import("@/lib/firebase/client");
      const { createIssue } = await import("@/lib/firebase/issues");

      // Retrieve current user
      const user = auth.currentUser;
      if (!user) {
        setSubmitError("Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      if (!lat || !lng) {
        setSubmitError("Please select a location or use Current Location.");
        setIsSubmitting(false);
        return;
      }

      const userData: CivicUser = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous Citizen",
        email: user.email || "",
        photoURL: user.photoURL || undefined,
        civicCred: 25,
        badge: "New Neighbor",
        role: "citizen",
        reportsFiled: 0,
        reportsConfirmed: 0,
        reportsRejected: 0,
        isGuardian: false,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      const categoryMap: Record<string, CivicIssue["category"]> = {
        Infrastructure: "infrastructure",
        Safety: "safety",
        Sanitation: "sanitation",
        Mobility: "mobility",
        Environment: "environment",
        Other: "other",
      };

      const severityMap: Record<string, CivicIssue["severity"]> = {
        Low: "low",
        Medium: "medium",
        High: "high",
        Critical: "critical",
      };

      const tempIssue: CivicIssue = {
        id: "",
        title,
        description,
        category: categoryMap[category],
        severity: severityMap[severity],
        coordinates: {
          lat: parseFloat(lat) || 0,
          lng: parseFloat(lng) || 0,
        },
        reporterId: user.uid,
        trustScore: 0,
        impactScore: 0, // computed by ImpactAgent below
        status: "reported",
        classificationReason: aiResult?.reasoning || "",
        recommendations: [],
        evidenceCount: (photoPreview ? 1 : 0) + (textEvidence.trim() ? 1 : 0),
        communityConfirmations: 0,
        linkedReports: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const trust = calculateTrustScore(userData, tempIssue);

      // Build the trust-enriched issue so that ImpactAgent can factor in trustScore
      const issueWithTrust: CivicIssue = {
        ...tempIssue,
        trustScore: trust.score,
        trustExplainer: trust.explainer,
      };

      const impact = calculateImpactScore(issueWithTrust);

      const issue: CivicIssue = {
        ...issueWithTrust,
        impactScore: impact.score,
        impactExplainer: impact.explainer,
      };

      await createIssue(issue);
      setSubmitSuccess(true);

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Infrastructure");
      setSeverity("Medium");
      setLat("");
      setLng("");
      setSubmitSuccess(true);
      setTimeout(() => window.location.href = "/issues", 2000);
    } catch (err: unknown) {
      console.error(err);
      setSubmitError((err as Error).message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <SectionHeader
        title="Report a Civic Issue"
        subtitle="Report infrastructure problems, hazards, or public service outages to improve your community."
        level={1}
      />

      {/* Success Alert */}
      {submitSuccess && (
        <BaseCard className="border-status-success bg-status-success/5 p-4 text-status-success">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-status-success"
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
              className="ml-auto text-status-success hover:text-status-success/80 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </BaseCard>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Card */}
        <BaseCard className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <Input
              label="Issue Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pothole on Maple Street"
            />

            {/* Description */}
            <Textarea
              label="Description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the issue..."
            />

            {/* Dropdowns row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Dropdown
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: "Infrastructure", label: "Infrastructure" },
                  { value: "Safety", label: "Safety" },
                  { value: "Sanitation", label: "Sanitation" },
                  { value: "Mobility", label: "Mobility" },
                  { value: "Environment", label: "Environment" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <Dropdown
                label="Severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                options={[
                  { value: "Low", label: "Low" },
                  { value: "Medium", label: "Medium" },
                  { value: "High", label: "High" },
                  { value: "Critical", label: "Critical" },
                ]}
              />
            </div>

            {/* Coordinates row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g., 37.7749"
              />

              <Input
                label="Longitude"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="e.g., -122.4194"
              />
            </div>

            {/* Evidence Section */}
            <div className="pt-4 border-t border-border-subtle space-y-6">
              <h3 className="text-sm font-bold text-ink">
                Evidence (Optional)
              </h3>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-ink-muted">
                  Upload Photo
                </label>
                {!photoPreview ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition-colors"
                  />
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden border border-border-subtle">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-xs font-semibold text-status-danger hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Text Notes */}
              <Textarea
                label="Text Notes"
                rows={2}
                value={textEvidence}
                onChange={(e) => setTextEvidence(e.target.value)}
                placeholder="Additional details, context, or observations..."
              />
            </div>

            {/* Geolocation Button */}
            <div className="flex flex-col gap-2">
              <SecondaryButton
                type="button"
                onClick={handleGetLocation}
                disabled={isDetecting}
                loading={isDetecting}
                className="w-full sm:w-auto"
              >
                {!isDetecting && (
                  <svg
                    className="h-4 w-4 mr-2 text-ink-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
                <span>{isDetecting ? "Detecting Location..." : "Use Current Location"}</span>
              </SecondaryButton>
              {geoError && (
                <p className="text-xs font-semibold text-status-danger">
                  {geoError}
                </p>
              )}
            </div>

            {/* Analyze with AI Button */}
            <div className="space-y-2">
              <SecondaryButton
                type="button"
                onClick={handleAnalyzeAI}
                disabled={isAnalyzing}
                loading={isAnalyzing}
                className="w-full flex justify-center items-center gap-2 border-brand/20 bg-brand/5 text-brand hover:bg-brand/10"
              >
                {!isAnalyzing && (
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                )}
                <span>Analyze with AI</span>
              </SecondaryButton>
              {analysisError && (
                <p className="text-xs font-semibold text-status-danger mb-4">
                  {analysisError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <PrimaryButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full"
            >
              Submit Report
            </PrimaryButton>
            {submitError && (
              <p className="text-xs font-semibold text-status-danger mt-3 text-center">
                {submitError}
              </p>
            )}
          </form>
        </BaseCard>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* AI Preview Score Card */}
          <BaseCard>
            <h3 className="text-lg font-bold text-ink border-b border-border-subtle pb-3 mb-4">
              AI Preview Score
            </h3>

            <div className="space-y-6">
              {/* Estimated Trust Score */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-ink-muted">
                    Estimated Trust Score
                  </span>
                  <span className="text-xl font-black text-brand">
                    75
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
                  <div className="h-full w-[75%] rounded-full bg-brand" />
                </div>
              </div>

              {/* Badge Indicator */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-sm font-semibold text-ink-muted">
                  Badge status
                </span>
                <div className="self-start">
                  <StatusBadge label="Community Verified Candidate" type="verified" />
                </div>
              </div>
            </div>
          </BaseCard>

          {/* AI Classification Results Card */}
          {aiResult && (
            <BaseCard className="transition-all">
              <h3 className="text-lg font-bold text-ink border-b border-border-subtle pb-3 mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-brand"
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
                <span>AI Classification</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Category
                  </span>
                  <p className="text-sm font-bold text-ink mt-0.5">
                    {aiResult.category}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Severity
                  </span>
                  <p className="text-sm font-bold text-ink mt-0.5">
                    {aiResult.severity}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Confidence
                    </span>
                    <span className="text-sm font-black text-brand">
                      {aiResult.confidence}%
                    </span>
                  </div>
                  {/* Confidence Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${aiResult.confidence}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Reasoning
                  </span>
                  <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                    {aiResult.reasoning}
                  </p>
                </div>
              </div>
            </BaseCard>
          )}
        </div>
      </div>
    </div>
  );
}
