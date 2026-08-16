import type { ThemeSettings } from "./types";

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  swatch: string[];
  values: Omit<ThemeSettings, "preset" | "fontDisplay" | "buttonStyle" | "radius">;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "midnight",
    label: "Midnight Luxury",
    description: "Black · Ivory · Gold",
    swatch: ["#0e0e0f", "#f5f1e8", "#b99450"],
    values: {
      primary: "oklch(0.18 0.005 60)",
      secondary: "oklch(0.95 0.012 85)",
      accent: "oklch(0.68 0.09 82)",
      background: "oklch(0.975 0.008 85)",
      foreground: "oklch(0.18 0.005 60)",
    },
  },
  {
    id: "soft",
    label: "Soft Minimal",
    description: "Cream · Charcoal · Beige",
    swatch: ["#f6f2ec", "#2b2a28", "#c8b8a4"],
    values: {
      primary: "oklch(0.28 0.008 60)",
      secondary: "oklch(0.93 0.014 75)",
      accent: "oklch(0.76 0.045 70)",
      background: "oklch(0.972 0.01 75)",
      foreground: "oklch(0.24 0.008 60)",
    },
  },
  {
    id: "rose",
    label: "Modern Rose",
    description: "Soft rose · Charcoal · White",
    swatch: ["#e7c8c2", "#2a2526", "#ffffff"],
    values: {
      primary: "oklch(0.32 0.02 20)",
      secondary: "oklch(0.93 0.022 25)",
      accent: "oklch(0.75 0.07 25)",
      background: "oklch(0.985 0.005 20)",
      foreground: "oklch(0.24 0.015 20)",
    },
  },
  {
    id: "sage",
    label: "Sage Wellness",
    description: "Sage · Cream · Deep green",
    swatch: ["#a9b7a2", "#f3f1e9", "#26362c"],
    values: {
      primary: "oklch(0.32 0.035 155)",
      secondary: "oklch(0.93 0.02 140)",
      accent: "oklch(0.7 0.05 150)",
      background: "oklch(0.97 0.012 120)",
      foreground: "oklch(0.24 0.025 155)",
    },
  },
  {
    id: "mono",
    label: "Monochrome",
    description: "Black · White · Grey",
    swatch: ["#000000", "#ffffff", "#9a9a9a"],
    values: {
      primary: "oklch(0.14 0 0)",
      secondary: "oklch(0.95 0 0)",
      accent: "oklch(0.62 0 0)",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.14 0 0)",
    },
  },
];

export const FONT_OPTIONS = [
  { id: "'Instrument Serif', serif", label: "Editorial Serif" },
  { id: "'Fraunces', serif", label: "Modern Serif" },
  { id: "'DM Sans', sans-serif", label: "Clean Sans" },
  { id: "'Syne', sans-serif", label: "Fashion Sans" },
];

export function applyTheme(theme: ThemeSettings) {
  if (typeof document === "undefined") return;
  const r = document.documentElement.style;
  r.setProperty("--primary", theme.primary);
  r.setProperty("--secondary", theme.secondary);
  r.setProperty("--accent-brand", theme.accent);
  r.setProperty("--background", theme.background);
  r.setProperty("--foreground", theme.foreground);
  r.setProperty("--radius", theme.radius);
  r.setProperty("--font-display", theme.fontDisplay);
  r.setProperty(
    "--btn-radius",
    theme.buttonStyle === "pill" ? "999px" : theme.buttonStyle === "square" ? "0px" : "0.5rem",
  );
}
