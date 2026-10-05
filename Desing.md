# Desing.md — Design Rules

Design system for the **General Authority for Borders and Customs** (الهيئة العامة للمنافذ والجمارك) dashboard, derived from the brand assets in `Desings/`.

This file governs **visual design**. `AGENTS.md` still governs code structure and Angular conventions; `CLAUDE.md` governs commands and architecture. Where this file and the TailAdmin defaults disagree on *colour, type, or logo*, this file wins.

---

## 1. Source assets

| Asset | Path |
|---|---|
| Colour palette | `Desings/colors.jpeg` |
| Logo — stacked, colour | `Desings/الشعار مفرغ/SVG/طولي 1.svg` · `PNG/… 1.png` (2.19:1) |
| Logo — stacked, knockout | `Desings/الشعار مفرغ/SVG/طولي 2.svg` · `PNG/… 2.png` |
| Logo — horizontal, colour | `Desings/الشعار مفرغ/SVG/عرضي 1.svg` · `PNG/… 3.png` (5.3:1) |
| Logo — horizontal, knockout | `Desings/الشعار مفرغ/SVG/عرضي 2.svg` · `PNG/… 4.png` |
| Arabic/Latin typeface | `Desings/خط قمرة itf_qomra_arabic_fonts/*.ttf` |

`Desings/` is the **master archive — never referenced at runtime**. Ship copies under `public/brand/` (logos) and `public/fonts/` (webfonts). Keep the Arabic directory names out of build paths: rename on copy to ASCII (`logo-stacked.svg`, `logo-stacked-knockout.svg`, `logo-horizontal.svg`, `logo-horizontal-knockout.svg`).

---

## 2. Colour

### 2.1 The eight brand colours

These are the only colours in `colors.jpeg`. Everything below is derived from them.

| Hex | Role |
|---|---|
| `#003830` | **Primary green.** Core brand colour — also the exact green in the logo wordmark. |
| `#0c2723` | Deep green. Dark-mode page ground, headers, footers. |
| `#b9a879` | **Primary gold.** Accent, the eagle mark, highlights on dark. |
| `#96865d` | Deep gold. Borders, dividers, hover state of gold. |
| `#531624` | **Maroon.** Secondary/alert accent — seals, destructive emphasis. |
| `#261013` | Deep maroon. Darkest maroon step only. |
| `#131818` | **Ink.** Near-black for text and dark surfaces. |
| `#f0ebe1` | **Cream.** Light-mode page ground and paper surfaces. |

The logo's gold is `#b9a67d`, one notch off the palette's `#b9a879`. **Use `#b9a879` for UI; leave the SVG fills untouched.** Do not "fix" the logo to match.

### 2.2 Token ramps

Replace the TailAdmin ramps in the `@theme` block of `src/styles.css`. Keep the token *names* Tailwind expects (`--color-brand-*`, `--color-gray-*`) so the 139 existing components re-skin without edits; add `gold` and `maroon` as new families.

```css
@theme {
  /* Primary — Authority green. Core brand sits at 700. */
  --color-brand-25:  #f6f8f8;
  --color-brand-50:  #edf1f1;
  --color-brand-100: #dbe3e2;
  --color-brand-200: #b8c7c5;
  --color-brand-300: #8aa3a0;
  --color-brand-400: #577c76;
  --color-brand-500: #2e5c55;
  --color-brand-600: #144841;
  --color-brand-700: #003830;  /* brand */
  --color-brand-800: #022f29;
  --color-brand-900: #0c2723;  /* palette */
  --color-brand-950: #071715;

  /* Accent — gold */
  --color-gold-25:  #fbfaf9;
  --color-gold-50:  #f7f5f2;
  --color-gold-100: #eeece5;
  --color-gold-200: #ddd8cb;
  --color-gold-300: #c6bea8;
  --color-gold-400: #b9a879;  /* palette */
  --color-gold-500: #96865d;  /* palette */
  --color-gold-600: #857753;
  --color-gold-700: #6f6446;
  --color-gold-800: #585139;
  --color-gold-900: #45402e;
  --color-gold-950: #2e2c21;

  /* Secondary — maroon */
  --color-maroon-25:  #faf8f8;
  --color-maroon-50:  #f5f1f2;
  --color-maroon-100: #eae3e5;
  --color-maroon-200: #d6c7ca;
  --color-maroon-300: #b79da3;
  --color-maroon-400: #916a73;
  --color-maroon-500: #72404b;
  --color-maroon-600: #612936;
  --color-maroon-700: #531624;  /* palette */
  --color-maroon-800: #44141f;
  --color-maroon-900: #37131b;
  --color-maroon-950: #261013;  /* palette */

  /* Neutrals — warm, cream-to-ink. Overrides TailAdmin's cool grays. */
  --color-gray-25:  #faf8f4;
  --color-gray-50:  #f4f1ea;
  --color-gray-100: #f0ebe1;  /* palette cream */
  --color-gray-200: #e3ded5;
  --color-gray-300: #d1cdc5;
  --color-gray-400: #bbb8b1;
  --color-gray-500: #9c9b95;
  --color-gray-600: #7d7d78;
  --color-gray-700: #676864;
  --color-gray-800: #515350;
  --color-gray-900: #2e3130;
  --color-gray-950: #131818;  /* palette ink */
  --color-gray-dark: #0c2723;

  --color-black: #131818;
}
```

`--color-blue-light-*`, `--color-orange-*` and `--color-theme-pink/purple-500` are **off-brand**: delete them from `@theme` and remove their usages rather than leaving them reachable.

### 2.3 Semantic status colours

Keep TailAdmin's `success` / `error` / `warning` ramps — they are functional signals, not brand colour, and must stay legible as such. Two rules:

- Never substitute brand green for `success` or maroon for `error`. A green "paid" badge next to a green brand header is unreadable as a signal.
- Status colours appear **only** on badges, alerts, toasts, validation text, and chart series that encode status. Never on navigation, buttons, or surfaces.

### 2.4 Surface roles

| Role | Light | Dark |
|---|---|---|
| Page ground | `bg-gray-100` (`#f0ebe1`) | `bg-brand-900` (`#0c2723`) |
| Card / panel | `bg-white` | `bg-gray-950` (`#131818`) |
| Raised / hover | `bg-gray-50` | `bg-brand-800` |
| Border | `border-gray-300` | `border-white/10` |
| Sidebar | `bg-brand-700` | `bg-brand-950` |
| Primary text | `text-gray-950` | `text-gray-100` |
| Muted text | `text-gray-700` | `text-gray-400` |

The sidebar is the one surface that is **always dark green in both themes** — it carries the brand. Its nav items use gold, not green, for the active state (green on green has no contrast).

### 2.5 Contrast rules — non-negotiable

Measured WCAG ratios:

| Foreground / background | Ratio | Verdict |
|---|---|---|
| `#ffffff` on `#003830` | 13.06 | ✅ any size |
| `#f0ebe1` on `#003830` | 10.99 | ✅ any size |
| `#b9a879` on `#003830` | 5.56 | ✅ any size |
| `#b9a879` on `#0c2723` | 6.72 | ✅ any size |
| `#b9a879` on `#131818` | 7.63 | ✅ any size |
| `#ffffff` on `#531624` | 13.93 | ✅ any size |
| `#131818` on `#f0ebe1` | 15.09 | ✅ any size |
| `#96865d` on `#ffffff` | 3.58 | ⚠️ large text (≥24px / ≥19px bold), icons, borders only |
| `#b9a879` on `#ffffff` | 2.35 | ❌ never text |
| `#96865d` on `#003830` | 3.65 | ❌ never body text |

Therefore:

- **Gold is a dark-background colour.** On light surfaces gold is fill, border, icon, or chart mark — never body text, never a link, never placeholder text.
- A gold button on light needs a dark label: `bg-gold-400 text-brand-900`, not `text-white`.
- Minimum for body text is 4.5:1, for UI borders and large text 3:1. Check any new pairing before shipping it.
- Never rely on hue alone for state. Pair every colour signal with an icon, label, or weight change — colour-blind users and the monochrome print path both need it.

### 2.6 Gradients and decoration

One gradient is allowed: `linear-gradient(135deg, #003830, #0c2723)` for hero and login panels. No gold gradients, no three-stop gradients, no colour-shifting borders. Gold decorative rules are flat `1px` `#96865d` at the stated opacity, nothing else.

---

## 3. Typography

### 3.1 Families

**itf Qomra Arabic** is the brand typeface for both Arabic and Latin — the logo lockup sets both scripts in it. Outfit is retained only as the metric fallback.

The five TTFs ship as **five separate font families** in their `name` tables (`itf Qomra Arabic`, `… Light`, `… Med`, `… Black`). Declaring them naively gives you faux-bold everywhere. Collapse them into one family with explicit weights:

```css
@font-face { font-family: "Qomra"; src: url("/fonts/qomra-light.woff2")   format("woff2"); font-weight: 300; font-style: normal; font-display: swap; }
@font-face { font-family: "Qomra"; src: url("/fonts/qomra-regular.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: "Qomra"; src: url("/fonts/qomra-medium.woff2")  format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: "Qomra"; src: url("/fonts/qomra-bold.woff2")    format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: "Qomra"; src: url("/fonts/qomra-black.woff2")   format("woff2"); font-weight: 900; font-style: normal; font-display: swap; }
```

```css
@theme {
  --font-*: initial;
  --font-qomra: "Qomra", "Outfit", system-ui, sans-serif;
  --font-outfit: Outfit, sans-serif; /* legacy, do not use in new markup */
}
```

Then `body { @apply font-qomra; }` in `@layer base`, replacing `font-outfit`.

Rules:

- Convert TTF → WOFF2 before shipping. Do not serve the `.ttf` files; they are roughly 3–4× the transfer size.
- Self-host. No Google Fonts request for Qomra, and drop the Outfit `@import` once Qomra is in place — a remote font request is a render-blocking dependency on a government dashboard.
- Only the five weights above exist. **Never specify 100, 200, 600, or 800** — the browser will synthesise them.
- There are no italics. `font-style: italic` is banned; use weight or colour for emphasis.
- Set `font-feature-settings` nowhere and `letter-spacing` nowhere on Arabic text — Arabic shaping breaks under tracking. Latin headings may use `tracking-tight`; Arabic headings may not.

### 3.2 Scale

Keep the existing `--text-title-*` / `--text-theme-*` tokens. Weight assignment:

| Element | Token | Weight |
|---|---|---|
| Page title | `text-title-sm` | 700 |
| Section / card title | `text-theme-xl` | 600 → **use 700** (600 does not exist) |
| Body | `text-base` | 400 |
| Label, table header | `text-theme-sm` | 500 |
| Caption, helper | `text-theme-xs` | 400 |
| Numeric KPI | `text-title-md` | 900 |

Arabic needs more leading than Latin at the same size. Where a block is Arabic-only, add `leading-relaxed`.

---

## 4. Logo

### 4.1 Choosing a lockup

| Context | File |
|---|---|
| Header, wide bar, anything shorter than ~80px tall | horizontal (`عرضي`, 5.3:1) |
| Login page, print header, splash, square-ish space | stacked (`طولي`, 2.19:1) |
| On cream/white | variant **1** (gold eagle, green text) |
| On brand green, ink, or photography | variant **2** (gold eagle, white text) |

Always ship the SVG. PNGs are for Office documents and external parties.

### 4.2 Rules

- **Minimum size:** horizontal 180px wide; stacked 96px wide. Below that, use the eagle mark alone.
- **Clear space:** on every side, at least the height of the eagle's head. Nothing — text, border, card edge, another logo — enters that zone.
- **Never** recolour, outline, add a shadow to, rotate, skew, stretch, crop, or place the logo inside a coloured pill. Scale proportionally only.
- **Never** place variant 1 on a dark background or variant 2 on a light one; that is what the two files are for.
- On photography, use variant 2 over a `#0c2723` scrim at ≥60% opacity. Never directly on an image.
- The eagle may be used alone as an app icon, favicon, and loading mark. The wordmark may **never** be used without the eagle.
- Give the inline `<svg>` a `role="img"` and `<title>` ("الهيئة العامة للمنافذ والجمارك — General Authority for Borders and Customs"), or use `<img alt="…">`. A logo is content, not decoration.

If the logo is inlined as an SVG string through `SafeHtmlPipe`, it must be a literal in the component — the pipe calls `bypassSecurityTrustHtml` and will happily render anything it is handed.

---

## 5. Form and layout

- **Radius:** `rounded-lg` (8px) for inputs, buttons, badges; `rounded-2xl` (16px) for cards and modals. No `rounded-full` except on avatars and status dots. The brand reads as institutional — no pill buttons.
- **Spacing:** 4px base. Card padding `p-6` desktop / `p-4` mobile; grid gutter `gap-6`; section rhythm `space-y-6`.
- **Elevation:** keep `--shadow-theme-*`, but retint them to the brand ink — `rgba(12, 39, 35, …)` instead of `rgba(16, 24, 40, …)`. Shadow conveys layering only; it is never decoration. Dark mode uses borders (`border-white/10`), not shadows.
- **Focus:** every interactive element gets a visible ring — `focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2`. Update `--shadow-focus-ring` from the old blue `rgba(70, 95, 255, 0.12)` to `rgba(185, 168, 121, 0.35)`. Removing focus outlines is prohibited.
- **Density:** this is an operational customs system — tables and lists favour density over air. Table rows `py-3`, not `py-5`.

### Buttons

| Variant | Light | Dark |
|---|---|---|
| Primary | `bg-brand-700 text-white hover:bg-brand-800` | `bg-gold-400 text-brand-900 hover:bg-gold-300` |
| Secondary | `border border-brand-700 text-brand-700 hover:bg-brand-50` | `border border-gold-400 text-gold-400 hover:bg-white/5` |
| Tertiary | `text-brand-700 hover:bg-brand-50` | `text-gold-400 hover:bg-white/5` |
| Destructive | `bg-maroon-700 text-white hover:bg-maroon-800` | same |

Gold is the primary action colour **on dark surfaces only**; green is primary on light. Do not mix the two on one surface — one primary action per view.

---

## 6. Direction and locale

The interface is **Arabic-first, RTL by default**, with English as a secondary direction. This inverts the template's default.

- Default `dir="rtl"` on `<html>`; `localStorage['dir']` may override to `ltr`. `AppComponent.ngOnInit` restores it.
- **Only logical properties.** `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s-*`/`rounded-e-*`. A physical `left`, `right`, `ml-`, `pr-`, or `text-left` in new markup is a defect.
- Directional icons (chevrons, arrows, back/next) must mirror in RTL: `rtl:-scale-x-100`. Icons that encode a real-world object (clock, download, check) must **not** mirror.
- Numbers, dates, currency, tracking numbers, and HS codes stay LTR inside RTL text — wrap in `dir="ltr"` with `inline-block`. A mis-shaped declaration number is a data error, not a cosmetic one.
- Charts (ApexCharts, amCharts) do not inherit `dir`. Set the axis/legend position per direction explicitly; do not assume the library mirrors.
- No i18n library. Copy stays as literals, per `AGENTS.md`.

---

## 7. Dark mode

`ThemeService` toggles `.dark` on `<html>`; the `@custom-variant dark (&:is(.dark *))` in `src/styles.css` drives the variants.

- Every new colour utility ships with its `dark:` counterpart in the same class list. A component that is only designed for light is incomplete.
- Dark is not "invert the light theme". Follow the surface table in §2.4: ground is `#0c2723` (green-black, not neutral), cards are `#131818`.
- Gold carries the accent in dark mode where green carries it in light.
- Dark surfaces never use pure `#000000` or pure `#ffffff` text. Ground is `#0c2723`, text is `#f0ebe1`/`gray-100`.
- `ThemeService` currently writes `data-color-scheme` while `AGENTS.md` documents `data-theme`. Also set the CSS `color-scheme` property so native form controls, scrollbars, and `<select>` popups follow the theme.

---

## 8. Charts

- Categorical series, in order: `#003830`, `#b9a879`, `#531624`, `#577c76`, `#96865d`, `#916a73`. Six is the ceiling; beyond that, group into "Other".
- Sequential (volumes, heat): `#edf1f1 → #8aa3a0 → #2e5c55 → #003830`.
- Diverging (variance against target): `#531624 ← #f0ebe1 → #003830`.
- Grid lines `#e3ded5` light / `rgba(255,255,255,0.08)` dark. Axis labels `gray-600` / `gray-400`.
- Never six shades of the same green — adjacent series must differ in hue or lightness by enough to survive greyscale printing.
- Chart text inherits `--font-qomra`; set it explicitly in the chart options, since ApexCharts and amCharts default to their own stacks.

---

## 9. Imagery and iconography

- Icons: single-weight line, 1.5px stroke, 24px grid, `currentColor` fill. Inline SVG strings in TypeScript rendered via `SafeHtmlPipe`, matching the existing pattern. No icon font, no emoji in the UI chrome.
- Icons inherit text colour. A gold icon on a light card is only acceptable at ≥24px (see §2.5).
- Photography, where used, is desaturated and overlaid with the `#0c2723` scrim. No stock-photo gradients, no drop shadows on images.
- Illustrations use the brand palette only — green, gold, cream, maroon, ink. No off-palette illustration sets.

---

## 10. Don'ts

- ❌ Blue. The template's `#465fff` brand, `blue-light-*`, `orange-*`, `theme-pink/purple` are all out. Strip them from `@theme`, not just from markup.
- ❌ Gold text on light backgrounds (2.35:1).
- ❌ Hard-coded hex in components. Every colour goes through a `@theme` token.
- ❌ `tailwind.config.js`. Tailwind v4 config lives in `src/styles.css`.
- ❌ Recoloured, stretched, or wordmark-only logo.
- ❌ Physical direction properties, `text-left`, `ml-`, `pr-`.
- ❌ Font weights 100/200/600/800, or italics.
- ❌ A light-only or dark-only component.
- ❌ Brand green as a success signal or maroon as a generic error signal.
- ❌ Loading the TTFs or remote Google Fonts at runtime.
- ❌ Decorative shadows, gradients beyond the one in §2.6, or animation longer than 200ms on a state change.

---

## 11. Migration checklist

When re-skinning the existing TailAdmin template:

1. Copy logos to `public/brand/` and WOFF2 fonts to `public/fonts/` with ASCII filenames.
2. Add the `@font-face` block and `--font-qomra` to `src/styles.css`; switch `@layer base body` from `font-outfit` to `font-qomra`; drop the Outfit `@import`.
3. Replace the `--color-brand-*` and `--color-gray-*` ramps; add `gold` and `maroon`; delete `blue-light`, `orange`, `theme-pink`, `theme-purple`.
4. Retint `--shadow-theme-*` and `--shadow-focus-ring` to brand ink/gold.
5. Set `dir="rtl"` as the default in `src/index.html` and in `AppComponent`'s fallback.
6. Swap the logo in `app-sidebar.component.ts` and the auth pages; apply §2.4's always-dark sidebar.
7. Sweep for hard-coded hex, `blue-`, `orange-`, `font-outfit`, and physical direction classes across `src/`.
8. Re-check every chart's `colors` array against §8.
9. Run `npx tsc -p tsconfig.json --noEmit` — `tsconfig.app.json` only typechecks what `main.ts` reaches, so a build passing proves less than it looks.
