# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a pnpm monorepo for MDXEditor plugins and shared tooling. The repository uses workspace protocol for internal dependencies and follows strict TypeScript practices.

## Architecture

### Workspace Structure

- `packages/source-preview-plugin` - MDXEditor plugin for displaying source code alongside preview
- `packages/tooling` - Shared development tooling (ESLint, Prettier, Vite, TypeScript configs)

### Plugin Architecture

The source-preview-plugin extends MDXEditor using the `realmPlugin` pattern from `@mdxeditor/editor`:

- **State Management**: Uses gurx library (reactive state management)
  - `viewMode$` - Controls whether editor is in 'rich-text' or 'source' mode
  - `sourceEditor$` - Cell containing the source editor component
  - `updateBothSourceAndMarkdown$` - Signal that syncs source and preview

- **Component Structure**:
  - `SourceWithPreviewWrapper` wraps the MDXEditor and displays side-by-side source/preview
  - Plugin requires a `SourceEditor` component to be passed as parameter for source editing
  - When `viewMode$` changes to 'source', the rich-text editor becomes read-only

### Shared Tooling Pattern

The `@mdxeditor/tooling` package exports shared configuration files:

- `tsconfig.base.json` - Base TypeScript config with strict settings
- `eslint.config.mjs` - ESLint with `strictTypeChecked` rules
- `vite.config.base` - Vite library build configuration with dts plugin
- `prettier.config.mjs` - Prettier formatting rules

Packages import these configs directly (e.g., `"@mdxeditor/tooling/tsconfig.base.json"`).

## Development Commands

### Root-level Commands

```bash
pnpm build                 # Build all packages
pnpm lint                  # Lint all packages
pnpm format                # Format all files with Prettier
pnpm format:check          # Check formatting without changes
pnpm type-check            # Run TypeScript type checking on all packages
```

### Per-package Commands (run from package directory)

```bash
pnpm build                 # Build package with Vite
pnpm type-check            # TypeScript type checking
pnpm lint                  # ESLint
pnpm format                # Prettier format
pnpm dev                   # Start Ladle dev server (source-preview-plugin only)
```

### Working with Specific Packages

```bash
pnpm --filter @mdxeditor/source-preview-plugin build
pnpm --filter @mdxeditor/source-preview-plugin lint
```

## Build System

- **Vite** builds ES modules for library distribution
- **vite-plugin-dts** generates TypeScript declarations with rollup
- React and react-dom are externalized peer dependencies
- Source maps and declaration maps are generated for all builds

## Code Quality

- ESLint uses `strictTypeChecked` ruleset from typescript-eslint
- TypeScript strict mode enabled with additional flags: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- All packages must pass type-check before commit
