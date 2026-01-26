# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

gitlab-pn is a Chrome extension (Manifest V3) that customizes GitLab merge request pages. It uses a plugin-based architecture for extensibility. Current plugins:

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
│   ├── core/                         # Plugin system core
│   │   ├── plugin/
│   │   │   ├── index.ts              # Re-exports
│   │   │   ├── types.ts              # Plugin, BasePlugin, PluginMeta
│   │   │   ├── PluginManager.ts      # Plugin lifecycle management
│   │   │   └── PluginContext.ts      # Services container
│   │   ├── events/
│   │   │   ├── index.ts
│   │   │   └── EventBus.ts           # Pub/sub for plugin communication
│   │   └── storage/
│   │       ├── index.ts
│   │       └── StorageService.ts     # Typed Chrome storage wrapper
│   ├── plugins/                      # Plugin implementations
│   │   ├── pn-rule/
│   │   │   ├── index.ts              # Plugin exports
│   │   │   ├── PnRulePlugin.ts       # Plugin class extending BasePlugin
│   │   │   ├── observer.ts           # MutationObserver setup
│   │   │   └── replacer.ts           # Text replacement logic
│   │   ├── rm-mr-filter/
│   │   │   ├── index.ts              # Plugin exports
│   │   │   ├── RmMrFilterPlugin.ts   # Plugin class extending BasePlugin
│   │   │   ├── utils.ts              # localStorage operations
│   │   │   └── ui/RemoveButton.ts
│   │   ├── inject/                   # Content script entry point
│   │   │   └── index.ts              # Uses PluginManager
│   │   └── popup/                    # Extension popup UI
│   │       ├── index.ts
│   │       ├── index.html
│   │       └── index.css
│   ├── domain/
│   │   ├── pn/                       # Priority rule types and helpers
│   │   │   └── index.ts
│   │   └── html/                     # HTML generation utilities
│   │       └── index.ts
│   ├── services/
│   │   └── gitlab/
│   │       ├── index.ts              # GitLab DOM accessors
│   │       └── selectors.ts          # Centralized CSS selectors
│   ├── utils/
│   │   ├── chrome/                   # Chrome storage API wrappers
│   │   │   └── index.ts
│   │   ├── observer/                 # MutationObserver management
│   │   │   └── index.ts
│   │   ├── html/
│   │   │   └── index.ts
│   │   └── debounce.ts
│   └── styles/
│       └── inject.css
├── tests/
│   └── domain/
│       └── pn.spec.ts
├── dist/                             # Build output
├── img/
├── manifest.json
├── tsup.config.ts
├── uno.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

### Entry Points
- `src/plugins/popup/index.ts` - Extension popup UI for configuring P1/P2/P3 replacement text and colors
- `src/plugins/inject/index.ts` - Content script using PluginManager to orchestrate plugins

### Plugin System

**Core Architecture**

The plugin system consists of:
- `PluginManager` - Registers, initializes, and manages plugin lifecycle (enable/disable)
- `PluginContext` - Provides shared services (storage, eventBus, gitlab) to plugins
- `BasePlugin` - Abstract base class with common lifecycle management
- `Plugin` interface - Contract for all plugins (init, start, stop, cleanup, onStorageChange)

**Creating a New Plugin**

1. Create a new directory in `src/plugins/`
2. Create a plugin class extending `BasePlugin`
3. Implement required methods (init, start, stop)
4. Register in `src/plugins/inject/index.ts`

Example:
```typescript
export class MyPlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    enabledKey: 'my-plugin-enabled',
  };

  override async start(): Promise<void> {
    if (this._state === 'active') return;
    // Start plugin functionality
    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;
    // Stop plugin functionality
    super.stop();
  }
}
```

### Key Modules

**src/core/plugin/** - Plugin system infrastructure
- `PluginManager` - Singleton managing all plugin lifecycle
- `BasePlugin` - Abstract class with state management
- `PluginContext` - Dependency injection container

**src/core/events/** - Event bus for plugin communication
- `EventBus` - Pub/sub with on(), once(), emit(), off(), clear()

**src/core/storage/** - Chrome storage wrapper
- `StorageService` - Typed storage with caching and subscriptions

**src/domain/pn/** - Priority rule types and helpers
- Defines `PnRule` ("p1"|"p2"|"p3") and related type utilities
- `findPn()` extracts priority prefix from text using regex `/^([pP]\d)\s*[:.]?/`
- `isPnRuleMap()` validates storage data structure

**src/domain/html/** - HTML generation for styled markers (`<mark>` elements)

**src/plugins/pn-rule/** - Priority label replacement plugin
- `PnRulePlugin` - Plugin class handling lifecycle and storage changes
- Uses MutationObserver to watch for DOM changes
- Subscribes to Chrome storage for live updates

**src/plugins/rm-mr-filter/** - Filter removal plugin
- `RmMrFilterPlugin` - Plugin class handling lifecycle
- Uses MutationObserver on filter dropdown button
- Adds remove buttons to filter list items

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
- `@core/*` → `./src/core/*`
- `@plugins/*` → `./src/plugins/*`

### Build Output
tsup bundles to `dist/` with entry points at `src/plugins/popup/index.ts` and `src/plugins/inject/index.ts`.

## Storage Key Compatibility

Existing storage keys maintained for backwards compatibility:
- `pn-rule-enabled` - Enable/disable pn-rule plugin
- `rm-mr-filter-enabled` - Enable/disable rm-mr-filter plugin
- `p1`, `p2`, `p3` - Priority label replacement text
- `p1-bg-color`, `p1-text-color`, etc. - Priority label colors

## Notes

- The extension uses MutationObserver to watch for DOM changes and apply replacements dynamically
- Chrome storage API is used for persistence (both popup settings and filter removal)
- GitLab version differences may require adjusting selectors in `src/services/gitlab/selectors.ts`
- Plugins are managed through the PluginManager singleton with automatic enable/disable based on storage state
