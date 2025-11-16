# MDXEditor Extras

A monorepo containing plugins and shared tooling for [MDXEditor](https://mdxeditor.dev/).

## Packages

### [@mdxeditor/source-preview-plugin](./packages/source-preview-plugin)

An MDXEditor plugin that provides side-by-side source code and preview display. Allows users to toggle between rich-text editing and viewing the raw markdown source alongside the rendered preview.

**Features:**

- Side-by-side source and preview display
- Seamless switching between rich-text and source modes
- Bring your own source editor (supports Monaco, CodeMirror, etc.)
- Built with gurx reactive state management

**Installation:**

```bash
npm install @mdxeditor/source-preview-plugin
# or
pnpm add @mdxeditor/source-preview-plugin
```

## Development

This is a pnpm workspace monorepo. Make sure you have [pnpm](https://pnpm.io/) installed.

### Setup

```bash
pnpm install
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @mdxeditor/source-preview-plugin build
```

### Development Commands

```bash
pnpm lint              # Lint all packages
pnpm format            # Format code with Prettier
pnpm format:check      # Check formatting
pnpm type-check        # TypeScript type checking
```

### Working on a Package

```bash
cd packages/source-preview-plugin

pnpm dev               # Start Ladle component dev server
pnpm build             # Build the package
pnpm lint              # Lint the package
pnpm type-check        # Type check the package
```

## License

MIT
