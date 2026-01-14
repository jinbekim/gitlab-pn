# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gitlab-pn is a Chrome extension (Manifest V3) for GitLab with two features:
- **pn_rule**: Transforms priority markers (p1, p2, p3) in MR comments into customizable colored badges
- **rm_mr_filter**: Adds delete buttons to remove saved MR filters from GitLab's filter dropdown

## Build Commands

```bash
npm run dev          # Watch mode - rebuilds on file changes
npm run build        # Production build to dist/
npm run type-check   # TypeScript type validation only
npx vitest           # Run tests
npx vitest run       # Run tests once (CI mode)
```

## Architecture

### Entry Points
- `popup/index.ts` - Extension popup UI for configuring pn rules
- `inject/index.ts` - Content script injected into GitLab MR pages

### Module Structure
- `domain/` - Business logic and types (pn parsing, HTML generation)
- `services/gitlab/` - GitLab-specific DOM selectors
- `utils/` - Reusable utilities (Chrome storage wrapper, debounce, HTML escaping)
- `inject/rm_mr_filter/` - Filter removal feature with UI components

### Path Aliases (tsconfig)
- `@utils/*` → `./utils/*`
- `@domain/*` → `./domain/*`
- `@services/*` → `./services/*`

### Build Output
tsup bundles each entry point to `dist/` with splitting disabled (required for content scripts).

## Chrome Extension Loading

1. Run `npm run build`
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

## Known Issues / TODO

GitLab version-specific DOM selectors are currently hardcoded in `services/gitlab/index.ts`. These should be extracted to support multiple GitLab versions.
