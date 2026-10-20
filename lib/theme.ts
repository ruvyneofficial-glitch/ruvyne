// Site colours. The editor picks a preset and can override any colour in
// Sanity (Site settings > Colours); app/layout.tsx turns the result into the
// CSS variables that globals.css and tailwind.config.ts read.

export type ThemeColors = {
  background: string;
  text: string;
  mutedText: string;
  brand: string;
  accent: string;
  surface: string;
  border: string;
  footer: string;
  footerText: string;
};

export type ThemeKey = keyof ThemeColors;

export const THEME_PRESETS: Record<string, { title: string; colors: ThemeColors }> = {
  ruvyne: {
    title: "Ruvyne: ivory, olive and bronze (matches the logo)",
    colors: {
      background: "#f8f3ec",
      text: "#2b2721",
      mutedText: "#675e53",
      brand: "#57553f",
      accent: "#8a5f33",
      surface: "#efe6da",
      border: "#ddd1c1",
      footer: "#3a3929",
      footerText: "#f3ece2",
    },
  },
  classic: {
    title: "Classic: black and white",
    colors: {
      background: "#ffffff",
      text: "#0a0a0a",
      mutedText: "#525252",
      brand: "#171717",
      accent: "#171717",
      surface: "#f5f5f5",
      border: "#e5e5e5",
      footer: "#000000",
      footerText: "#ffffff",
    },
  },
  blush: {
    title: "Blush: rose and ivory",
    colors: {
      background: "#fbf6f4",
      text: "#231f20",
      mutedText: "#6b5b5c",
      brand: "#2b2325",
      accent: "#9e4459",
      surface: "#f5e6e3",
      border: "#ead7d4",
      footer: "#2b2325",
      footerText: "#fbefef",
    },
  },
};

export const DEFAULT_PRESET = "ruvyne";

const HEX = /^#[0-9a-f]{6}$/i;

export function isHex(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value);
}

function channels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// "#57553f" -> "53 16% 29%", the space separated form used inside hsl() by
// globals.css and tailwind.config.ts.
export function hexToHslChannels(hex: string) {
  const [r, g, b] = channels(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
  return `${h} ${pct(s)} ${pct(l)}`;
}

function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG contrast ratio, 1 to 21. Body text needs at least 4.5.
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function resolveTheme(
  preset?: string | null,
  overrides: Partial<Record<ThemeKey, unknown>> = {}
): ThemeColors {
  const colors = { ...(THEME_PRESETS[preset ?? ""] ?? THEME_PRESETS[DEFAULT_PRESET]).colors };
  for (const key of Object.keys(colors) as ThemeKey[]) {
    const value = overrides[key];
    if (isHex(value)) colors[key] = value;
  }
  return colors;
}

export function readableOn(fill: string, a: string, b: string) {
  return contrast(fill, a) >= contrast(fill, b) ? a : b;
}

export function themeVars(c: ThemeColors): Record<string, string> {
  const v = hexToHslChannels;
  return {
    "--background": v(c.background),
    "--card": v(c.background),
    "--popover": v(c.background),
    "--foreground": v(c.text),
    "--card-foreground": v(c.text),
    "--popover-foreground": v(c.text),
    "--muted": v(c.surface),
    "--secondary": v(c.surface),
    "--secondary-foreground": v(c.text),
    "--muted-foreground": v(c.mutedText),
    "--primary": v(c.brand),
    "--primary-foreground": v(readableOn(c.brand, c.background, c.text)),
    "--accent": v(c.accent),
    "--accent-foreground": v(readableOn(c.accent, c.background, c.text)),
    "--border": v(c.border),
    "--input": v(c.mutedText),
    "--ring": v(c.text),
    "--footer": v(c.footer),
    "--footer-foreground": v(c.footerText),
  };
}
