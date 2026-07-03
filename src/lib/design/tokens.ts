/**
 * CivicMind design tokens — single source of truth for programmatic styling.
 * CSS custom properties in globals.css mirror these values for Tailwind utilities.
 */

export const brand = {
  cobalt: "#1A49E4",
  cobaltHover: "#153BB8",
  cobaltPressed: "#0F2C8C",
  sage: "#2D5C43",
} as const;

export const light = {
  canvas: "#F8F9FA",
  surface: "#FFFFFF",
  ink: "#0F141E",
  inkMuted: "#5C6479",
  border: "#E3E6EC",
  disabled: "#EAECEF",
} as const;

export const status = {
  success: "#1B874B",
  warning: "#D47A08",
  danger: "#C8372D",
  info: "#0F70B7",
} as const;

/** Shared visual language for reputation-related UI (EPIC B ready). */
export const civicSemantics = {
  /** CivicCred points, progress, and contribution milestones */
  civicCred: brand.sage,
  /** Trust score and trustworthiness indicators */
  trust: status.info,
  /** Reputation, badges, and neighbor standing */
  reputation: brand.sage,
  /** Verified / confirmed community signals */
  verified: status.success,
} as const;

export const typography = {
  h1: { fontSize: "32px", fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: "24px", fontWeight: 600, lineHeight: 1.3 },
  h3: { fontSize: "18px", fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: "15px", fontWeight: 400, lineHeight: 1.6 },
  label: { fontSize: "14px", fontWeight: 500, lineHeight: 1.5 },
  caption: { fontSize: "12px", fontWeight: 400, lineHeight: 1.5 },
} as const;

export const spacing = {
  2: "2px",
  4: "4px",
  8: "8px",
  16: "16px",
  24: "24px",
  32: "32px",
  64: "64px",
} as const;

export const radius = {
  badge: "4px",
  button: "8px",
  input: "8px",
  card: "16px",
  dialog: "20px",
  avatar: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(15, 20, 30, 0.05)",
  md: "0 4px 12px rgba(15, 20, 30, 0.03), 0 1px 3px rgba(15, 20, 30, 0.02)",
  lg: "0 12px 24px rgba(15, 20, 30, 0.06)",
  overlay: "0 24px 48px rgba(15, 20, 30, 0.08)",
} as const;

export const motion = {
  duration: "200ms",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const fonts = {
  heading:
    'var(--font-plus-jakarta), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  body: 'var(--font-inter), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;
