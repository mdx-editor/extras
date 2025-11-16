# @mdxeditor/source-preview-plugin

MDXEditor plugin for displaying source code editor alongside a rich-text preview in a side-by-side view.

## Installation

```bash
pnpm add @mdxeditor/source-preview-plugin
```

```bash
npm install @mdxeditor/source-preview-plugin
```

## Usage

This plugin adds a source code editor view that can be toggled alongside the rich-text WYSIWYG editor.

```tsx
import { MDXEditor } from "@mdxeditor/editor";
import { sourceWithPreviewPlugin } from "@mdxeditor/source-preview-plugin";
import type { SourceEditor } from "@mdxeditor/source-preview-plugin";

// Define your source editor component
const MySourceEditor: SourceEditor = ({ markdown, onChange }) => {
  return (
    <textarea
      value={markdown}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", height: "100%", fontFamily: "monospace" }}
    />
  );
};

function App() {
  return (
    <MDXEditor
      markdown="# Hello World"
      plugins={[
        sourceWithPreviewPlugin({
          viewMode: "rich-text", // or 'source'
          editor: MySourceEditor,
        }),
      ]}
    />
  );
}
```

### Plugin Configuration

The plugin accepts the following options:

- **`editor`** (required): A React component that implements the `SourceEditor` interface for editing markdown source
- **`viewMode`** (optional): Initial view mode, either `'rich-text'` or `'source'`. Default: `'rich-text'`

### SourceEditor Interface

Your source editor component should match this interface:

```tsx
interface SourceEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

type SourceEditor = React.ComponentType<SourceEditorProps>;
```

## Peer Dependencies

This plugin requires the following peer dependencies:

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## License

MIT
