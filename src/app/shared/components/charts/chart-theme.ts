/**
 * Brand chart theme — Desing.md §8.
 *
 * ApexCharts and amCharts both default to their own colour stacks and their
 * own font stacks, so every chart must set these explicitly. Charts also do
 * not inherit `dir`, so axis and legend positions are set per direction.
 */

/** Chart text must be set explicitly; it does not inherit from `body`. */
export const CHART_FONT = '"Qomra", "Outfit", system-ui, sans-serif';

/**
 * Categorical series, in order. Six is the ceiling — beyond that, group the
 * tail into "Other". Adjacent entries differ in hue or lightness by enough to
 * survive greyscale printing.
 */
export const CHART_CATEGORICAL = [
  '#003830', // brand-700, Authority green
  '#b9a879', // gold-400
  '#531624', // maroon-700
  '#577c76', // brand-400
  '#96865d', // gold-500
  '#916a73', // maroon-400
] as const;

/**
 * The dark-mode counterpart. Green carries the accent on light; gold carries
 * it on dark (§7) — Authority green is 1.37:1 on an ink card, effectively
 * invisible. Lightness alternates between steps so adjacent series stay
 * separable in greyscale.
 */
export const CHART_CATEGORICAL_DARK = [
  '#b9a879', // gold-400
  '#b8c7c5', // brand-200
  '#916a73', // maroon-400
  '#ddd8cb', // gold-200
  '#8aa3a0', // brand-300
  '#d6c7ca', // maroon-200
] as const;

/** The categorical series for the theme currently applied to the document. */
export function chartSeries(dark: boolean = isDarkTheme()): string[] {
  return [...(dark ? CHART_CATEGORICAL_DARK : CHART_CATEGORICAL)];
}

/** Sequential ramp for volumes and heat. */
export const CHART_SEQUENTIAL = ['#edf1f1', '#8aa3a0', '#2e5c55', '#003830'] as const;

/** Diverging ramp for variance against target. */
export const CHART_DIVERGING = ['#531624', '#f0ebe1', '#003830'] as const;

/** Grid lines: warm stone on light, a faint white wash on dark. */
export const CHART_GRID_LIGHT = '#e3ded5'; // gray-200
export const CHART_GRID_DARK = 'rgba(255, 255, 255, 0.08)';

/** Axis and legend label colours. */
export const CHART_LABEL_LIGHT = '#7d7d78'; // gray-600
export const CHART_LABEL_DARK = '#bbb8b1'; // gray-400

/** Primary chart text — data labels, gauge values. Ink on light, cream on dark. */
export const CHART_TEXT_LIGHT = '#131818'; // gray-950
export const CHART_TEXT_DARK = '#f0ebe1'; // gray-100

/** A translucent brand-green track for radial gauges. */
export const CHART_TRACK_LIGHT = '#dbe3e2'; // brand-100
export const CHART_TRACK_DARK = 'rgba(255, 255, 255, 0.1)';

/** amCharts takes numeric hex, not strings. */
export const CHART_HEX = {
  brand700: 0x003830,
  brand400: 0x577c76,
  brand100: 0xdbe3e2,
  gold400: 0xb9a879,
  gray200: 0xe3ded5,
  gray300: 0xd1cdc5,
  cream: 0xf0ebe1,
  white: 0xffffff,
} as const;

/** `true` when the document is currently in dark mode. */
export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}

/** `true` when the document is currently right-to-left. */
export function isRtl(): boolean {
  return document.documentElement.getAttribute('dir') === 'rtl';
}
