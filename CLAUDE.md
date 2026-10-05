# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read AGENTS.md first

`AGENTS.md` is the authoritative style guide for this repo (Tailwind theme tokens, dark-mode variants, RTL logical-property rules, page/component placement conventions, and a "Don'ts" list). Follow it. This file covers commands, architecture, and the places where the codebase diverges from what AGENTS.md describes.

## Commands

```bash
npm start            # ng serve → http://localhost:4200 (development configuration)
npm run build        # production build → dist/ng-tailadmin/browser
npm run watch        # ng build --watch --configuration development
npm test             # ng test (Karma + Jasmine)
```

- Node 22 is pinned (`.nvmrc`, `.node-version`, `engines.node`).
- **There are no tests.** Zero `*.spec.ts` files exist, so `npm test` launches Karma against an empty suite. There is no "run a single test" workflow until specs are added; `tsconfig.spec.json` picks up `src/**/*.spec.ts` automatically.
- **There is no linter or formatter.** No ESLint/Prettier config and no `lint` script. The only automated check is the Angular compiler during `build`/`serve`.
- Deploys to Cloudflare Workers static assets (`wrangler.jsonc`, SPA fallback) — build first, then `wrangler deploy`.

### Typecheck coverage gotcha

`tsconfig.app.json` uses `"files": ["src/main.ts"]` — the build only compiles what is reachable from the bootstrap import graph. Dead files are never typechecked. For example `src/app/shared/layout/generator-layout/` is unreferenced and imports `../../components/ai/ai-sidebar-history/` which does not exist; the build passes anyway. If you wire up a previously-unused component, expect latent errors. To typecheck everything, run `npx tsc -p tsconfig.json --noEmit`.

## Architecture

Standalone-component Angular 22 app bootstrapped in `src/main.ts` (which also registers Swiper custom elements globally) with providers in `src/app/app.config.ts` — zone-based change detection with `eventCoalescing`, plus `provideRouter`. No HTTP client, no interceptors, no guards: all page data is hardcoded in component class fields. This is a UI template, not a data-driven app.

### Routing

`src/app/app.routes.ts` is a single flat file with eagerly-imported components (no lazy loading). Two shapes:

- Dashboard pages — children of `AppLayoutComponent` at path `''`.
- Auth pages (`/signin`, `/signup`) and the `**` 404 — top-level, no shell.

Every route sets a `title`. Sidebar nav items are a **separate** hardcoded `navItems`/`othersItems` array inside `app-sidebar.component.ts`, so adding a route requires editing both files, and the two can drift (e.g. the sidebar links `/error-404`, which only resolves via the `**` wildcard).

### Layout shell

`AppLayoutComponent` composes `AppSidebarComponent` + `BackdropComponent` + `AppHeaderComponent` + `<router-outlet>`, and shifts the content area via `[ngClass]` on `SidebarService` observables (`xl:ms-[290px]` expanded / `xl:ms-[90px]` collapsed). Note its `containerClasses` getter is dead code — the template does not use it, and the getter tests Observables for truthiness, so it would always report "expanded".

### State: RxJS BehaviorSubjects, not signals

All three root services in `src/app/shared/services/` expose `BehaviorSubject`-backed `*$` observables consumed with the `async` pipe:

- `ThemeService` — `light`/`dark`, persisted to `localStorage['theme']`, applied as `.dark` on `<html>` plus a `data-color-scheme` attribute and a `dark:bg-gray-900` class on `<body>`. (AGENTS.md says `data-theme`/`color-scheme`; the code sets `data-color-scheme`.)
- `SidebarService` — `isExpanded$`, `isMobileOpen$`, `isHovered$`.
- `ModalService` — `isOpen$` plus a synchronous `isOpen` getter.

The codebase uses **zero** signals, `input()`/`output()` functions, or `inject()`. Match the existing style: `@Input()`/`@Output()` decorators, constructor injection, `| async` in templates. Derived values are plain getters returning Tailwind class strings (see `ui/button`).

### Component conventions in practice

- Standalone is implicit: 134 of 139 components omit `standalone: true` and rely on the Angular default while declaring `imports: [...]`. AGENTS.md asks for the explicit flag; the dominant convention is to omit it. Either compiles — be consistent with neighbouring files.
- Templates use only modern control flow (`@if`/`@for`/`@switch`); there are no `*ngIf`/`*ngFor` usages left.
- Icons are inline SVG strings held in TypeScript and rendered through `SafeHtmlPipe` (`src/app/shared/pipe/safe-html.pipe.ts`), which calls `bypassSecurityTrustHtml`. Only ever feed it author-controlled markup.
- Dropdowns implement click-outside manually: a `document` `mousedown` listener in `AfterViewInit`/`OnDestroy` that ignores clicks on `.dropdown-toggle`. Triggers must carry that class or the dropdown closes on its own toggle. `@angular/cdk` is a dependency but is not used anywhere in `src/`.
- Pages wrap content in `<app-page-breadcrumb [pageTitle]>` and `<app-component-card [title]>`.

### Tables: use @tanstack/angular-table

**`@tanstack/angular-table` (v9) is the primary table implementation for this repo.** Build any new table — and any table being reworked — on it. Do not hand-roll a new `@for`-over-an-array table.

The existing tables predate it: `src/app/shared/components/ui/table/` (`app-table`, `app-table-header`, `app-table-body`, `app-table-row`, `app-table-cell`) are thin styling wrappers over `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<td>`, and the ~13 feature tables under `shared/components/tables/`, `ecommerce/`, `invoice/`, `transactions/` loop over hardcoded arrays with no sorting, filtering, or pagination. Keep using the `ui/table` primitives for markup and Tailwind tokens; let TanStack own the row model.

v9's API is **not** v8's — there is no `createAngularTable` and no `getCoreRowModel()` option:

- `injectTable(() => options)` creates the instance. The factory is re-evaluated whenever a signal read inside it changes, so read reactive state (`data()`, sorting/pagination signals) **inside** it and keep `columns` and the feature set as stable references **outside** it.
- Features are opt-in: `tableFeatures({ rowSortingFeature, rowPaginationFeature, ... })`, or `tableFeatures(stockFeatures)` for everything. Pass the result as `features`. `ColumnDef`/`createColumnHelper` are generic over `typeof features`.
- Render cells with the `FlexRender` import and its structural directives — `<td *flexRenderCell="cell; let cell">{{ cell }}</td>`, plus `*flexRenderHeader` / `*flexRenderFooter`. `flexRenderComponent(MyComponent, { inputs: {...} })` renders an Angular component into a cell; `injectTableCellContext()` / `injectTableHeaderContext()` / `injectTableContext()` reach the cell, header, or table from inside such a component.
- `@tanstack/angular-table` re-exports all of `@tanstack/table-core`, so import types and helpers from the adapter, not the core package.

This is the one place where signals are expected: the adapter is signal-based, so table state belongs in `signal()`/`computed()` even though the rest of the codebase is `BehaviorSubject`-based (see below). Confine signals to the table component — services stay on observables.

### Styling

Tailwind CSS v4 via PostCSS (`.postcssrc.json`) — all configuration lives in `src/styles.css` (~1200 lines) and there is deliberately no `tailwind.config.js`. Structure of that file: Google Fonts + `tailwindcss` + vendor CSS imports (Swiper, Flatpickr, FullCalendar) → `@custom-variant dark (&:is(.dark *))` → `@theme` tokens (fonts, breakpoints including `2xsm`/`xsm`/`3xl`, `text-title-*`/`text-theme-*` scales, `brand`/`gray`/`blue-light`/`orange`/`success`/`error`/`warning` ramps, `shadow-theme-*`) → `@layer base` → utilities and heavy third-party overrides (ApexCharts, FullCalendar, Flatpickr) written with `@apply` and `!` importance.

Because `--font-*` and `--breakpoint-*` are reset to `initial`, Tailwind's default font and breakpoint names are gone — only the tokens defined here exist.

### Third-party integrations

- **TanStack Table 9** — `@tanstack/angular-table`, the primary table implementation. See "Tables" above.
- **ApexCharts** — via `ng-apexcharts` components, plus `apexcharts.min.js` injected as a global script in `angular.json`.
- **FullCalendar 7** — `src/app/pages/calender/` builds `CalendarOptions` with the dayGrid/timeGrid/multiMonth/interaction/classic-theme plugins and drives an edit modal.
- **amCharts 5** — `ecommerce/country-map` renders a world map; chart setup runs inside `NgZone.runOutsideAngular` to keep it out of change detection. Follow that pattern for any new amCharts component.
- **Flatpickr** (`form/date-picker`, `form/time-picker`), **Swiper** (web components), **Prism.js** (allow-listed as a CommonJS dependency in `angular.json`).

### i18n

Despite the README changelog mentioning i18n, **no translation layer exists** — no `@angular/localize`, no `i18n` attributes, no translate pipe. All copy is English string literals. RTL is the only localization feature: `dir="rtl"` on `<html>`, persisted to `localStorage['dir']`, toggled from the language menu in `header/user-dropdown` and restored in `AppComponent.ngOnInit`. New markup must use logical properties (`ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, `text-start`/`text-end`) per AGENTS.md.
