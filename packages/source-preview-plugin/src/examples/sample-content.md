# Getting Started with MDXEditor

Welcome to **MDXEditor** - a powerful markdown editor built with React.

## Features

MDXEditor comes with many built-in features:

- **Rich text editing** with a familiar interface
- **Source code view** for direct markdown manipulation
- **Live preview** to see your changes in real-time
- Support for various markdown extensions

### Supported Formatting

You can use all standard markdown formatting:

1. **Bold text** and _italic text_
2. `Inline code` snippets
3. [Links](https://mdxeditor.dev) to external resources
4. And much more!

## Installation

To install MDXEditor in your project:

```bash
npm install @mdxeditor/editor
```

Or if you prefer yarn:

```bash
yarn add @mdxeditor/editor
```

## Usage Example

Here's a simple example of how to use MDXEditor:

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

function App() {
  return <MDXEditor markdown="# Hello World" />;
}
```

## Why Choose MDXEditor?

MDXEditor stands out because:

- It's **extensible** - build your own plugins
- It's **performant** - handles large documents with ease
- It's **customizable** - style it to match your brand
- It's **well-documented** - comprehensive guides and examples

---

**Note**: This is a sample document demonstrating various markdown features including headings, lists, code blocks, and text formatting.
