# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gitlab-pn is a Chrome extension (Manifest V3) that customizes GitLab merge request pages. It provides two main features:

1. **pn-rule**: Replaces priority labels (P1, P2, P3) in MR notes with customizable styled markers (text + colors)
2. **rm-mr-filter**: Adds delete buttons to MR filter history items, removing them from both DOM and localStorage

## Commands

```bash
npm run dev          # Watch mode with tsup
npm run build        # Production build
npm run type-check   # TypeScript type checking (tsc --noEmit)
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
```

## Architecture

### Directory Structure

```
gitlab-pn/
├── src/
│   ├── features/
│   │   ├── pn-rule/              # P1/P2/P3 replacement feature
│   │   │   ├── index.ts          # Feature init/cleanup
│   │   │   ├── observer.ts       # MutationObserver setup
│   │   │   └── replacer.ts       # Text replacement logic
│   │   ├── rm-mr-filter/         # Filter removal feature
│   │   │   ├── index.ts          # Feature init/cleanup
│   │   │   ├── utils.ts          # localStorage operations
│   │   │   └── ui/
│   │   │       └── RemoveButton.ts
│   │   ├── inject/               # Content script entry point
│   │   │   └── index.ts
│   │   └── popup/                # Extension popup UI
│   │       ├── index.ts
│   │       ├── index.html
│   │       └── index.css
│   ├── domain/
│   │   ├── pn/                   # Priority rule types and helpers
│   │   │   └── index.ts
│   │   └── html/                 # HTML generation utilities
│   │       └── index.ts
│   ├── services/
│   │   └── gitlab/
│   │       ├── index.ts          # GitLab DOM accessors
│   │       └── selectors.ts      # Centralized CSS selectors
│   ├── utils/
│   │   ├── chrome/               # Chrome storage API wrappers
│   │   │   └── index.ts
│   │   ├── observer/             # MutationObserver management
│   │   │   └── index.ts
│   │   ├── html/
│   │   │   └── index.ts
│   │   └── debounce.ts
│   └── styles/
│       └── inject.css
├── tests/
│   └── domain/
│       └── pn.spec.ts
├── dist/                         # Build output
├── img/
├── manifest.json
├── tsup.config.ts
├── uno.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

### Entry Points
- `src/features/popup/index.ts` - Extension popup UI for configuring P1/P2/P3 replacement text and colors
- `src/features/inject/index.ts` - Content script injected into GitLab MR pages (`*://*/*/*/-/merge_requests*`)

### Key Modules

**src/domain/pn/** - Priority rule types and helpers
- Defines `PnRule` ("p1"|"p2"|"p3") and related type utilities
- `findPn()` extracts priority prefix from text using regex `/^([pP]\d)\s*[:.]?/`
- `isPnRuleMap()` validates storage data structure

**src/domain/html/** - HTML generation for styled markers (`<mark>` elements)

**src/features/pn-rule/** - Priority label replacement feature
- `initPnRule()` / `cleanupPnRule()` - Feature lifecycle
- Uses MutationObserver to watch for DOM changes
- Subscribes to Chrome storage for live updates

**src/features/rm-mr-filter/** - Filter removal feature
- `initRmMrFilter()` / `cleanupRmMrFilter()` - Feature lifecycle
- Uses MutationObserver on filter dropdown button
- Adds remove buttons to filter list items
- `removeFilterByIndex()` updates localStorage filter array

**src/services/gitlab/** - GitLab-specific DOM utilities
- Centralized selectors in `selectors.ts` for easy version updates
- DOM accessor functions for notes and filter elements

**src/utils/chrome/** - Chrome storage API wrappers with error handling
- `StorageResult<T>` type for typed error handling
- `subscribeToChromeStorage()` returns unsubscribe function

**src/utils/observer/** - MutationObserver management
- `createObserver()` / `disconnectObserver()` - Named observer lifecycle
- `disconnectAllObservers()` - Global cleanup

### Path Aliases (tsconfig.json)
- `@utils/*` → `./src/utils/*`
- `@domain/*` → `./src/domain/*`
- `@services/*` → `./src/services/*`
- `@features/*` → `./src/features/*`

### Build Output
tsup bundles to `dist/` with entry points at `src/features/popup/index.ts` and `src/features/inject/index.ts`.

## Notes

- The extension uses MutationObserver to watch for DOM changes and apply replacements dynamically
- Chrome storage API is used for persistence (both popup settings and filter removal)
- GitLab version differences may require adjusting selectors in `src/services/gitlab/selectors.ts`
- Each feature module has init/cleanup functions for proper lifecycle management
